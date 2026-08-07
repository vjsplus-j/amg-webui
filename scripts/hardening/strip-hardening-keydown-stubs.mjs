/**
 * Remove fake __hardeningKeydown stubs injected by bulk-close.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const files = [
  'packages/components/data/Descriptions/index.vue',
  'packages/components/data/DescriptionsItem/index.vue',
  'packages/components/data/InfiniteScroll/index.vue',
  'packages/components/data/BatchPanel/index.vue',
  'packages/components/form/SearchFilterPanel/index.vue',
  'packages/components/form/SmsCode/index.vue'
]

for (const f of files) {
  let s = readFileSync(f, 'utf8')
  const before = s
  s = s.replace(/\r\n/g, '\n')
  s = s.replace(
    /\n?import \{ resolveKeyboardNavAction \} from '@amg-webui\/utils'\n?/g,
    '\n'
  )
  s = s.replace(
    /\nfunction __hardeningKeydown\(event: KeyboardEvent\) \{\n  resolveKeyboardNavAction\(event, \{ orientation: 'vertical' \}\)\n\}\n/g,
    '\n'
  )
  s = s.replace(/\s*tabindex="0"\s*@keydown="__hardeningKeydown"/g, '')
  if (s === before) console.log('NO_CHANGE', f)
  else {
    writeFileSync(f, s)
    console.log('FIXED', f)
  }
}
