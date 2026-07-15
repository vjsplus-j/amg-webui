<script setup lang="ts">
import { computed, ref } from 'vue'
import { Avatar, AvatarGroup } from '@amg-webui/components/base'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import type { PropRow } from '../../components/demo/types'

const { t } = useLocale()

const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']
const overflowClicks = ref(0)

const imgA = 'https://api.dicebear.com/9.x/avataaars/svg?seed=amg-ga'
const imgB = 'https://api.dicebear.com/9.x/avataaars/svg?seed=amg-gb'
const imgC = 'https://api.dicebear.com/9.x/avataaars/svg?seed=amg-gc'

const members = computed(() => [
  { key: 'a', text: t('example.doc.avatarGroup.sample.userA'), src: imgA },
  { key: 'b', text: t('example.doc.avatarGroup.sample.userB'), src: imgB },
  { key: 'c', text: t('example.doc.avatarGroup.sample.userC'), src: imgC },
  { key: 'd', text: t('example.doc.avatarGroup.sample.userD') },
  { key: 'e', text: t('example.doc.avatarGroup.sample.userE') },
  { key: 'f', text: t('example.doc.avatarGroup.sample.userF'), icon: 'User' }
])

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
  }
])

const codeBasic = `<AvatarGroup>
  <Avatar text="A" :tooltip="…" />
  <Avatar text="B" :tooltip="…" />
  <Avatar :src="…" :tooltip="…" />
</AvatarGroup>`

const codeMax = `<AvatarGroup :max="3">
  <!-- 6 members → shows 3 + "+3" -->
  <Avatar … />
</AvatarGroup>`

const codeSize = `<AvatarGroup size="lg" :max="4">
  <Avatar … />
</AvatarGroup>`

const codeMix = `<AvatarGroup :max="4">
  <Avatar :src="…" />
  <Avatar text="张" />
  <Avatar icon="User" />
</AvatarGroup>`

const codeTooltip = `<AvatarGroup :max="2">
  <Avatar text="A" :tooltip="t('…userA')" />
  <!-- overflow tooltip lists hidden names -->
</AvatarGroup>`

const codeDisabled = `<AvatarGroup disabled :max="3">
  <Avatar … />
</AvatarGroup>`

const codeNeon = `<AvatarGroup variant="neon" :max="4">
  <Avatar text="A" border-color="var(--primary-500)" />
  <Avatar text="B" border-color="var(--success-500)" />
  <Avatar text="C" border-color="var(--warning-500)" />
</AvatarGroup>`

function onOverflowClick() {
  overflowClicks.value += 1
}
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.avatarGroup.demo.basic')"
      :description="t('example.doc.avatarGroup.demo.basicDesc')"
      :code="codeBasic"
    >
      <AvatarGroup>
        <Avatar
          v-for="m in members.slice(0, 3)"
          :key="m.key"
          :src="m.src"
          :text="m.text"
          :tooltip="m.text"
        />
      </AvatarGroup>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.avatarGroup.demo.max')"
      :description="t('example.doc.avatarGroup.demo.maxDesc')"
      :code="codeMax"
    >
      <div class="vp-ag-stack">
        <AvatarGroup :max="3" @overflow-click="onOverflowClick">
          <Avatar
            v-for="m in members"
            :key="m.key"
            :src="m.src"
            :text="m.text"
            :icon="m.icon"
            :tooltip="m.text"
          />
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
            v-for="m in members.slice(0, 5)"
            :key="`${sz}-${m.key}`"
            :text="m.text"
            :tooltip="m.text"
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
      <AvatarGroup :max="2">
        <Avatar
          v-for="m in members"
          :key="`tip-${m.key}`"
          :src="m.src"
          :text="m.text"
          :icon="m.icon"
          :tooltip="m.text"
        />
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
            v-for="m in members.slice(0, 4)"
            :key="`n-${m.key}`"
            :text="m.text"
            :tooltip="m.text"
          />
        </AvatarGroup>
        <AvatarGroup disabled :max="3">
          <Avatar
            v-for="m in members.slice(0, 4)"
            :key="`d-${m.key}`"
            :text="m.text"
            :tooltip="m.text"
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

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <PropsTable :rows="propRows" />
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
}
</style>
