<template>
  <div class="consumer-nuxt">
    <ClientOnly>
      <AmgButton>{{ label }}</AmgButton>
    </ClientOnly>
    <p>ssr-env:{{ clientFlag }}</p>
  </div>
</template>

<script setup lang="ts">
import { Button as AmgButton } from 'amg-webui/button'
import { sanitizeHtml } from 'amg-webui/security'
import { isClient } from 'amg-webui/utils/env'
import { ThemeService } from 'amg-webui/theme'

const label = sanitizeHtml('<b>nuxt</b>')
const clientFlag = String(isClient())
void ThemeService
</script>
