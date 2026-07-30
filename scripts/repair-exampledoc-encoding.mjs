/**
 * Repair exampleDoc.ts locale packs corrupted by UTF-8 truncation (U+FFFD).
 *
 * Strategy per key:
 *  1. Prefer git HEAD value when it has fewer FFFD for that key
 *  2. Else if en-US has the key with fewer FFFD, use zh/zh-TW fallback map or en-US copy
 *  3. Apply legacy `�?,` → `",` fixes
 *
 * Run: node scripts/repair-exampledoc-encoding.mjs
 * Then: node scripts/repair-exampledoc-and-registry.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const localeRoot = join(root, 'packages/locale')
const LOCALES = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'ko-KR', 'ko-KP', 'ru-RU']

/** Common en-US → zh-CN/zh-TW word fallbacks when HEAD is unavailable */
const ZH_FALLBACK = {
  'zh-CN': {
    'Basic usage': '基础用法',
    'Demo for': '组件演示',
    'Mount': '挂载',
    'to preview core behavior': '查看基础能力',
    'Forward class / style': '透传 class / style',
    draft: '草稿',
    listen: '监听',
    clickable: '可点击',
    fallback: '兜底',
    custom: '自定义',
    overflow: '溢出',
    cascade: '级联',
    tooltip: '气泡',
    global: '全局',
    default: '默认',
    separator: '分隔符',
    loading: '加载',
    scroll: '滚动',
    virtual: '虚拟',
    column: '列',
    row: '行',
    filter: '筛选',
    export: '导出',
    print: '打印',
    preview: '预览',
    upload: '上传',
    download: '下载',
    search: '搜索',
    reset: '重置',
    confirm: '确认',
    cancel: '取消',
    close: '关闭',
    expand: '展开',
    collapse: '折叠',
    select: '选择',
    drag: '拖拽',
    resize: '调整大小',
    fullscreen: '全屏',
    thumbnail: '缩略图',
    timeline: '时间轴',
    chart: '图表',
    table: '表格',
    form: '表单',
    layout: '布局',
    navigation: '导航',
    menu: '菜单',
    tab: '标签页',
    step: '步骤',
    status: '状态',
    warning: '警告',
    error: '错误',
    success: '成功',
    info: '信息'
  },
  'zh-TW': {
    'Basic usage': '基礎用法',
    'Demo for': '元件演示',
    'Mount': '掛載',
    'to preview core behavior': '檢視基礎能力',
    'Forward class / style': '透傳 class / style',
    draft: '草稿',
    listen: '監聽',
    clickable: '可點擊',
    fallback: '兜底',
    custom: '自訂',
    overflow: '溢出',
    cascade: '級聯',
    tooltip: '氣泡',
    global: '全域',
    default: '預設',
    separator: '分隔符',
    loading: '載入',
    scroll: '捲動',
    virtual: '虛擬',
    column: '欄',
    row: '列',
    filter: '篩選',
    export: '匯出',
    print: '列印',
    preview: '預覽',
    upload: '上傳',
    download: '下載',
    search: '搜尋',
    reset: '重設',
    confirm: '確認',
    cancel: '取消',
    close: '關閉',
    expand: '展開',
    collapse: '摺疊',
    select: '選擇',
    drag: '拖曳',
    resize: '調整大小',
    fullscreen: '全螢幕',
    thumbnail: '縮圖',
    timeline: '時間軸',
    chart: '圖表',
    table: '表格',
    form: '表單',
    layout: '版面',
    navigation: '導航',
    menu: '選單',
    tab: '分頁',
    step: '步驟',
    status: '狀態',
    warning: '警告',
    error: '錯誤',
    success: '成功',
    info: '資訊'
  }
}

const lineRe = /^\s*(['"])((?:\\\1|(?!\1).)+)\1:\s*(.+?),\s*$/

function fffdCount(s) {
  return (s.match(/\uFFFD/g) || []).length
}

function unquoteValue(raw) {
  const t = raw.trim()
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    try {
      return JSON.parse(t.replace(/^'/, '"').replace(/'$/, '"'))
    } catch {
      return t.slice(1, -1)
    }
  }
  return t
}

function quoteValue(v) {
  return JSON.stringify(String(v))
}

/** Parse exampleDoc.ts into key → raw value string (without trailing comma) */
function parseExampleDoc(src) {
  const map = new Map()
  for (const line of src.split(/\r?\n/)) {
    const m = line.match(lineRe)
    if (!m) continue
    map.set(m[2], m[3])
  }
  return map
}

function tryGitHead(locale) {
  const rel = `packages/locale/${locale}/exampleDoc.ts`
  try {
    return execSync(`git show HEAD:${rel}`, { cwd: root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
  } catch {
    return null
  }
}

function applyLegacyFixes(text) {
  let out = text
  out = out.replace(/\uFFFD\?,/g, '",')
  out = out.replace(/",\\n  "/g, '", "')
  out = out.replace(/\\",\\n  "/g, '", "')
  return out
}

function translateFromEn(enText, locale) {
  const map = ZH_FALLBACK[locale]
  if (!map) return enText
  let out = enText
  for (const [en, zh] of Object.entries(map)) {
    out = out.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), zh)
  }
  return out
}

function serializeExampleDoc(map) {
  const lines = [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `  '${k}': ${v},`)
  return `export default {\n${lines.join('\n')}\n}\n`
}

const enPath = join(localeRoot, 'en-US', 'exampleDoc.ts')
const enMap = existsSync(enPath) ? parseExampleDoc(readFileSync(enPath, 'utf8')) : new Map()

const report = {}

for (const locale of LOCALES) {
  const filePath = join(localeRoot, locale, 'exampleDoc.ts')
  if (!existsSync(filePath)) continue

  let src = readFileSync(filePath, 'utf8')
  const beforeFffd = fffdCount(src)
  src = applyLegacyFixes(src)

  const current = parseExampleDoc(src)
  const headSrc = tryGitHead(locale)
  const headMap = headSrc ? parseExampleDoc(headSrc) : new Map()

  let fromHead = 0
  let fromEn = 0
  let fromFallback = 0
  let stripped = 0

  for (const [key, rawVal] of current.entries()) {
    const curText = unquoteValue(rawVal)
    const curBad = fffdCount(curText)
    if (curBad === 0) continue

    const headRaw = headMap.get(key)
    if (headRaw != null) {
      const headText = unquoteValue(headRaw)
      if (fffdCount(headText) < curBad) {
        current.set(key, headRaw)
        fromHead++
        continue
      }
    }

    const enRaw = enMap.get(key)
    if (enRaw != null) {
      const enText = unquoteValue(enRaw)
      if (fffdCount(enText) < curBad) {
        if (locale === 'zh-CN' || locale === 'zh-TW') {
          current.set(key, quoteValue(translateFromEn(enText, locale)))
          fromFallback++
        } else {
          current.set(key, enRaw)
          fromEn++
        }
        continue
      }
    }

    // Last resort: strip FFFD and broken `?` tails
    const cleaned = curText.replace(/\uFFFD+\??/g, '').replace(/\?\s*$/, '')
    if (cleaned !== curText) {
      current.set(key, quoteValue(cleaned))
      stripped++
    }
  }

  const out = serializeExampleDoc(current)
  writeFileSync(filePath, out, 'utf8')
  const afterFffd = fffdCount(out)

  report[locale] = {
    beforeFffd,
    afterFffd,
    keys: current.size,
    fromHead,
    fromEn,
    fromFallback,
    stripped
  }
}

console.log('[repair-exampledoc-encoding]', JSON.stringify(report, null, 2))
