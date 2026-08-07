<script setup lang="ts">
import { ConfigProvider, Button, Space, Card } from 'amg-webui/core'
import { useLocale } from 'amg-webui/hooks'
import { LocaleKeys } from 'amg-webui/locale'

const { locale, setLocale, dir, toggleDirection, t } = useLocale()

function toZh() {
  setLocale('zh-CN')
}

function toEn() {
  setLocale('en-US')
}

function toAr() {
  setLocale('ar-SA')
}
</script>

<template>
  <ConfigProvider :direction="dir">
    <Card :title="t('page.intro.i18n.demoCardTitle')">
      <Space>
        <Button
          size="sm"
          :variant="locale === 'zh-CN' ? 'solid' : 'outlined'"
          severity="primary"
          label="zh-CN"
          @click="toZh"
        />
        <Button
          size="sm"
          :variant="locale === 'en-US' ? 'solid' : 'outlined'"
          severity="primary"
          label="en-US"
          @click="toEn"
        />
        <Button
          size="sm"
          :variant="locale === 'ar-SA' ? 'solid' : 'outlined'"
          severity="primary"
          label="ar-SA"
          @click="toAr"
        />
        <Button
          size="sm"
          :variant="dir === 'rtl' ? 'solid' : 'outlined'"
          severity="secondary"
          :label="t(LocaleKeys.chrome.dirRtl)"
          @click="toggleDirection"
        />
      </Space>
      <p style="margin: 1rem 0 0; color: var(--text-secondary)">
        locale = {{ locale }} · dir = {{ dir }}
      </p>
      <p style="margin: 0.5rem 0 0">{{ t('page.intro.i18n.demoSample') }}</p>
    </Card>
  </ConfigProvider>
</template>
