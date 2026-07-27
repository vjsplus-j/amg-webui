<script setup lang="ts">
/**
 * Curated demo gold standard — code-example structure template.
 * Other play demos should mirror this layout (see `demoCode.ts` header).
 */
import { computed, onMounted, ref } from 'vue'
import { Avatar, AvatarGroup, Button, Icon } from '@amg-webui/components/base'
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
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'

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
const lastEvent = ref('')
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
  asyncSrc.value = `https://picsum.photos/seed/vp-avatar-${asyncKey.value}/128/128`
}

function noteEvent(kind: string) {
  lastEvent.value = kind
}

onMounted(() => {
  replayAsyncLoad()
})

/* ─── Code snippets: must mirror preview 1:1 (no `…`) ─── */

const codeBasic = demoSfc({
  imports: [`import { Avatar } from '@amg-webui/components/base'`],
  template: [
    '  <!-- image -->',
    `  <Avatar`,
    `    src="${imgA}"`,
    `    :alt="t('example.doc.avatar.sample.photo')"`,
    `  />`,
    `  <!-- letter (CJK / Latin) -->`,
    `  <Avatar :text="t('example.doc.avatar.sample.nameZh')" />`,
    `  <Avatar text="JD" />`,
    `  <!-- icon -->`,
    `  <Avatar icon="User" :alt="t('example.doc.avatar.sample.icon')" />`
  ]
})

const codeSize = demoCode(
  `<!-- token sizes xs → xl -->`,
  `<Avatar size="xs" src="${imgA}" />`,
  `<Avatar size="sm" src="${imgA}" />`,
  `<Avatar size="md" src="${imgA}" />`,
  `<Avatar size="lg" src="${imgA}" />`,
  `<Avatar size="xl" src="${imgA}" />`,
  ``,
  `<!-- custom px -->`,
  `<Avatar :size="48" text="48" />`
)

const codeShape = demoCode(
  `<Avatar shape="circle" text="C" />`,
  `<Avatar shape="square" text="S" />`,
  `<Avatar`,
  `  border-radius="var(--border-radius-lg)"`,
  `  text="R"`,
  `  color-bg="var(--surface-2)"`,
  `  color-text="var(--primary-500)"`,
  `/>`
)

const codeBorder = demoCode(
  `<Avatar bordered text="B" />`,
  `<Avatar :bordered="false" text="N" />`,
  `<Avatar border-color="var(--primary-500)" text="P" />`
)

const codeNeon = demoCode(
  `<Avatar variant="neon" text="N" border-color="var(--primary-500)" />`,
  `<Avatar variant="neon" text="S" border-color="var(--success-500)" />`,
  `<Avatar variant="neon" text="W" border-color="var(--warning-500)" />`,
  `<Avatar variant="neon" text="D" border-color="var(--danger-500)" />`
)

const codeTooltip = demoCode(
  `<Avatar`,
  `  src="${imgB}"`,
  `  :alt="t('example.doc.avatar.sample.userA')"`,
  `  :tooltip="t('example.doc.avatar.sample.userA')"`,
  `/>`,
  `<Avatar`,
  `  :text="t('example.doc.avatar.sample.nameZh')"`,
  `  :tooltip="t('example.doc.avatar.sample.tooltipRole')"`,
  `  :tooltip-delay="200"`,
  `/>`
)

const codeFallback = demoCode(
  `<!-- letter fallback -->`,
  `<Avatar`,
  `  src="${imgBroken}"`,
  `  fallback-text="FB"`,
  `/>`,
  ``,
  `<!-- icon fallback -->`,
  `<Avatar`,
  `  src="${imgBroken}"`,
  `  fallback-icon="User"`,
  `/>`,
  ``,
  `<!-- secondary image -->`,
  `<Avatar`,
  `  src="${imgBroken}"`,
  `  fallback-src="${imgC}"`,
  `/>`
)

const codeLoading = demoCode(
  `<!-- sync: controlled skeleton -->`,
  `<Avatar loading size="lg" />`,
  ``,
  `<!-- async: skeleton while image loads -->`,
  `<Avatar size="lg" :src="asyncSrc" />`
)

const codeState = demoCode(
  `<Avatar text="OK" />`,
  `<Avatar disabled text="DN" />`,
  `<Avatar`,
  `  clickable`,
  `  text="GO"`,
  `  :tooltip="t('example.doc.avatar.sample.clicked', { count })"`,
  `  @click="count++"`,
  `/>`
)

const codeSlots = demoCode(
  `<!-- #icon overrides default User glyph -->`,
  `<Avatar size="lg">`,
  `  <template #icon>`,
  `    <Icon name="Star" />`,
  `  </template>`,
  `</Avatar>`,
  ``,
  `<!-- default slot when no src / text -->`,
  `<Avatar size="lg" :alt="t('example.doc.avatar.sample.slotDefault')">`,
  `  <span class="vp-avatar-demo-custom">VP</span>`,
  `</Avatar>`
)

const codeEvents = demoCode(
  `<Avatar`,
  `  src="${imgA}"`,
  `  @load="onLoad"`,
  `  @error="onError"`,
  `/>`,
  `<Avatar`,
  `  src="${imgBroken}"`,
  `  fallback-text="FB"`,
  `  @error="onError"`,
  `/>`,
  `<Avatar clickable text="GO" @click="onClick" />`
)

