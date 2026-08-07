#!/usr/bin/env node
/**
 * Generates showcase mini-app scaffolds under showcases/.
 * Run: node scripts/generate-showcases.mjs
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const showcasesRoot = resolve(root, 'showcases')

const SHOWCASES = [
  {
    dir: '01-admin',
    port: 5101,
    title: 'Admin Console',
    purpose:
      'Classic enterprise admin shell — users, settings, and mock CRUD patterns.',
    seedPrefix: 'User',
    crudTitle: 'Users',
    entityLabel: 'User',
    mobile: false
  },
  {
    dir: '02-saas',
    port: 5102,
    title: 'SaaS Console',
    purpose:
      'Multi-tenant SaaS operator console with tenant subscription mock CRUD.',
    seedPrefix: 'Tenant',
    crudTitle: 'Tenants',
    entityLabel: 'Tenant',
    mobile: false
  },
  {
    dir: '03-ecommerce',
    port: 5103,
    title: 'E-Commerce Ops',
    purpose:
      'Catalog and order operations sample with product mock CRUD.',
    seedPrefix: 'Product',
    crudTitle: 'Products',
    entityLabel: 'Product',
    mobile: false
  },
  {
    dir: '04-content-management',
    port: 5104,
    title: 'Content CMS',
    purpose:
      'Editorial CMS sample for articles/pages with content entry mock CRUD.',
    seedPrefix: 'Article',
    crudTitle: 'Articles',
    entityLabel: 'Article',
    mobile: false
  },
  {
    dir: '05-device-management',
    port: 5105,
    title: 'Device Management',
    purpose:
      'IoT / edge device registry sample with device mock CRUD.',
    seedPrefix: 'Device',
    crudTitle: 'Devices',
    entityLabel: 'Device',
    mobile: false
  },
  {
    dir: '06-video-surveillance',
    port: 5106,
    title: 'Video Surveillance',
    purpose:
      'VMS-style camera channel management sample (mock data only).',
    seedPrefix: 'Camera',
    crudTitle: 'Cameras',
    entityLabel: 'Camera',
    mobile: false
  },
  {
    dir: '07-gb28181-center',
    port: 5107,
    title: 'GB28181 Center',
    purpose:
      'National standard video platform sample — SIP device catalog mock CRUD.',
    seedPrefix: 'SIP Device',
    crudTitle: 'GB Devices',
    entityLabel: 'GB Device',
    mobile: false
  },
  {
    dir: '08-onvif-center',
    port: 5108,
    title: 'ONVIF Center',
    purpose:
      'ONVIF discovery and channel registry sample with mock CRUD.',
    seedPrefix: 'ONVIF Node',
    crudTitle: 'ONVIF Devices',
    entityLabel: 'ONVIF Device',
    mobile: false
  },
  {
    dir: '09-dashboard',
    port: 5109,
    title: 'Analytics Dashboard',
    purpose:
      'KPI dashboard shell plus widget registry mock CRUD for demo tiles.',
    seedPrefix: 'Widget',
    crudTitle: 'Widgets',
    entityLabel: 'Widget',
    mobile: false
  },
  {
    dir: '10-mobile-admin',
    port: 5110,
    title: 'Mobile Admin',
    purpose:
      'Mobile-first admin layout with compact nav and field mock CRUD.',
    seedPrefix: 'Field Task',
    crudTitle: 'Tasks',
    entityLabel: 'Task',
    mobile: true
  }
]

function write(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, content, 'utf8')
}

function packageJson(sc) {
  return JSON.stringify(
    {
      name: `showcase-${sc.dir}`,
      private: true,
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview'
      },
      dependencies: {
        'amg-webui': 'file:../..',
        '@lucide/vue': '^1.0.0',
        vue: '^3.4.0',
        'vue-router': '^4.6.4'
      },
      devDependencies: {
        '@vitejs/plugin-vue': '^5.0.4',
        sass: '^1.77.0',
        vite: '^5.4.0'
      }
    },
    null,
    2
  )
}

function viteConfig(sc) {
  return `import { createShowcaseConfig } from '../_shared/vite/createShowcaseConfig.mjs'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const dir = dirname(fileURLToPath(import.meta.url))
export default createShowcaseConfig(dir, ${sc.port})
`
}

function indexHtml(sc) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${sc.title} — AMG Showcase</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`
}

function mainTs() {
  return `import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { bootstrapAmgRuntime } from '@showcase/shared/setup/bootstrap'
import './style.scss'

bootstrapAmgRuntime()

createApp(App).use(router).mount('#app')
`
}

function styleScss() {
  return `@import '@showcase/shared/styles/base.scss';
`
}

function envDts() {
  return `/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}
`
}

function appVue(sc) {
  return `<script setup lang="ts">
import AppLayout from '@showcase/shared/components/AppLayout.vue'
import type { ShowcaseNavItem } from '@showcase/shared/types/nav'

const appTitle = '${sc.title}'

const navItems: ShowcaseNavItem[] = [
  { path: '/', label: 'Home' },
  { path: '/manage', label: '${sc.crudTitle}' },
  { path: '/about', label: 'About' }
]
</script>

<template>
  <AppLayout :app-title="appTitle" :nav-items="navItems" :mobile="${sc.mobile}">
    <router-view />
  </AppLayout>
</template>
`
}

function routerTs(sc) {
  return `import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ManagePage from '../pages/ManagePage.vue'
import AboutPage from '../pages/AboutPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    {
      path: '/manage',
      name: 'manage',
      component: ManagePage,
      meta: { title: '${sc.crudTitle}' }
    },
    { path: '/about', name: 'about', component: AboutPage }
  ]
})

export default router
`
}

function homePage(sc) {
  return `<script setup lang="ts">
import { Card } from '@amg-webui/core'
import { Message } from '@amg-webui/overlay'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="showcase-page">
    <h1>${sc.title}</h1>
    <p class="showcase-page__lead">${sc.purpose}</p>
    <Card title="Quick start">
      <p>
        This is an application sample built on AMG-WebUI workspace packages
        (theme, locale, core components). Data is mocked via
        <code>showcases/_shared/mock-api</code>.
      </p>
      <Message severity="info" :closable="false">
        Open the ${sc.crudTitle} route to explore list + dialog CRUD with loading,
        empty, and error states.
      </Message>
      <button type="button" class="showcase-link" @click="router.push('/manage')">
        Go to ${sc.crudTitle} →
      </button>
    </Card>
  </div>
</template>

<style scoped>
.showcase-link {
  margin-top: 12px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--theme-primary, #2563eb);
  cursor: pointer;
  font: inherit;
}
</style>
`
}

function managePage(sc) {
  return `<script setup lang="ts">
import CrudPage from '@showcase/shared/components/CrudPage.vue'
</script>

<template>
  <CrudPage
    title="${sc.crudTitle}"
    entity-label="${sc.entityLabel}"
    seed-prefix="${sc.seedPrefix}"
  />
</template>
`
}

function aboutPage(sc) {
  return `<script setup lang="ts">
import { Card } from '@amg-webui/core'
</script>

<template>
  <div class="showcase-page">
    <h1>About</h1>
    <Card title="Showcase metadata">
      <ul>
        <li><strong>Slug:</strong> ${sc.dir}</li>
        <li><strong>Purpose:</strong> ${sc.purpose}</li>
        <li><strong>Port (dev):</strong> ${sc.port}</li>
        <li><strong>AMG link:</strong> workspace alias via Vite (not npm Stable claim)</li>
      </ul>
    </Card>
  </div>
</template>
`
}

function readme(sc) {
  return `# ${sc.title}

${sc.purpose}

## Run locally

From repository root:

\`\`\`bash
npm run showcase:${sc.dir.replace(/^\d+-/, '')}
\`\`\`

Or from this folder:

\`\`\`bash
npm install
npm run dev
\`\`\`

Dev server port: **${sc.port}**.

## Routes

| Path | Description |
|------|-------------|
| \`/\` | Home overview |
| \`/manage\` | Mock CRUD (${sc.crudTitle}) |
| \`/about\` | Showcase metadata |

## Notes

- Uses AMG-WebUI via workspace Vite aliases (\`@amg-webui/*\` → \`packages/\`).
- Mock API: \`showcases/_shared/mock-api/adapter.ts\`.
- This is a **sample scaffold**, not a production app or STABLE component claim.
`
}

function rootReadme() {
  const rows = SHOWCASES.map(
    (sc) =>
      `| [${sc.dir}](./${sc.dir}/) | ${sc.title} | ${sc.port} | \`npm run showcase:${sc.dir.replace(/^\d+-/, '')}\` |`
  ).join('\n')

  return `# AMG-WebUI Application Showcases

Consumer-facing **application samples** (not the library-author \`example/\` playground).

Each folder is a standalone Vite + Vue 3 app with:

- Layout shell + vue-router (3 routes)
- Mock CRUD page (list + form dialog)
- Loading / empty / error state toggles
- Theme + i18n via workspace-linked AMG packages

Shared mock adapter: [\`_shared/mock-api\`](./_shared/mock-api/adapter.ts).

## Samples

| Folder | Title | Port | Root script |
|--------|-------|------|-------------|
${rows}

## First-time setup

Install dependencies per showcase (or run from root scripts which delegate with \`--prefix\`):

\`\`\`bash
npm install --prefix showcases/01-admin
\`\`\`

## Development

\`\`\`bash
npm run showcase:admin
# … see table above for other slugs
\`\`\`

These scaffolds compile against workspace sources; build the library first if you prefer \`dist/\` artifacts:

\`\`\`bash
npm run build:lib
\`\`\`
`
}

for (const sc of SHOWCASES) {
  const base = resolve(showcasesRoot, sc.dir)
  const src = resolve(base, 'src')

  write(resolve(base, 'package.json'), packageJson(sc))
  write(resolve(base, 'vite.config.ts'), viteConfig(sc))
  write(resolve(base, 'index.html'), indexHtml(sc))
  write(resolve(base, 'README.md'), readme(sc))
  write(resolve(src, 'main.ts'), mainTs())
  write(resolve(src, 'App.vue'), appVue(sc))
  write(resolve(src, 'style.scss'), styleScss())
  write(resolve(src, 'env.d.ts'), envDts())
  write(resolve(src, 'router/index.ts'), routerTs(sc))
  write(resolve(src, 'pages/HomePage.vue'), homePage(sc))
  write(resolve(src, 'pages/ManagePage.vue'), managePage(sc))
  write(resolve(src, 'pages/AboutPage.vue'), aboutPage(sc))
}

write(resolve(showcasesRoot, 'README.md'), rootReadme())

console.log(`Generated ${SHOWCASES.length} showcases under ${showcasesRoot}`)
