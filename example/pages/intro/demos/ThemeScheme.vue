<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Button, Space } from 'amg-webui/core'
import { ThemeService, type ColorScheme } from 'amg-webui/theme'

const scheme = ref<ColorScheme>(ThemeService.getScheme())
let unsub: (() => void) | undefined

onMounted(() => {
  unsub = ThemeService.subscribeScheme((s) => {
    scheme.value = s
  })
})

onUnmounted(() => {
  unsub?.()
})

function setLight() {
  ThemeService.setScheme('light')
}

function setDark() {
  ThemeService.setScheme('dark')
}

function toggle() {
  ThemeService.toggleScheme()
}
</script>

<template>
  <Space>
    <Button
      size="sm"
      :variant="scheme === 'light' ? 'solid' : 'outlined'"
      severity="primary"
      label="Light"
      @click="setLight"
    />
    <Button
      size="sm"
      :variant="scheme === 'dark' ? 'solid' : 'outlined'"
      severity="primary"
      label="Dark"
      @click="setDark"
    />
    <Button size="sm" variant="text" label="Toggle" @click="toggle" />
    <span>scheme = {{ scheme }}</span>
  </Space>
</template>
