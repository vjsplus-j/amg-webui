import type { Component } from 'vue'

export interface CuratedDemoDoc {
  whenKey: string
  Demo: Component
}

const modules = import.meta.glob('./*/index.vue', { eager: true }) as Record<
  string,
  { default: Component }
>

function loadDemo(folder: string): Component {
  const key = Object.keys(modules).find((p) => p.includes(`/${folder}/`))
  if (!key) throw new Error(`Missing curated demo: ${folder}`)
  return modules[key].default
}

/** Curated Ant-style docs — expand over time (Button / ButtonGroup / FloatButton / Icon / Typography / Tag / Link / Ellipsis / Highlight / Avatar / AvatarGroup / Badge…). */
export const DEMO_REGISTRY: Record<string, CuratedDemoDoc> = {
  Button: { whenKey: 'example.doc.button.when', Demo: loadDemo('Button') },
  ButtonGroup: { whenKey: 'example.doc.buttonGroup.when', Demo: loadDemo('ButtonGroup') },
  FloatButton: { whenKey: 'example.doc.floatButton.when', Demo: loadDemo('FloatButton') },
  Icon: { whenKey: 'example.doc.icon.when', Demo: loadDemo('Icon') },
  Typography: { whenKey: 'example.doc.typography.when', Demo: loadDemo('Typography') },
  Tag: { whenKey: 'example.doc.tag.when', Demo: loadDemo('Tag') },
  Link: { whenKey: 'example.doc.link.when', Demo: loadDemo('Link') },
  Ellipsis: { whenKey: 'example.doc.ellipsis.when', Demo: loadDemo('Ellipsis') },
  Highlight: { whenKey: 'example.doc.highlight.when', Demo: loadDemo('Highlight') },
  Avatar: { whenKey: 'example.doc.avatar.when', Demo: loadDemo('Avatar') },
  AvatarGroup: { whenKey: 'example.doc.avatarGroup.when', Demo: loadDemo('AvatarGroup') },
  Badge: { whenKey: 'example.doc.badge.when', Demo: loadDemo('Badge') },
  Skeleton: { whenKey: 'example.doc.skeleton.when', Demo: loadDemo('Skeleton') },
  Space: { whenKey: 'example.doc.space.when', Demo: loadDemo('Space') },
  Spin: { whenKey: 'example.doc.spin.when', Demo: loadDemo('Spin') },
  CopyText: { whenKey: 'example.doc.copyText.when', Demo: loadDemo('CopyText') },
  Collapse: { whenKey: 'example.doc.collapse.when', Demo: loadDemo('Collapse') },
  Statistic: { whenKey: 'example.doc.statistic.when', Demo: loadDemo('Statistic') },
  Divider: { whenKey: 'example.doc.divider.when', Demo: loadDemo('Divider') },
  Progress: { whenKey: 'example.doc.progress.when', Demo: loadDemo('Progress') },
  Card: { whenKey: 'example.doc.card.when', Demo: loadDemo('Card') },
  CardWidgets: { whenKey: 'example.doc.card-widgets.when', Demo: loadDemo('CardWidgets') },
  Empty: { whenKey: 'example.doc.empty.when', Demo: loadDemo('Empty') },
  Tabs: { whenKey: 'example.doc.tabs.when', Demo: loadDemo('Tabs') },
  Switch: { whenKey: 'example.doc.switch.when', Demo: loadDemo('Switch') },
  Radio: { whenKey: 'example.doc.radio.when', Demo: loadDemo('Radio') },
  Checkbox: { whenKey: 'example.doc.checkbox.when', Demo: loadDemo('Checkbox') }
}

export function getCuratedDemo(name: string): CuratedDemoDoc | undefined {
  return DEMO_REGISTRY[name]
}
