import { readFileSync, writeFileSync } from 'node:fs'

const zh = {
  'page.intro.quickStart.tocPrerequisites': '环境要求',
  'page.intro.quickStart.tocInstall': '安装',
  'page.intro.quickStart.prereqTs': 'TypeScript ^5.3（推荐，与仓库开发依赖对齐）',
  'page.intro.quickStart.installLead':
    '安装包与 peer 依赖后，即可在应用入口初始化主题并挂载根组件。',
  'page.intro.installation.pkgCoreTitle': 'core',
  'page.intro.installation.pkgCoreDesc':
    '基础 UI：Button、Card、Layout、ConfigProvider、ThemeProvider、Icon 等。',
  'page.intro.installation.pkgFormTitle': 'form / components/form',
  'page.intro.installation.pkgFormDesc':
    '表单能力：Form、FormItem、InputText、Select 与校验模型。发布路径优先 amg-webui/components/form。',
  'page.intro.installation.pkgDataTitle': 'data',
  'page.intro.installation.pkgDataDesc':
    '数据展示：Table、Tree、Pagination 等列表与结构化数据组件。',
  'page.intro.installation.pkgOverlayTitle': 'overlay',
  'page.intro.installation.pkgOverlayDesc':
    '浮层与反馈：Dialog、Drawer、Popover、Message、MessageBox，共享 Overlay Runtime。',
  'page.intro.installation.pkgThemeTitle': 'theme',
  'page.intro.installation.pkgThemeDesc':
    '主题运行时：ThemeService、design / scheme / font / token 覆盖。',
  'page.intro.installation.pkgDomainTitle': '领域包（高级）',
  'page.intro.installation.pkgDomainDesc':
    'media · gb28181 · onvif · lowcode · business 为领域/业务能力，按需引入，不进入 Foundation 默认路径。'
}

const en = {
  'page.intro.quickStart.tocPrerequisites': 'Prerequisites',
  'page.intro.quickStart.tocInstall': 'Installation',
  'page.intro.quickStart.prereqTs':
    'TypeScript ^5.3 (recommended; matches repo tooling)',
  'page.intro.quickStart.installLead':
    'Install the package and peers, then initialize theme in your app entry before mounting.',
  'page.intro.installation.pkgCoreTitle': 'core',
  'page.intro.installation.pkgCoreDesc':
    'Foundation UI: Button, Card, Layout, ConfigProvider, ThemeProvider, Icon, and more.',
  'page.intro.installation.pkgFormTitle': 'form / components/form',
  'page.intro.installation.pkgFormDesc':
    'Forms: Form, FormItem, InputText, Select, and validation. Prefer amg-webui/components/form for the published barrel.',
  'page.intro.installation.pkgDataTitle': 'data',
  'page.intro.installation.pkgDataDesc':
    'Data display: tables, trees, pagination, and structured data views.',
  'page.intro.installation.pkgOverlayTitle': 'overlay',
  'page.intro.installation.pkgOverlayDesc':
    'Overlays and feedback: Dialog, Drawer, Popover, Message, MessageBox sharing Overlay Runtime.',
  'page.intro.installation.pkgThemeTitle': 'theme',
  'page.intro.installation.pkgThemeDesc':
    'Theme runtime: ThemeService plus design, scheme, font, and token overrides.',
  'page.intro.installation.pkgDomainTitle': 'Domain packages (advanced)',
  'page.intro.installation.pkgDomainDesc':
    'media, gb28181, onvif, lowcode, and business are domain opt-ins — not part of the Foundation default path.'
}

function patch(file, map) {
  let s = readFileSync(file, 'utf8')
  for (const [k, v] of Object.entries(map)) {
    const line = `  '${k}': '${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}',`
    const re = new RegExp(`^\\s*'${k.replace(/\./g, '\\.')}'\\s*:\\s*'[^']*',?\\s*$`, 'm')
    if (re.test(s)) {
      s = s.replace(re, line)
    } else {
      s = s.replace(/\n\}\s*$/, `\n${line}\n}\n`)
    }
  }
  writeFileSync(file, s)
  console.log('patched', file)
}

patch('packages/locale/zh-CN/page.ts', zh)
patch('packages/locale/en-US/page.ts', en)
