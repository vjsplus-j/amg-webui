/**
 * Explicit allowlist for `package.json` `exports` deep paths.
 * Prevents every internal `.ts` under packages/* from becoming a forever public API.
 *
 * Keys match `collectTsEntries` output (e.g. `utils/env`, `locale/zh-CN/index`).
 */

/**
 * @param {string} key
 * @returns {boolean}
 */
export function isPublicExportEntryKey(key) {
  if (!key || key.includes('.worker')) return false

  // Overlay runtime: barrel only — managers stay internal
  if (key.startsWith('runtime/')) return key === 'runtime/index'

  // Locale: package packs only (never message fragment modules)
  if (key.startsWith('locale/')) {
    return key === 'locale/index' || /^locale\/[^/]+\/index$/.test(key)
  }

  // Lowcode UI components ship via kebab component exports; only ui barrel here
  if (key.startsWith('lowcode/ui/')) return key === 'lowcode/ui/index'
  if (key.startsWith('lowcode/')) return /^lowcode\/[^/]+$/.test(key)

  // Hooks: flat public composables
  if (key.startsWith('hooks/')) return /^hooks\/[^/]+$/.test(key)

  // Utils: top-level + documented subtrees
  if (key.startsWith('utils/')) {
    if (/^utils\/[^/]+$/.test(key)) return true
    if (key.startsWith('utils/nav/')) return true
    if (key.startsWith('utils/data-display/')) return true
    return false
  }

  // Icons / security / telemetry / types / constants / animations: flat modules only
  if (/^(icons|security|telemetry|types|constants|animations)\//.test(key)) {
    return /^[^/]+\/[^/]+$/.test(key)
  }

  return false
}
