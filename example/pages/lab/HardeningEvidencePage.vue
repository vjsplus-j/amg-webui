<script setup lang="ts">
/**
 * Hardening Family Evidence Lab — mounts real components for axe / keyboard / visual gates.
 * Local debug only (example). Not a public docs demo.
 */
import { ref, reactive } from 'vue'
import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Icon,
  StatusTip,
  Tag,
  Tooltip
} from '@amg-webui/core'
import {
  Cascader,
  Checkbox,
  DatePicker,
  Form,
  FormItem,
  InputNumber,
  InputOTP,
  InputText,
  Mention,
  Password,
  RangeInput,
  Select,
  SelectNav,
  Textarea,
  TimePicker
} from '@amg-webui/form'
import { DataTable, TreeSelect } from '@amg-webui/data'
import { Dialog, Drawer, Popover } from '@amg-webui/overlay'
import { useLocale } from '@amg-webui/hooks'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

const { t } = useLocale()

const inputValue = ref('')
const passwordValue = ref('')
const textareaValue = ref('')
const numberValue = ref<number | null>(null)
const rangeValue = ref<{ min: number | null; max: number | null }>({
  min: null,
  max: null
})
const otpValue = ref('')
const mentionValue = ref('')
const selectValue = ref<string | undefined>()
const checkboxValue = ref(false)
const cascaderValue = ref<string | undefined>()
const treeSelectValue = ref<string | undefined>()
const selectNavValue = ref<string | number>('home')
const dateValue = ref<string | undefined>()
const timeValue = ref<string | null>(null)
const dialogOpen = ref(false)
const drawerOpen = ref(false)

const selectOptions = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma', value: 'gamma' }
]

const mentionOptions = [
  { label: 'Alice', value: 'alice' },
  { label: 'Bob', value: 'bob' },
  { label: 'Carol', value: 'carol' }
]

const cascaderOptions = [
  {
    label: 'East',
    value: 'east',
    children: [
      { label: 'Hangzhou', value: 'hz' },
      { label: 'Shanghai', value: 'sh' }
    ]
  },
  {
    label: 'South',
    value: 'south',
    children: [{ label: 'Guangzhou', value: 'gz' }]
  }
]

const treeSelectOptions = [
  {
    label: 'Root',
    value: 'root',
    children: [
      { label: 'Child', value: 'child' },
      { label: 'Leaf', value: 'leaf' }
    ]
  }
]

const selectNavOptions = [
  { label: 'Home', value: 'home' },
  { label: 'Docs', value: 'docs' },
  { label: 'Lab', value: 'lab' }
]