const codeGroup = demoCode(
  `<AvatarGroup :max="3" size="md">`,
  `  <Avatar src="${imgA}" :alt="t('example.doc.avatar.sample.userA')" />`,
  `  <Avatar src="${imgB}" :alt="t('example.doc.avatar.sample.userB')" />`,
  `  <Avatar text="C" :alt="t('example.doc.avatar.sample.userC')" />`,
  `  <Avatar text="D" />`,
  `  <Avatar text="E" />`,
  `</AvatarGroup>`,
  ``,
  `<AvatarGroup :max="4" size="sm">`,
  `  <Avatar icon="User" />`,
  `  <Avatar text="王" />`,
  `  <Avatar text="李" />`,
  `  <Avatar text="赵" />`,
  `  <Avatar text="陈" />`,
  `</AvatarGroup>`
)

/* ─── API tables ─── */

const propRows = computed<PropRow[]>(() => [
  {
    name: 'src',
    description: t('example.doc.avatar.prop.src'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'alt',
    description: t('example.doc.avatar.prop.alt'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'text',
    description: t('example.doc.avatar.prop.text'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'textMaxLength',
    description: t('example.doc.avatar.prop.textMaxLength'),
    type: 'number',
    defaultValue: '2'
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
    name: 'shape',
    description: t('example.doc.avatar.prop.shape'),
    type: "'circle' | 'square'",
    defaultValue: "'circle'"
  },
  {
    name: 'borderRadius',
    description: t('example.doc.avatar.prop.borderRadius'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'bordered / borderColor / borderWidth',
    description: t('example.doc.avatar.prop.border'),
    type: 'boolean / string',
    defaultValue: 'true / - / 1px'
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
    name: 'spin / pulse / heartbeat / bounce / …',
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
    name: 'trackId / telemetry',
    description: t('example.doc.avatar.prop.telemetry'),
    type: 'string / boolean',
    defaultValue: '- / undefined'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'load',
    description: t('example.doc.avatar.emit.load'),
    type: '(event: Event) => void',
    defaultValue: '-'
  },
  {
    name: 'error',
    description: t('example.doc.avatar.emit.error'),
    type: '(event: Event) => void',
    defaultValue: '-'
  },
  {
    name: 'click',
    description: t('example.doc.avatar.emit.click'),
    type: '(event: MouseEvent) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.avatar.slot.default'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'icon',
    description: t('example.doc.avatar.slot.icon'),
    type: 'VNode',
    defaultValue: '<Icon name="User" />'
  }
])
</script>

<template>
  <div class="vp-curated">
    <!-- 1. Basic — pasteable SFC, default-open -->
    <DemoBlock
      :title="t('example.doc.avatar.demo.basic')"
      :description="t('example.doc.avatar.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-avatar-row">
        <Avatar :src="imgA" :alt="t('example.doc.avatar.sample.photo')" />
        <Avatar :text="t('example.doc.avatar.sample.nameZh')" />
        <Avatar text="JD" />
        <Avatar icon="User" :alt="t('example.doc.avatar.sample.icon')" />
      </div>
    </DemoBlock>

    <!-- 2. Feature blocks -->
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
        <div class="vp-avatar-size-item">
          <Avatar
            :size="48"
            text="48"
            :alt="t('example.doc.avatar.sample.sizeCustom')"
            :tooltip="t('example.doc.avatar.sample.sizeCustom')"
          />
          <span class="vp-avatar-size-label">{{ t('example.doc.avatar.sample.sizeCustom') }}</span>
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
          :tooltip-delay="200"
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

    <!-- 3. Slots -->
    <DemoBlock
      :title="t('example.doc.avatar.demo.slots')"
      :description="t('example.doc.avatar.demo.slotsDesc')"
      :code="codeSlots"
    >
      <div class="vp-avatar-row">
        <Avatar size="lg" :alt="t('example.doc.avatar.sample.slotIcon')">
          <template #icon>
            <Icon name="Star" />
          </template>
        </Avatar>
        <Avatar size="lg" :alt="t('example.doc.avatar.sample.slotDefault')">
          <span class="vp-avatar-demo-custom">VP</span>
        </Avatar>
      </div>
    </DemoBlock>

    <!-- 4. Events -->
    <DemoBlock
      :title="t('example.doc.avatar.demo.events')"
      :description="t('example.doc.avatar.demo.eventsDesc')"
      :code="codeEvents"
    >
      <div class="vp-avatar-events">
        <div class="vp-avatar-row">
          <Avatar
            :src="imgA"
            :alt="t('example.doc.avatar.sample.photo')"
            @load="noteEvent('load')"
            @error="noteEvent('error')"
          />
          <Avatar
            :src="imgBroken"
            fallback-text="FB"
            :alt="t('example.doc.avatar.sample.fallbackLetter')"
            @error="noteEvent('error')"
          />
          <Avatar
            clickable
            text="GO"
            :tooltip="t('example.doc.avatar.sample.clickable')"
            @click="
              clickCount++;
              noteEvent('click')
            "
          />
        </div>
        <p class="vp-avatar-events__log">
          {{
            t('example.doc.avatar.sample.eventLog', {
              event: lastEvent || t('example.doc.avatar.sample.eventIdle')
            })
          }}
        </p>
      </div>
    </DemoBlock>

    <!-- 5. Motion -->
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

    <!-- 6. Related teaser (full page: AvatarGroup) -->
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

    <!-- 7. API: Props → Events → Slots -->
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

.vp-avatar-events {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-avatar-events__log {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.vp-avatar-demo-custom {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-heading, 600);
  color: var(--primary-500);
  line-height: 1;
}
</style>
