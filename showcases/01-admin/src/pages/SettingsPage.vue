<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  Button,
  Card,
  Form,
  FormItem,
  InputText,
  PageHeader,
  Select,
  Switch
} from 'amg-webui'

const saved = ref(false)

const general = reactive({
  siteName: 'Admin Console',
  supportEmail: 'ops@example.com',
  timezone: 'Asia/Shanghai'
})

const security = reactive({
  mfaRequired: true,
  sessionMinutes: '30',
  ipAllowlist: '192.168.0.0/16'
})

const notifications = reactive({
  emailAlerts: true,
  slackWebhook: '',
  digest: 'daily'
})

const timezoneOptions = [
  { label: 'Asia/Shanghai', value: 'Asia/Shanghai' },
  { label: 'UTC', value: 'UTC' },
  { label: 'America/New_York', value: 'America/New_York' }
]

const digestOptions = [
  { label: 'Realtime', value: 'realtime' },
  { label: 'Daily digest', value: 'daily' },
  { label: 'Weekly digest', value: 'weekly' }
]

function saveAll() {
  saved.value = true
  setTimeout(() => {
    saved.value = false
  }, 2000)
}
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="Settings">
      <template #extra>
        <Button severity="primary" label="Save all" @click="saveAll" />
        <span v-if="saved" class="showcase-status showcase-status--online">Saved</span>
      </template>
    </PageHeader>

    <div class="showcase-grid showcase-grid--2">
      <Card title="General">
        <Form :model="general" label-position="top">
          <FormItem label="Site name" prop="siteName">
            <InputText v-model="general.siteName" fluid />
          </FormItem>
          <FormItem label="Support email" prop="supportEmail">
            <InputText v-model="general.supportEmail" fluid />
          </FormItem>
          <FormItem label="Timezone" prop="timezone">
            <Select v-model="general.timezone" :options="timezoneOptions" fluid />
          </FormItem>
        </Form>
      </Card>

      <Card title="Security">
        <Form :model="security" label-position="top">
          <FormItem label="Require MFA" prop="mfaRequired">
            <Switch v-model="security.mfaRequired" />
          </FormItem>
          <FormItem label="Session timeout (minutes)" prop="sessionMinutes">
            <InputText v-model="security.sessionMinutes" fluid />
          </FormItem>
          <FormItem label="IP allowlist" prop="ipAllowlist">
            <InputText v-model="security.ipAllowlist" fluid />
          </FormItem>
        </Form>
      </Card>

      <Card title="Notifications">
        <Form :model="notifications" label-position="top">
          <FormItem label="Email alerts" prop="emailAlerts">
            <Switch v-model="notifications.emailAlerts" />
          </FormItem>
          <FormItem label="Slack webhook" prop="slackWebhook">
            <InputText
              v-model="notifications.slackWebhook"
              fluid
              placeholder="https://hooks.slack.com/..."
            />
          </FormItem>
          <FormItem label="Digest frequency" prop="digest">
            <Select v-model="notifications.digest" :options="digestOptions" fluid />
          </FormItem>
        </Form>
      </Card>
    </div>
  </div>
</template>
