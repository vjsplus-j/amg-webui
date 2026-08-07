<script setup lang="ts">
/**
 * Lab · Hooks
 * Spec: docs/APP_WORKFLOW.md §六 — theme/locale · toast/confirm · size/breakpoint · form combo
 */
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { Button, Card, Space, Tag } from '@amg-webui/core'
import { Form, FormItem, InputText, Select } from '@amg-webui/form'
import type { SelectModelValue } from '@amg-webui/form'
import {
  useLocale,
  useTheme,
  useToast,
  useConfirm,
  useSize,
  useVModel
} from '@amg-webui/hooks'
import { LocaleKeys, LOCALE_CODES } from '@amg-webui/locale'
import type { DesignStyleName, ColorScheme } from '@amg-webui/theme'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

const { t, tDyn, locale, dir, setLocale, toggleDirection, toggle } = useLocale()
const theme = useTheme()
const toast = useToast()
const confirm = useConfirm()

const design = ref(theme.getStyle())
const scheme = ref(theme.getScheme())
const lastConfirm = ref('—')

let unsubTheme: (() => void) | undefined
let unsubScheme: (() => void) | undefined

const checklist = computed(() => {
  void locale.value
  return [
    t('page.lab.hooks.c1'),
    t('page.lab.hooks.c2'),
    t('page.lab.hooks.c3'),
    t('page.lab.hooks.c4')
  ]
})

const localeOptions = computed(() =>
  LOCALE_CODES.map((code) => ({ value: code, label: code }))
)

function onLocaleSelect(v: SelectModelValue) {
  if (typeof v === 'string') setLocale(v)
}

function applyDesign(name: DesignStyleName) {
  theme.setStyle(name)
  design.value = theme.getStyle()
}

function toggleScheme() {
  theme.toggleScheme()
  scheme.value = theme.getScheme()
}

/* —— size + breakpoint —— */
const sizeChoice = ref<'sm' | 'md' | 'lg' | 'xl'>('md')
const sizeProps = reactive({ size: sizeChoice.value as 'sm' | 'md' | 'lg' | 'xl' })
watch(sizeChoice, (s) => {
  sizeProps.size = s
})
const { size, sizeStyle } = useSize(sizeProps)

const sizeOptions = [
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
  { value: 'lg', label: 'lg' },
  { value: 'xl', label: 'xl' }
]

const viewportW = ref(typeof window !== 'undefined' ? window.innerWidth : 0)
const breakpoint = ref('md')

const mediaQueries: { name: string; mq: string }[] = [
  { name: 'xs', mq: '(max-width: 575.98px)' },
  { name: 'sm', mq: '(min-width: 576px) and (max-width: 767.98px)' },
  { name: 'md', mq: '(min-width: 768px) and (max-width: 991.98px)' },
  { name: 'lg', mq: '(min-width: 992px) and (max-width: 1199.98px)' },
  { name: 'xl', mq: '(min-width: 1200px)' }
]

const mediaList: MediaQueryList[] = []
const mediaHandlers: Array<() => void> = []

function refreshBreakpoint() {
  viewportW.value = window.innerWidth
  for (const item of mediaQueries) {
    if (window.matchMedia(item.mq).matches) {
      breakpoint.value = item.name
      return
    }
  }
  breakpoint.value = '—'
}

/* —— form + useVModel —— */
const formModel = reactive({ email: '' })
const emailBox = reactive({ value: formModel.email })
watch(
  () => formModel.email,
  (v) => {
    emailBox.value = v
  }
)
watch(
  () => emailBox.value,
  (v) => {
    formModel.email = v
  }
)
const { value: emailVModel } = useVModel(emailBox)

const formRef = ref<{ validate: () => Promise<boolean> } | null>(null)
const formStatus = ref('')

const formRules = computed(() => ({
  email: [
    { required: true, message: tDyn('page.lab.hooks.formRequired') },
    {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: tDyn('page.lab.hooks.formInvalid')
    }
  ]
}))

async function submitForm() {
  const ok = await formRef.value?.validate()
  if (!ok) {
    formStatus.value = ''
    return
  }
  formStatus.value = tDyn('page.lab.hooks.formOk', { value: formModel.email })
  toast.success({
    summary: tDyn('page.lab.hooks.toastSummary'),
    detail: formStatus.value
  })
}

