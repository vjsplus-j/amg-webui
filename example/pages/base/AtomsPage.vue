<script setup lang="ts">
import { ref } from 'vue'
import { Button, Card, Tag, Badge, Avatar, Link, Icon } from '@amg-webui/core'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import ComponentGallery from '../../components/ComponentGallery.vue'

const { t, tDyn } = useLocale()
const loading = ref(false)

/** Tiny SVG avatar for img-button column (no external asset) */
const demoImg =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <rect width="64" height="64" fill="%235e6ad2"/>
      <circle cx="32" cy="26" r="12" fill="%23f7f8f8"/>
      <ellipse cx="32" cy="54" rx="20" ry="14" fill="%23f7f8f8"/>
    </svg>`
  )

const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']

const sizeLabelKey: Record<Size, string> = {
  xs: LocaleKeys.page.baseAtomsButton.sizeXs,
  sm: LocaleKeys.page.baseAtomsButton.sizeSm,
  md: LocaleKeys.page.baseAtomsButton.sizeMd,
  lg: LocaleKeys.page.baseAtomsButton.sizeLg,
  xl: LocaleKeys.page.baseAtomsButton.sizeXl
}

function flash() {
  loading.value = true
  window.setTimeout(() => {
    loading.value = false
  }, 800)
}
</script>

<template>
  <ComponentGallery zone="atoms" title-key="page.base.atoms.title" lead-key="page.base.atoms.lead">
    <template #featured>
      <Card :title="t(LocaleKeys.page.baseAtomsButton.matrix)" class="vp-btn-matrix-card">
        <p class="vp-btn-matrix__hint">{{ t(LocaleKeys.page.baseAtomsButton.statesHint) }}</p>
        <div class="vp-btn-matrix" role="table">
          <div class="vp-btn-matrix__head" role="row">
            <span class="vp-btn-matrix__cell vp-btn-matrix__cell--label" role="columnheader" />
            <span class="vp-btn-matrix__cell" role="columnheader">{{ t(LocaleKeys.page.baseAtomsButton.solid) }}</span>
            <span class="vp-btn-matrix__cell" role="columnheader">{{ t(LocaleKeys.page.baseAtomsButton.outlined) }}</span>
            <span class="vp-btn-matrix__cell" role="columnheader">{{ t(LocaleKeys.page.baseAtomsButton.badge) }}</span>
            <span class="vp-btn-matrix__cell" role="columnheader">{{ t(LocaleKeys.page.baseAtomsButton.star) }}</span>
            <span class="vp-btn-matrix__cell" role="columnheader">{{ t(LocaleKeys.page.baseAtomsButton.iconCircle) }}</span>
            <span class="vp-btn-matrix__cell" role="columnheader">{{ t(LocaleKeys.page.baseAtomsButton.iconSquare) }}</span>
            <span class="vp-btn-matrix__cell" role="columnheader">{{ t(LocaleKeys.page.baseAtomsButton.img) }}</span>
          </div>
          <div
            v-for="sz in sizes"
            :key="sz"
            class="vp-btn-matrix__row"
            role="row"
          >
            <span class="vp-btn-matrix__cell vp-btn-matrix__cell--label" role="rowheader">
              {{ tDyn(sizeLabelKey[sz]) }}
            </span>
            <span class="vp-btn-matrix__cell" role="cell">
              <Button :size="sz" @click="flash">{{ t(LocaleKeys.button.confirm) }}</Button>
            </span>
            <span class="vp-btn-matrix__cell" role="cell">
              <Button :size="sz" variant="outlined" :loading="sz === 'md' && loading">
                {{ t(LocaleKeys.common.loading) }}
              </Button>
            </span>
            <span class="vp-btn-matrix__cell" role="cell">
              <Button :size="sz" :badge="3" @click="flash">
                {{ t(LocaleKeys.button.refresh) }}
              </Button>
            </span>
            <span class="vp-btn-matrix__cell" role="cell">
              <Button :size="sz" star variant="outlined" @click="flash">
                {{ t(LocaleKeys.button.save) }}
              </Button>
            </span>
            <span class="vp-btn-matrix__cell" role="cell">
              <Button
                :size="sz"
                shape="circle"
                icon="Star"
                :aria-label="t(LocaleKeys.page.baseAtomsButton.ariaIcon)"
                @click="flash"
              />
            </span>
            <span class="vp-btn-matrix__cell" role="cell">
              <Button
                :size="sz"
                shape="square"
                variant="outlined"
                icon="Settings"
                :aria-label="t(LocaleKeys.page.baseAtomsButton.ariaIcon)"
                @click="flash"
              />
            </span>
            <span class="vp-btn-matrix__cell" role="cell">
              <Button
                :size="sz"
                shape="circle"
                :img="demoImg"
                :aria-label="t(LocaleKeys.page.baseAtomsButton.ariaImg)"
                badge="1"
                @click="flash"
              />
            </span>
          </div>
        </div>
      </Card>

      <Card :title="t(LocaleKeys.common.actions)" class="vp-toolbar">
        <div class="row">
          <Button size="sm" @click="flash">{{ t(LocaleKeys.button.confirm) }}</Button>
          <Button size="sm" variant="outlined" :loading="loading">{{ t(LocaleKeys.common.loading) }}</Button>
          <Tag severity="success">{{ t(LocaleKeys.common.success) }}</Tag>
          <Badge :value="3">
            <Icon name="Settings" />
          </Badge>
          <Avatar text="VP" />
          <Link href="https://example.com" target="_blank">{{ t(LocaleKeys.button.learnMore) }}</Link>
        </div>
      </Card>
    </template>
  </ComponentGallery>
</template>

<style scoped>
.vp-btn-matrix-card {
  margin-bottom: var(--theme-section-gap);
}

.vp-btn-matrix__hint {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.vp-btn-matrix {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  overflow-x: auto;
}

.vp-btn-matrix__head,
.vp-btn-matrix__row {
  display: grid;
  grid-template-columns: minmax(4.5rem, 6rem) repeat(7, minmax(4.5rem, 1fr));
  gap: var(--spacing-md);
  align-items: center;
}

.vp-btn-matrix__head {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  font-weight: var(--font-weight-heading, 500);
}

.vp-btn-matrix__cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--height-xl);
}

.vp-btn-matrix__cell--label {
  justify-content: flex-start;
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  white-space: nowrap;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: center;
}
</style>
