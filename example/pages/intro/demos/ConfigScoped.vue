<script setup lang="ts">
import { ConfigProvider, Button, Card, Space } from 'amg-webui/core'
</script>

<template>
  <Space direction="vertical" style="width: 100%">
    <ConfigProvider design="linear" scheme="light" density="comfortable">
      <Card title="App Root · Linear Light">
        <Button variant="solid" severity="primary" label="Root Theme" />
      </Card>
    </ConfigProvider>
    <ConfigProvider design="mercedes" scheme="dark" density="compact" :tokens="{ '--border-radius-md': '2px' }">
      <Card title="Scoped · Mercedes Dark">
        <Button variant="solid" severity="primary" label="Scoped Theme" />
      </Card>
    </ConfigProvider>
  </Space>
</template>
