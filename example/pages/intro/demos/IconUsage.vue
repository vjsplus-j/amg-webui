<script setup lang="ts">
import { Button, Icon, Space } from 'amg-webui/core'
</script>

<template>
  <Space>
    <Icon name="Search" size="md" />
    <Icon name="Settings" size="md" />
    <Icon name="User" size="lg" />
    <Button variant="solid" severity="primary" icon="Plus" label="New" />
    <Button variant="outlined" icon="Download" label="Export" />
  </Space>
</template>
