<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Avatar, AvatarGroup, Button } from '@amg-webui/components/base'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import MotionLivePanel from '../../components/demo/MotionLivePanel.vue'
import {
  createMotionLiveState,
  formatMotionLiveCode,
  useMotionLiveBind
} from '../../components/demo/motionLive'
import type { PropRow } from '../../components/demo/types'

const { t } = useLocale()

const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']

const sizeLabelKey: Record<Size, string> = {
  xs: 'example.doc.avatar.size.xs',
  sm: 'example.doc.avatar.size.sm',
  md: 'example.doc.avatar.size.md',
  lg: 'example.doc.avatar.size.lg',
  xl: 'example.doc.avatar.size.xl'
}

const clickCount = ref(0)
const motion = createMotionLiveState()
const motionBind = useMotionLiveBind(motion)
const codeMotionLive = computed(() =>
  formatMotionLiveCode('Avatar', motion.value, ['  text="AM"', '  size="lg"'])
)

/** Stable demo portraits — replace with local assets when offline QA needs them */
const imgA = 'https://api.dicebear.com/9.x/avataaars/svg?seed=amg-a'
const imgB = 'https://api.dicebear.com/9.x/avataaars/svg?seed=amg-b'
const imgC = 'https://api.dicebear.com/9.x/avataaars/svg?seed=amg-c'
const imgBroken = 'https://invalid.amg-webui.local/avatar-404.png'

/** Async image-load demo: remount + unique URL so network skeleton is visible */
const asyncKey = ref(0)
const asyncSrc = ref('')

function replayAsyncLoad() {
  asyncKey.value += 1
  // Unique seed avoids cache; Avatar shows skeleton until img @load
  asyncSrc.value = `https://picsum.photos/seed/vp-avatar-${asyncKey.value}/128/128`
}

