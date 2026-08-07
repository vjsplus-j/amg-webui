<script setup lang="ts">
import { computed } from 'vue'
import { Breadcrumb, BreadcrumbItem } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const codeBasic = demoSfc({
  imports: [`import { Breadcrumb, BreadcrumbItem } from '@amg-webui/core'`],
  template: [
    `  <Breadcrumb>`,
    `    <BreadcrumbItem href="#">{{ t('example.doc.breadcrumb.sample.home') }}</BreadcrumbItem>`,
    `    <BreadcrumbItem href="#">{{ t('example.doc.breadcrumb.sample.list') }}</BreadcrumbItem>`,
    `    <BreadcrumbItem current>{{ t('example.doc.breadcrumb.sample.detail') }}</BreadcrumbItem>`,
    `  </Breadcrumb>`
  ]
})

const demoTitle = computed(() => t(LocaleKeys.exampleDoc.basicMount))
const demoDesc = computed(() => t(LocaleKeys.exampleDoc.basicMountDesc))
</script>

<template>
  <div class="vp-curated">
    <DemoBlock :title="demoTitle" :description="demoDesc" :code="codeBasic" default-open>
      <Breadcrumb>
        <BreadcrumbItem href="#">{{ t('example.doc.breadcrumb.sample.home') }}</BreadcrumbItem>
        <BreadcrumbItem href="#">{{ t('example.doc.breadcrumb.sample.list') }}</BreadcrumbItem>
        <BreadcrumbItem current>{{ t('example.doc.breadcrumb.sample.detail') }}</BreadcrumbItem>
      </Breadcrumb>
    </DemoBlock>
  </div>
</template>
