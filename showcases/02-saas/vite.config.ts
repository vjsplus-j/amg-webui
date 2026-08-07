import { createShowcaseConfig } from '../_shared/vite/createShowcaseConfig.mjs'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const dir = dirname(fileURLToPath(import.meta.url))
export default createShowcaseConfig(dir, 5102)