onMounted(() => {
  replayAsyncLoad()
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'src / alt',
    description: t('example.doc.avatar.prop.src'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'text / textMaxLength',
    description: t('example.doc.avatar.prop.text'),
    type: 'string / number',
    defaultValue: '- / 2'
  },
  {
    name: 'icon / fallbackIcon',
    description: t('example.doc.avatar.prop.icon'),
    type: 'string',
    defaultValue: 'User'
  },
  {
    name: 'size',
    description: t('example.doc.avatar.prop.size'),
    type: "Size | number",
    defaultValue: "'md'"
  },
  {
    name: 'shape / borderRadius',
    description: t('example.doc.avatar.prop.shape'),
    type: "'circle' | 'square' / string",
    defaultValue: "'circle'"
  },
  {
    name: 'bordered / borderColor / borderWidth',
    description: t('example.doc.avatar.prop.border'),
    type: 'boolean / string',
    defaultValue: 'true'
  },
  {
    name: 'variant',
    description: t('example.doc.avatar.prop.variant'),
    type: "'default' | 'neon'",
    defaultValue: "'default'"
  },
  {
    name: 'colorBg / colorText',
    description: t('example.doc.avatar.prop.color'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'tooltip / tooltipDelay',
    description: t('example.doc.avatar.prop.tooltip'),
    type: 'string / number',
    defaultValue: '- / 200'
  },
  {
    name: 'fallbackSrc / fallbackText',
    description: t('example.doc.avatar.prop.fallback'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'loading',
    description: t('example.doc.avatar.prop.loading'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'disabled / clickable',
    description: t('example.doc.avatar.prop.state'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'spin / pulse / heartbeat / bounce',
    description: t('example.doc.motion.prop.heartbeat'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'animationDuration',
    description: t('example.doc.motion.prop.animationDuration'),
    type: 'number | string',
    defaultValue: '-'
  },
  {
    name: 'AvatarGroup max / size / overlap',
    description: t('example.doc.avatar.prop.group'),
    type: 'number / Size / string',
    defaultValue: '3 / - / token'
  }
])

const codeModes = `<Avatar :src="url" alt="…" />
<Avatar text="张三" />
<Avatar icon="User" />`

const codeSize = `<Avatar size="xs" :src="…" />
<Avatar size="sm" :src="…" />
<Avatar size="md" :src="…" />
<Avatar size="lg" :src="…" />
<Avatar size="xl" :src="…" />`

const codeShape = `<Avatar shape="circle" text="C" />
<Avatar shape="square" text="S" />
<Avatar border-radius="var(--border-radius-lg)" text="R" />`

const codeBorder = `<Avatar bordered text="B" />
<Avatar :bordered="false" text="N" />
<Avatar border-color="var(--primary-500)" text="P" />`

const codeNeon = `<Avatar variant="neon" text="N" border-color="var(--primary-500)" />
<Avatar variant="neon" text="S" border-color="var(--success-500)" />
<Avatar variant="neon" text="W" border-color="var(--warning-500)" />
<Avatar variant="neon" text="D" border-color="var(--danger-500)" />`

const codeTooltip = `<Avatar text="AM" tooltip="…" />`

const codeFallback = `<Avatar
  src="broken.png"
  fallback-text="FB"
  fallback-icon="User"
/>`

const codeLoading = `<!-- sync: controlled skeleton -->
<Avatar loading />

<!-- async: skeleton while image loads -->
<Avatar :src="url" />`

const codeState = `<Avatar disabled text="D" />
<Avatar clickable text="OK" @click="…" />`

const codeGroup = `<AvatarGroup :max="3" size="md">
  <Avatar :src="…" />
  <Avatar text="B" />
  <!-- overflow → +N -->
</AvatarGroup>`
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.avatar.demo.modes')"
      :description="t('example.doc.avatar.demo.modesDesc')"
      :code="codeModes"
    >
      <div class="vp-avatar-row">
        <Avatar :src="imgA" :alt="t('example.doc.avatar.sample.photo')" />
        <Avatar :text="t('example.doc.avatar.sample.nameZh')" />
        <Avatar text="JD" />
        <Avatar icon="User" :alt="t('example.doc.avatar.sample.icon')" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.avatar.demo.size')"
      :description="t('example.doc.avatar.demo.sizeDesc')"
      :code="codeSize"
    >
      <div class="vp-avatar-size-row">
        <div v-for="sz in sizes" :key="sz" class="vp-avatar-size-item">
          <Avatar
            :size="sz"
            :src="imgA"
            :alt="t(sizeLabelKey[sz])"
            :tooltip="t(sizeLabelKey[sz])"
          />
          <span class="vp-avatar-size-label">{{ t(sizeLabelKey[sz]) }}</span>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.avatar.demo.shape')"
      :description="t('example.doc.avatar.demo.shapeDesc')"
      :code="codeShape"
    >
      <div class="vp-avatar-row">
        <Avatar
          shape="circle"
          text="C"
          :alt="t('example.doc.avatar.sample.circle')"
          :tooltip="t('example.doc.avatar.sample.circle')"
        />
        <Avatar
          shape="square"
          text="S"
          :alt="t('example.doc.avatar.sample.square')"
          :tooltip="t('example.doc.avatar.sample.square')"
        />
        <Avatar
          border-radius="var(--border-radius-lg)"
          text="R"
          :alt="t('example.doc.avatar.sample.radius')"
          :tooltip="t('example.doc.avatar.sample.radius')"
          color-bg="var(--surface-2)"
          color-text="var(--primary-500)"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.avatar.demo.border')"
      :description="t('example.doc.avatar.demo.borderDesc')"
      :code="codeBorder"
    >
      <div class="vp-avatar-row">
        <Avatar
          bordered
          text="B"
          :tooltip="t('example.doc.avatar.sample.borderOn')"
          :alt="t('example.doc.avatar.sample.borderOn')"
        />
        <Avatar
          :bordered="false"
          text="N"
          :tooltip="t('example.doc.avatar.sample.borderOff')"
          :alt="t('example.doc.avatar.sample.borderOff')"
        />
        <Avatar
          border-color="var(--primary-500)"
          text="P"
          :tooltip="t('example.doc.avatar.sample.borderAccent')"
          :alt="t('example.doc.avatar.sample.borderAccent')"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.avatar.demo.neon')"
      :description="t('example.doc.avatar.demo.neonDesc')"
      :code="codeNeon"
    >
      <div class="vp-avatar-row">
        <Avatar
          variant="neon"
          text="N"
          border-color="var(--primary-500)"
          :tooltip="t('example.doc.avatar.sample.neonPrimary')"
          :alt="t('example.doc.avatar.sample.neonPrimary')"
        />
        <Avatar
          variant="neon"
          text="S"
          border-color="var(--success-500)"
          :tooltip="t('example.doc.avatar.sample.neonSuccess')"
          :alt="t('example.doc.avatar.sample.neonSuccess')"
        />
        <Avatar
          variant="neon"
          text="W"
          border-color="var(--warning-500)"
          :tooltip="t('example.doc.avatar.sample.neonWarning')"
          :alt="t('example.doc.avatar.sample.neonWarning')"
        />
        <Avatar
          variant="neon"
          text="D"
          border-color="var(--danger-500)"
          :tooltip="t('example.doc.avatar.sample.neonDanger')"
          :alt="t('example.doc.avatar.sample.neonDanger')"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.avatar.demo.tooltip')"
      :description="t('example.doc.avatar.demo.tooltipDesc')"
      :code="codeTooltip"
    >
      <div class="vp-avatar-row">
        <Avatar
          :src="imgB"
          :alt="t('example.doc.avatar.sample.userA')"
          :tooltip="t('example.doc.avatar.sample.userA')"
        />
        <Avatar
          :text="t('example.doc.avatar.sample.nameZh')"
          :tooltip="t('example.doc.avatar.sample.tooltipRole')"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.avatar.demo.fallback')"
      :description="t('example.doc.avatar.demo.fallbackDesc')"
      :code="codeFallback"
    >
      <div class="vp-avatar-row">
        <Avatar
          :src="imgBroken"
          fallback-text="FB"
          :alt="t('example.doc.avatar.sample.fallbackLetter')"
          :tooltip="t('example.doc.avatar.sample.fallbackLetter')"
        />
        <Avatar
          :src="imgBroken"
          fallback-icon="User"
          :alt="t('example.doc.avatar.sample.icon')"
        />
        <Avatar
          :src="imgBroken"
          :fallback-src="imgC"
          :alt="t('example.doc.avatar.sample.fallbackImg')"
          :tooltip="t('example.doc.avatar.sample.fallbackImg')"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.avatar.demo.loading')"
      :description="t('example.doc.avatar.demo.loadingDesc')"
      :code="codeLoading"
    >
      <div class="vp-avatar-loading">
        <div class="vp-avatar-size-item">
          <Avatar
            loading
            size="lg"
            :alt="t('example.doc.avatar.sample.loadingSync')"
            :tooltip="t('example.doc.avatar.sample.loadingSync')"
          />
          <span class="vp-avatar-size-label">{{ t('example.doc.avatar.sample.loadingSync') }}</span>
        </div>
        <div class="vp-avatar-size-item">
          <Avatar
            :key="asyncKey"
            size="lg"
            :src="asyncSrc || undefined"
            :alt="t('example.doc.avatar.sample.loadingAsync')"
            :tooltip="t('example.doc.avatar.sample.loadingAsync')"
          />
          <span class="vp-avatar-size-label">{{ t('example.doc.avatar.sample.loadingAsync') }}</span>
        </div>
        <Button size="sm" variant="outlined" @click="replayAsyncLoad">
          {{ t(LocaleKeys.button.refresh) }}
        </Button>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.avatar.demo.state')"
      :description="t('example.doc.avatar.demo.stateDesc')"
      :code="codeState"
    >
      <div class="vp-avatar-row">
        <Avatar text="OK" :tooltip="t('example.doc.avatar.sample.normal')" />
        <Avatar disabled text="DN" :tooltip="t('example.doc.avatar.sample.disabled')" />
        <Avatar
          clickable
          text="GO"
          :tooltip="t('example.doc.avatar.sample.clicked', { count: clickCount })"
          @click="clickCount++"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.icon.demo.motion')"
      :description="t('example.doc.motion.demo.desc')"
      :code="codeMotionLive"
    >
      <MotionLivePanel v-model="motion">
        <template #preview>
          <Avatar text="AM" size="lg" v-bind="motionBind" />
          <Avatar icon="User" size="lg" v-bind="motionBind" />
          <Avatar text="VP" shape="square" size="lg" v-bind="motionBind" />
        </template>
      </MotionLivePanel>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.avatar.demo.group')"
      :description="t('example.doc.avatar.demo.groupDesc')"
      :code="codeGroup"
    >
      <div class="vp-avatar-stack">
        <AvatarGroup :max="3" size="md">
          <Avatar :src="imgA" :alt="t('example.doc.avatar.sample.userA')" />
          <Avatar :src="imgB" :alt="t('example.doc.avatar.sample.userB')" />
          <Avatar text="C" :alt="t('example.doc.avatar.sample.userC')" />
          <Avatar text="D" />
          <Avatar text="E" />
        </AvatarGroup>
        <AvatarGroup :max="4" size="sm">
          <Avatar icon="User" />
          <Avatar text="王" />
          <Avatar text="李" />
          <Avatar text="赵" />
          <Avatar text="陈" />
        </AvatarGroup>
      </div>
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

.vp-avatar-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
}

.vp-avatar-size-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--spacing-xl);
}

.vp-avatar-size-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.vp-avatar-size-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
  white-space: nowrap;
}

.vp-avatar-loading {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--spacing-xl);
}

.vp-avatar-stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  align-items: flex-start;
}
</style>
