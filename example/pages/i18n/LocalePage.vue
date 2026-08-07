<script setup lang="ts">
/**
 * i18n Lab — full local debugging surface for locale / direction / packs.
 * Spec: docs/APP_WORKFLOW.md §四 · packages/locale/I18N.md
 */
import { computed, reactive, ref, watch } from 'vue'
import { Button, Card, Space, Tag, ConfigProvider } from '@amg-webui/core'
import { Form, FormItem, InputText, Select } from '@amg-webui/form'
import type { SelectModelValue } from '@amg-webui/form'
import { MessageBox } from '@amg-webui/overlay'
import { useLocale } from '@amg-webui/hooks'
import {
  LocaleKeys,
  LOCALE_CODES,
  getLocaleMeta,
  listLocaleCodes,
  registerLocale,
  zhCN,
  type LocaleMessages
} from '@amg-webui/locale'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

const CUSTOM_CODE = 'lab-XX'
const REMOTE_CODE = 'lab-REMOTE'

const { t, tDyn, locale, dir, setLocale, setDirection, toggleDirection } = useLocale()

const customRegistered = ref(false)
const remoteRegistered = ref(false)
const remoteLoading = ref(false)
const remoteError = ref('')
const lastOverlay = ref('')

const formModel = reactive({ name: '' })
const formRef = ref<{ validate: () => Promise<boolean> } | null>(null)

const formRules = computed(() => ({
  name: [
    {
      required: true,
      message: tDyn('page.i18n.lab.formRequired')
    },
    {
      min: 2,
      message: tDyn('page.i18n.lab.formMin')
    }
  ]
}))

const localeOptions = computed(() =>
  listLocaleCodes().map((code) => {
    const meta = getLocaleMeta(code)
    return {
      value: code,
      label: meta ? `${meta.label} (${code})` : code
    }
  })
)

const sampleGroups = computed(() => {
  void locale.value
  return [
    {
      titleKey: 'page.i18n.lab.groupButton',
      items: [
        { key: LocaleKeys.button.save, value: t(LocaleKeys.button.save) },
        { key: LocaleKeys.button.cancel, value: t(LocaleKeys.button.cancel) },
        { key: LocaleKeys.button.confirm, value: t(LocaleKeys.button.confirm) },
        { key: LocaleKeys.button.signIn, value: t(LocaleKeys.button.signIn) }
      ]
    },
    {
      titleKey: 'page.i18n.lab.groupCommon',
      items: [
        { key: LocaleKeys.common.search, value: t(LocaleKeys.common.search) },
        { key: LocaleKeys.common.loading, value: t(LocaleKeys.common.loading) },
        { key: LocaleKeys.common.noData, value: t(LocaleKeys.common.noData) },
        { key: LocaleKeys.common.close, value: t(LocaleKeys.common.close) }
      ]
    },
    {
      titleKey: 'page.i18n.lab.groupChrome',
      items: [
        { key: LocaleKeys.chrome.direction, value: t(LocaleKeys.chrome.direction) },
        { key: LocaleKeys.chrome.dirLtr, value: t(LocaleKeys.chrome.dirLtr) },
        { key: LocaleKeys.chrome.dirRtl, value: t(LocaleKeys.chrome.dirRtl) }
      ]
    },
    {
      titleKey: 'page.i18n.lab.groupBiz',
      items: [
        { key: LocaleKeys.auth.username, value: t(LocaleKeys.auth.username) },
        { key: LocaleKeys.auth.signOut, value: t(LocaleKeys.auth.signOut) },
        { key: LocaleKeys.nav.biz, value: t(LocaleKeys.nav.biz) },
        { key: LocaleKeys.page.i18nTitle, value: t(LocaleKeys.page.i18nTitle) }
      ]
    }
  ]
})

const meta = computed(() => getLocaleMeta(locale.value))

const localeLead = computed(() => {
  void locale.value
  void dir.value
  const m = meta.value
  return tDyn('page.i18n.lab.leadDetail', {
    locale: locale.value,
    label: m?.label ?? '—',
    lang: m?.lang ?? '—',
    dir: dir.value,
    natural: m?.dir ?? '—'
  })
})

const dirActionLabel = computed(() => {
  void locale.value
  void dir.value
  return dir.value === 'rtl' ? t(LocaleKeys.chrome.dirLtr) : t(LocaleKeys.chrome.dirRtl)
})

function onLocaleSelect(code: SelectModelValue) {
  if (typeof code === 'string' && code) setLocale(code)
}

