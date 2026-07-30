<script setup lang="ts">
import TopNav from '../TopNav/index.vue'
import './style.scss'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <TopNav v-bind="$attrs" direction="horizontal" class="vp-quick-nav" />
</template>
