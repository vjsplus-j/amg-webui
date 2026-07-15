import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AMG-WebUI',
  description: 'Vue3 AMG WebUI component library',
  themeConfig: {
    nav: [
      { text: '指南', link: '/' },
      { text: '主题', link: '/theme' },
      { text: '业务模块', link: '/business' }
    ],
    sidebar: [
      {
        text: '起步',
        items: [{ text: '简介', link: '/' }]
      }
    ]
  }
})
