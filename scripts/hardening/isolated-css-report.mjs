/**
 * HAR-011 isolated CSS consumer checklist generator.
 * Documents that Button/Select etc. must work without root style.css
 * (enforced by existing test:consumers + on-demand CSS entries).
 */
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const hardening = join(root, 'component-hardening')

const SAMPLES = ['Button', 'Select', 'InputText', 'Dialog', 'DataTable']

function main() {
  const out = {
    generatedAt: new Date().toISOString(),
    requirement:
      'Consumers must be able to import component JS + per-component CSS without root dist/style.css',
    samples: SAMPLES,
    verification: {
      script: 'npm run test:consumers',
      fixtures: [
        'tests/consumer-vite',
        'tests/consumer-webpack',
        'tests/consumer-nuxt'
      ],
      ondemand: 'npm run build:ondemand → dist/es/**'
    },
    status: 'covered-by-test-consumers'
  }
  mkdirSync(join(hardening, 'reports'), { recursive: true })
  writeFileSync(
    join(hardening, 'reports/isolated-css-consumer.json'),
    JSON.stringify(out, null, 2) + '\n'
  )
  console.log('[isolated-css] wrote report')
}

main()
