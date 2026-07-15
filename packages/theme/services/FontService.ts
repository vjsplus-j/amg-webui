export type FontName = 'inter' | 'barlow' | 'anton' | 'archivo' | 'albert-sans' | 'yahei' | 'song' | 'heiti' | 'apple'

export interface FontConfig {
  name: FontName
  label: string
  description: string
  sample: string
}

/** Brand fonts first (synced by ThemeService), then optional OS stacks */
export const fonts: FontConfig[] = [
  {
    name: 'inter',
    label: 'Inter',
    description: 'Mercedes / Linear — Inter Variable（品牌代理 MB Corpo）',
    sample: 'Inter Aa 123'
  },
  {
    name: 'barlow',
    label: 'Barlow',
    description: 'Porsche — Barlow（品牌代理 Porsche Next）',
    sample: 'Barlow Aa 123'
  },
  {
    name: 'anton',
    label: 'Anton',
    description: 'Lamborghini — Anton（品牌代理 LamboType）',
    sample: 'ANTON Aa 123'
  },
  {
    name: 'archivo',
    label: 'Archivo',
    description: 'Ferrari — Archivo（品牌代理 FerrariSans）',
    sample: 'Archivo Aa 123'
  },
  {
    name: 'albert-sans',
    label: 'Albert Sans',
    description: 'Apple — Albert Sans（品牌代理 SF Pro Display）',
    sample: 'Albert Sans Aa'
  },
  {
    name: 'yahei',
    label: '微软雅黑',
    description: 'Windows 常见无衬线中文',
    sample: '微软雅黑 Aa 123'
  },
  {
    name: 'song',
    label: '宋体',
    description: '传统衬线中文',
    sample: '宋体 Aa 123'
  },
  {
    name: 'heiti',
    label: '黑体',
    description: '经典无衬线黑体',
    sample: '黑体 Aa 123'
  },
  {
    name: 'apple',
    label: '系统苹方',
    description: 'PingFang / SF 系统栈（非 Albert Sans）',
    sample: '苹方 Aa 123'
  }
]

const STORAGE_KEY = 'amg-webui-font-v3'
const ATTR = 'data-font'
const DEFAULT_FONT: FontName = 'inter'

let currentFont: FontName = DEFAULT_FONT
const listeners = new Set<(font: FontName) => void>()

function notify() {
  listeners.forEach((fn) => fn(currentFont))
}

export class FontService {
  static getCurrentFont(): FontName {
    return currentFont
  }

  static setFont(font: FontName): void {
    if (!fonts.some((f) => f.name === font)) return

    document.documentElement.setAttribute(ATTR, font)
    currentFont = font
    localStorage.setItem(STORAGE_KEY, font)
    notify()
  }

  static init(): void {
    const stored = localStorage.getItem(STORAGE_KEY) as FontName | null
    const next = stored && fonts.some((f) => f.name === stored) ? stored : DEFAULT_FONT
    FontService.setFont(next)
  }

  static getFonts(): FontConfig[] {
    return fonts
  }

  static toggleFont(): FontName {
    const idx = fonts.findIndex((f) => f.name === currentFont)
    const next = fonts[(idx + 1) % fonts.length].name
    FontService.setFont(next)
    return next
  }

  static subscribe(fn: (font: FontName) => void): () => void {
    listeners.add(fn)
    return () => listeners.delete(fn)
  }
}

export function useFont() {
  return {
    setFont: FontService.setFont,
    getFont: FontService.getCurrentFont,
    getFonts: FontService.getFonts,
    toggleFont: FontService.toggleFont,
    initFont: FontService.init,
    subscribe: FontService.subscribe
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $font: ReturnType<typeof useFont>
  }
}
