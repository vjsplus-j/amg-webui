<script setup lang="ts">
/**
 * Curated demo — Display wave2 Countdown
 */
import { ref } from 'vue'
import { Countdown, Button, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const target = ref(Date.now() + 90_000)
const finished = ref(false)

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Countdown } from '@amg-webui/core'`
  ],
  script: [`const target = ref(Date.now() + 90_000)`],
  template: [`  <Countdown :value="target" @finish="onFinish" />`]
})

const codeFormat = demoCode(
  `<Countdown :value="target" format="mm:ss" />`,
  `<Button size="sm" @click="reset">{{ t('example.doc.countdown.demo.reset') }}</Button>`
)

function onFinish() {
  finished.value = true
}

function reset() {
  finished.value = false
  target.value = Date.now() + 90_000
}

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.countdown.demo.basic')"
      :description="t('example.doc.countdown.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="sm">
        <Countdown :value="target" @finish="onFinish" />
        <p v-if="finished" class="vp-countdown-demo__hint">
          {{ t('example.doc.countdown.sample.finished') }}
        </p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.countdown.demo.format')"
      :description="t('example.doc.countdown.demo.formatDesc')"
      :code="codeFormat"
    >
      <Space align="center">
        <Countdown :value="target" format="mm:ss" />
        <Button size="sm" variant="outlined" @click="reset">
          {{ t('example.doc.countdown.demo.reset') }}
        </Button>
      </Space>
    </DemoBlock>
  </div>
</template>

<style scoped lang="scss">
.vp-countdown-demo__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
