<script setup lang="ts">
import { ref } from 'vue'
import { RichText } from '@amg-webui/editor'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const html = ref('<p><strong>AMG</strong> RichText</p>')

const codeBasic = demoSfc({
  imports: [`import { ref } from 'vue'`, `import { RichText } from '@amg-webui/editor'`],
  script: [`const html = ref('<p><strong>AMG</strong> RichText</p>')`],
  template: [`  <RichText v-model="html" />`]
})

const propRows: PropRow[] = [
  {
    name: 'modelValue',
    type: 'string',
    description: t('example.doc.richText.prop.base')
  },
  {
    name: 'sanitize / sanitizeOptions',
    type: 'boolean / SanitizeHtmlOptions',
    description: t('example.doc.richText.prop.sanitize')
  },
  {
    name: 'placeholder / disabled / historyLimit',
    type: 'editor props',
    description: t('example.doc.richText.prop.base')
  }
]
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.richText.when') }}</p>
    <DemoBlock
      :title="t('example.doc.richText.demo.basic')"
      :description="t('example.doc.richText.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <RichText v-model="html" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
