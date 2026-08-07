<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Button, Card, Icon } from '@amg-webui/core'
import { InputText, Select } from '@amg-webui/form'
import { Message } from '@amg-webui/overlay'
import {
  ThemeService,
  designStyles,
  type DesignStyleName,
  type ColorScheme,
  IconStyleService,
  iconStyles,
  type IconStyleName,
  FontService,
  fonts,
  type FontName
} from '@amg-webui/theme'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

const { t } = useLocale()

const currentDesign = ref<DesignStyleName>(ThemeService.getCurrentStyle())
const currentScheme = ref<ColorScheme>(ThemeService.getScheme())
const currentIconStyle = ref<IconStyleName>(IconStyleService.getCurrentStyle())
const currentFont = ref<FontName>(FontService.getCurrentFont())
const activeTab = ref<'overview' | 'activity' | 'settings'>('overview')
const sliderVolume = ref(62)
const sliderStorage = ref(78)

let unsubDesign: (() => void) | undefined
let unsubScheme: (() => void) | undefined
let unsubIcon: (() => void) | undefined
let unsubFont: (() => void) | undefined

onMounted(() => {
  unsubDesign = ThemeService.subscribe((s) => {
    currentDesign.value = s
  })
  unsubScheme = ThemeService.subscribeScheme((s) => {
    currentScheme.value = s
  })
  unsubIcon = IconStyleService.subscribe((s) => {
    currentIconStyle.value = s
  })
  unsubFont = FontService.subscribe((f) => {
    currentFont.value = f
  })
})

onUnmounted(() => {
  unsubDesign?.()
  unsubScheme?.()
  unsubIcon?.()
  unsubFont?.()
})

const handleDesignChange = (name: DesignStyleName) => {
  ThemeService.setStyle(name)
}

const handleIconStyleChange = (name: IconStyleName) => {
  IconStyleService.setStyle(name)
}

const handleFontChange = (name: FontName) => {
  FontService.setFont(name)
}

const currentConfig = computed(() => ThemeService.getConfig(currentDesign.value))
const supportsScheme = computed(() => !!currentConfig.value?.supportsScheme)

const previewIcons = [
  'Search',
  'User',
  'Check',
  'Plus',
  'Trash',
  'Edit',
  'Download',
  'Eye',
  'Star',
  'Monitor',
  'Camera',
  'Activity'
]

const fontStacks: Record<FontName, string> = {
  inter: "'Inter', 'Inter Variable', system-ui, sans-serif",
  barlow: "'Barlow', system-ui, sans-serif",
  anton: "'Anton', Impact, sans-serif",
  archivo: "'Archivo', system-ui, sans-serif",
  'albert-sans': "'Albert Sans', -apple-system, sans-serif",
  yahei: "'Microsoft YaHei', '微软雅黑', sans-serif",
  song: "'SimSun', '宋体', 'Songti SC', serif",
  heiti: "'SimHei', '黑体', 'Heiti SC', sans-serif",
  apple: "'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif"
}

const fontPreviewFamily = (name: FontName) => fontStacks[name]

const selectOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' }
]

const tableRows = [
  { member: 'Avery Quinn', plan: 'Pro', status: 'Active' },
  { member: 'Jordan Lee', plan: 'Team', status: 'Pending' },
  { member: 'Sam Rivera', plan: 'Free', status: 'Active' }
]

