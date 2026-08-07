<script setup lang="ts">
/**
 * Curated demo — aligned with Avatar gold standard (demoCode / demoSfc / API thirds).
 */
import { ref, computed } from 'vue'
import { Button, ButtonGroup, Icon } from '@amg-webui/core'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Basic from './parts/Basic.vue'
import basicSource from './parts/Basic.vue?raw'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import MotionLivePanel from '../../components/demo/MotionLivePanel.vue'
import {
  createMotionLiveState,
  formatMotionLiveCode,
  useMotionLiveBind
} from '../../components/demo/motionLive'
import { demoCode } from '../../components/demo/demoCode'

const { t, tDyn } = useLocale()
const loading = ref(false)
const clickCount = ref(0)
const lastEvent = ref('')
const motion = createMotionLiveState()
const motionBind = useMotionLiveBind(motion)
const codeMotionLive = computed(() =>
  formatMotionLiveCode('Button', motion.value, [
    '  icon="Heart"',
    `  :label="t('button.save')"`,
    '  severity="primary"'
  ])
)

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

function onGuardedClick() {
  clickCount.value += 1
}

function noteEvent(kind: string) {
  lastEvent.value = kind
}

/* ─── Code snippets: must mirror preview 1:1 (no `…`) ─── */

const codeDashed = demoCode(
  `<Button variant="dashed" severity="primary">{{ t('button.confirm') }}</Button>`,
  `<Button variant="dashed" severity="success">{{ t('common.success') }}</Button>`,
  `<Button variant="dashed" severity="warning">{{ t('button.edit') }}</Button>`,
  `<Button variant="dashed" severity="danger">{{ t('button.delete') }}</Button>`,
  `<Button variant="dashed">{{ t('button.create') }}</Button>`
)

const codeNeon = demoCode(
  `<Button variant="neon" severity="primary">{{ t('button.confirm') }}</Button>`,
  `<Button variant="neon" severity="success">{{ t('common.success') }}</Button>`,
  `<Button variant="neon" severity="warning">{{ t('button.edit') }}</Button>`,
  `<Button variant="neon" severity="danger">{{ t('button.delete') }}</Button>`
)

const codeSize = demoCode(
  `<Button size="xs" severity="primary">{{ t('page.base.atoms.button.size.xs') }}</Button>`,
  `<Button size="sm" severity="primary">{{ t('page.base.atoms.button.size.sm') }}</Button>`,
  `<Button size="md" severity="primary">{{ t('page.base.atoms.button.size.md') }}</Button>`,
  `<Button size="lg" severity="primary">{{ t('page.base.atoms.button.size.lg') }}</Button>`,
  `<Button size="xl" severity="primary">{{ t('page.base.atoms.button.size.xl') }}</Button>`
)

const codeIcon = demoCode(
  `<Button icon="Star" :label="t('button.save')" severity="primary" />`,
  `<Button`,
  `  icon="ChevronRight"`,
  `  icon-pos="right"`,
  `  :label="t('button.continue')"`,
  `  variant="outlined"`,
  `/>`,
  `<Button`,
  `  icon="Upload"`,
  `  icon-pos="top"`,
  `  :label="t('button.submit')"`,
  `  variant="dashed"`,
  `/>`,
  `<Button shape="circle" icon="Settings" :aria-label="t('page.base.atoms.button.ariaIcon')" />`,
  `<Button`,
  `  shape="square"`,
  `  variant="outlined"`,
  `  icon="Search"`,
  `  :aria-label="t('page.base.atoms.button.ariaIcon')"`,
  `/>`,
  `<Button`,
  `  shape="circle"`,
  `  :img="demoImg"`,
  `  :aria-label="t('page.base.atoms.button.ariaImg')"`,
  `  badge="1"`,
  `/>`
)

const codeStates = demoCode(
  `<Button`,
  `  :loading="loading"`,
  `  :loading-text="t('common.loading')"`,
  `  severity="primary"`,
  `>`,
  `  {{ t('common.loading') }}`,
  `</Button>`,
  `<Button disabled :disabled-title="t('example.doc.button.tip.disabled')">`,
  `  {{ t('button.confirm') }}`,
  `</Button>`,
  `<Button readonly>{{ t('example.doc.button.demo.readonlyLabel') }}</Button>`,
  `<Button`,
  `  click-guard="debounce"`,
  `  :wait="500"`,
  `  severity="primary"`,
  `  @click="onGuardedClick"`,
  `>`,
  `  {{ t('example.doc.button.demo.debounceLabel') }} ({{ clickCount }})`,
  `</Button>`,
  `<Button :badge="3">{{ t('button.refresh') }}</Button>`,
  `<Button star variant="outlined">{{ t('button.save') }}</Button>`,
  `<Button ripple severity="primary">{{ t('example.doc.button.demo.rippleLabel') }}</Button>`
)

