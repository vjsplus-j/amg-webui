<script setup lang="ts">
import { ref } from 'vue'
import { Upload } from '@amg-webui/form'
import type { UploadFile } from '@amg-webui/form/Upload/types'

const files = ref<UploadFile[]>([])
</script>

<template>
  <Upload v-model="files" drag multiple />
</template>
