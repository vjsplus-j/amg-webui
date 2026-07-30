<script setup lang="ts">
import TopNav from '../TopNav/index.vue'
import './style.scss'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <TopNav v-bind="$attrs" direction="vertical" class="vp-mini-nav" />
</template>
