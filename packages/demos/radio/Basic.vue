<script setup lang="ts">
import { ref } from 'vue'
import { Radio, RadioGroup } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'

const { t } = useLocale()
const val = ref('a')
</script>

<template>
  <RadioGroup v-model="val" name="amg-demo-radio-basic">
    <Radio value="a" :label="t('example.doc.radio.sample.optA')" />
    <Radio value="b" :label="t('example.doc.radio.sample.optB')" />
    <Radio value="c" :label="t('example.doc.radio.sample.optC')" disabled />
  </RadioGroup>
</template>
