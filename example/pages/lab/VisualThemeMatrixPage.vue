<script setup lang="ts">
/**
 * Visual theme matrix harness — isolated fixtures for Playwright screenshot baselines.
 * Local debug only (example). Not public docs.
 */
import { ref } from 'vue'
import { Button } from '@amg-webui/core'
import { InputText, Select } from '@amg-webui/form'
import { DataTable } from '@amg-webui/data'
import { Dialog } from '@amg-webui/overlay'
import { useLocale } from '@amg-webui/hooks'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

const { t } = useLocale()

const selectValue = ref<string | undefined>('alpha')
const dialogOpen = ref(false)

const selectOptions = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma', value: 'gamma' }
]

const tableRows = [
  { id: 1, name: 'Alpha', role: 'admin' },
  { id: 2, name: 'Beta', role: 'user' },
  { id: 3, name: 'Gamma', role: 'user' }
]

const tableColumns = [
  { field: 'id', header: 'ID', width: '4rem' },
  { field: 'name', header: 'Name' },
  { field: 'role', header: 'Role', width: '6rem' }
]
</script>

<template>
  <div class="lab-visual-matrix">
    <ExamplePageHero
      title-key="page.lab.visualMatrix.title"
      lead-key="page.lab.visualMatrix.lead"
    />

    <div class="lab-visual-matrix__grid">
      <section
        class="lab-visual-matrix__fixture"
        data-visual-matrix="button"
        aria-label="Button fixture"
      >
        <Button variant="solid">{{ t('page.lab.hardening.sample.primary') }}</Button>
        <Button variant="outlined">{{ t('page.lab.hardening.sample.disabled') }}</Button>
        <Button variant="dashed">{{ t('page.lab.hardening.sample.link') }}</Button>
      </section>

      <section
        class="lab-visual-matrix__fixture"
        data-visual-matrix="input-text"
        aria-label="InputText fixture"
      >
        <InputText
          model-value="AMG-WebUI"
          :placeholder="t('page.lab.hardening.sample.placeholder')"
          :aria-label="t('page.lab.hardening.sample.placeholder')"
        />
      </section>

      <section
        class="lab-visual-matrix__fixture"
        data-visual-matrix="select"
        aria-label="Select fixture"
      >
        <Select
          v-model="selectValue"
          :options="selectOptions"
          :placeholder="t('page.lab.hardening.sample.placeholder')"
          style="min-width: 12rem"
        />
      </section>

      <section
        class="lab-visual-matrix__fixture lab-visual-matrix__fixture--wide"
        data-visual-matrix="data-table"
        aria-label="DataTable fixture"
      >
        <DataTable :value="tableRows" :columns="tableColumns" />
      </section>

      <section
        class="lab-visual-matrix__fixture"
        data-visual-matrix="dialog"
        aria-label="Dialog fixture"
      >
        <div data-testid="v-matrix-dialog-open">
          <Button @click="dialogOpen = true">
            {{ t('page.lab.hardening.sample.openDialog') }}
          </Button>
        </div>
      </section>
    </div>

    <Dialog
      v-model:visible="dialogOpen"
      :title="t('page.lab.hardening.sample.dialogTitle')"
      :close-on-press-escape="true"
      :dismissible="true"
    >
      <p>{{ t('page.lab.hardening.sample.dialogBody') }}</p>
      <template #footer>
        <Button @click="dialogOpen = false">
          {{ t('page.lab.hardening.sample.close') }}
        </Button>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.lab-visual-matrix {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.lab-visual-matrix__grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.lab-visual-matrix__fixture {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
  box-sizing: border-box;
  width: 448px;
  min-width: 448px;
  max-width: 448px;
  padding: var(--spacing-lg);
  background: var(--ds-bg);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
}

.lab-visual-matrix__fixture--wide {
  width: 576px;
  min-width: 576px;
  max-width: 576px;
}
</style>
