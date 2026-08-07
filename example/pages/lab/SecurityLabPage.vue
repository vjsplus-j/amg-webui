<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Button, Card, Link } from '@amg-webui/core'
import { InputText } from '@amg-webui/form'
import { RichText } from '@amg-webui/editor'
import { useLocale } from '@amg-webui/hooks'
import {
  SecurityService,
  filterDangerousInput,
  isSafeHref,
  sanitizeHtml,
  sanitizeUrl,
  type SecurityAlert
} from '@amg-webui/security'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

const { t } = useLocale()

const dirtyHtml = ref(
  '<p>Hello <strong>AMG</strong></p><scr' +
    'ipt>alert(1)</scr' +
    'ipt><a href="javascript:alert(1)">x</a><a href="https://example.com" target="_blank">ok</a>'
)
const formInput = ref('<b>admin</b> javascript:void(0)')
const hrefInput = ref('javascript:alert(1)')
const rich = ref(
  '<p>Safe <em>rich</em> text</p><img src=x onerror=alert(1) /><a href="https://example.com">link</a>'
)
const alerts = ref<SecurityAlert[]>([])
let unsub: (() => void) | undefined

const cleanHtml = computed(() => sanitizeHtml(dirtyHtml.value))
const filtered = computed(() => filterDangerousInput(formInput.value))
const hrefSafe = computed(() => isSafeHref(hrefInput.value))
const hrefSanitized = computed(() => sanitizeUrl(hrefInput.value) ?? '—')

function refreshAlerts() {
  alerts.value = SecurityService.getRecentAlerts().slice().reverse()
}

onMounted(() => {
  SecurityService.configure({ appId: 'example-lab-security', warnOnStrip: true })
  unsub = SecurityService.subscribe(() => refreshAlerts())
  refreshAlerts()
})

onUnmounted(() => {
  unsub?.()
  SecurityService.clearAlerts()
})
</script>

<template>
  <div class="lab-security">
    <ExamplePageHero title-key="page.lab.security.title" lead-key="page.lab.security.lead" />

    <div class="lab-security__grid">
      <Card :title="t('component.rich-text.title')">
        <RichText v-model="rich" />
      </Card>

      <Card :title="t('page.lab.security.sanitizeTitle')">
        <textarea
          v-model="dirtyHtml"
          class="lab-security__code"
          rows="6"
          :aria-label="t('page.lab.security.sanitizeTitle')"
        />
        <pre class="lab-security__out">{{ cleanHtml }}</pre>
        <!-- intentional: preview already-sanitized HTML -->
        <div class="lab-security__preview" v-html="cleanHtml" />
      </Card>

      <Card :title="t('page.lab.security.hrefTitle')">
        <InputText v-model="hrefInput" />
        <p>
          {{
            hrefSafe
              ? t('page.lab.security.hrefSafe')
              : t('page.lab.security.hrefBlocked')
          }}
          → {{ hrefSanitized }}
        </p>
        <Link :href="hrefInput" :label="t('page.lab.security.tryLink')" />
        <Link href="https://example.com" label="https://example.com" />
      </Card>

      <Card :title="t('page.lab.security.filterTitle')">
        <InputText v-model="formInput" />
        <pre class="lab-security__out">{{ filtered }}</pre>
      </Card>

      <Card :title="t('page.lab.security.alertsTitle')">
        <Button
          :label="t('page.lab.telemetry.clear')"
          variant="outlined"
          @click="
            SecurityService.clearAlerts();
            refreshAlerts()
          "
        />
        <ul class="lab-security__alerts">
          <li v-for="(a, i) in alerts" :key="i">
            <strong>{{ a.kind }}</strong> — {{ a.message }}
          </li>
          <li v-if="!alerts.length">{{ t('page.lab.telemetry.empty') }}</li>
        </ul>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.lab-security__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: var(--theme-section-gap);
  width: 100%;
  min-width: 0;
}

.lab-security__code,
.lab-security__out {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  font-family: var(--font-family-mono, ui-monospace, monospace);
  font-size: var(--font-size-sm);
  padding: var(--spacing-sm);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  background: var(--surface-0, var(--surface-1));
  color: var(--text-primary);
  white-space: pre-wrap;
  word-break: break-word;
}

.lab-security__preview {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
}

.lab-security__alerts {
  margin: var(--spacing-md) 0 0;
  padding-left: var(--spacing-lg);
  font-size: var(--font-size-sm);
}
</style>
