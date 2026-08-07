import { describe, expect, it, beforeEach, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { LocaleService } from '@amg-webui/locale'
import InputText from '@amg-webui/form/InputText/index.vue'
import {
  SecurityService,
  applySanitizeInput,
  escapeHtml,
  filterDangerousInput,
  isSafeHref,
  sanitizeHtml,
  sanitizeModelStrings,
  sanitizeUrl,
  unescapeHtml,
  SECURE_FORM_KIT,
  SECURE_INPUT_PRESET
} from '@amg-webui/security'

beforeAll(() => {
  LocaleService.init()
})

describe('security layer', () => {
  beforeEach(() => {
    SecurityService.reset()
    SecurityService.configure({ warnOnStrip: false })
    SecurityService.clearAlerts()
  })

  it('blocks dangerous href protocols and odd schemes', () => {
    expect(isSafeHref('javascript:alert(1)')).toBe(false)
    expect(isSafeHref('JAVASCRIPT:alert(1)')).toBe(false)
    expect(isSafeHref('data:text/html,hi')).toBe(false)
    expect(isSafeHref('vbscript:msg')).toBe(false)
    expect(isSafeHref('file:///etc/passwd')).toBe(false)
    expect(isSafeHref('https://example.com')).toBe(true)
    expect(isSafeHref('/relative/path')).toBe(true)
    expect(isSafeHref('//evil.example')).toBe(true) // protocol-relative allowed as relative
    expect(sanitizeUrl('javascript:x')).toBeUndefined()
    expect(sanitizeUrl('https://ok.test')).toBe('https://ok.test')
  })

  it('sanitizes html whitelist and strips script / event handlers', () => {
    const dirty =
      '<p>Hi <strong>x</strong></p><script>alert(1)</script><a href="javascript:alert(1)">bad</a><a href="https://a.test" target="_blank">ok</a><img src=x onerror=alert(1) /><div onclick="evil()">y</div>'
    const clean = sanitizeHtml(dirty)
    expect(clean).toContain('<strong>')
    expect(clean).not.toContain('<script')
    expect(clean).not.toContain('javascript:')
    expect(clean).not.toContain('onerror')
    expect(clean).not.toContain('onclick')
    expect(clean).not.toContain('<img')
    expect(clean).toContain('https://a.test')
    expect(clean).toContain('noopener')
  })

  it('resists common mXSS / mutation payloads', () => {
    const payloads = [
      '<svg><script>alert(1)</script></svg>',
      '<math><mi//xlink:href="javascript:alert(1)">',
      '<a href="jav&#x09;ascript:alert(1)">x</a>',
      '<a href=" &#10; javascript:alert(1)">x</a>',
      '<iframe src="javascript:alert(1)"></iframe>',
      '<object data="javascript:alert(1)"></object>',
      '<embed src="data:text/html,<script>alert(1)</script>">',
      '<p style="background:url(javascript:alert(1))">x</p>',
      '"><img src=x onerror=alert(1)>',
      '<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">x</a>'
    ]
    for (const dirty of payloads) {
      const clean = sanitizeHtml(dirty)
      expect(clean.toLowerCase()).not.toContain('javascript:')
      expect(clean.toLowerCase()).not.toContain('<script')
      expect(clean.toLowerCase()).not.toContain('onerror')
      expect(clean.toLowerCase()).not.toContain('<iframe')
      expect(clean.toLowerCase()).not.toContain('<object')
      expect(clean.toLowerCase()).not.toContain('<embed')
      expect(clean.toLowerCase()).not.toContain('style=')
    }
  })

  it('escapes and unescapes without DOM XSS', () => {
    expect(escapeHtml('<b>&')).toBe('&lt;b&gt;&amp;')
    expect(unescapeHtml('&lt;b&gt;&amp;')).toBe('<b>&')
    // Critical: must NOT execute via innerHTML assignment
    const hostile = '<img src=x onerror=alert(1)>'
    expect(unescapeHtml(hostile)).toBe(hostile)
    expect(unescapeHtml('&#60;script&#62;')).toBe('<script>')
  })

  it('filters form input', () => {
    expect(filterDangerousInput('<b>admin</b> javascript:void(0)')).not.toContain('<')
    expect(filterDangerousInput('<b>admin</b> javascript:void(0)')).not.toMatch(/javascript/i)
  })

  it('applySanitizeInput respects blur vs input mode; undefined/false are off', () => {
    expect(applySanitizeInput('<b>x</b>', undefined, 'blur')).toBe('<b>x</b>')
    expect(applySanitizeInput('<b>x</b>', false, 'blur')).toBe('<b>x</b>')
    expect(applySanitizeInput('<b>x</b>', true, 'input')).toBe('<b>x</b>')
    expect(applySanitizeInput('<b>x</b>', true, 'blur')).not.toContain('<')
    expect(applySanitizeInput('<b>x</b>', 'input', 'input')).not.toContain('<')
    expect(applySanitizeInput('<b>x</b>', 'off', 'blur')).toBe('<b>x</b>')
  })

  it('sanitizeModelStrings deep-filters leaves', () => {
    const cleaned = sanitizeModelStrings({
      name: '<script>x</script>',
      nested: { note: 'javascript:alert(1)' }
    })
    expect(cleaned.name).not.toContain('<')
    expect(String(cleaned.nested.note)).not.toMatch(/javascript/i)
  })

  it('resists extended fuzz corpus', () => {
    const payloads = [
      '<img src=x onerror=alert(1)>',
      '<svg/onload=alert(1)>',
      '<a href="java\u0000script:alert(1)">x</a>',
      '<a href="javascript&#58;alert(1)">x</a>',
      '<form action="javascript:alert(1)"><button>x</button></form>',
      '<meta http-equiv="refresh" content="0;url=javascript:alert(1)">',
      '<link rel=stylesheet href="javascript:alert(1)">',
      '<base href="javascript:alert(1)//">',
      '<div style="width:expression(alert(1))">x</div>',
      '<<script>script>alert(1)<</script>/script>',
      '<a href="//evil" onclick=alert(1)>x</a>',
      '<p title="&#34; onmouseover=alert(1) x=&#34;">x</p>'
    ]
    for (const dirty of payloads) {
      const clean = sanitizeHtml(dirty)
      const lower = clean.toLowerCase()
      expect(lower).not.toContain('javascript:')
      expect(lower).not.toContain('onerror')
      expect(lower).not.toContain('onload')
      expect(lower).not.toContain('onclick')
      expect(lower).not.toContain('onmouseover')
      expect(lower).not.toContain('<script')
      expect(lower).not.toContain('<form')
      expect(lower).not.toContain('<meta')
      expect(lower).not.toContain('<link')
      expect(lower).not.toContain('<base')
      expect(lower).not.toContain('style=')
      expect(lower).not.toContain('expression(')
    }
  })

  it('records alerts when stripping / blocking without raw detail by default', () => {
    SecurityService.configure({ warnOnStrip: false })
    sanitizeUrl('javascript:1')
    sanitizeHtml('<script>x</script>')
    filterDangerousInput('<x>')
    const alerts = SecurityService.getRecentAlerts()
    const kinds = alerts.map((a) => a.kind)
    expect(kinds).toContain('url-blocked')
    expect(kinds).toContain('html-stripped')
    expect(kinds).toContain('input-filtered')
    for (const a of alerts) {
      expect(a.detail).toBeUndefined()
      expect(a.detailHash).toBeTruthy()
      expect(typeof a.detailLength).toBe('number')
      expect(a.matchedRule).toBeTruthy()
    }
  })

  it('keeps truncated detail only when includeDetail is true', () => {
    SecurityService.configure({ warnOnStrip: false, includeDetail: true })
    sanitizeUrl('javascript:alert(1)')
    const [alert] = SecurityService.getRecentAlerts()
    expect(alert?.detail).toContain('javascript:')
    expect(alert?.detailHash).toBeTruthy()
    expect(alert?.matchedRule).toBe('blocked-protocol')
  })
})

describe('security presets', () => {
  it('exports opt-in secure presets without changing defaults', () => {
    expect(SECURE_INPUT_PRESET.sanitizeInput).toBe('blur')
    expect(SECURE_FORM_KIT.sanitizeOnSubmit).toBe(true)
    expect(SECURE_FORM_KIT.sanitizeInput).toBe('blur')
  })
})

describe('InputText sanitizeInput mount', () => {
  it('filters dangerous input on blur when sanitizeInput is true', async () => {
    const wrapper = mount(InputText, {
      props: {
        modelValue: '<b>x</b> javascript:void(0)',
        sanitizeInput: true
      }
    })
    await nextTick()

    const input = wrapper.get('input')
    await input.trigger('blur')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
      expect.not.stringContaining('<')
    ])
    expect(String(wrapper.emitted('update:modelValue')?.at(-1)?.[0])).not.toMatch(/javascript/i)
  })

  it('filters on input phase when sanitizeInput is input', async () => {
    const wrapper = mount(InputText, {
      props: {
        modelValue: '',
        sanitizeInput: 'input'
      }
    })
    await nextTick()

    const input = wrapper.get('input')
    await input.setValue('<script>x</script>')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).not.toContain('<')
  })

  it('leaves value unchanged by default (sanitizeInput false)', async () => {
    const wrapper = mount(InputText, {
      props: {
        modelValue: '<device-id>',
        sanitizeInput: false
      }
    })
    await nextTick()
    await wrapper.get('input').trigger('blur')
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