const formModel = reactive({ name: '', note: '' })
const formRules = {
  name: { required: true }
}

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
  <div class="lab-hardening">
    <ExamplePageHero
      title-key="page.lab.hardening.title"
      lead-key="page.lab.hardening.lead"
    />

    <!-- B01 Foundation -->
    <section
      id="family-foundation"
      class="lab-hardening__family"
      data-family="foundation"
      data-batch="B01"
    >
      <Card>
        <template #header>{{ t('page.lab.hardening.family.foundation') }}</template>
        <div class="lab-hardening__row" data-visual="foundation-default">
          <div data-testid="hf-button">
            <Button>{{ t('page.lab.hardening.sample.primary') }}</Button>
          </div>
          <Button variant="outlined" :disabled="true" data-testid="hf-button-disabled">
            {{ t('page.lab.hardening.sample.disabled') }}
          </Button>
          <Icon name="Star" aria-hidden="true" />
          <Button variant="text" data-testid="hf-link-like">
            {{ t('page.lab.hardening.sample.link') }}
          </Button>
          <Tag>{{ t('page.lab.hardening.sample.tag') }}</Tag>
          <Badge :value="3">
            <Button variant="text">{{ t('page.lab.hardening.sample.badge') }}</Button>
          </Badge>
          <Avatar text="AM" />
          <Divider />
          <StatusTip
            severity="info"
            :message="t('page.lab.hardening.sample.status')"
          />
        </div>
        <div class="lab-hardening__row" data-visual="foundation-focus">
          <div data-testid="hf-button-focus">
            <Button>
              {{ t('page.lab.hardening.sample.focus') }}
            </Button>
          </div>
          <Tooltip :content="t('page.lab.hardening.sample.tooltip')">
            <Button variant="outlined">{{ t('page.lab.hardening.sample.tooltip') }}</Button>
          </Tooltip>
        </div>
      </Card>
    </section>

    <!-- B02 Input -->
    <section
      id="family-input"
      class="lab-hardening__family"
      data-family="input"
      data-batch="B02"
    >
      <Card>
        <template #header>{{ t('page.lab.hardening.family.input') }}</template>
        <div class="lab-hardening__stack" data-visual="input-default">
          <div data-testid="hf-input">
            <label class="lab-hardening__label" for="hf-input-el">
              {{ t('page.lab.hardening.sample.placeholder') }}
            </label>
            <InputText
              id="hf-input-el"
              v-model="inputValue"
              :placeholder="t('page.lab.hardening.sample.placeholder')"
              :ariaLabel="t('page.lab.hardening.sample.placeholder')"
            />
          </div>
          <div data-testid="hf-password">
            <label class="lab-hardening__label" for="hf-password-el">
              {{ t('page.lab.hardening.sample.password') }}
            </label>
            <Password
              id="hf-password-el"
              v-model="passwordValue"
              :placeholder="t('page.lab.hardening.sample.password')"
              :ariaLabel="t('page.lab.hardening.sample.password')"
            />
          </div>
          <div data-testid="hf-textarea">
            <label class="lab-hardening__label" for="hf-textarea-el">
              {{ t('page.lab.hardening.sample.textarea') }}
            </label>
            <Textarea
              id="hf-textarea-el"
              v-model="textareaValue"
              :placeholder="t('page.lab.hardening.sample.textarea')"
              :ariaLabel="t('page.lab.hardening.sample.textarea')"
            />
          </div>
          <div data-testid="hf-input-number">
            <label class="lab-hardening__label" for="hf-input-number-el">
              {{ t('page.lab.hardening.sample.number') }}
            </label>
            <InputNumber
              id="hf-input-number-el"
              v-model="numberValue"
              :ariaLabel="t('page.lab.hardening.sample.number')"
            />
          </div>
          <div data-testid="hf-range-input">
            <label class="lab-hardening__label">
              {{ t('page.lab.hardening.sample.range') }}
            </label>
            <RangeInput
              v-model="rangeValue"
              :ariaLabel="t('page.lab.hardening.sample.range')"
            />
          </div>
          <div data-testid="hf-input-otp">
            <label class="lab-hardening__label">
              {{ t('page.lab.hardening.sample.otp') }}
            </label>
            <InputOTP
              v-model="otpValue"
              :length="4"
            />
          </div>
          <div data-testid="hf-input-disabled">
            <label class="lab-hardening__label" for="hf-input-disabled-el">
              {{ t('page.lab.hardening.sample.disabled') }}
            </label>
            <InputText
              id="hf-input-disabled-el"
              :disabled="true"
              :model-value="t('page.lab.hardening.sample.disabled')"
              :ariaLabel="t('page.lab.hardening.sample.disabled')"
            />
          </div>
        </div>
      </Card>
    </section>

    <!-- B03 Form -->
    <section
      id="family-form"
      class="lab-hardening__family"
      data-family="form"
      data-batch="B03"
    >
      <Card>
        <template #header>{{ t('page.lab.hardening.family.form') }}</template>
        <Form
          data-visual="form-default"
          :model="formModel"
          :rules="formRules"
        >
          <FormItem :label="t('page.lab.hardening.sample.fieldName')" prop="name">
            <div data-testid="hf-form-input">
              <InputText v-model="formModel.name" />
            </div>
          </FormItem>
          <FormItem :label="t('page.lab.hardening.sample.fieldNote')" prop="note">
            <div data-testid="hf-form-textarea">
              <Textarea v-model="formModel.note" />
            </div>
          </FormItem>
          <div data-testid="hf-form-submit">
            <Button type="submit">
              {{ t('page.lab.hardening.sample.submit') }}
            </Button>
          </div>
        </Form>
      </Card>
    </section>

    <!-- B04 / B05 Selection -->
    <section
      id="family-selection"
      class="lab-hardening__family"
      data-family="selection"
      data-batch="B04-B05"
    >
      <Card>
        <template #header>{{ t('page.lab.hardening.family.selection') }}</template>
        <div class="lab-hardening__stack" data-visual="selection-default">
          <div data-testid="hf-select">
            <label class="lab-hardening__label" id="hf-select-label">
              {{ t('page.lab.hardening.sample.select') }}
            </label>
            <Select
              v-model="selectValue"
              :options="selectOptions"
              :placeholder="t('page.lab.hardening.sample.select')"
            />
          </div>
          <div data-testid="hf-checkbox">
            <Checkbox
              v-model="checkboxValue"
              :aria-label="t('page.lab.hardening.sample.placeholder')"
            />
          </div>
          <div data-testid="hf-mention">
            <label class="lab-hardening__label" for="hf-mention-el">
              {{ t('page.lab.hardening.sample.mention') }}
            </label>
            <Mention
              id="hf-mention-el"
              v-model="mentionValue"
              :options="mentionOptions"
              :placeholder="t('page.lab.hardening.sample.mention')"
            />
          </div>
          <div data-testid="hf-cascader">
            <label class="lab-hardening__label" id="hf-cascader-label">
              {{ t('page.lab.hardening.sample.cascader') }}
            </label>
            <Cascader
              v-model="cascaderValue"
              :options="cascaderOptions"
              :placeholder="t('page.lab.hardening.sample.cascader')"
            />
          </div>
          <div data-testid="hf-treeselect">
            <label class="lab-hardening__label" id="hf-treeselect-label">
              {{ t('page.lab.hardening.sample.treeSelect') }}
            </label>
            <TreeSelect
              v-model="treeSelectValue"
              :options="treeSelectOptions"
              :placeholder="t('page.lab.hardening.sample.treeSelect')"
              clearable
            />
          </div>
          <div data-testid="hf-selectnav">
            <label class="lab-hardening__label" id="hf-selectnav-label">
              {{ t('page.lab.hardening.sample.selectNav') }}
            </label>
            <SelectNav
              v-model="selectNavValue"
              :options="selectNavOptions"
              :aria-label="t('page.lab.hardening.sample.selectNav')"
              :placeholder="t('page.lab.hardening.sample.selectNav')"
            />
          </div>
        </div>
      </Card>
    </section>

    <!-- B06 DateTime -->
    <section
      id="family-datetime"
      class="lab-hardening__family"
      data-family="datetime"
      data-batch="B06"
    >
      <Card>
        <template #header>{{ t('page.lab.hardening.family.datetime') }}</template>
        <div class="lab-hardening__stack" data-visual="datetime-default">
          <div data-testid="hf-datepicker">
            <label class="lab-hardening__label" for="hf-date-el">
              {{ t('page.lab.hardening.sample.date') }}
            </label>
            <DatePicker
              id="hf-date-el"
              v-model="dateValue"
              :placeholder="t('page.lab.hardening.sample.date')"
            />
          </div>
          <div data-testid="hf-timepicker">
            <label class="lab-hardening__label" for="hf-time-el">
              {{ t('page.lab.hardening.sample.time') }}
            </label>
            <TimePicker
              id="hf-time-el"
              v-model="timeValue"
              :placeholder="t('page.lab.hardening.sample.time')"
              :show-seconds="false"
            />
          </div>
        </div>
      </Card>
    </section>

    <!-- B12 Table -->
    <section
      id="family-table"
      class="lab-hardening__family"
      data-family="table"
      data-batch="B12"
    >
      <Card>
        <template #header>{{ t('page.lab.hardening.family.table') }}</template>
        <div data-testid="hf-datatable" data-visual="table-default">
          <DataTable
            :value="tableRows"
            :columns="tableColumns"
          />
        </div>
      </Card>
    </section>

    <!-- B08 Overlay -->
    <section
      id="family-overlay"
      class="lab-hardening__family"
      data-family="overlay"
      data-batch="B08"
    >
      <Card>
        <template #header>{{ t('page.lab.hardening.family.overlay') }}</template>
        <div class="lab-hardening__row" data-visual="overlay-triggers">
          <div data-testid="hf-dialog-open">
            <Button @click="dialogOpen = true">
              {{ t('page.lab.hardening.sample.openDialog') }}
            </Button>
          </div>
          <div data-testid="hf-drawer-open">
            <Button variant="outlined" @click="drawerOpen = true">
              {{ t('page.lab.hardening.sample.openDrawer') }}
            </Button>
          </div>
          <Popover :title="t('page.lab.hardening.sample.popover')">
            <template #trigger>
              <div data-testid="hf-popover">
                <Button variant="text">
                  {{ t('page.lab.hardening.sample.popover') }}
                </Button>
              </div>
            </template>
            <p>{{ t('page.lab.hardening.sample.popover') }}</p>
          </Popover>
        </div>
      </Card>

      <Dialog
        v-model:visible="dialogOpen"
        :title="t('page.lab.hardening.sample.dialogTitle')"
        :close-on-press-escape="true"
        :dismissible="true"
      >
        <p>{{ t('page.lab.hardening.sample.dialogBody') }}</p>
        <template #footer>
          <div data-testid="hf-dialog-close">
            <Button @click="dialogOpen = false">
              {{ t('page.lab.hardening.sample.close') }}
            </Button>
          </div>
        </template>
      </Dialog>

      <Drawer
        v-model:visible="drawerOpen"
        :title="t('page.lab.hardening.sample.drawerTitle')"
        data-testid="hf-drawer"
      >
        <p>{{ t('page.lab.hardening.sample.drawerBody') }}</p>
      </Drawer>
    </section>
  </div>
</template>

<style scoped lang="scss">
.lab-hardening {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
  box-sizing: border-box;
}

.lab-hardening__family {
  width: 100%;
  min-width: 0;
}

.lab-hardening__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
}

.lab-hardening__stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  max-width: 28rem;
}

.lab-hardening__label {
  display: block;
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
}
</style>