const paletteTokens = computed(() => {
  const map: Record<DesignStyleName, { label: string; color: string }[]> = {
    mercedes: [
      { label: 'background', color: '#ffffff' },
      { label: 'surface-alt', color: '#f4f4f4' },
      { label: 'ink', color: '#171717' },
      { label: 'ink-secondary', color: '#5c5c5c' },
      { label: 'silver', color: '#b0b0b0' },
      { label: 'border', color: '#d4d4d4' },
      { label: 'primary', color: '#171717' },
      { label: 'hover-tint', color: '#ebebeb' }
    ],
    linear: [
      { label: 'background', color: '#08090a' },
      { label: 'surface', color: '#0f1011' },
      { label: 'elevated', color: '#191a1b' },
      { label: 'ink', color: '#f7f8f8' },
      { label: 'ink-tertiary', color: '#8a8f98' },
      { label: 'primary', color: '#5e6ad2' },
      { label: 'accent', color: '#7170ff' },
      { label: 'border', color: '#23252a' },
      { label: 'success', color: '#27a644' }
    ],
    porsche: [
      { label: 'background', color: '#000000' },
      { label: 'surface-card', color: '#111111' },
      { label: 'surface-light', color: '#1a1a1a' },
      { label: 'ink', color: '#ffffff' },
      { label: 'ink-secondary', color: '#a0a0a0' },
      { label: 'primary', color: '#ffffff' },
      { label: 'border', color: '#333333' }
    ],
    lamborghini: [
      { label: 'background', color: '#000000' },
      { label: 'surface', color: '#202020' },
      { label: 'primary', color: '#ffc000' },
      { label: 'primary-hover', color: '#917300' },
      { label: 'cyan', color: '#29abe2' },
      { label: 'ink', color: '#ffffff' },
      { label: 'ash', color: '#7d7d7d' },
      { label: 'border', color: '#333333' }
    ],
    ferrari: [
      { label: 'primary', color: '#da291c' },
      { label: 'background', color: '#ffffff' },
      { label: 'surface-dark', color: '#000000' },
      { label: 'ink', color: '#181818' },
      { label: 'text-secondary', color: '#666666' },
      { label: 'yellow-racing', color: '#fff200' },
      { label: 'success', color: '#03904a' },
      { label: 'border', color: '#cccccc' }
    ],
    apple: [
      { label: 'background', color: '#f5f5f7' },
      { label: 'surface', color: '#ffffff' },
      { label: 'ink', color: '#1d1d1f' },
      { label: 'text-tertiary', color: '#858586' },
      { label: 'primary', color: '#0071e3' },
      { label: 'link', color: '#0066cc' },
      { label: 'overlay', color: '#d2d2d7' }
    ]
  }
  return map[currentDesign.value]
})

const typeSamples = [
  { cls: 'theme-kit-display-xl', label: 'display-hero / xl', sample: 'The quick brown fox' },
  { cls: 'theme-kit-display', label: 'display', sample: 'Plan, track, and ship together' },
  { cls: 'theme-kit-heading', label: 'heading-section', sample: 'Engineered restraint' },
  { cls: 'theme-kit-body-lg', label: 'body-large', sample: 'Luxury engineering rendered in restraint — tokens map 1:1 to designmd.' }
]
</script>

