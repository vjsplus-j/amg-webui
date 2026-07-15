<script setup lang="ts">
import { ref } from 'vue'
import {
  Card,
  Button,
  Alert,
  Drawer,
  Result,
  Dialog,
  Notification,
  Toast,
  Loading
} from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import ComponentGallery from '../../components/ComponentGallery.vue'

const { t } = useLocale()
const drawerVisible = ref(false)
const dialogVisible = ref(false)
const loading = ref(false)

function flashLoading() {
  loading.value = true
  window.setTimeout(() => {
    loading.value = false
  }, 1200)
}
</script>

<template>
  <ComponentGallery
    zone="feedback"
    title-key="page.base.feedback.title"
    lead-key="page.base.feedback.lead"
  >
    <template #featured>
      <Card>
        <div class="stack">
          <Alert severity="info" :title="t(LocaleKeys.tip.changesLive)" />
          <Notification
            :title="t(LocaleKeys.common.success)"
            :message="t(LocaleKeys.tip.saved)"
            severity="success"
            :duration="0"
          />
          <Toast />
          <Result
            status="success"
            :title="t(LocaleKeys.common.success)"
            :sub-title="t(LocaleKeys.tip.saved)"
          />
          <div class="row">
            <Button size="sm" @click="dialogVisible = true">{{ t(LocaleKeys.button.confirm) }}</Button>
            <Button size="sm" variant="outlined" @click="drawerVisible = true">
              {{ t(LocaleKeys.button.continue) }}
            </Button>
            <Button size="sm" variant="outlined" @click="flashLoading">
              {{ t(LocaleKeys.common.loading) }}
            </Button>
          </div>
        </div>
      </Card>
      <Dialog
        v-model:visible="dialogVisible"
        :header="t(LocaleKeys.button.confirm)"
        modal
      >
        <p>{{ t('page.base.feedback.lead') }}</p>
        <template #footer>
          <Button size="sm" variant="outlined" @click="dialogVisible = false">
            {{ t(LocaleKeys.button.cancel) }}
          </Button>
          <Button size="sm" @click="dialogVisible = false">{{ t(LocaleKeys.button.confirm) }}</Button>
        </template>
      </Dialog>
      <Drawer
        v-model:visible="drawerVisible"
        :title="t(LocaleKeys.common.actions)"
        placement="right"
      >
        <p>{{ t('page.base.feedback.c1') }}</p>
      </Drawer>
      <Loading :visible="loading" fullscreen />
    </template>
  </ComponentGallery>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}
</style>
