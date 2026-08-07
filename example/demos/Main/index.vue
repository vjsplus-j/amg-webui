<script setup lang="ts">
import { ref } from 'vue'
import { Main, Button, Space, Tag, Card } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const padded = ref(true)
const overflow = ref<'auto' | 'hidden' | 'visible'>('auto')
const scrollTop = ref(0)

function onScroll(e: Event) {
  const el = e.target as HTMLElement
  scrollTop.value = Math.round(el.scrollTop)
}

const codePad = demoSfc({
  imports: [`import { Main } from '@amg-webui/core'`],
  template: [
    '  <div class="main-host">',
    '    <Main :padded="padded" overflow="auto" @scroll="onScroll">',
    '      …',
    '    </Main>',
    '  </div>'
  ]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.main.when') }}</p>

    <DemoBlock
      :title="t('example.doc.main.demo.scroll')"
      :description="t('example.doc.main.demo.scrollDesc')"
      :code="codePad"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button
            size="sm"
            :variant="padded ? 'solid' : 'outlined'"
            @click="padded = !padded"
          >
            padded: {{ padded }}
          </Button>
          <Button
            v-for="o in (['auto', 'hidden', 'visible'] as const)"
            :key="o"
            size="sm"
            :variant="overflow === o ? 'solid' : 'outlined'"
            @click="overflow = o"
          >
            {{ o }}
          </Button>
          <Tag severity="info">{{ t('example.doc.main.sample.scrollY', { n: scrollTop }) }}</Tag>
        </Space>
        <div class="main-host">
          <div class="main-host__chrome">{{ t('example.doc.main.sample.chrome') }}</div>
          <Main
            :padded="padded"
            :overflow="overflow"
            :label="t('example.doc.main.sample.label')"
            class="main-host__main"
            @scroll="onScroll"
          >
            <Space direction="vertical" block size="md">
              <Card>
                <p class="lead">{{ t('example.doc.main.sample.card') }}</p>
              </Card>
              <p v-for="n in 10" :key="n" class="line">
                {{ t('example.doc.main.sample.line', { n }) }}
              </p>
            </Space>
          </Main>
        </div>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.main.demo.flush')"
      :description="t('example.doc.main.demo.flushDesc')"
      :code="codePad"
    >
      <div class="main-host main-host--flush-demo">
        <Main :padded="false" overflow="auto" class="main-host__main">
          <div class="bleed">
            <p class="bleed__title">{{ t('example.doc.main.sample.bleedTitle') }}</p>
            <p class="bleed__body">{{ t('example.doc.main.sample.bleedBody') }}</p>
          </div>
          <div class="inset">
            <p class="line">{{ t('example.doc.main.sample.flushNote') }}</p>
          </div>
        </Main>
      </div>
    </DemoBlock>
</div>
</template>

<style scoped>
.main-host {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(var(--spacing-2xl) * 11);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  overflow: hidden;
  background: var(--surface-1);
  box-sizing: border-box;
}

.main-host--flush-demo {
  height: calc(var(--spacing-2xl) * 9);
}

.main-host__chrome {
  flex-shrink: 0;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--ds-border);
  background: var(--surface-2);
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
}

.main-host__main {
  flex: 1;
  min-height: 0;
  background: var(--surface-0);
}

.lead {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading);
  line-height: var(--line-height-body);
}

.line {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}

.bleed {
  padding: var(--spacing-xl) var(--theme-page-pad);
  background: color-mix(in srgb, var(--ds-accent) 12%, var(--surface-2));
  border-bottom: 1px solid var(--ds-border);
}

.bleed__title {
  margin: 0 0 var(--spacing-sm);
  color: var(--text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-heading);
}

.bleed__body {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}

.inset {
  padding: var(--theme-page-pad);
}
</style>
