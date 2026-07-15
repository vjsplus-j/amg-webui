/**
 * Cascade marqueeLeft / marqueeRight / scrollUp / scrollDown / dampOut
 * into MotionProps host type files + SFCs that already declare glow.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const typeDocs = `  /** Fluorescent glow — shared Motion */
  glow?: boolean
  /** Marquee scroll left — shared Motion */
  marqueeLeft?: boolean
  /** Marquee scroll right — shared Motion */
  marqueeRight?: boolean
  /** Vertical scroll up — shared Motion */
  scrollUp?: boolean
  /** Vertical scroll down — shared Motion */
  scrollDown?: boolean
  /** Damped zoom then fade out — shared Motion */
  dampOut?: boolean`

const typeDocsEn = `  /** Fluorescent / neon text-shadow glow */
  glow?: boolean
  /** Marquee scroll to the left */
  marqueeLeft?: boolean
  /** Marquee scroll to the right */
  marqueeRight?: boolean
  /** Vertical scroll upward */
  scrollUp?: boolean
  /** Vertical scroll downward */
  scrollDown?: boolean
  /** Damped zoom in → settle → shrink & fade out (one-shot) */
  dampOut?: boolean`

const typeBlockA = `  glow?: boolean
  marqueeLeft?: boolean
  marqueeRight?: boolean
  scrollUp?: boolean
  scrollDown?: boolean
  dampOut?: boolean`

const defaultsBlock = `  glow: false,
  marqueeLeft: false,
  marqueeRight: false,
  scrollUp: false,
  scrollDown: false,
  dampOut: false`

const useMotionBlock = `  glow: props.glow,
  marqueeLeft: props.marqueeLeft,
  marqueeRight: props.marqueeRight,
  scrollUp: props.scrollUp,
  scrollDown: props.scrollDown,
  dampOut: props.dampOut,`

const files = [
  'packages/components/base/Typography/types.ts',
  'packages/components/base/Tag/types.ts',
  'packages/components/base/Button/types.ts',
  'packages/components/base/Avatar/types.ts',
  'packages/components/base/Icon/types.ts',
  'packages/components/base/Badge/types.ts',
  'packages/components/base/Typography/index.vue',
  'packages/components/base/Tag/index.vue',
  'packages/components/base/Button/index.vue',
  'packages/components/base/Button/useButton.ts',
  'packages/components/base/Avatar/index.vue',
  'packages/components/base/Icon/index.vue',
  'packages/components/base/Badge/index.vue'
]

function patch(src) {
  let s = src
  if (s.includes('marqueeLeft')) return s

  // typedoc variants
  s = s.replace(
    / {2}\/\*\* Fluorescent glow — shared Motion \*\/\n {2}glow\?: boolean/g,
    typeDocs
  )
  s = s.replace(
    / {2}\/\*\* Fluorescent \/ neon text-shadow glow \*\/\n {2}glow\?: boolean/g,
    typeDocsEn
  )
  // Badge already has glow?: boolean without that exact comment in some spots
  s = s.replace(
    / {2}\/\*\* Fluorescent glow — shared Motion \*\/\n {2}glow\?: boolean/g,
    typeDocs
  )

  // plain type intersection in SFCs (`glow?: boolean` alone before animationDuration or next)
  if (!s.includes('marqueeLeft?: boolean')) {
    s = s.replace(
      /( {2}glow\?: boolean)\n( {2}animationDuration\?:)/g,
      `$1\n  marqueeLeft?: boolean\n  marqueeRight?: boolean\n  scrollUp?: boolean\n  scrollDown?: boolean\n  dampOut?: boolean\n$2`
    )
    s = s.replace(
      /( {2}glow\?: boolean)\n( {2}\/\*\* Explicit)/g,
      `${typeBlockA}\n$2`
    )
  }

  s = s.replace(/ {2}glow: false\n/g, `  glow: false,\n${defaultsBlock.slice('  glow: false,\n'.length)}\n`)
  s = s.replace(/ {2}glow: false,\n(?! {2}marqueeLeft)/g, `${defaultsBlock}\n`)

  s = s.replace(
    / {2}glow: props\.glow,\n(?! {2}marqueeLeft)/g,
    `${useMotionBlock}\n`
  )

  return s
}

for (const rel of files) {
  const file = path.join(root, rel)
  const before = fs.readFileSync(file, 'utf8')
  const after = patch(before)
  if (after === before) {
    console.warn('no change', rel)
  } else {
    fs.writeFileSync(file, after)
    console.log('patched', rel)
  }
}
