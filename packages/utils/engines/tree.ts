/**
 * ENG-006 Tree Model — re-export shared tree state.
 */
export {
  useTreeState,
  flattenVisibleTree,
  filterTreeNodes,
  type UseTreeStateOptions,
  type TreeStateEmit
} from '../data-display/useTreeState'
export type { TreeNode, FlatTreeRow, TreeCheckState } from '../data-display/tree-types'