function ensureCustomPack() {
  if (customRegistered.value) {
    setLocale(CUSTOM_CODE)
    return
  }
  const messages = {
    ...zhCN,
    'button.save': '[LAB] SAVE',
    'button.cancel': '[LAB] CANCEL',
    'common.search': '[LAB] Search',
    'page.i18n.title': 'i18n Lab · custom pack'
  } as LocaleMessages
  try {
    registerLocale(CUSTOM_CODE, messages, {
      label: 'Lab Custom',
      lang: 'lab',
      dir: 'ltr'
    })
    customRegistered.value = true
    setLocale(CUSTOM_CODE)
  } catch (e) {
    customRegistered.value = true
    setLocale(CUSTOM_CODE)
    void e
  }
}

async function loadRemotePack() {
  remoteError.value = ''
  remoteLoading.value = true
  try {
    // Simulate remote fetch latency, then register a full pack (clone zh-CN + overrides)
    await new Promise((r) => window.setTimeout(r, 450))
    if (!remoteRegistered.value) {
      const messages = {
        ...zhCN,
        'button.save': '[REMOTE] Save',
        'common.search': '[REMOTE] Search',
        'page.i18n.title': 'i18n Lab · remote pack',
        'page.i18n.hint': 'Loaded via simulated remote registerLocale()'
      } as LocaleMessages
      try {
        registerLocale(REMOTE_CODE, messages, {
          label: 'Lab Remote',
          lang: 'remote',
          dir: 'ltr'
        })
      } catch {
        /* already registered in HMR */
      }
      remoteRegistered.value = true
    }
    setLocale(REMOTE_CODE)
  } catch (e) {
    remoteError.value = e instanceof Error ? e.message : String(e)
  } finally {
    remoteLoading.value = false
  }
}

async function submitForm() {
  const ok = await formRef.value?.validate()
  if (!ok) return
  lastOverlay.value = tDyn('page.i18n.lab.formOk')
}

async function openConfirm() {
  const result = await MessageBox.confirm(
    tDyn('page.i18n.lab.dialogBody'),
    tDyn('page.i18n.lab.dialogTitle'),
    {
      confirmLabel: t(LocaleKeys.button.confirm),
      cancelLabel: t(LocaleKeys.button.cancel)
    }
  )
  lastOverlay.value = `${tDyn('page.i18n.lab.dialogResult')}: ${result}`
}

watch(locale, () => {
  formRef.value?.validate?.().catch(() => undefined)
})
</script>

