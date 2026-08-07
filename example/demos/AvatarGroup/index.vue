<script setup lang="ts">
import { computed, ref } from 'vue'
import { Avatar, AvatarGroup } from '@amg-webui/core'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'

const { t } = useLocale()

const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']
const overflowClicks = ref(0)
const lastEvent = ref('')

const imgA = 'https://api.dicebear.com/9.x/avataaars/svg?seed=amg-ga'
const imgB = 'https://api.dicebear.com/9.x/avataaars/svg?seed=amg-gb'
const imgC = 'https://api.dicebear.com/9.x/avataaars/svg?seed=amg-gc'

function onOverflowClick() {
  overflowClicks.value += 1
  lastEvent.value = 'overflowClick'
}

/* ─── Code snippets: must mirror preview 1:1 (no `…`) ─── */

const codeBasic = demoSfc({
  imports: [`import { Avatar, AvatarGroup } from '@amg-webui/core'`],
  template: [
    `  <AvatarGroup>`,
    `    <Avatar`,
    `      src="${imgA}"`,
    `      :tooltip="t('example.doc.avatarGroup.sample.userA')"`,
    `    />`,
    `    <Avatar`,
    `      src="${imgB}"`,
    `      :tooltip="t('example.doc.avatarGroup.sample.userB')"`,
    `    />`,
    `    <Avatar`,
    `      src="${imgC}"`,
    `      :tooltip="t('example.doc.avatarGroup.sample.userC')"`,
    `    />`,
    `  </AvatarGroup>`
  ]
})

const codeMax = demoCode(
  `<AvatarGroup :max="3" @overflow-click="onOverflowClick">`,
  `  <Avatar src="${imgA}" :tooltip="t('example.doc.avatarGroup.sample.userA')" />`,
  `  <Avatar src="${imgB}" :tooltip="t('example.doc.avatarGroup.sample.userB')" />`,
  `  <Avatar src="${imgC}" :tooltip="t('example.doc.avatarGroup.sample.userC')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userD')" :tooltip="t('example.doc.avatarGroup.sample.userD')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userE')" :tooltip="t('example.doc.avatarGroup.sample.userE')" />`,
  `  <Avatar icon="User" :tooltip="t('example.doc.avatarGroup.sample.userF')" />`,
  `</AvatarGroup>`
)

const codeSize = demoCode(
  `<AvatarGroup size="xs" :max="4">`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userA')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userB')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userC')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userD')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userE')" />`,
  `</AvatarGroup>`,
  `<AvatarGroup size="sm" :max="4">`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userA')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userB')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userC')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userD')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userE')" />`,
  `</AvatarGroup>`,
  `<AvatarGroup size="md" :max="4">`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userA')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userB')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userC')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userD')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userE')" />`,
  `</AvatarGroup>`,
  `<AvatarGroup size="lg" :max="4">`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userA')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userB')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userC')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userD')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userE')" />`,
  `</AvatarGroup>`,
  `<AvatarGroup size="xl" :max="4">`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userA')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userB')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userC')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userD')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userE')" />`,
  `</AvatarGroup>`
)

const codeMix = demoCode(
  `<AvatarGroup :max="5" shape="circle">`,
  `  <Avatar src="${imgA}" :tooltip="t('example.doc.avatarGroup.sample.userA')" />`,
  `  <Avatar`,
  `    :text="t('example.doc.avatarGroup.sample.nameZh')"`,
  `    :tooltip="t('example.doc.avatarGroup.sample.nameZh')"`,
  `  />`,
  `  <Avatar icon="User" :tooltip="t('example.doc.avatarGroup.sample.userC')" />`,
  `  <Avatar src="${imgB}" :tooltip="t('example.doc.avatarGroup.sample.userD')" />`,
  `  <Avatar`,
  `    :text="t('example.doc.avatarGroup.sample.userE')"`,
  `    :tooltip="t('example.doc.avatarGroup.sample.userE')"`,
  `  />`,
  `  <Avatar`,
  `    :text="t('example.doc.avatarGroup.sample.userF')"`,
  `    :tooltip="t('example.doc.avatarGroup.sample.userF')"`,
  `  />`,
  `</AvatarGroup>`
)

