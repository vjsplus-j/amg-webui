import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const base = resolve(root, 'packages/components/base')

function walk(d, acc = []) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name)
    if (e.isDirectory()) walk(p, acc)
    else if (e.name.endsWith('.vue') || e.name.endsWith('.ts')) acc.push(p)
  }
  return acc
}

let fixed = 0
for (const file of walk(base)) {
  const orig = readFileSync(file, 'utf8')
  const out = orig.split('\n').map((line) => {
    let l = line
    const dirty = /[\uFFFD]|\?\<\/(button|span)>|â€.|Ã.|Â./.test(l)
    if (!dirty) return l

    if (/prev|previous|arrow--prev|prevMonth|prevYear|prevRange|zoomOut/i.test(l) && /button/.test(l)) {
      return l.replace(/>[\uFFFD?]+\s*<\/button>/, '>‹</button>')
    }
    if (/next|arrow--next|nextMonth|nextYear|nextRange|zoomIn/i.test(l) && /button/.test(l)) {
      return l.replace(/>[\uFFFD?]+\s*<\/button>/, '>›</button>')
    }
    if (/__sep|years\[0\]|week|Range|range/i.test(l)) {
      l = l.replace(/[\uFFFD?]{1,2}/g, '–')
    }
    if (/__icon|__arrow|showIcon|status-tip__icon|alert__icon/i.test(l)) {
      return l.replace(/>[\uFFFD?]+\s*<\/span>/, '>•</span>')
    }
    if (file.includes('Transfer') && /button/.test(l)) {
      if (/left|remove|toLeft/i.test(l)) return l.replace(/[\uFFFD?]+/g, '←')
      return l.replace(/[\uFFFD?]+/g, '→')
    }
    if (file.includes('Statistic')) {
      if (/up|rise|success/i.test(l)) return l.replace(/[\uFFFD?]+/g, '↑')
      if (/down|fall|danger/i.test(l)) return l.replace(/[\uFFFD?]+/g, '↓')
    }
    if (file.includes('InputNumber')) {
      return l.replace(/[\uFFFD?]+/g, '±')
    }
    if (l.trim().startsWith('*') || l.includes('//')) {
      return l.replace(/[\uFFFD]+/g, '—').replace(/â€"/g, '—')
    }
    if (/<\/button>/.test(l)) {
      return l.replace(/>[\uFFFD?]+\s*<\/button>/, '>•</button>')
    }
    if (/<\/span>/.test(l)) {
      return l.replace(/>[\uFFFD?]+\s*<\/span>/, '>•</span>')
    }
    return l.replace(/[\uFFFD]/g, '')
  })

  const next = out.join('\n')
  if (next !== orig) {
    writeFileSync(file, next, 'utf8')
    fixed++
    console.log('fixed', file.slice(root.length + 1))
  }
}
console.log('files fixed:', fixed)
