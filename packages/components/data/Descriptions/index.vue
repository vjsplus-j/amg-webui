<script setup lang="ts">

import { provide, computed, toRef } from 'vue'

import { DESCRIPTIONS_INJECTION_KEY } from './types'

import './style.scss'



const props = withDefaults(

  defineProps<{

    title?: string

    column?: number

    bordered?: boolean

    size?: 'sm' | 'md' | 'lg'

    labelWidth?: string | number

    class?: string

    style?: Record<string, string>

  }>(),

  {

    column: 3,

    bordered: false,

    size: 'md'

  }

)



provide(DESCRIPTIONS_INJECTION_KEY, {

  column: toRef(props, 'column'),

  bordered: toRef(props, 'bordered'),

  size: toRef(props, 'size'),

  labelWidth: toRef(props, 'labelWidth')

})



const bodyStyle = computed(() => ({

  gridTemplateColumns: `repeat(${props.column}, minmax(0, 1fr))`

}))



const rootClass = computed(() => [

  'vp-descriptions',

  `vp-descriptions--size-${props.size}`,

  { 'vp-descriptions--bordered': props.bordered },

  props.class

])



const titleId = computed(() => (props.title ? 'vp-descriptions-title' : undefined))


</script>



<template>

  <section

    :class="rootClass"

    :style="style"

    data-component="Descriptions"

    role="region"

    :aria-labelledby="titleId">

    <div v-if="title || $slots.title" :id="titleId" class="vp-descriptions__title">

      <slot name="title">{{ title }}</slot>

    </div>

    <div class="vp-descriptions__body" :style="bodyStyle">

      <slot />

    </div>

  </section>

</template>

