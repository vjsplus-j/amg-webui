<script setup lang="ts">
import { computed } from 'vue'
import {
  Button,
  Card,
  Descriptions,
  DescriptionsItem,
  PageHeader,
  Progress,
  Result
} from 'amg-webui'
import { useRoute, useRouter } from 'vue-router'
import { getIotDeviceDetail } from '@showcase/shared/mock-api/device-mgmt'

const route = useRoute()
const router = useRouter()

const deviceId = computed(() => String(route.params.id))
const detail = computed(() => getIotDeviceDetail(deviceId.value))
</script>

<template>
  <div class="showcase-page">
    <PageHeader :title="detail?.name ?? 'Device detail'">
      <template #extra>
        <Button variant="outlined" label="Back to list" @click="router.push('/devices')" />
      </template>
    </PageHeader>

    <Result v-if="!detail" status="404" title="Device not found" />

    <template v-else>
      <Card title="Device info">
        <Descriptions :column="2">
          <DescriptionsItem label="Model">{{ detail.model }}</DescriptionsItem>
          <DescriptionsItem label="Serial">{{ detail.serial }}</DescriptionsItem>
          <DescriptionsItem label="Group">{{ detail.group }}</DescriptionsItem>
          <DescriptionsItem label="IP">{{ detail.ip }}</DescriptionsItem>
          <DescriptionsItem label="Location">{{ detail.location }}</DescriptionsItem>
          <DescriptionsItem label="Firmware">{{ detail.firmware }}</DescriptionsItem>
          <DescriptionsItem label="Status">
            <span
              class="showcase-status"
              :class="{
                'showcase-status--online': detail.status === 'online',
                'showcase-status--offline': detail.status === 'offline',
                'showcase-status--pending': detail.status === 'sleep'
              }"
            >
              {{ detail.status }}
            </span>
          </DescriptionsItem>
          <DescriptionsItem label="Last seen">
            {{ new Date(detail.lastSeen).toLocaleString() }}
          </DescriptionsItem>
        </Descriptions>
      </Card>

      <div class="showcase-grid showcase-grid--2">
        <Card title="Battery">
          <Progress :value="detail.battery" :max="100" />
          <p class="showcase-meta">{{ detail.battery }}%</p>
        </Card>
        <Card title="Signal strength">
          <Progress :value="Math.min(100, 100 + detail.signal)" :max="100" />
          <p class="showcase-meta">{{ detail.signal }} dBm</p>
        </Card>
      </div>

      <Card v-if="detail.tags.length" title="Tags">
        <div class="showcase-toolbar">
          <span v-for="tag in detail.tags" :key="tag" class="showcase-status showcase-status--pending">
            {{ tag }}
          </span>
        </div>
      </Card>
    </template>
  </div>
</template>

<style scoped>
.showcase-meta {
  margin: 8px 0 0;
  font-size: 0.8125rem;
  color: var(--theme-text-secondary, #64748b);
}
</style>
