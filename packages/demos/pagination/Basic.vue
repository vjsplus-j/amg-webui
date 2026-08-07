<script setup lang="ts">
import { ref } from 'vue'
import { Pagination } from '@amg-webui/data'

const page = ref(1)
const pageSize = ref(10)
const total = 128
</script>

<template>
  <Pagination
    :total="total"
    v-model:page="page"
    v-model:page-size="pageSize"
  />
</template>
