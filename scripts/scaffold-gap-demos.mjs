/**
 * Scaffold curated demos for Gap Batch (P0–P2).
 * node scripts/scaffold-gap-demos.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const demos = join(root, 'example/demos')

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200"><rect width="320" height="200" fill="%23e8eaed"/><text x="160" y="105" text-anchor="middle" font-size="14" fill="%236b7280">AMG</text></svg>`
  )

function write(name, content) {
  const dir = join(demos, name)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.vue'), content, 'utf8')
  console.log('wrote', name)
}

write(
  'ConfigProvider',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { ConfigProvider, Button, Tag, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const size = ref<'sm' | 'md' | 'lg'>('lg')

const codeBasic = demoSfc({
  imports: [\`import { ConfigProvider, Button, Tag } from '@amg-webui/components/base'\`],
  template: [
    "  <ConfigProvider :button="{ size: 'lg' }" :tag="{ size: 'lg' }">",
    '    <Button label="Primary" />',
    '    <Tag label="Tag" />',
    '  </ConfigProvider>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'size', type: 'Size', defaultValue: '—', description: t('example.doc.configProvider.prop.size') },
  { name: 'zIndex', type: 'number', defaultValue: '—', description: t('example.doc.configProvider.prop.zIndex') },
  { name: 'button / tag / badge / avatar', type: 'GlobalConfig', defaultValue: '—', description: t('example.doc.configProvider.prop.nested') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.configProvider.when') }}</p>
    <DemoBlock
      :title="t('example.doc.configProvider.demo.basic')"
      :description="t('example.doc.configProvider.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space wrap>
        <Button
          v-for="s in (['sm', 'md', 'lg'] as const)"
          :key="s"
          size="sm"
          :variant="size === s ? 'solid' : 'outlined'"
          :label="s"
          @click="size = s"
        />
      </Space>
      <ConfigProvider class="vp-gap-demo" :button="{ size }" :tag="{ size }">
        <Space wrap>
          <Button :label="t('example.doc.configProvider.sample.btn')" />
          <Tag :label="t('example.doc.configProvider.sample.tag')" />
        </Space>
      </ConfigProvider>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-gap-demo {
  width: 100%;
  margin-top: var(--spacing-md);
  padding: var(--theme-card-pad);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
  box-sizing: border-box;
}
</style>
`
)

write(
  'MessageBox',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { MessageBox, Button, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const last = ref('')

async function openConfirm() {
  try {
    const r = await MessageBox.confirm(
      t('example.doc.messageBox.sample.body'),
      t('example.doc.messageBox.sample.title')
    )
    last.value = String(r)
  } catch {
    last.value = 'cancel'
  }
}

async function openAlert() {
  await MessageBox.alert(
    t('example.doc.messageBox.sample.alertBody'),
    t('example.doc.messageBox.sample.alertTitle')
  )
  last.value = 'confirm'
}

async function openPrompt() {
  try {
    const r = await MessageBox.prompt(
      t('example.doc.messageBox.sample.promptBody'),
      t('example.doc.messageBox.sample.promptTitle')
    )
    last.value = typeof r === 'object' && r && 'value' in r ? String((r as { value: string }).value) : String(r)
  } catch {
    last.value = 'cancel'
  }
}

const codeBasic = demoSfc({
  imports: [\`import { MessageBox, Button } from '@amg-webui/components/base'\`],
  template: ['  <Button @click="() => MessageBox.confirm(msg, title)" />']
})

const propRows = computed<PropRow[]>(() => [
  { name: 'MessageBox.confirm', type: '(msg, title?, opts?) => Promise', description: t('example.doc.messageBox.prop.confirm') },
  { name: 'MessageBox.alert', type: '(msg, title?, opts?) => Promise', description: t('example.doc.messageBox.prop.alert') },
  { name: 'MessageBox.prompt', type: '(msg, title?, opts?) => Promise', description: t('example.doc.messageBox.prop.prompt') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.messageBox.when') }}</p>
    <DemoBlock
      :title="t('example.doc.messageBox.demo.basic')"
      :description="t('example.doc.messageBox.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space wrap>
        <Button :label="t('example.doc.messageBox.sample.openConfirm')" @click="openConfirm" />
        <Button variant="outlined" :label="t('example.doc.messageBox.sample.openAlert')" @click="openAlert" />
        <Button variant="outlined" :label="t('example.doc.messageBox.sample.openPrompt')" @click="openPrompt" />
      </Space>
      <p v-if="last" class="vp-gap-hint">{{ t('example.doc.messageBox.sample.result') }}: {{ last }}</p>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-gap-hint {
  margin-top: var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}
</style>
`
)

write(
  'Affix',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { Affix, Tag } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const affixed = ref(false)

const codeBasic = demoSfc({
  imports: [\`import { Affix } from '@amg-webui/components/base'\`],
  template: [
    '  <div class="scroll" data-affix-demo>',
    '    <Affix target="[data-affix-demo]" :offset-top="8">…</Affix>',
    '  </div>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'offsetTop', type: 'number', defaultValue: '0', description: t('example.doc.affix.prop.offsetTop') },
  { name: 'target', type: 'string | HTMLElement | Window', defaultValue: 'window', description: t('example.doc.affix.prop.target') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.affix.when') }}</p>
    <DemoBlock
      :title="t('example.doc.affix.demo.basic')"
      :description="t('example.doc.affix.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-affix-stage" data-affix-demo>
        <Affix target="[data-affix-demo]" :offset-top="8" @change="affixed = $event">
          <Tag :label="affixed ? t('example.doc.affix.sample.fixed') : t('example.doc.affix.sample.static')" />
        </Affix>
        <p v-for="n in 18" :key="n" class="vp-affix-stage__line">
          {{ t('example.doc.affix.sample.hint') }} · {{ n }}
        </p>
      </div>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-affix-stage {
  position: relative;
  width: 100%;
  max-height: calc(var(--spacing-2xl) * 8);
  overflow: auto;
  padding: var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
  box-sizing: border-box;
}
.vp-affix-stage__line {
  margin: var(--spacing-sm) 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}
</style>
`
)

write(
  'PageHeader',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { PageHeader, Button, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const backLog = ref('')

const codeBasic = demoSfc({
  imports: [\`import { PageHeader, Button } from '@amg-webui/components/base'\`],
  template: [
    '  <PageHeader back :title="title" :subtitle="subtitle">',
    '    <template #extra><Button size="sm" /></template>',
    '  </PageHeader>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'title / subtitle', type: 'string', description: t('example.doc.pageHeader.prop.title') },
  { name: 'back', type: 'boolean', defaultValue: 'false', description: t('example.doc.pageHeader.prop.back') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.pageHeader.when') }}</p>
    <DemoBlock
      :title="t('example.doc.pageHeader.demo.basic')"
      :description="t('example.doc.pageHeader.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <PageHeader
        back
        :title="t('example.doc.pageHeader.sample.title')"
        :subtitle="t('example.doc.pageHeader.sample.subtitle')"
        @back="backLog = t('example.doc.pageHeader.sample.backFired')"
      >
        <template #extra>
          <Space>
            <Button size="sm" variant="outlined" :label="t('example.doc.pageHeader.sample.extra')" />
          </Space>
        </template>
        <p class="vp-gap-hint">{{ t('example.doc.pageHeader.sample.body') }}</p>
      </PageHeader>
      <p v-if="backLog" class="vp-gap-hint">{{ backLog }}</p>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-gap-hint {
  margin: var(--spacing-md) 0 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}
</style>
`
)

write(
  'Segmented',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { Segmented, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const value = ref('day')
const size = ref<'sm' | 'md' | 'lg'>('md')

const options = computed(() => [
  { label: t('example.doc.segmented.sample.day'), value: 'day' },
  { label: t('example.doc.segmented.sample.week'), value: 'week' },
  { label: t('example.doc.segmented.sample.month'), value: 'month' }
])

const codeBasic = demoSfc({
  imports: [\`import { Segmented } from '@amg-webui/components/base'\`],
  template: ['  <Segmented v-model="value" :options="options" />']
})

const propRows = computed<PropRow[]>(() => [
  { name: 'modelValue', type: 'string | number | boolean', description: t('example.doc.segmented.prop.modelValue') },
  { name: 'options', type: 'SegmentedOption[]', description: t('example.doc.segmented.prop.options') },
  { name: 'block', type: 'boolean', defaultValue: 'false', description: t('example.doc.segmented.prop.block') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.segmented.when') }}</p>
    <DemoBlock
      :title="t('example.doc.segmented.demo.basic')"
      :description="t('example.doc.segmented.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block>
        <Segmented v-model="value" :options="options" :size="size" />
        <Segmented v-model="value" :options="options" block />
        <p class="vp-gap-hint">{{ value }}</p>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-gap-hint { color: var(--text-secondary); font-size: var(--font-size-sm); }
</style>
`
)

write(
  'InputOTP',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { InputOTP, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const code = ref('')
const done = ref('')

const codeBasic = demoSfc({
  imports: [\`import { InputOTP } from '@amg-webui/components/base'\`],
  template: ['  <InputOTP v-model="code" :length="6" @complete="onComplete" />']
})

const propRows = computed<PropRow[]>(() => [
  { name: 'modelValue', type: 'string', description: t('example.doc.inputOTP.prop.modelValue') },
  { name: 'length', type: 'number', defaultValue: '6', description: t('example.doc.inputOTP.prop.length') },
  { name: 'mask', type: 'boolean', defaultValue: 'false', description: t('example.doc.inputOTP.prop.mask') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.inputOTP.when') }}</p>
    <DemoBlock
      :title="t('example.doc.inputOTP.demo.basic')"
      :description="t('example.doc.inputOTP.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block>
        <InputOTP v-model="code" :length="6" @complete="done = $event" />
        <InputOTP v-model="code" :length="6" mask />
        <p class="vp-gap-hint">
          {{ t('example.doc.inputOTP.sample.value') }}: {{ code || '—' }}
          <span v-if="done"> · {{ t('example.doc.inputOTP.sample.complete') }}</span>
        </p>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-gap-hint { color: var(--text-secondary); font-size: var(--font-size-sm); }
</style>
`
)

write(
  'TimeSelect',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { TimeSelect, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const time = ref<string | null>('09:00')

const codeBasic = demoSfc({
  imports: [\`import { TimeSelect } from '@amg-webui/components/base'\`],
  template: ['  <TimeSelect v-model="time" start="08:00" end="18:00" step="00:30" />']
})

const propRows = computed<PropRow[]>(() => [
  { name: 'modelValue', type: 'string | null', description: t('example.doc.timeSelect.prop.modelValue') },
  { name: 'start / end / step', type: 'string', defaultValue: '00:00 / 23:30 / 00:30', description: t('example.doc.timeSelect.prop.range') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.timeSelect.when') }}</p>
    <DemoBlock
      :title="t('example.doc.timeSelect.demo.basic')"
      :description="t('example.doc.timeSelect.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block>
        <TimeSelect v-model="time" start="08:00" end="18:00" step="00:30" />
        <p class="vp-gap-hint">{{ time || '—' }}</p>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-gap-hint { color: var(--text-secondary); font-size: var(--font-size-sm); }
</style>
`
)

write(
  'Mention',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { Mention, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const text = ref('')

const options = computed(() => [
  { label: 'Alice', value: 'alice' },
  { label: 'Bob', value: 'bob' },
  { label: 'Carol', value: 'carol' }
])

const codeBasic = demoSfc({
  imports: [\`import { Mention } from '@amg-webui/components/base'\`],
  template: ['  <Mention v-model="text" :options="options" />']
})

const propRows = computed<PropRow[]>(() => [
  { name: 'modelValue', type: 'string', description: t('example.doc.mention.prop.modelValue') },
  { name: 'options', type: 'MentionOption[]', description: t('example.doc.mention.prop.options') },
  { name: 'prefix', type: 'string', defaultValue: '@', description: t('example.doc.mention.prop.prefix') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.mention.when') }}</p>
    <DemoBlock
      :title="t('example.doc.mention.demo.basic')"
      :description="t('example.doc.mention.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block>
        <Mention v-model="text" :options="options" :rows="4" />
        <p class="vp-gap-hint">{{ text || t('example.doc.mention.sample.hint') }}</p>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-gap-hint { color: var(--text-secondary); font-size: var(--font-size-sm); }
</style>
`
)

write(
  'Image',
  `<script setup lang="ts">
import { computed } from 'vue'
import { Image, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const src = ${JSON.stringify(PLACEHOLDER)}

const codeBasic = demoSfc({
  imports: [\`import { Image } from '@amg-webui/components/base'\`],
  template: ['  <Image :src="src" fit="cover" preview />']
})

const propRows = computed<PropRow[]>(() => [
  { name: 'src', type: 'string', description: t('example.doc.image.prop.src') },
  { name: 'fit', type: 'fill|contain|cover|none|scale-down', defaultValue: 'cover', description: t('example.doc.image.prop.fit') },
  { name: 'preview', type: 'boolean', defaultValue: 'true', description: t('example.doc.image.prop.preview') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.image.when') }}</p>
    <DemoBlock
      :title="t('example.doc.image.demo.basic')"
      :description="t('example.doc.image.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space wrap>
        <Image :src="src" fit="cover" class="vp-img-demo" />
        <Image :src="src" fit="contain" class="vp-img-demo" />
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-img-demo {
  width: calc(var(--spacing-2xl) * 6);
  height: calc(var(--spacing-2xl) * 4);
}
</style>
`
)

write(
  'ImageViewer',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { ImageViewer, Button } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const visible = ref(false)
const urls = [
  ${JSON.stringify(PLACEHOLDER)},
  ${JSON.stringify(PLACEHOLDER)}
]

const codeBasic = demoSfc({
  imports: [\`import { ImageViewer, Button } from '@amg-webui/components/base'\`],
  template: [
    '  <Button @click="visible = true" />',
    '  <ImageViewer v-model:visible="visible" :url-list="urls" />'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'visible', type: 'boolean', description: t('example.doc.imageViewer.prop.visible') },
  { name: 'urlList', type: 'string[]', description: t('example.doc.imageViewer.prop.urlList') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.imageViewer.when') }}</p>
    <DemoBlock
      :title="t('example.doc.imageViewer.demo.basic')"
      :description="t('example.doc.imageViewer.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Button :label="t('example.doc.imageViewer.sample.open')" @click="visible = true" />
      <ImageViewer v-model:visible="visible" :url-list="urls" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
`
)

write(
  'Tour',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { Tour, Button, Space, Card } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const open = ref(false)
const current = ref(0)

const steps = computed(() => [
  { target: '[data-tour-a]', title: t('example.doc.tour.sample.s1Title'), description: t('example.doc.tour.sample.s1Desc') },
  { target: '[data-tour-b]', title: t('example.doc.tour.sample.s2Title'), description: t('example.doc.tour.sample.s2Desc'), placement: 'bottom' as const },
  { target: '[data-tour-c]', title: t('example.doc.tour.sample.s3Title'), description: t('example.doc.tour.sample.s3Desc') }
])

const codeBasic = demoSfc({
  imports: [\`import { Tour, Button } from '@amg-webui/components/base'\`],
  template: [
    '  <Button @click="open = true" />',
    '  <Tour v-model:open="open" v-model="current" :steps="steps" />'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'open', type: 'boolean', description: t('example.doc.tour.prop.open') },
  { name: 'steps', type: 'TourStep[]', description: t('example.doc.tour.prop.steps') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.tour.when') }}</p>
    <DemoBlock
      :title="t('example.doc.tour.demo.basic')"
      :description="t('example.doc.tour.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space wrap class="vp-tour-stage">
        <Button data-tour-a :label="t('example.doc.tour.sample.start')" @click="open = true; current = 0" />
        <Card data-tour-b class="vp-tour-card">{{ t('example.doc.tour.sample.card') }}</Card>
        <Button data-tour-c variant="outlined" :label="t('example.doc.tour.sample.action')" />
      </Space>
      <Tour v-model:open="open" v-model="current" :steps="steps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-tour-stage { width: 100%; min-height: calc(var(--spacing-2xl) * 4); }
.vp-tour-card { padding: var(--theme-card-pad); min-width: calc(var(--spacing-2xl) * 6); }
</style>
`
)

write(
  'InfiniteScroll',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { InfiniteScroll } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const items = ref(Array.from({ length: 12 }, (_, i) => i + 1))
const loading = ref(false)
const finished = ref(false)

function onLoad() {
  if (loading.value || finished.value) return
  loading.value = true
  window.setTimeout(() => {
    const start = items.value.length
    items.value.push(...Array.from({ length: 8 }, (_, i) => start + i + 1))
    loading.value = false
    if (items.value.length >= 40) finished.value = true
  }, 400)
}

const codeBasic = demoSfc({
  imports: [\`import { InfiniteScroll } from '@amg-webui/components/base'\`],
  template: [
    '  <InfiniteScroll :loading="loading" :finished="finished" @load="onLoad">',
    '    <div v-for="n in items" :key="n">{{ n }}</div>',
    '  </InfiniteScroll>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'loading / finished', type: 'boolean', description: t('example.doc.infiniteScroll.prop.loading') },
  { name: 'distance', type: 'number', defaultValue: '0', description: t('example.doc.infiniteScroll.prop.distance') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.infiniteScroll.when') }}</p>
    <DemoBlock
      :title="t('example.doc.infiniteScroll.demo.basic')"
      :description="t('example.doc.infiniteScroll.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <InfiniteScroll
        class="vp-inf-stage"
        :loading="loading"
        :finished="finished"
        @load="onLoad"
      >
        <p v-for="n in items" :key="n" class="vp-inf-line">
          {{ t('example.doc.infiniteScroll.sample.row') }} · {{ n }}
        </p>
      </InfiniteScroll>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-inf-stage {
  width: 100%;
  max-height: calc(var(--spacing-2xl) * 8);
  overflow: auto;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
  box-sizing: border-box;
}
.vp-inf-line {
  margin: 0;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--ds-border);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}
</style>
`
)

console.log('[scaffold-gap-demos] done')
