<script setup lang="ts">
import {
  Button,
  Card,
  Tag,
  Icon,
  Badge,
  Progress,
  Alert
} from '@amg-webui/core'
import { InputText, Switch, Radio, RadioGroup, Checkbox } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import { ref } from 'vue'

defineProps<{
  scheme: 'light' | 'dark'
}>()

const { t } = useLocale()
const switchOn = ref(true)
const radio = ref('a')
</script>

<template>
  <div class="vp-component-preview" :data-scheme="scheme">
    <div class="vp-component-preview__toolbar">
      <Button variant="solid">{{ t('theme.studio.preview.primary') }}</Button>
      <Button variant="outlined">{{ t('theme.studio.preview.secondary') }}</Button>
      <Button variant="dashed">{{ t('theme.studio.preview.dashed') }}</Button>
      <Button variant="text">{{ t('theme.studio.preview.text') }}</Button>
    </div>

    <Card class="vp-component-preview__card">
      <template #header>
        <span>{{ t('theme.studio.preview.cardTitle') }}</span>
        <Tag type="primary">Tag</Tag>
      </template>
      <p class="vp-component-preview__lead">
        {{ t('theme.studio.preview.cardBody') }}
      </p>
      <InputText
        :placeholder="t('theme.studio.preview.inputPlaceholder')"
        style="max-width: 16rem"
      />
    </Card>

    <div class="vp-component-preview__row">
      <Alert severity="success" :title="t('theme.studio.preview.alertSuccess')" />
      <Alert severity="warning" :title="t('theme.studio.preview.alertWarning')" />
    </div>

    <div class="vp-component-preview__controls">
      <label class="vp-component-preview__control">
        <Switch v-model="switchOn" />
        <span>{{ t('theme.studio.preview.switch') }}</span>
      </label>
      <Checkbox>{{ t('theme.studio.preview.checkbox') }}</Checkbox>
      <RadioGroup v-model="radio">
        <Radio value="a">{{ t('theme.studio.preview.radioA') }}</Radio>
        <Radio value="b">{{ t('theme.studio.preview.radioB') }}</Radio>
      </RadioGroup>
    </div>

    <div class="vp-component-preview__stats">
      <div class="vp-component-preview__stat">
        <Badge :value="12">
          <Icon name="Bell" />
        </Badge>
        <span>{{ t('theme.studio.preview.badge') }}</span>
      </div>
      <Progress :percentage="68" style="flex: 1; max-width: 12rem" />
    </div>
  </div>
</template>

<style scoped>
.vp-component-preview {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
  padding: var(--theme-card-pad);
  background: var(--ds-bg);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  min-height: 20rem;
}

.vp-component-preview__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.vp-component-preview__card {
  width: 100%;
}

.vp-component-preview__lead {
  margin: 0 0 var(--spacing-md);
  color: var(--ds-text-muted);
  font-size: var(--font-size-sm);
}

.vp-component-preview__row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: var(--spacing-sm);
}

.vp-component-preview__controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
  align-items: center;
}

.vp-component-preview__control {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--ds-text);
}

.vp-component-preview__stats {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.vp-component-preview__stat {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--ds-text-muted);
}
</style>
