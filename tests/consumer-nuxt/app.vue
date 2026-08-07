<template>
  <div class="consumer-nuxt">
    <!-- True SSR path: no ClientOnly wrapper around the library Button -->
    <AmgButton class="consumer-nuxt__btn">{{ label }}</AmgButton>
    <ClientOnly>
      <p class="consumer-nuxt__client-only">client-only-ok</p>
    </ClientOnly>
    <p>ssr-env:{{ clientFlag }}</p>
    <p data-ssr-marker="amg-nuxt-ssr">{{ marker }}</p>
  </div>
</template>

<script setup lang="ts">
import { Button as AmgButton } from 'amg-webui/button'
import { sanitizeHtml } from 'amg-webui/security'
import { isClient } from 'amg-webui/utils/env'
import { ThemeService } from 'amg-webui/theme'

const label = sanitizeHtml('<b>nuxt</b>')
const clientFlag = String(isClient())
const marker = 'amg-nuxt-ssr-matrix'
void ThemeService
</script>
