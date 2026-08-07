<script setup lang="ts">
import { ThemeProvider, Button, Card, Space } from 'amg-webui/core'
</script>

<template>
  <Space direction="vertical" style="width: 100%">
    <ThemeProvider design="apple" scheme="light">
      <Card title="Nested A · Apple Light">
        <Button variant="solid" severity="primary" label="Apple" />
      </Card>
    </ThemeProvider>
    <ThemeProvider design="ferrari" scheme="dark">
      <Card title="Nested B · Ferrari Dark">
        <Button variant="solid" severity="primary" label="Ferrari" />
      </Card>
    </ThemeProvider>
  </Space>
</template>
