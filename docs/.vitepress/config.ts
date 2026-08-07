import { defineConfig } from 'vitepress'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { packageAlias } from '../../build/shared.mjs'
import { componentSidebarGroup } from './sidebar.components'

const repoRoot = resolve(fileURLToPath(new URL('../..', import.meta.url)))

const viteAliases = Object.entries(packageAlias)
  .sort(([a], [b]) => b.length - a.length)
  .map(([find, replacement]) => ({ find, replacement }))

export default defineConfig({
  title: 'AMG-WebUI',
  description: 'Enterprise Vue Web Application UI Platform',
  vite: {
    resolve: {
      alias: viteAliases
    },
    ssr: {
      noExternal: [/^@amg-webui(\/|$)/, 'amg-webui']
    }
  },
  // Narrow allowlist only — NOT global true (dead links in docs/ still fail the build).
  ignoreDeadLinks: [
    /^\/docs\/engineering\//,
    /^\/component-hardening\//,
    /^\/packages\//,
    /^\/example\//
  ],
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
          { text: 'Vp Telemetry', link: '/TELEMETRY' },
          { text: '安全防护层', link: '/SECURITY' },
          { text: '低代码 Schema', link: '/LOWCODE' }
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
      componentSidebarGroup
    ]
  }
})
