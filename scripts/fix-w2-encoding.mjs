import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const names = [
  'BarChart', 'CardList', 'Carousel', 'Collapse', 'DataCard', 'DrillTable', 'EditTable', 'EditTree',
  'FolderTree', 'GaugeChart', 'GraphChart', 'HeatMap', 'ImageGroup', 'LazyTree', 'LineChart', 'MergeTable',
  'PieChart', 'PivotTable', 'ProTable', 'RadarChart', 'Ranking', 'ScrollNotice', 'StickyTable', 'TableAction',
  'TableDrag', 'TableExport', 'Thumbnail', 'TimelineList', 'TransferTree', 'Tree', 'TreeChart', 'TreeForm',
  'TreeTable', 'TreeTransfer', 'VirtualTable', 'VirtualTree', 'Waterfall', 'WordCloud'
]

const rules = [
  [/\{\{\s*row\.expanded\s*\?\s*'[^:]*\s*:\s*'\+'\s*\}\}/g, "{{ row.expanded ? '-' : '+' }}"],
  [/\{\{\s*expanded\.has\(f\.row\.id\)\s*\?\s*'[^:]*\s*:\s*'\+'\s*\}\}/g, "{{ expanded.has(f.row.id) ? '-' : '+' }}"],
  [/\{\{\s*openKeys\.has\(panel\.key\)\s*\?\s*'[^:]*\s*:\s*'\+'\s*\}\}/g, "{{ openKeys.has(panel.key) ? '-' : '+' }}"],
  [
    /\{\{\s*loadingIds\.has\(row\.id\)\s*\?\s*'[^:]*\s*:\s*row\.expanded\s*\?\s*'[^:]*\s*:\s*'\+'\s*\}\}/g,
    "{{ loadingIds.has(row.id) ? '...' : row.expanded ? '-' : '+' }}"
  ]
]

for (const name of names) {
  const file = join('packages/components/base', name, 'index.vue')
  if (!existsSync(file)) continue
  let s = readFileSync(file, 'utf8')
  const orig = s
  for (const [re, rep] of rules) s = s.replace(re, rep)
  if (s !== orig) {
    writeFileSync(file, s)
    console.log('fixed', name)
  }
}