function showToast(kind: 'success' | 'info' | 'warn' | 'error') {
  const detail = tDyn('page.lab.hooks.toastDetail', { kind })
  const summary = tDyn('page.lab.hooks.toastSummary')
  if (kind === 'success') toast.success({ summary, detail })
  else if (kind === 'info') toast.info({ summary, detail })
  else if (kind === 'warn') toast.warn({ summary, detail })
  else toast.error({ summary, detail })
}

function openConfirm() {
  confirm.require({
    header: tDyn('page.lab.hooks.confirmHeader'),
    message: tDyn('page.lab.hooks.confirmMessage'),
    severity: 'warn',
    acceptLabel: t(LocaleKeys.button.confirm),
    rejectLabel: t(LocaleKeys.button.cancel),
    accept: () => {
      lastConfirm.value = tDyn('page.lab.hooks.confirmAccepted')
    },
    reject: () => {
      lastConfirm.value = tDyn('page.lab.hooks.confirmRejected')
    }
  })
}

const sampleText = computed(() => {
  void locale.value
  return tDyn('page.lab.hooks.sampleCopy', { text: t(LocaleKeys.button.save) })
})

onMounted(() => {
  design.value = theme.getStyle()
  scheme.value = theme.getScheme()
  unsubTheme = theme.subscribe((name) => {
    design.value = name as DesignStyleName
  })
  unsubScheme = theme.subscribeScheme((s) => {
    scheme.value = s as ColorScheme
  })

  refreshBreakpoint()
  for (const item of mediaQueries) {
    const mql = window.matchMedia(item.mq)
    const handler = () => refreshBreakpoint()
    mql.addEventListener('change', handler)
    mediaList.push(mql)
    mediaHandlers.push(handler)
  }
  window.addEventListener('resize', refreshBreakpoint, { passive: true })
})

onUnmounted(() => {
  unsubTheme?.()
  unsubScheme?.()
  mediaList.forEach((mql, i) => {
    mql.removeEventListener('change', mediaHandlers[i]!)
  })
  window.removeEventListener('resize', refreshBreakpoint)
})
</script>

