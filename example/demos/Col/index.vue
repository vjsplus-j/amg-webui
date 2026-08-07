<script setup lang="ts">
/**
 * Curated demo — Layout wave1 Col (with Row)
 */
import {  } from 'vue'
import { Row, Col } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const codeGrid = demoSfc({
  imports: [`import { Row, Col } from '@amg-webui/core'`],
  template: [
    '  <Row gutter="var(--spacing-md)">',
    '    <Col :span="8"><div>8</div></Col>',
    '    <Col :span="8"><div>8</div></Col>',
    '    <Col :span="8"><div>8</div></Col>',
    '  </Row>'
  ]
})

const codeMixed = demoCode(
  `<Row gutter="var(--spacing-md)">`,
  `  <Col :span="16">…</Col>`,
  `  <Col :span="8">…</Col>`,
  `</Row>`,
  `<Row gutter="var(--spacing-md)">`,
  `  <Col :span="6">…</Col>`,
  `  <Col :span="6">…</Col>`,
  `  <Col :span="12">…</Col>`,
  `</Row>`
)

const codeOffset = demoCode(
  `<Row gutter="var(--spacing-md)">`,
  `  <Col :span="12" :offset="6">centered</Col>`,
  `</Row>`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.col.demo.grid')"
      :description="t('example.doc.col.demo.gridDesc')"
      :code="codeGrid"
      default-open
    >
      <div class="stack">
        <Row gutter="var(--spacing-md)">
          <Col :span="8">
            <div class="tile">{{ t('example.doc.col.sample.col', { n: 8 }) }}</div>
          </Col>
          <Col :span="8">
            <div class="tile">{{ t('example.doc.col.sample.col', { n: 8 }) }}</div>
          </Col>
          <Col :span="8">
            <div class="tile">{{ t('example.doc.col.sample.col', { n: 8 }) }}</div>
          </Col>
        </Row>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.col.demo.span')"
      :description="t('example.doc.col.demo.spanDesc')"
      :code="codeMixed"
    >
      <div class="stack">
        <Row gutter="var(--spacing-md)">
          <Col :span="16">
            <div class="tile tile--accent">{{ t('example.doc.col.sample.col', { n: 16 }) }}</div>
          </Col>
          <Col :span="8">
            <div class="tile">{{ t('example.doc.col.sample.col', { n: 8 }) }}</div>
          </Col>
        </Row>
        <Row gutter="var(--spacing-md)">
          <Col :span="6">
            <div class="tile">{{ t('example.doc.col.sample.col', { n: 6 }) }}</div>
          </Col>
          <Col :span="6">
            <div class="tile">{{ t('example.doc.col.sample.col', { n: 6 }) }}</div>
          </Col>
          <Col :span="12">
            <div class="tile tile--accent">{{ t('example.doc.col.sample.col', { n: 12 }) }}</div>
          </Col>
        </Row>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.col.demo.offset')"
      :description="t('example.doc.col.demo.offsetDesc')"
      :code="codeOffset"
    >
      <Row gutter="var(--spacing-md)">
        <Col :span="12" :offset="6">
          <div class="tile tile--accent">
            {{ t('example.doc.col.sample.offset', { span: 12, offset: 6 }) }}
          </div>
        </Col>
      </Row>
    </DemoBlock>
  </div>
</template>

<style scoped lang="scss">
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  min-width: 0;
}

.tile {
  padding: var(--theme-card-pad);
  background: var(--surface-2);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  text-align: center;
  box-sizing: border-box;
  min-height: calc(var(--spacing-2xl) * 2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tile--accent {
  border-color: var(--ds-accent);
  color: var(--text-primary);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