<template>
  <div class="i18n-lab">
    <ExamplePageHero title-key="page.i18n.title" :lead="localeLead">
      <template #actions>
        <Button
          size="sm"
          variant="outlined"
          :label="`${t(LocaleKeys.chrome.direction)} → ${dirActionLabel}`"
          @click="toggleDirection"
        />
      </template>
    </ExamplePageHero>

    <p class="i18n-lab__hint">{{ t('page.i18n.hint') }}</p>

    <!-- 1. Locale switch (all packs) -->
    <Card class="i18n-lab__card" :header="tDyn('page.i18n.lab.sectionSwitch')">
      <p class="i18n-lab__desc">{{ tDyn('page.i18n.lab.sectionSwitchDesc') }}</p>
      <div class="i18n-lab__row">
        <Select
          class="i18n-lab__select"
          :model-value="locale"
          :options="localeOptions"
          filterable
          fluid
          @update:model-value="onLocaleSelect"
        />
        <Space wrap>
          <Button
            v-for="code in LOCALE_CODES"
            :key="code"
            size="sm"
            :variant="locale === code ? 'solid' : 'outlined'"
            severity="primary"
            :label="code"
            @click="setLocale(code)"
          />
        </Space>
      </div>
      <ul class="i18n-lab__meta">
        <li>
          <code>LOCALE_META</code>
          <span>{{ meta?.label }} · lang={{ meta?.lang }} · naturalDir={{ meta?.dir }}</span>
        </li>
        <li>
          <code>html[dir]</code>
          <Tag size="sm" :label="dir" :severity="dir === 'rtl' ? 'warning' : 'info'" />
          <span>{{ tDyn('page.i18n.lab.dirIndependent') }}</span>
        </li>
      </ul>
    </Card>

    <!-- 2. Direction independent of locale -->
    <Card class="i18n-lab__card" :header="tDyn('page.i18n.lab.sectionDirection')">
      <p class="i18n-lab__desc">{{ tDyn('page.i18n.lab.sectionDirectionDesc') }}</p>
      <ConfigProvider :direction="dir">
        <Space wrap>
          <Button
            size="sm"
            :variant="dir === 'ltr' ? 'solid' : 'outlined'"
            :label="t(LocaleKeys.chrome.dirLtr)"
            @click="setDirection('ltr')"
          />
          <Button
            size="sm"
            :variant="dir === 'rtl' ? 'solid' : 'outlined'"
            :label="t(LocaleKeys.chrome.dirRtl)"
            @click="setDirection('rtl')"
          />
          <Button size="sm" variant="text" :label="tDyn('page.i18n.lab.forceArRtl')" @click="() => { setLocale('ar-SA'); setDirection('rtl') }" />
        </Space>
        <p class="i18n-lab__mirror">{{ tDyn('page.i18n.lab.mirrorSample') }}</p>
      </ConfigProvider>
    </Card>

    <!-- 3. Built-in key samples -->
    <Card class="i18n-lab__card" :header="tDyn('page.i18n.lab.sectionSamples')">
      <p class="i18n-lab__desc">{{ tDyn('page.i18n.lab.sectionSamplesDesc') }}</p>
      <div v-for="group in sampleGroups" :key="group.titleKey" class="i18n-lab__group">
        <h3 class="i18n-lab__h3">{{ tDyn(group.titleKey) }}</h3>
        <ul class="i18n-lab__list">
          <li v-for="item in group.items" :key="item.key">
            <code class="vp-ltr">{{ item.key }}</code>
            <span>{{ item.value }}</span>
          </li>
        </ul>
      </div>
    </Card>

    <!-- 4. Form validation follows locale -->
    <Card class="i18n-lab__card" :header="tDyn('page.i18n.lab.sectionForm')">
      <p class="i18n-lab__desc">{{ tDyn('page.i18n.lab.sectionFormDesc') }}</p>
      <Form ref="formRef" :model="formModel" :rules="formRules" label-position="top" @submit="submitForm">
        <FormItem :label="tDyn('page.i18n.lab.formName')" prop="name">
          <InputText v-model="formModel.name" fluid :placeholder="tDyn('page.i18n.lab.formPlaceholder')" />
        </FormItem>
        <Button severity="primary" :label="t(LocaleKeys.button.submit)" @click="submitForm" />
      </Form>
      <p v-if="lastOverlay" class="i18n-lab__status">{{ lastOverlay }}</p>
    </Card>

    <!-- 5. Overlay / MessageBox labels -->
    <Card class="i18n-lab__card" :header="tDyn('page.i18n.lab.sectionOverlay')">
      <p class="i18n-lab__desc">{{ tDyn('page.i18n.lab.sectionOverlayDesc') }}</p>
      <Button severity="primary" :label="tDyn('page.i18n.lab.openDialog')" @click="openConfirm" />
    </Card>

    <!-- 6. registerLocale custom pack -->
    <Card class="i18n-lab__card" :header="tDyn('page.i18n.lab.sectionCustom')">
      <p class="i18n-lab__desc">{{ tDyn('page.i18n.lab.sectionCustomDesc') }}</p>
      <Space wrap>
        <Button
          size="sm"
          severity="secondary"
          :label="customRegistered ? tDyn('page.i18n.lab.customSwitch') : tDyn('page.i18n.lab.customRegister')"
          @click="ensureCustomPack"
        />
        <Tag
          v-if="customRegistered"
          size="sm"
          severity="success"
          :label="`${CUSTOM_CODE} · ${tDyn('page.i18n.lab.customActive')}`"
        />
      </Space>
    </Card>

    <!-- 7. Simulated remote pack -->
    <Card class="i18n-lab__card" :header="tDyn('page.i18n.lab.sectionRemote')">
      <p class="i18n-lab__desc">{{ tDyn('page.i18n.lab.sectionRemoteDesc') }}</p>
      <Space wrap>
        <Button
          size="sm"
          severity="primary"
          :loading="remoteLoading"
          :label="tDyn('page.i18n.lab.remoteLoad')"
          @click="loadRemotePack"
        />
        <Tag
          v-if="remoteRegistered"
          size="sm"
          severity="success"
          :label="`${REMOTE_CODE} · ${tDyn('page.i18n.lab.remoteLoaded')}`"
        />
      </Space>
      <p v-if="remoteError" class="i18n-lab__error">{{ remoteError }}</p>
    </Card>
  </div>
</template>

<style scoped>
.i18n-lab {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.i18n-lab__hint,
.i18n-lab__desc {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
}

.i18n-lab__card {
  width: 100%;
}

.i18n-lab__row {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.i18n-lab__select {
  max-width: 24rem;
}

.i18n-lab__meta,
.i18n-lab__list {
  margin: var(--spacing-md) 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.i18n-lab__meta li,
.i18n-lab__list li {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: baseline;
  font-size: var(--font-size-md);
  color: var(--text-primary);
}

.i18n-lab__meta code,
.i18n-lab__list code {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.i18n-lab__group + .i18n-lab__group {
  margin-top: var(--spacing-lg);
}

.i18n-lab__h3 {
  margin: 0 0 var(--spacing-sm);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.i18n-lab__mirror {
  margin: var(--spacing-md) 0 0;
  padding: var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-radius-md);
  background: var(--surface-1);
  text-align: start;
}

.i18n-lab__status {
  margin: var(--spacing-md) 0 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.i18n-lab__error {
  margin: var(--spacing-sm) 0 0;
  color: var(--severity-danger);
  font-size: var(--font-size-sm);
}
</style>