<template>
  <div class="theme-page theme-kit-stack">
    <ExamplePageHero
      title-key="page.theme.title"
      lead-key="page.theme.switch.lead"
      eyebrow-key="page.theme.eyebrow"
    />

    <section class="section">
      <div class="section-head">
        <h2>{{ t(LocaleKeys.chrome.design) }}</h2>
        <div class="head-actions">
          <Button
            v-if="supportsScheme"
            size="sm"
            variant="outlined"
            @click="ThemeService.toggleScheme()"
          >
            {{
              currentScheme === 'dark'
                ? t(LocaleKeys.chrome.schemeLight)
                : t(LocaleKeys.chrome.schemeDark)
            }}
          </Button>
          <Button size="sm" variant="outlined" @click="ThemeService.toggleTheme()">
            {{ t('page.theme.switch.toggleOnce') }}
          </Button>
        </div>
      </div>
      <div class="style-grid">
        <button
          v-for="style in designStyles"
          :key="style.name"
          type="button"
          class="style-card"
          :class="{ active: currentDesign === style.name }"
          @click="handleDesignChange(style.name)"
        >
          <div class="style-preview" :style="{ background: style.preview.background }">
            <span class="swatch" :style="{ background: style.preview.primary }" />
          </div>
          <div class="style-meta">
            <strong>{{ style.label }}</strong>
            <span>{{ style.category }} · {{ style.description }}</span>
            <a class="ref-link" :href="style.ref" target="_blank" rel="noopener" @click.stop>
              designmd ↗
            </a>
          </div>
          <Icon v-if="currentDesign === style.name" name="Check" size="sm" class="check" />
        </button>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Theme summary</h2>
      <Card class="preview-card">
        <div class="preview-status">
          {{ currentConfig?.label }} · font {{ currentConfig?.font }} · icons
          {{ currentConfig?.iconSet }} · stack
          {{ fonts.find((f) => f.name === currentFont)?.label }}
        </div>
        <p class="theme-kit-body-lg">{{ currentConfig?.description }}</p>
      </Card>
    </section>

    <section class="section">
      <h2 class="section-title">Color Palette</h2>
      <div class="theme-kit-palette">
        <div
          v-for="t in paletteTokens"
          :key="t.label"
          class="theme-kit-swatch"
          :style="{ background: t.color, color: t.color === '#ffffff' || t.color === '#f5f5f7' || t.color === '#f4f4f4' ? '#171717' : '#fff' }"
        >
          <span>{{ t.label }}</span>
          <span>{{ t.color }}</span>
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Typography</h2>
      <div class="theme-kit-stack type-block">
        <div v-for="row in typeSamples" :key="row.cls" class="type-row">
          <span class="type-label">{{ row.label }}</span>
          <p :class="row.cls">{{ row.sample }}</p>
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Buttons</h2>
      <div class="preview-row">
        <button type="button" class="theme-kit-btn-primary p-button p-button-solid p-button-primary">
          primary
        </button>
        <Button severity="secondary" variant="outlined">outline</Button>
        <Button severity="secondary" variant="text" class="theme-kit-btn-ghost">ghost</Button>
        <Button severity="danger" variant="outlined">danger</Button>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <h2>icons Icons</h2>
        <Button size="sm" variant="outlined" @click="IconStyleService.toggleStyle()">Outline/Solid</Button>
      </div>
      <p class="hint">
        designmd: {{ currentConfig?.iconSet }}(runtime Lucide; stroke follows theme
        <code>--icon-stroke-width</code>）
      </p>
      <div class="style-grid compact">
        <button
          v-for="style in iconStyles"
          :key="style.name"
          type="button"
          class="style-card"
          :class="{ active: currentIconStyle === style.name }"
          @click="handleIconStyleChange(style.name)"
        >
          <div class="icon-preview-row">
            <Icon v-for="n in previewIcons.slice(0, 6)" :key="n" :name="n" size="md" />
          </div>
          <div class="style-meta">
            <strong>{{ style.label }}</strong>
            <span>{{ style.description }}</span>
          </div>
        </button>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <h2>font Font</h2>
        <Button size="sm" variant="outlined" @click="FontService.toggleFont()">{{ t('page.theme.switch.toggleOnce') }}</Button>
      </div>
      <p class="hint">Theme switch syncs brand font; override manually here.</p>
      <div class="style-grid">
        <button
          v-for="font in fonts"
          :key="font.name"
          type="button"
          class="style-card"
          :class="{ active: currentFont === font.name }"
          @click="handleFontChange(font.name)"
        >
          <div class="font-preview" :style="{ fontFamily: fontPreviewFamily(font.name) }">
            {{ font.sample }}
          </div>
          <div class="style-meta">
            <strong>{{ font.label }}</strong>
            <span>{{ font.description }}</span>
          </div>
        </button>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Form</h2>
      <div class="preview-row">
        <InputText placeholder="you@company.com" class="preview-input" />
        <InputText type="password" placeholder="••••••••" class="preview-input" />
        <Select :options="selectOptions" placeholder="Select..." class="preview-select" />
        <button type="button" class="theme-kit-btn-primary p-button p-button-solid p-button-primary">
          Continue
        </button>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Card · Shapes</h2>
      <div class="card-shape-row">
        <div class="theme-kit-card">
          <h3 class="theme-kit-heading">{{ currentConfig?.label }}</h3>
          <p class="theme-kit-body-lg">{{ currentConfig?.description }}</p>
          <span class="theme-kit-badge">{{ currentConfig?.category }}</span>
        </div>
        <div class="radius-chip">
          radius → sm/md/lg from theme
          <code>--theme-card-radius</code>
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Alerts</h2>
      <div class="theme-kit-stack">
        <div class="theme-kit-alert theme-kit-alert-info">Heads up — a new version of the design system is available.</div>
        <div class="theme-kit-alert theme-kit-alert-success">Saved. Your changes are live across all surfaces.</div>
        <div class="theme-kit-alert theme-kit-alert-warn">Some tokens are missing a contrast-safe pairing.</div>
        <div class="theme-kit-alert theme-kit-alert-danger">Couldn’t reach the server. Retry in a moment.</div>
        <Message severity="info">Message follows theme alert surfaces</Message>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Badges</h2>
      <div class="preview-row">
        <span class="theme-kit-badge">Solid</span>
        <span class="theme-kit-badge theme-kit-badge-outline">Outline</span>
        <span class="theme-kit-badge">New</span>
        <span class="theme-kit-badge">v2.0</span>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Tabs</h2>
      <div class="theme-kit-tabs">
        <button
          type="button"
          class="theme-kit-tab"
          :class="{ 'is-active': activeTab === 'overview' }"
          @click="activeTab = 'overview'"
        >
          Overview
        </button>
        <button
          type="button"
          class="theme-kit-tab"
          :class="{ 'is-active': activeTab === 'activity' }"
          @click="activeTab = 'activity'"
        >
          Activity
        </button>
        <button
          type="button"
          class="theme-kit-tab"
          :class="{ 'is-active': activeTab === 'settings' }"
          @click="activeTab = 'settings'"
        >
          Settings
        </button>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Stats</h2>
      <div class="theme-kit-stats">
        <div>
          <div class="theme-kit-stat-value">48.2k</div>
          <div class="theme-kit-stat-label">Active users</div>
          <div class="theme-kit-stat-delta">+12.4%</div>
        </div>
        <div>
          <div class="theme-kit-stat-value">$12.8k</div>
          <div class="theme-kit-stat-label">MRR</div>
          <div class="theme-kit-stat-delta">+3.1%</div>
        </div>
        <div>
          <div class="theme-kit-stat-value">99.9%</div>
          <div class="theme-kit-stat-label">Uptime</div>
          <div class="theme-kit-stat-delta is-down">−0.02%</div>
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Table</h2>
      <table class="theme-kit-table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Plan</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableRows" :key="row.member">
            <td>{{ row.member }}</td>
            <td>{{ row.plan }}</td>
            <td>{{ row.status }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="section">
      <h2 class="section-title">Avatars</h2>
      <div class="preview-row">
        <div class="theme-kit-avatars">
          <span class="theme-kit-avatar">AQ</span>
          <span class="theme-kit-avatar">JL</span>
          <span class="theme-kit-avatar">SR</span>
          <span class="theme-kit-avatar">+5</span>
        </div>
        <div class="theme-kit-avatar-profile">
          <span class="theme-kit-avatar">AQ</span>
          <div>
            <strong>Avery Quinn</strong>
            <div class="hint">Online · Owner</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Slider · Progress</h2>
      <div class="slider-grid">
        <div class="theme-kit-slider">
          <div class="theme-kit-slider-meta">
            <span>Volume</span>
            <span>{{ sliderVolume }}%</span>
          </div>
          <div class="theme-kit-slider-track">
            <div class="theme-kit-slider-fill" :style="{ width: sliderVolume + '%' }" />
          </div>
          <input v-model.number="sliderVolume" type="range" min="0" max="100" />
        </div>
        <div class="theme-kit-slider">
          <div class="theme-kit-slider-meta">
            <span>Storage used</span>
            <span>{{ sliderStorage }}%</span>
          </div>
          <div class="theme-kit-slider-track">
            <div class="theme-kit-slider-fill" :style="{ width: sliderStorage + '%' }" />
          </div>
          <input v-model.number="sliderStorage" type="range" min="0" max="100" />
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Navigation</h2>
      <nav class="theme-kit-nav">
        <span class="theme-kit-nav-brand">{{ currentConfig?.label }}</span>
        <div class="theme-kit-nav-links">
          <span>Product</span>
          <span>Solutions</span>
          <span>Pricing</span>
          <span>Docs</span>
        </div>
        <div class="theme-kit-nav-actions">
          <Button size="sm" variant="text">Sign in</Button>
          <button type="button" class="theme-kit-btn-primary p-button p-button-solid p-button-primary">
            Get started
          </button>
        </div>
      </nav>
    </section>

    <section class="section">
      <h2 class="section-title">Breadcrumb</h2>
      <div class="theme-kit-breadcrumb">
        <span>Home</span>
        <span class="sep">/</span>
        <span>{{ currentConfig?.category }}</span>
        <span class="sep">/</span>
        <span class="is-current">{{ currentConfig?.label }}</span>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Menu</h2>
      <div class="theme-kit-menu" style="max-width: 220px">
        <button type="button" class="theme-kit-menu-item">Profile</button>
        <button type="button" class="theme-kit-menu-item">Settings</button>
        <button type="button" class="theme-kit-menu-item">Billing</button>
        <button type="button" class="theme-kit-menu-item is-danger">Sign out</button>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Integration</h2>
      <div class="info-cards">
        <div class="info-card">
          <h3>ThemeService</h3>
          <p>
            <code>setStyle('mercedes' | 'linear' | 'porsche' | 'lamborghini' | 'ferrari' | 'apple')</code>
          </p>
          <p>Writes <code>html[data-design]</code> and syncs brand font.</p>
        </div>
        <div class="info-card">
          <h3>URL</h3>
          <p><code>?design=porsche</code> · <code>?font=barlow</code> · <code>?icon=outline</code></p>
        </div>
        <div class="info-card">
          <h3>Token layers</h3>
          <p>Brand primitives → <code>--surface-*</code> / <code>--primary-*</code> → <code>--theme-*</code> component contract</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.theme-page {
  padding: 0;
}

.section {
  margin-bottom: var(--spacing-2xl);
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.head-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.section-head h2,
.section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-heading);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.section-head .section-title,
.section-head h2 {
  margin-bottom: 0;
}

.style-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--spacing-lg);
}