<template>
  <div class="page vp-lab-hooks">
    <ExamplePageHero title-key="page.lab.hooks.title" lead-key="page.lab.hooks.lead" />

    <Card class="vp-lab-hooks__card" :header="tDyn('page.lab.hooks.checklistTitle')">
      <ul class="vp-lab-hooks__checklist">
        <li v-for="(item, i) in checklist" :key="i">{{ item }}</li>
      </ul>
    </Card>

    <!-- 1. useTheme / useLocale -->
    <Card class="vp-lab-hooks__card" :header="tDyn('page.lab.hooks.sectionThemeLocale')">
      <p class="vp-lab-hooks__desc">{{ tDyn('page.lab.hooks.sectionThemeLocaleDesc') }}</p>
      <div class="vp-lab-hooks__tags">
        <Tag size="sm" :label="`${tDyn('page.lab.hooks.currentStyle')}: ${design}`" />
        <Tag size="sm" :label="`${tDyn('page.lab.hooks.currentScheme')}: ${scheme}`" />
        <Tag size="sm" :label="`${tDyn('page.lab.hooks.currentLocale')}: ${locale}`" />
        <Tag size="sm" :label="`${tDyn('page.lab.hooks.currentDir')}: ${dir}`" />
      </div>
      <p class="vp-lab-hooks__sample">{{ sampleText }}</p>
      <Space wrap>
        <Button size="sm" severity="primary" :label="tDyn('page.lab.hooks.applyMercedes')" @click="applyDesign('mercedes')" />
        <Button size="sm" severity="primary" :label="tDyn('page.lab.hooks.applyLinear')" @click="applyDesign('linear')" />
        <Button size="sm" variant="outlined" :label="tDyn('page.lab.hooks.toggleScheme')" @click="toggleScheme" />
        <Button size="sm" variant="outlined" :label="tDyn('page.lab.hooks.nextLocale')" @click="toggle" />
        <Button size="sm" variant="outlined" :label="tDyn('page.lab.hooks.toggleDir')" @click="toggleDirection" />
      </Space>
      <div class="vp-lab-hooks__select">
        <Select
          :model-value="locale"
          :options="localeOptions"
          filterable
          fluid
          @update:model-value="onLocaleSelect"
        />
      </div>
    </Card>

    <!-- 2. Toast / Confirm -->
    <Card class="vp-lab-hooks__card" :header="tDyn('page.lab.hooks.sectionToast')">
      <p class="vp-lab-hooks__desc">{{ tDyn('page.lab.hooks.sectionToastDesc') }}</p>
      <Space wrap>
        <Button size="sm" severity="success" :label="tDyn('page.lab.hooks.toastSuccess')" @click="showToast('success')" />
        <Button size="sm" severity="info" :label="tDyn('page.lab.hooks.toastInfo')" @click="showToast('info')" />
        <Button size="sm" severity="warning" :label="tDyn('page.lab.hooks.toastWarn')" @click="showToast('warn')" />
        <Button size="sm" severity="danger" :label="tDyn('page.lab.hooks.toastError')" @click="showToast('error')" />
        <Button size="sm" severity="primary" :label="tDyn('page.lab.hooks.confirmOpen')" @click="openConfirm" />
      </Space>
      <Tag
        class="vp-lab-hooks__result"
        size="sm"
        :label="`${tDyn('page.lab.hooks.lastConfirm')}: ${lastConfirm}`"
      />
    </Card>

    <!-- 3. Size / breakpoint -->
    <Card class="vp-lab-hooks__card" :header="tDyn('page.lab.hooks.sectionSize')">
      <p class="vp-lab-hooks__desc">{{ tDyn('page.lab.hooks.sectionSizeDesc') }}</p>
      <div class="vp-lab-hooks__tags">
        <Tag size="sm" :label="`${tDyn('page.lab.hooks.sizeProp')}: ${size}`" />
        <Tag size="sm" :label="`${tDyn('page.lab.hooks.sizeHeight')}: ${sizeStyle.height}`" />
        <Tag size="sm" severity="info" :label="`${tDyn('page.lab.hooks.breakpoint')}: ${breakpoint}`" />
        <Tag size="sm" :label="`${tDyn('page.lab.hooks.viewport')}: ${viewportW}px`" />
      </div>
      <div class="vp-lab-hooks__select">
        <Select v-model="sizeChoice" :options="sizeOptions" fluid />
      </div>
      <div class="vp-lab-hooks__size-demo" :style="sizeStyle">
        <span>{{ size }}</span>
      </div>
    </Card>

    <!-- 4. Form + useVModel -->
    <Card class="vp-lab-hooks__card" :header="tDyn('page.lab.hooks.sectionForm')">
      <p class="vp-lab-hooks__desc">{{ tDyn('page.lab.hooks.sectionFormDesc') }}</p>
      <Form ref="formRef" :model="formModel" :rules="formRules" label-position="top">
        <FormItem :label="tDyn('page.lab.hooks.formEmail')" prop="email">
          <InputText v-model="formModel.email" fluid :placeholder="tDyn('page.lab.hooks.formEmailPh')" />
        </FormItem>
        <p class="vp-lab-hooks__mirror">
          {{ tDyn('page.lab.hooks.vmodelMirror') }}:
          <code>{{ emailVModel }}</code>
        </p>
        <Button size="sm" severity="primary" :label="tDyn('page.lab.hooks.formSubmit')" @click="submitForm" />
      </Form>
      <p v-if="formStatus" class="vp-lab-hooks__status">{{ formStatus }}</p>
    </Card>
  </div>
</template>

<style scoped lang="scss">
.vp-lab-hooks {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.vp-lab-hooks__card {
  width: 100%;
}

.vp-lab-hooks__desc,
.vp-lab-hooks__sample,
.vp-lab-hooks__mirror,
.vp-lab-hooks__status {
  margin: 0 0 var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
}

.vp-lab-hooks__checklist {
  margin: 0;
  padding-inline-start: var(--spacing-lg);
  color: var(--text-primary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
}

.vp-lab-hooks__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.vp-lab-hooks__select {
  margin-top: var(--spacing-md);
  max-width: 20rem;
}

.vp-lab-hooks__size-demo {
  margin-top: var(--spacing-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 8rem;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-btn-radius);
  background: var(--surface-1);
  color: var(--text-primary);
  box-sizing: border-box;
}

.vp-lab-hooks__result {
  margin-top: var(--spacing-md);
}

.vp-lab-hooks__mirror code {
  color: var(--text-primary);
}
</style>