const codeBiz = demoCode(
  `<Button`,
  `  :permission="false"`,
  `  permission-mode="disable"`,
  `  :permission-tip="t('example.doc.button.tip.noPermission')"`,
  `>`,
  `  {{ t('example.doc.button.demo.permissionLabel') }}`,
  `</Button>`,
  `<Button :permission="false" permission-mode="hide">`,
  `  {{ t('example.doc.button.demo.permissionHidden') }}`,
  `</Button>`,
  `<Button severity="danger" :confirm="t('example.doc.button.tip.confirmDelete')">`,
  `  {{ t('button.delete') }}`,
  `</Button>`,
  `<Button href="https://example.com" target="_blank" link>`,
  `  {{ t('example.doc.button.demo.hrefLabel') }}`,
  `</Button>`,
  `<Button block severity="primary" type="submit">`,
  `  {{ t('button.submit') }}`,
  `</Button>`
)

const codeSlots = demoCode(
  `<Button severity="primary">`,
  `  <template #prefix>`,
  `    <Icon name="Star" size="sm" />`,
  `  </template>`,
  `  {{ t('button.save') }}`,
  `  <template #suffix>`,
  `    <Icon name="ChevronRight" size="sm" />`,
  `  </template>`,
  `</Button>`,
  `<Button severity="primary">`,
  `  <template #icon>`,
  `    <Icon name="Heart" />`,
  `  </template>`,
  `  {{ t('button.save') }}`,
  `</Button>`,
  `<Button loading severity="primary">`,
  `  <template #loading>`,
  `    <Icon name="Loader2" spin />`,
  `  </template>`,
  `  {{ t('common.loading') }}`,
  `</Button>`,
  `<Button severity="primary">`,
  `  {{ t('common.more') }}`,
  `  <template #dropdown>`,
  `    <Button variant="text" block>{{ t('button.edit') }}</Button>`,
  `    <Button variant="text" block>{{ t('button.delete') }}</Button>`,
  `  </template>`,
  `</Button>`
)

const codeEvents = demoCode(
  `<Button`,
  `  severity="primary"`,
  `  @click="onClick"`,
  `  @focus="onFocus"`,
  `  @blur="onBlur"`,
  `>`,
  `  {{ t('button.confirm') }}`,
  `</Button>`,
  `<Button`,
  `  severity="danger"`,
  `  :confirm="t('example.doc.button.tip.confirmDelete')"`,
  `  @confirm="onConfirm"`,
  `  @cancel-confirm="onCancelConfirm"`,
  `>`,
  `  {{ t('button.delete') }}`,
  `</Button>`
)

const codeGroup = demoCode(
  `<ButtonGroup>`,
  `  <Button severity="primary">{{ t('button.create') }}</Button>`,
  `  <Button variant="outlined">{{ t('button.edit') }}</Button>`,
  `  <Button variant="outlined">{{ t('button.delete') }}</Button>`,
  `</ButtonGroup>`,
  `<Button severity="primary">`,
  `  {{ t('common.more') }}`,
  `  <template #dropdown>`,
  `    <Button variant="text" block>{{ t('button.edit') }}</Button>`,
  `    <Button variant="text" block>{{ t('button.delete') }}</Button>`,
  `  </template>`,
  `</Button>`
)

