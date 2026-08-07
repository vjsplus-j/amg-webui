<script setup lang="ts">
import { ref } from 'vue'
import { ScaleLayout, Button, Space, Tag, Card, Statistic } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { ScaleLayoutFit } from '@amg-webui/core/ScaleLayout'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const scale = ref(1)
const fit = ref<ScaleLayoutFit>('contain')

const codeFit = demoSfc({
  imports: [`import { ScaleLayout } from '@amg-webui/core'`],
  template: [
    '  <div class="stage">',
    '    <ScaleLayout :width="1280" :height="720" fit="contain" fill>',
    '      <div class="board">…design canvas…</div>',
    '    </ScaleLayout>',
    '  </div>'
  ]
})

const codeManual = demoSfc({
  imports: [`import { ScaleLayout } from '@amg-webui/core'`],
  template: [
    '  <div class="stage">',
    '    <ScaleLayout :scale="0.85" fill>',
    '      <div class="board board--fluid">…</div>',
    '    </ScaleLayout>',
    '  </div>'
  ]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.scaleLayout.when') }}</p>

    <DemoBlock
      :title="t('example.doc.scaleLayout.demo.fit')"
      :description="t('example.doc.scaleLayout.demo.fitDesc')"
      :code="codeFit"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button
            v-for="f in (['contain', 'cover', 'width', 'height'] as const)"
            :key="f"
            size="sm"
            :variant="fit === f ? 'solid' : 'outlined'"
            @click="fit = f"
          >
            {{ f }}
          </Button>
        </Space>
        <div class="stage">
          <ScaleLayout :width="1280" :height="720" :fit="fit" fill>
            <div class="board">
              <header class="board__bar">
                <span class="board__title">{{ t('example.doc.scaleLayout.sample.boardTitle') }}</span>
                <Tag severity="primary">1280×720</Tag>
              </header>
              <div class="board__grid">
                <Card class="board__card">
                  <Statistic :value="1280" :title="t('example.doc.scaleLayout.sample.statW')" />
                </Card>
                <Card class="board__card">
                  <Statistic :value="720" :title="t('example.doc.scaleLayout.sample.statH')" />
                </Card>
                <Card class="board__card board__card--wide">
                  <p class="board__note">{{ t('example.doc.scaleLayout.sample.boardNote') }}</p>
                </Card>
              </div>
            </div>
          </ScaleLayout>
        </div>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.scaleLayout.demo.manual')"
      :description="t('example.doc.scaleLayout.demo.manualDesc')"
      :code="codeManual"
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button size="sm" variant="outlined" @click="scale = Math.max(0.5, +(scale - 0.1).toFixed(2))">
            −
          </Button>
          <Button size="sm" variant="outlined" @click="scale = Math.min(1.5, +(scale + 0.1).toFixed(2))">
            +
          </Button>
          <Button size="sm" variant="outlined" @click="scale = 1">100%</Button>
          <Tag severity="info">{{ t('example.doc.scaleLayout.sample.scale', { n: scale }) }}</Tag>
        </Space>
        <div class="stage">
          <ScaleLayout :scale="scale" fit="manual" fill>
            <div class="board board--fluid">
              <p class="board__note">{{ t('example.doc.scaleLayout.sample.body') }}</p>
              <div class="board__grid board__grid--fluid">
                <div v-for="n in 6" :key="n" class="tile">
                  {{ t('example.doc.scaleLayout.sample.tile', { n }) }}
                </div>
              </div>
            </div>
          </ScaleLayout>
        </div>
      </Space>
    </DemoBlock>
</div>
</template>

<style scoped>
.stage {
  width: 100%;
  height: calc(var(--spacing-2xl) * 12);
  min-width: 0;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  overflow: hidden;
  background: var(--surface-0);
  box-sizing: border-box;
}

.board {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
  width: 100%;
  height: 100%;
  padding: var(--theme-page-pad);
  box-sizing: border-box;
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
}

.board--fluid {
  min-height: 100%;
}

.board__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.board__title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading);
  color: var(--text-primary);
}

.board__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-md);
  flex: 1;
  min-height: 0;
}

.board__grid--fluid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.board__card--wide {
  grid-column: 1 / -1;
}

.board__note {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}

.tile {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(var(--spacing-2xl) * 2);
  padding: var(--spacing-md);
  background: var(--surface-2);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  box-sizing: border-box;
}
</style>