const codeTooltip = demoCode(
  `<AvatarGroup`,
  `  :max="2"`,
  `  :max-tooltip="t('example.doc.avatarGroup.sample.maxTooltip')"`,
  `>`,
  `  <Avatar src="${imgA}" :tooltip="t('example.doc.avatarGroup.sample.userA')" />`,
  `  <Avatar src="${imgB}" :tooltip="t('example.doc.avatarGroup.sample.userB')" />`,
  `  <Avatar src="${imgC}" :tooltip="t('example.doc.avatarGroup.sample.userC')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userD')" :tooltip="t('example.doc.avatarGroup.sample.userD')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userE')" :tooltip="t('example.doc.avatarGroup.sample.userE')" />`,
  `  <Avatar icon="User" :tooltip="t('example.doc.avatarGroup.sample.userF')" />`,
  `</AvatarGroup>`
)

const codeDisabled = demoCode(
  `<AvatarGroup :max="3">`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userA')" :tooltip="t('example.doc.avatarGroup.sample.userA')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userB')" :tooltip="t('example.doc.avatarGroup.sample.userB')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userC')" :tooltip="t('example.doc.avatarGroup.sample.userC')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userD')" :tooltip="t('example.doc.avatarGroup.sample.userD')" />`,
  `</AvatarGroup>`,
  ``,
  `<AvatarGroup disabled :max="3">`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userA')" :tooltip="t('example.doc.avatarGroup.sample.userA')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userB')" :tooltip="t('example.doc.avatarGroup.sample.userB')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userC')" :tooltip="t('example.doc.avatarGroup.sample.userC')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userD')" :tooltip="t('example.doc.avatarGroup.sample.userD')" />`,
  `</AvatarGroup>`
)

const codeNeon = demoCode(
  `<AvatarGroup variant="neon" :max="4">`,
  `  <Avatar text="A" border-color="var(--primary-500)" :tooltip="t('example.doc.avatar.sample.neonPrimary')" />`,
  `  <Avatar text="B" border-color="var(--success-500)" :tooltip="t('example.doc.avatar.sample.neonSuccess')" />`,
  `  <Avatar text="C" border-color="var(--warning-500)" :tooltip="t('example.doc.avatar.sample.neonWarning')" />`,
  `  <Avatar text="D" border-color="var(--danger-500)" :tooltip="t('example.doc.avatar.sample.neonDanger')" />`,
  `  <Avatar text="E" border-color="var(--info-500)" />`,
  `</AvatarGroup>`
)

const codeSlots = demoCode(
  `<!-- #overflowTooltip customizes +N bubble -->`,
  `<AvatarGroup :max="2">`,
  `  <Avatar src="${imgA}" :tooltip="t('example.doc.avatarGroup.sample.userA')" />`,
  `  <Avatar src="${imgB}" :tooltip="t('example.doc.avatarGroup.sample.userB')" />`,
  `  <Avatar src="${imgC}" :tooltip="t('example.doc.avatarGroup.sample.userC')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userD')" :tooltip="t('example.doc.avatarGroup.sample.userD')" />`,
  `  <template #overflowTooltip="{ overflowCount, labels }">`,
  `    <span>`,
  `      {{ t('example.doc.avatarGroup.sample.overflowCustom', {`,
  `        count: overflowCount,`,
  `        names: labels.join(', ')`,
  `      }) }}`,
  `    </span>`,
  `  </template>`,
  `</AvatarGroup>`
)

const codeEvents = demoCode(
  `<AvatarGroup :max="3" @overflow-click="onOverflowClick">`,
  `  <Avatar src="${imgA}" :tooltip="t('example.doc.avatarGroup.sample.userA')" />`,
  `  <Avatar src="${imgB}" :tooltip="t('example.doc.avatarGroup.sample.userB')" />`,
  `  <Avatar src="${imgC}" :tooltip="t('example.doc.avatarGroup.sample.userC')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userD')" :tooltip="t('example.doc.avatarGroup.sample.userD')" />`,
  `  <Avatar :text="t('example.doc.avatarGroup.sample.userE')" :tooltip="t('example.doc.avatarGroup.sample.userE')" />`,
  `</AvatarGroup>`
)

