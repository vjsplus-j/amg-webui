<script setup lang="ts">
import { ConfigProvider, Button, Card, Space } from 'amg-webui/core'

const tokens = {
  '--primary-500': '#0f766e',
  '--primary-600': '#0d9488',
  '--surface-1': 'var(--surface-1)',
  '--text-primary': 'var(--text-primary)',
  '--ds-border': 'var(--ds-border)',
  '--border-radius-md': '12px',
  '--spacing-md': '1rem'
}
</script>

<template>
  <ConfigProvider :tokens="tokens" primary="#0f766e">
    <Card title="Token Override Preview">
      <Space>
        <Button variant="solid" severity="primary" label="Primary Action" />
        <Button variant="outlined" label="Outlined" />
      </Space>
    </Card>
  </ConfigProvider>
</template>
