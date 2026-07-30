<script setup lang="ts">
import { computed, ref } from 'vue'
import { Footer, Button, Space, Link } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const align = ref<'start' | 'center' | 'end'>('center')
const size = ref<'sm' | 'md' | 'lg'>('md')
const bordered = ref(true)

const codeAlign = demoSfc({
  imports: [`import { Footer } from '@amg-webui/components/base'`],
  template: [
    '  <Footer align="center" size="md" bordered>',
    `    <p>{{ t('example.doc.footer.sample.legal') }}</p>`,
    '  </Footer>'
  ]
})

const codeRich = demoSfc({
  imports: [`import { Footer, Link, Space } from '@amg-webui/components/base'`],
  template: [
    '  <Footer align="start" size="lg">',
    '    <Space wrap>',
    '      <Link href="#">…</Link>',
    '    </Space>',
    `    <p>{{ t('example.doc.footer.sample.legal') }}</p>`,
    '  </Footer>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'align', type: "'start'|'center'|'end'", defaultValue: "'center'", description: t('example.doc.footer.prop.align') },
  { name: 'size', type: "'sm'|'md'|'lg'", defaultValue: "'md'", description: t('example.doc.footer.prop.size') },
  { name: 'bordered', type: 'boolean', defaultValue: 'true', description: t('example.doc.footer.prop.bordered') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.footer.when') }}</p>

    <DemoBlock
      :title="t('example.doc.footer.demo.align')"
      :description="t('example.doc.footer.demo.alignDesc')"
      :code="codeAlign"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button
            v-for="a in (['start', 'center', 'end'] as const)"
            :key="a"
            size="sm"
            :variant="align === a ? 'solid' : 'outlined'"
            @click="align = a"
          >
            {{ a }}
          </Button>
          <Button
            v-for="s in (['sm', 'md', 'lg'] as const)"
            :key="s"
            size="sm"
            :variant="size === s ? 'solid' : 'outlined'"
            @click="size = s"
          >
            {{ s }}
          </Button>
          <Button
            size="sm"
            :variant="bordered ? 'solid' : 'outlined'"
            @click="bordered = !bordered"
          >
            bordered
          </Button>
        </Space>
        <div class="footer-stage">
          <div class="footer-stage__page">
            <p class="footer-stage__hint">{{ t('example.doc.footer.sample.pageHint') }}</p>
          </div>
          <Footer :align="align" :size="size" :bordered="bordered">
            {{ t('example.doc.footer.sample.legal') }}
          </Footer>
        </div>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.footer.demo.rich')"
      :description="t('example.doc.footer.demo.richDesc')"
      :code="codeRich"
    >
      <div class="footer-stage footer-stage--tall">
        <div class="footer-stage__page">
          <p class="footer-stage__hint">{{ t('example.doc.footer.sample.pageHint') }}</p>
        </div>
        <Footer align="start" size="lg" bordered>
          <div class="footer-rich">
            <Space wrap class="footer-rich__links">
              <Link href="#docs">{{ t('example.doc.footer.sample.linkDocs') }}</Link>
              <Link href="#privacy">{{ t('example.doc.footer.sample.linkPrivacy') }}</Link>
              <Link href="#status">{{ t('example.doc.footer.sample.linkStatus') }}</Link>
            </Space>
            <p class="footer-rich__legal">{{ t('example.doc.footer.sample.legal') }}</p>
          </div>
        </Footer>
      </div>
    </DemoBlock>

    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.footer-stage {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: calc(var(--spacing-2xl) * 7);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  overflow: hidden;
  background: var(--surface-0);
  box-sizing: border-box;
}

.footer-stage--tall {
  min-height: calc(var(--spacing-2xl) * 9);
}

.footer-stage__page {
  flex: 1;
  padding: var(--theme-page-pad);
}

.footer-stage__hint {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}

.footer-rich {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  width: 100%;
}

.footer-rich__legal {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-body);
}
</style>