/* ─── API tables ─── */

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.button.demo.basic')"
      :description="t('example.doc.button.demo.basicDesc')"
      :code="basicSource"
      default-open
    >
      <Basic />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.button.demo.dashed')"
      :description="t('example.doc.button.demo.dashedDesc')"
      :code="codeDashed"
    >
      <div class="vp-button-row">
        <Button variant="dashed" severity="primary" @click="flash">
          {{ t(LocaleKeys.button.confirm) }}
        </Button>
        <Button variant="dashed" severity="success" @click="flash">
          {{ t(LocaleKeys.common.success) }}
        </Button>
        <Button variant="dashed" severity="warning" @click="flash">
          {{ t(LocaleKeys.button.edit) }}
        </Button>
        <Button variant="dashed" severity="danger" @click="flash">
          {{ t(LocaleKeys.button.delete) }}
        </Button>
        <Button variant="dashed" @click="flash">
          {{ t(LocaleKeys.button.create) }}
        </Button>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.button.demo.neon')"
      :description="t('example.doc.button.demo.neonDesc')"
      :code="codeNeon"
    >
      <div class="vp-button-row">
        <Button variant="neon" severity="primary" @click="flash">
          {{ t(LocaleKeys.button.confirm) }}
        </Button>
        <Button variant="neon" severity="success" @click="flash">
          {{ t(LocaleKeys.common.success) }}
        </Button>
        <Button variant="neon" severity="warning" @click="flash">
          {{ t(LocaleKeys.button.edit) }}
        </Button>
        <Button variant="neon" severity="danger" @click="flash">
          {{ t(LocaleKeys.button.delete) }}
        </Button>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.button.demo.size')"
      :description="t('example.doc.button.demo.sizeDesc')"
      :code="codeSize"
    >
      <div class="vp-button-row">
        <Button
          v-for="sz in sizes"
          :key="sz"
          :size="sz"
          severity="primary"
          @click="flash"
        >
          {{ tDyn(sizeLabelKey[sz]) }}
        </Button>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.button.demo.icon')"
      :description="t('example.doc.button.demo.iconDesc')"
      :code="codeIcon"
    >
      <div class="vp-button-row">
        <Button icon="Star" :label="t(LocaleKeys.button.save)" severity="primary" @click="flash" />
        <Button
          icon="ChevronRight"
          icon-pos="right"
          :label="t(LocaleKeys.button.continue)"
          variant="outlined"
          @click="flash"
        />
        <Button
          icon="Upload"
          icon-pos="top"
          :label="t(LocaleKeys.button.submit)"
          variant="dashed"
          @click="flash"
        />
        <Button
          shape="circle"
          icon="Settings"
          :aria-label="t(LocaleKeys.page.baseAtomsButton.ariaIcon)"
          @click="flash"
        />
        <Button
          shape="square"
          variant="outlined"
          icon="Search"
          :aria-label="t(LocaleKeys.page.baseAtomsButton.ariaIcon)"
          @click="flash"
        />
        <Button
          shape="circle"
          :img="demoImg"
          :aria-label="t(LocaleKeys.page.baseAtomsButton.ariaImg)"
          badge="1"
          @click="flash"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.button.demo.states')"
      :description="t('example.doc.button.demo.statesDesc')"
      :code="codeStates"
    >
      <div class="vp-button-row">
        <Button
          :loading="loading"
          :loading-text="t(LocaleKeys.common.loading)"
          severity="primary"
          @click="flash"
        >
          {{ t(LocaleKeys.common.loading) }}
        </Button>
        <Button
          disabled
          :disabled-title="t('example.doc.button.tip.disabled')"
        >
          {{ t(LocaleKeys.button.confirm) }}
        </Button>
        <Button readonly>{{ t('example.doc.button.demo.readonlyLabel') }}</Button>
        <Button
          click-guard="debounce"
          :wait="500"
          severity="primary"
          @click="onGuardedClick"
        >
          {{ t('example.doc.button.demo.debounceLabel') }} ({{ clickCount }})
        </Button>
        <Button :badge="3" @click="flash">{{ t(LocaleKeys.button.refresh) }}</Button>
        <Button star variant="outlined" @click="flash">{{ t(LocaleKeys.button.save) }}</Button>
        <Button ripple severity="primary" @click="flash">
          {{ t('example.doc.button.demo.rippleLabel') }}
        </Button>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.button.demo.biz')"
      :description="t('example.doc.button.demo.bizDesc')"
      :code="codeBiz"
    >
      <div class="vp-button-row">
        <Button
          :permission="false"
          permission-mode="disable"
          :permission-tip="t('example.doc.button.tip.noPermission')"
        >
          {{ t('example.doc.button.demo.permissionLabel') }}
        </Button>
        <Button :permission="false" permission-mode="hide">
          {{ t('example.doc.button.demo.permissionHidden') }}
        </Button>
        <Button severity="danger" :confirm="t('example.doc.button.tip.confirmDelete')">
          {{ t(LocaleKeys.button.delete) }}
        </Button>
        <Button href="https://example.com" target="_blank" link>
          {{ t('example.doc.button.demo.hrefLabel') }}
        </Button>
        <Button block severity="primary" type="submit" @click="flash">
          {{ t(LocaleKeys.button.submit) }}
        </Button>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.button.demo.slots')"
      :description="t('example.doc.button.demo.slotsDesc')"
      :code="codeSlots"
    >
      <div class="vp-button-row">
        <Button severity="primary" @click="flash">
          <template #prefix>
            <Icon name="Star" size="sm" />
          </template>
          {{ t(LocaleKeys.button.save) }}
          <template #suffix>
            <Icon name="ChevronRight" size="sm" />
          </template>
        </Button>
        <Button severity="primary" @click="flash">
          <template #icon>
            <Icon name="Heart" />
          </template>
          {{ t(LocaleKeys.button.save) }}
        </Button>
        <Button loading severity="primary">
          <template #loading>
            <Icon name="Loader2" spin />
          </template>
          {{ t(LocaleKeys.common.loading) }}
        </Button>
        <Button severity="primary" @click="flash">
          {{ t(LocaleKeys.common.more) }}
          <template #dropdown>
            <Button variant="text" block @click="flash">{{ t(LocaleKeys.button.edit) }}</Button>
            <Button variant="text" block @click="flash">{{ t(LocaleKeys.button.delete) }}</Button>
          </template>
        </Button>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.button.demo.events')"
      :description="t('example.doc.button.demo.eventsDesc')"
      :code="codeEvents"
    >
      <div class="vp-button-events">
        <div class="vp-button-row">
          <Button
            severity="primary"
            @click="noteEvent('click')"
            @focus="noteEvent('focus')"
            @blur="noteEvent('blur')"
          >
            {{ t(LocaleKeys.button.confirm) }}
          </Button>
          <Button
            severity="danger"
            :confirm="t('example.doc.button.tip.confirmDelete')"
            @confirm="noteEvent('confirm')"
            @cancel-confirm="noteEvent('cancelConfirm')"
          >
            {{ t(LocaleKeys.button.delete) }}
          </Button>
        </div>
        <p class="vp-button-events__log">
          {{
            t('example.doc.button.sample.eventLog', {
              event: lastEvent || t('example.doc.button.sample.eventIdle')
            })
          }}
        </p>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.icon.demo.motion')"
      :description="t('example.doc.motion.demo.desc')"
      :code="codeMotionLive"
    >
      <MotionLivePanel v-model="motion">
        <template #preview>
          <Button
            icon="Heart"
            severity="primary"
            :label="t(LocaleKeys.button.save)"
            v-bind="motionBind"
          />
          <Button
            icon="RefreshCw"
            variant="outlined"
            :label="t(LocaleKeys.button.refresh)"
            v-bind="motionBind"
          />
          <Button
            shape="circle"
            icon="Star"
            :aria-label="t(LocaleKeys.page.baseAtomsButton.ariaIcon)"
            v-bind="motionBind"
          />
        </template>
      </MotionLivePanel>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.button.demo.group')"
      :description="t('example.doc.button.demo.groupDesc')"
      :code="codeGroup"
    >
      <div class="vp-button-row">
        <ButtonGroup>
          <Button severity="primary" @click="flash">{{ t(LocaleKeys.button.create) }}</Button>
          <Button variant="outlined" @click="flash">{{ t(LocaleKeys.button.edit) }}</Button>
          <Button variant="outlined" @click="flash">{{ t(LocaleKeys.button.delete) }}</Button>
        </ButtonGroup>
        <Button severity="primary" @click="flash">
          {{ t(LocaleKeys.common.more) }}
          <template #dropdown>
            <Button variant="text" block @click="flash">{{ t(LocaleKeys.button.edit) }}</Button>
            <Button variant="text" block @click="flash">{{ t(LocaleKeys.button.delete) }}</Button>
          </template>
        </Button>
      </div>
    </DemoBlock>
  </div>
</template>

<style scoped>
.vp-curated {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}
.vp-button-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
}

.vp-button-events {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-button-events__log {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}
</style>