/* ─── API tables ─── */

const propRows = computed<PropRow[]>(() => [
  {
    name: 'max',
    description: t('example.doc.avatarGroup.prop.max'),
    type: 'number',
    defaultValue: '3'
  },
  {
    name: 'size',
    description: t('example.doc.avatarGroup.prop.size'),
    type: 'Size | number',
    defaultValue: '-'
  },
  {
    name: 'shape',
    description: t('example.doc.avatarGroup.prop.shape'),
    type: "'circle' | 'square'",
    defaultValue: '-'
  },
  {
    name: 'variant',
    description: t('example.doc.avatarGroup.prop.variant'),
    type: "'default' | 'neon'",
    defaultValue: "'default'"
  },
  {
    name: 'overlap',
    description: t('example.doc.avatarGroup.prop.overlap'),
    type: 'string',
    defaultValue: 'var(--theme-avatar-group-overlap)'
  },
  {
    name: 'maxTooltip',
    description: t('example.doc.avatarGroup.prop.maxTooltip'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'disabled',
    description: t('example.doc.avatarGroup.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'trackId / telemetry',
    description: t('example.doc.avatarGroup.prop.telemetry'),
    type: 'string / boolean',
    defaultValue: '- / undefined'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'overflowClick',
    description: t('example.doc.avatarGroup.emit.overflowClick'),
    type: '(event: MouseEvent) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.avatarGroup.slot.default'),
    type: 'VNode (Avatar children)',
    defaultValue: '-'
  },
  {
    name: 'overflowTooltip',
    description: t('example.doc.avatarGroup.slot.overflowTooltip'),
    type: '{ overflowCount: number; labels: string[] }',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <!-- 1. Basic — pasteable SFC, default-open -->
    <DemoBlock
      :title="t('example.doc.avatarGroup.demo.basic')"
      :description="t('example.doc.avatarGroup.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <AvatarGroup>
        <Avatar :src="imgA" :tooltip="t('example.doc.avatarGroup.sample.userA')" />
        <Avatar :src="imgB" :tooltip="t('example.doc.avatarGroup.sample.userB')" />
        <Avatar :src="imgC" :tooltip="t('example.doc.avatarGroup.sample.userC')" />
      </AvatarGroup>
    </DemoBlock>

    <!-- 2. Feature blocks -->
    <DemoBlock
      :title="t('example.doc.avatarGroup.demo.max')"
      :description="t('example.doc.avatarGroup.demo.maxDesc')"
      :code="codeMax"
    >
      <div class="vp-ag-stack">
        <AvatarGroup :max="3" @overflow-click="onOverflowClick">
          <Avatar :src="imgA" :tooltip="t('example.doc.avatarGroup.sample.userA')" />
          <Avatar :src="imgB" :tooltip="t('example.doc.avatarGroup.sample.userB')" />
          <Avatar :src="imgC" :tooltip="t('example.doc.avatarGroup.sample.userC')" />
          <Avatar
            :text="t('example.doc.avatarGroup.sample.userD')"
            :tooltip="t('example.doc.avatarGroup.sample.userD')"
          />
          <Avatar
            :text="t('example.doc.avatarGroup.sample.userE')"
            :tooltip="t('example.doc.avatarGroup.sample.userE')"
          />
          <Avatar icon="User" :tooltip="t('example.doc.avatarGroup.sample.userF')" />
        </AvatarGroup>
        <p class="vp-ag-hint">
          {{ t('example.doc.avatarGroup.sample.overflowClicked', { count: overflowClicks }) }}
        </p>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.avatarGroup.demo.size')"
      :description="t('example.doc.avatarGroup.demo.sizeDesc')"
      :code="codeSize"
    >
      <div class="vp-ag-stack">
        <AvatarGroup v-for="sz in sizes" :key="sz" :size="sz" :max="4">
          <Avatar
            :text="t('example.doc.avatarGroup.sample.userA')"
            :tooltip="t('example.doc.avatarGroup.sample.userA')"
          />
          <Avatar
            :text="t('example.doc.avatarGroup.sample.userB')"
            :tooltip="t('example.doc.avatarGroup.sample.userB')"
          />
          <Avatar
            :text="t('example.doc.avatarGroup.sample.userC')"
            :tooltip="t('example.doc.avatarGroup.sample.userC')"
          />
          <Avatar
            :text="t('example.doc.avatarGroup.sample.userD')"
            :tooltip="t('example.doc.avatarGroup.sample.userD')"
          />
          <Avatar
            :text="t('example.doc.avatarGroup.sample.userE')"
            :tooltip="t('example.doc.avatarGroup.sample.userE')"
          />
        </AvatarGroup>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.avatarGroup.demo.mix')"
      :description="t('example.doc.avatarGroup.demo.mixDesc')"
      :code="codeMix"
    >
      <AvatarGroup :max="5" shape="circle">
        <Avatar :src="imgA" :tooltip="t('example.doc.avatarGroup.sample.userA')" />
        <Avatar
          :text="t('example.doc.avatarGroup.sample.nameZh')"
          :tooltip="t('example.doc.avatarGroup.sample.nameZh')"
        />
        <Avatar icon="User" :tooltip="t('example.doc.avatarGroup.sample.userC')" />
        <Avatar :src="imgB" :tooltip="t('example.doc.avatarGroup.sample.userD')" />
        <Avatar
          :text="t('example.doc.avatarGroup.sample.userE')"
          :tooltip="t('example.doc.avatarGroup.sample.userE')"
        />
        <Avatar
          :text="t('example.doc.avatarGroup.sample.userF')"
          :tooltip="t('example.doc.avatarGroup.sample.userF')"
        />
      </AvatarGroup>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.avatarGroup.demo.tooltip')"
      :description="t('example.doc.avatarGroup.demo.tooltipDesc')"
      :code="codeTooltip"
    >
      <AvatarGroup :max="2" :max-tooltip="t('example.doc.avatarGroup.sample.maxTooltip')">
        <Avatar :src="imgA" :tooltip="t('example.doc.avatarGroup.sample.userA')" />
        <Avatar :src="imgB" :tooltip="t('example.doc.avatarGroup.sample.userB')" />
        <Avatar :src="imgC" :tooltip="t('example.doc.avatarGroup.sample.userC')" />
        <Avatar
          :text="t('example.doc.avatarGroup.sample.userD')"
          :tooltip="t('example.doc.avatarGroup.sample.userD')"
        />
        <Avatar
          :text="t('example.doc.avatarGroup.sample.userE')"
          :tooltip="t('example.doc.avatarGroup.sample.userE')"
        />
        <Avatar icon="User" :tooltip="t('example.doc.avatarGroup.sample.userF')" />
      </AvatarGroup>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.avatarGroup.demo.disabled')"
      :description="t('example.doc.avatarGroup.demo.disabledDesc')"
      :code="codeDisabled"
    >
      <div class="vp-ag-row">
        <AvatarGroup :max="3">
          <Avatar
            :text="t('example.doc.avatarGroup.sample.userA')"
            :tooltip="t('example.doc.avatarGroup.sample.userA')"
          />
          <Avatar
            :text="t('example.doc.avatarGroup.sample.userB')"
            :tooltip="t('example.doc.avatarGroup.sample.userB')"
          />
          <Avatar
            :text="t('example.doc.avatarGroup.sample.userC')"
            :tooltip="t('example.doc.avatarGroup.sample.userC')"
          />
          <Avatar
            :text="t('example.doc.avatarGroup.sample.userD')"
            :tooltip="t('example.doc.avatarGroup.sample.userD')"
          />
        </AvatarGroup>
        <AvatarGroup disabled :max="3">
          <Avatar
            :text="t('example.doc.avatarGroup.sample.userA')"
            :tooltip="t('example.doc.avatarGroup.sample.userA')"
          />
          <Avatar
            :text="t('example.doc.avatarGroup.sample.userB')"
            :tooltip="t('example.doc.avatarGroup.sample.userB')"
          />
          <Avatar
            :text="t('example.doc.avatarGroup.sample.userC')"
            :tooltip="t('example.doc.avatarGroup.sample.userC')"
          />
          <Avatar
            :text="t('example.doc.avatarGroup.sample.userD')"
            :tooltip="t('example.doc.avatarGroup.sample.userD')"
          />
        </AvatarGroup>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.avatarGroup.demo.neon')"
      :description="t('example.doc.avatarGroup.demo.neonDesc')"
      :code="codeNeon"
    >
      <AvatarGroup variant="neon" :max="4">
        <Avatar
          text="A"
          border-color="var(--primary-500)"
          :tooltip="t('example.doc.avatar.sample.neonPrimary')"
        />
        <Avatar
          text="B"
          border-color="var(--success-500)"
          :tooltip="t('example.doc.avatar.sample.neonSuccess')"
        />
        <Avatar
          text="C"
          border-color="var(--warning-500)"
          :tooltip="t('example.doc.avatar.sample.neonWarning')"
        />
        <Avatar
          text="D"
          border-color="var(--danger-500)"
          :tooltip="t('example.doc.avatar.sample.neonDanger')"
        />
        <Avatar text="E" border-color="var(--info-500)" />
      </AvatarGroup>
    </DemoBlock>

    <!-- 3. Slots -->
    <DemoBlock
      :title="t('example.doc.avatarGroup.demo.slots')"
      :description="t('example.doc.avatarGroup.demo.slotsDesc')"
      :code="codeSlots"
    >
      <AvatarGroup :max="2">
        <Avatar :src="imgA" :tooltip="t('example.doc.avatarGroup.sample.userA')" />
        <Avatar :src="imgB" :tooltip="t('example.doc.avatarGroup.sample.userB')" />
        <Avatar :src="imgC" :tooltip="t('example.doc.avatarGroup.sample.userC')" />
        <Avatar
          :text="t('example.doc.avatarGroup.sample.userD')"
          :tooltip="t('example.doc.avatarGroup.sample.userD')"
        />
        <template #overflowTooltip="{ overflowCount, labels }">
          <span>
            {{
              t('example.doc.avatarGroup.sample.overflowCustom', {
                count: overflowCount,
                names: labels.join(', ')
              })
            }}
          </span>
        </template>
      </AvatarGroup>
    </DemoBlock>

    <!-- 4. Events -->
    <DemoBlock
      :title="t('example.doc.avatarGroup.demo.events')"
      :description="t('example.doc.avatarGroup.demo.eventsDesc')"
      :code="codeEvents"
    >
      <div class="vp-ag-stack">
        <AvatarGroup :max="3" @overflow-click="onOverflowClick">
          <Avatar :src="imgA" :tooltip="t('example.doc.avatarGroup.sample.userA')" />
          <Avatar :src="imgB" :tooltip="t('example.doc.avatarGroup.sample.userB')" />
          <Avatar :src="imgC" :tooltip="t('example.doc.avatarGroup.sample.userC')" />
          <Avatar
            :text="t('example.doc.avatarGroup.sample.userD')"
            :tooltip="t('example.doc.avatarGroup.sample.userD')"
          />
          <Avatar
            :text="t('example.doc.avatarGroup.sample.userE')"
            :tooltip="t('example.doc.avatarGroup.sample.userE')"
          />
        </AvatarGroup>
        <p class="vp-ag-hint">
          {{
            t('example.doc.avatar.sample.eventLog', {
              event: lastEvent || t('example.doc.avatar.sample.eventIdle')
            })
          }}
        </p>
      </div>
    </DemoBlock>

    <!-- 5. API: Props → Events → Slots -->
    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>

      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />

      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />

      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.slots) }}</h3>
      <PropsTable :rows="slotRows" />
    </section>
  </div>
</template>

<style scoped>
.vp-curated {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.vp-curated__api-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  color: var(--text-primary);
}

.vp-curated__api-sub {
  margin: var(--spacing-xl) 0 var(--spacing-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.vp-curated__api-sub:first-of-type {
  margin-top: 0;
}

.vp-ag-stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  align-items: flex-start;
}

.vp-ag-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-xl);
}

.vp-ag-hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}
</style>
