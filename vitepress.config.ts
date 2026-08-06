import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AMG-WebUI',
  description: 'Vue3 AMG WebUI component library',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/installation' },
      { text: '组件', link: '/components/' },
      { text: '主题', link: '/theme/' },
      { text: 'Skill Runtime', link: '/SKILL_RUNTIME' },
      { text: '业务模块', link: '/business/' }
    ],
    sidebar: [
      {
        text: '起步',
        items: [
          { text: '简介', link: '/' },
          { text: '安装', link: '/guide/installation' },
          { text: '快速开始', link: '/guide/quick-start' },
          { text: '0.1 发布说明', link: '/RELEASE_0.1' },
          { text: '0.1 组件子集', link: '/V0_1_SUBSET' }
        ]
      },
      {
        text: '独家能力',
        items: [
          { text: 'Skill Runtime', link: '/SKILL_RUNTIME' },
          { text: 'Vp Telemetry', link: '/TELEMETRY' }
        ]
      },
      {
        text: '主题',
        items: [
          { text: '主题体系', link: '/theme/' },
          { text: 'Theme Studio', link: '/THEME_STUDIO' }
        ]
      },
      {
        text: '业务模块',
        items: [{ text: '概览', link: '/business/' }]
      },
      {
        text: '组件（v0.1 核心）',
        items: [
          { text: '概览', link: '/components/' },
          { text: 'Affix', link: '/components/affix' },
          { text: 'Alert', link: '/components/alert' },
          { text: 'Button', link: '/components/button' },
          { text: 'ButtonGroup', link: '/components/button-group' },
          { text: 'Checkbox', link: '/components/checkbox' },
          { text: 'ConfigProvider', link: '/components/config-provider' },
          { text: 'DataTable', link: '/components/data-table' },
          { text: 'Dialog', link: '/components/dialog' },
          { text: 'Divider', link: '/components/divider' },
          { text: 'Ellipsis', link: '/components/ellipsis' },
          { text: 'Empty', link: '/components/empty' },
          { text: 'Form', link: '/components/form' },
          { text: 'Highlight', link: '/components/highlight' },
          { text: 'Icon', link: '/components/icon' },
          { text: 'Image', link: '/components/image' },
          { text: 'InputText', link: '/components/input-text' },
          { text: 'Layout', link: '/components/layout' },
          { text: 'Menu', link: '/components/menu' },
          { text: 'MessageBox', link: '/components/message-box' },
          { text: 'Pagination', link: '/components/pagination' },
          { text: 'Radio', link: '/components/radio' },
          { text: 'Segmented', link: '/components/segmented' },
          { text: 'Select', link: '/components/select' },
          { text: 'Space', link: '/components/space' },
          { text: 'Spin', link: '/components/spin' },
          { text: 'Switch', link: '/components/switch' },
          { text: 'Tabs', link: '/components/tabs' },
          { text: 'Tour', link: '/components/tour' },
          { text: 'Tree', link: '/components/tree' }
        ]
      }
    ]
  }
})
