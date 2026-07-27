import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AMG-WebUI',
  description: 'Vue3 AMG WebUI component library',
  themeConfig: {
    nav: [
      { text: '指南', link: '/' },
      { text: '组件', link: '/components/' },
      { text: '主题', link: '/theme' },
      { text: '业务模块', link: '/business' }
    ],
    sidebar: [
      {
        text: '起步',
        items: [{ text: '简介', link: '/' }]
      },
      {
        text: '组件（本阶段 stub）',
        items: [
          { text: '概览', link: '/components/' },
          { text: 'ButtonGroup', link: '/components/button-group' },
          { text: 'Checkbox', link: '/components/checkbox' },
          { text: 'Divider', link: '/components/divider' },
          { text: 'Ellipsis', link: '/components/ellipsis' },
          { text: 'Empty', link: '/components/empty' },
          { text: 'Highlight', link: '/components/highlight' },
          { text: 'Icon', link: '/components/icon' },
          { text: 'Radio', link: '/components/radio' },
          { text: 'Space', link: '/components/space' },
          { text: 'Spin', link: '/components/spin' },
          { text: 'Switch', link: '/components/switch' },
          { text: 'Tabs', link: '/components/tabs' }
        ]
      }
    ]
  }
})
