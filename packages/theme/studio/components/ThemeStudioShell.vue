<script setup lang="ts">
import { ref } from 'vue'
import { Button, Card } from '@amg-webui/core'
import { InputText } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import type { LocaleKey } from '@amg-webui/locale'
import { useThemeStudio } from '../composables/useThemeStudio'
import PaletteEditor from './PaletteEditor.vue'
import TypographyEditor from './TypographyEditor.vue'
import RadiusEditor from './RadiusEditor.vue'
import ElevationEditor from './ElevationEditor.vue'
import ComponentPreview from './ComponentPreview.vue'
import ThemePreset from './ThemePreset.vue'
import ThemeExport from './ThemeExport.vue'
import ThemeImport from './ThemeImport.vue'
import ThemeValidation from './ThemeValidation.vue'
import '../studio.scss'

const props = withDefaults(
  defineProps<{
    storageKey?: string
  }>(),
  { storageKey: undefined }
)

const { t } = useLocale()
const studio = useThemeStudio({ storageKey: props.storageKey })
const activePanel = ref<'palette' | 'typography' | 'radius' | 'elevation'>('palette')

function onTokensPatch(patch: Record<string, string>) {
  studio.patchTokens(patch)
}

function toggleScheme() {
  studio.setScheme(studio.draft.value.scheme === 'dark' ? 'light' : 'dark')
}

const panels: { id: typeof activePanel.value; labelKey: LocaleKey }[] = [
  { id: 'palette', labelKey: 'theme.studio.group.palette' },
  { id: 'typography', labelKey: 'theme.studio.group.typography' },
  { id: 'radius', labelKey: 'theme.studio.group.radius' },
  { id: 'elevation', labelKey: 'theme.studio.group.elevation' }
]
</script>

<template>
  <div class="vp-theme-studio">
    <header class="vp-theme-studio__header">
      <InputText
        :model-value="studio.draft.value.name"
        size="sm"
        :placeholder="t('theme.studio.namePlaceholder')"
        style="max-width: 14rem"
        @update:model-value="
          (v) => {
            studio.draft.value.name = v
            studio.persist()
          }
        "
      />
      <div class="vp-theme-studio__header-actions">
        <Button
          size="sm"
          :variant="studio.draft.value.scheme === 'dark' ? 'solid' : 'outlined'"
          @click="toggleScheme"
        >
          {{
            studio.draft.value.scheme === 'dark'
              ? t('theme.studio.scheme.dark')
              : t('theme.studio.scheme.light')
          }}
        </Button>
        <Button size="sm" @click="studio.resetDraft()">
          {{ t('theme.studio.reset') }}
        </Button>
      </div>
    </header>

    <section class="vp-theme-studio__presets">
      <h3 class="vp-theme-studio__section-title">{{ t('theme.studio.presets') }}</h3>
      <ThemePreset
        :active="studio.draft.value.baseDesign"
        @select="studio.setDesign"
      />
    </section>

    <div class="vp-theme-studio__layout">
      <aside class="vp-theme-studio__sidebar">
        <nav class="vp-theme-studio__tabs">
          <button
            v-for="panel in panels"
            :key="panel.id"
            type="button"
            class="vp-theme-studio__tab"
            :class="{ 'vp-theme-studio__tab--active': activePanel === panel.id }"
            @click="activePanel = panel.id"
          >
            {{ t(panel.labelKey) }}
          </button>
        </nav>

        <Card class="vp-theme-studio__editor-card">
          <PaletteEditor
            v-if="activePanel === 'palette'"
            :tokens="studio.draft.value.tokens"
            @update:tokens="onTokensPatch"
          />
          <TypographyEditor
            v-else-if="activePanel === 'typography'"
            :tokens="studio.draft.value.tokens"
            @update:tokens="onTokensPatch"
          />
          <RadiusEditor
            v-else-if="activePanel === 'radius'"
            :tokens="studio.draft.value.tokens"
            @update:tokens="onTokensPatch"
          />
          <ElevationEditor
            v-else
            :tokens="studio.draft.value.tokens"
            @update:tokens="onTokensPatch"
          />
        </Card>

        <Card class="vp-theme-studio__io-card">
          <h4 class="vp-theme-studio__card-title">{{ t('theme.studio.import.title') }}</h4>
          <ThemeImport @import="studio.loadImported" />
          <h4 class="vp-theme-studio__card-title">{{ t('theme.studio.export.title') }}</h4>
          <ThemeExport :draft="studio.draft.value" />
          <h4 class="vp-theme-studio__card-title">{{ t('theme.studio.validation.title') }}</h4>
          <ThemeValidation :result="studio.validation.value" />
        </Card>
      </aside>

      <main class="vp-theme-studio__preview">
        <h3 class="vp-theme-studio__section-title">{{ t('theme.studio.preview.title') }}</h3>
        <ComponentPreview :scheme="studio.draft.value.scheme" />
      </main>
    </div>
  </div>
</template>
