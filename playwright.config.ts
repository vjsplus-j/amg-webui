import { defineConfig, devices } from '@playwright/test'



const port = Number(process.env.PLAYWRIGHT_PORT ?? 4173)

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`

const isCI = Boolean(process.env.CI)



/**

 * Browser matrix:

 * - chromium: smoke + a11y/focus + RTL/theme

 * - firefox / webkit / mobile-chrome: smoke only (existence + core chrome)

 *

 * Local default stays Chromium-only for speed; set PLAYWRIGHT_FULL=1 or CI for matrix.

 */

const fullMatrix = isCI || process.env.PLAYWRIGHT_FULL === '1'



export default defineConfig({

  testDir: './tests/e2e',

  fullyParallel: false,

  forbidOnly: isCI,

  retries: isCI ? 1 : 0,

  workers: 1,

  reporter: isCI ? [['github'], ['list']] : 'list',

  use: {

    baseURL,

    trace: 'on-first-retry',

    screenshot: 'only-on-failure'

  },

  projects: fullMatrix

    ? [

        {

          name: 'chromium',

          use: { ...devices['Desktop Chrome'] }

        },

        {

          name: 'firefox',

          use: { ...devices['Desktop Firefox'] },

          testMatch: /smoke\.spec\.ts/

        },

        {

          name: 'webkit',

          use: { ...devices['Desktop Safari'] },

          testMatch: /smoke\.spec\.ts/

        },

        {

          name: 'mobile-chrome',

          use: { ...devices['Pixel 5'] },

          testMatch: /smoke\.spec\.ts/

        }

      ]

    : [

        {

          name: 'chromium',

          use: { ...devices['Desktop Chrome'] }

        }

      ],

  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER

    ? undefined

    : {

        command: `npx vite preview --config vite.example.config.ts --host 127.0.0.1 --port ${port}`,

        url: baseURL,

        reuseExistingServer: !isCI,

        timeout: 120_000

      }

})


