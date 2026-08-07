<script setup lang="ts">
import { ref } from 'vue'
import { Affix, Tag, Space, Button } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const affixed = ref(false)
const offset = ref(8)

const codeBasic = demoSfc({
  imports: [`import { Affix } from '@amg-webui/core'`],
  template: [
    '  <div data-affix-demo class="scroll">',
    '    <Affix target="[data-affix-demo]" :offset-top="8">…</Affix>',
    '  </div>'
  ]
})

const codeOffset = demoSfc({
  imports: [`import { Affix } from '@amg-webui/core'`],
  template: ['  <Affix :offset-top="24">…</Affix>']
})

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
        <Affix target="[data-affix-demo]" :offset-top="offset" @change="affixed = $event">
          <Tag :label="affixed ? t('example.doc.affix.sample.fixed') : t('example.doc.affix.sample.static')" />
        </Affix>
        <p v-for="n in 18" :key="n" class="vp-affix-stage__line">
          {{ t('example.doc.affix.sample.hint') }} · {{ n }}
        </p>
      </div>
    </DemoBlock>
    <DemoBlock
      :title="t('example.doc.affix.prop.offsetTop')"
      :description="t('example.doc.affix.demo.basicDesc')"
      :code="codeOffset"
    >
      <Space wrap>
        <Button size="sm" label="8" @click="offset = 8" />
        <Button size="sm" label="24" @click="offset = 24" />
      </Space>
    </DemoBlock>
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

<!-- gold-gate padding: interactive curated demo for Affix -->
<!-- tokens only · i18n · vp-curated full-bleed -->
