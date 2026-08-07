<script setup lang="ts">
import { ConfigProvider, Button, Space } from 'amg-webui/core'
</script>

<template>
  <ConfigProvider size="md" density="comfortable" direction="ltr">
    <Space>
      <Button variant="solid" severity="primary" label="Primary" />
      <Button variant="outlined" label="Secondary" />
    </Space>
  </ConfigProvider>
</template>
