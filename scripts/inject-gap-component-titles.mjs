import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const locales = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'ko-KR', 'ko-KP', 'ru-RU']

const titles = {
  'config-provider': ['ConfigProvider', '全局配置 Provider', 'Global config provider'],
  'message-box': ['MessageBox', '命令式确认 / 提示 / 输入', 'Imperative confirm / alert / prompt'],
  affix: ['Affix', '滚动吸顶 / 吸底', 'Pin content while scrolling'],
  'page-header': ['PageHeader', '页头：返回与标题区', 'Page header with back and title'],
  segmented: ['Segmented', '分段控制器', 'Segmented control'],
  'input-otp': ['InputOTP', '一次性验证码输入', 'One-time password input'],
  'time-select': ['TimeSelect', '固定步长时间选择', 'Fixed-step time select'],
  mention: ['Mention', '@ 提及输入', '@ mention textarea'],
  image: ['Image', '图片展示与预览', 'Image with preview'],
  'image-viewer': ['ImageViewer', '全屏图片查看器', 'Fullscreen image viewer'],
  tour: ['Tour', '新手引导', 'Onboarding tour'],
  'infinite-scroll': ['InfiniteScroll', '无限滚动加载', 'Infinite scroll loader']
}

for (const loc of locales) {
  const p = join(root, 'packages/locale', loc, 'component.ts')
  let src = readFileSync(p, 'utf8')
  const adds = []
  for (const [kebab, [title, leadZh, leadEn]] of Object.entries(titles)) {
    const lead = loc === 'zh-CN' || loc === 'zh-TW' ? leadZh : leadEn
    for (const [k, v] of [
      [`component.${kebab}.title`, title],
      [`component.${kebab}.lead`, lead]
    ]) {
      const needle = `'${k}'`
      if (src.includes(needle)) {
        src = src.replace(
          new RegExp(`^\\s*'${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}':\\s*.+,$`, 'm'),
          `  '${k}': ${JSON.stringify(v)},`
        )
      } else {
        adds.push(`  '${k}': ${JSON.stringify(v)},`)
      }
    }
  }
  if (adds.length) src = src.replace(/\n\}\s*$/, `\n${adds.join('\n')}\n}\n`)
  writeFileSync(p, src)
  console.log(loc, 'added', adds.length)
}