.style-grid.compact {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.style-card {
  position: relative;
  text-align: left;
  background: var(--surface-1);
  border: 2px solid var(--border-color);
  border-radius: var(--theme-card-radius);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: border-color var(--transition-normal), box-shadow var(--transition-normal);
  color: inherit;
}

.style-card:hover,
.style-card.active {
  border-color: var(--primary-500);
}

.style-card.active {
  box-shadow: var(--shadow-md);
}

.style-preview {
  height: 72px;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
  border: 1px solid var(--border-color);
}

.swatch {
  width: 36px;
  height: 36px;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
}

.style-meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding-right: var(--spacing-xl);
}

.style-meta strong {
  color: var(--text-primary);
}

.style-meta span {
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
  line-height: 1.4;
}

.ref-link {
  font-size: var(--font-size-xs);
  color: var(--ds-accent);
  text-decoration: none;
  margin-top: 0.25rem;
}

.check {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  color: var(--primary-500);
}

.hint {
  color: var(--text-muted);
  font-size: var(--font-size-xs);
  margin: 0 0 var(--spacing-md);
}

.preview-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.preview-status {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
}

.preview-row {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  align-items: center;
}

.preview-input,
.preview-select {
  width: 200px;
}

.icon-preview-row {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  background: var(--surface-2);
  border-radius: var(--border-radius-md);
  color: var(--text-primary);
}

.font-preview {
  height: 72px;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
  border: 1px solid var(--border-color);
  background: var(--surface-2);
  color: var(--text-primary);
  font-size: var(--font-size-xl);
  font-weight: 600;
}

.type-block {
  gap: var(--spacing-lg);
}

.type-row {
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.type-label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-bottom: 0.35rem;
}

.card-shape-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-lg);
}

@media (max-width: 800px) {
  .card-shape-row {
    grid-template-columns: 1fr;
  }
}

.radius-chip {
  padding: var(--spacing-lg);
  border: 1px dashed var(--border-color);
  border-radius: var(--theme-card-radius);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.slider-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--spacing-xl);
}

.slider-grid input[type='range'] {
  width: 100%;
  accent-color: var(--theme-slider-fill);
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--spacing-lg);
}

.info-card {
  background: var(--surface-1);
  border: 1px solid var(--border-color);
  border-radius: var(--theme-card-radius);
  padding: var(--spacing-lg);
}

.info-card h3 {
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-sm);
}

.info-card p {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.5;
}

.info-card code {
  font-family: var(--font-family-mono);
  font-size: 0.85em;
  color: var(--primary-400);
}

code {
  font-family: var(--font-family-mono);
  font-size: 0.9em;
}
</style>
