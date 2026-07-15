<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Button, InputText, Icon } from '@amg-webui/components/base'
import { BizLogin, type BizLoginCredentials } from '@amg-webui/components/business'
import {
  ToastService,
  ThemeService,
  designStyles,
  type DesignStyleName,
  IconStyleService,
  iconStyles,
  type IconStyleName,
  FontService,
  fonts,
  type FontName
} from '@amg-webui/theme'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { useAuth } from '../../stores/auth'

const router = useRouter()
const route = useRoute()
const { login, init, isAuthenticated } = useAuth()
const { t } = useLocale()

const isLoading = ref(false)
const currentDesign = ref<DesignStyleName>(ThemeService.getCurrentStyle())
const currentIconStyle = ref<IconStyleName>(IconStyleService.getCurrentStyle())
const currentFont = ref<FontName>(FontService.getCurrentFont())

const previewIcons = ['Search', 'User', 'Check', 'Plus', 'Star', 'Monitor']

let unsubDesign: (() => void) | undefined
let unsubIcon: (() => void) | undefined
let unsubFont: (() => void) | undefined

onMounted(() => {
  init()
  ThemeService.init()
  IconStyleService.init()
  FontService.init()
  currentDesign.value = ThemeService.getCurrentStyle()
  currentIconStyle.value = IconStyleService.getCurrentStyle()
  currentFont.value = FontService.getCurrentFont()

  unsubDesign = ThemeService.subscribe((s) => {
    currentDesign.value = s
  })
  unsubIcon = IconStyleService.subscribe((s) => {
    currentIconStyle.value = s
  })
  unsubFont = FontService.subscribe((f) => {
    currentFont.value = f
  })

  if (isAuthenticated.value) {
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : undefined
    router.replace(redirect || { name: 'dashboard' })
  }
})

onUnmounted(() => {
  unsubDesign?.()
  unsubIcon?.()
  unsubFont?.()
})

const handleSubmit = async (payload: BizLoginCredentials) => {
  isLoading.value = true
  const success = await login(payload.username, payload.password)
  isLoading.value = false

  if (success) {
    ToastService.success({
      summary: t(LocaleKeys.common.success),
      detail: t(LocaleKeys.auth.loginSuccess)
    })
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : undefined
    router.replace(redirect || { name: 'dashboard' })
  } else {
    ToastService.error({
      summary: t(LocaleKeys.error.unauthorized),
      detail: t(LocaleKeys.auth.loginFailed)
    })
  }
}

const setDesign = (name: DesignStyleName) => {
  ThemeService.setStyle(name)
}

const setIconStyle = (name: IconStyleName) => {
  IconStyleService.setStyle(name)
}

const setFont = (name: FontName) => {
  FontService.setFont(name)
}
</script>

<template>
  <div class="login-page">
    <div class="login-layout">
      <div class="login-container">
        <BizLogin
          default-username="admin"
          :loading="isLoading"
          show-captcha
          captcha-mode="checkbox"
          @submit="handleSubmit"
          @register="router.push({ name: 'register' })"
          @forgot="router.push({ name: 'forgot-password' })"
        />

        <div class="demo-credentials">
          <p class="demo-label">{{ t(LocaleKeys.auth.demoAccounts) }}</p>
          <div class="demo-info">
            <span>admin / admin123</span>
            <span>user / user123</span>
          </div>
        </div>
      </div>

      <aside class="style-demo-panel">
        <div class="panel-header">
          <h2>{{ t(LocaleKeys.auth.styleDemoTitle) }}</h2>
          <p>{{ t(LocaleKeys.auth.styleDemoLead) }}</p>
        </div>

        <section class="demo-block">
          <div class="demo-block-head">
            <h3>{{ t(LocaleKeys.auth.designBlock) }}</h3>
            <Button size="sm" variant="outlined" @click="ThemeService.toggleTheme()">
              {{ t(LocaleKeys.chrome.toggle) }}
            </Button>
          </div>
          <div class="chip-row">
            <button
              v-for="style in designStyles"
              :key="style.name"
              type="button"
              class="chip"
              :class="{ active: currentDesign === style.name }"
              @click="setDesign(style.name)"
            >
              <span class="dot" :style="{ background: style.preview.primary }" />
              {{ style.label }}
            </button>
          </div>
          <p class="hint">
            {{
              t(LocaleKeys.chrome.current, {
                label: designStyles.find((s) => s.name === currentDesign)?.label ?? ''
              })
            }}
          </p>
        </section>

        <section class="demo-block">
          <div class="demo-block-head">
            <h3>{{ t(LocaleKeys.auth.iconBlock) }}</h3>
            <Button size="sm" variant="outlined" @click="IconStyleService.toggleStyle()">
              {{ t(LocaleKeys.chrome.toggle) }}
            </Button>
          </div>
          <div class="chip-row">
            <button
              v-for="style in iconStyles"
              :key="style.name"
              type="button"
              class="chip"
              :class="{ active: currentIconStyle === style.name }"
              @click="setIconStyle(style.name)"
            >
              {{ style.label }}
            </button>
          </div>
          <div class="icon-stage">
            <Icon v-for="n in previewIcons" :key="n" :name="n" size="lg" />
          </div>
          <p class="hint">
            {{
              t(LocaleKeys.chrome.current, {
                label: iconStyles.find((s) => s.name === currentIconStyle)?.label ?? ''
              })
            }}
          </p>
        </section>

        <section class="demo-block">
          <div class="demo-block-head">
            <h3>{{ t(LocaleKeys.auth.fontBlock) }}</h3>
            <Button size="sm" variant="outlined" @click="FontService.toggleFont()">
              {{ t(LocaleKeys.chrome.toggle) }}
            </Button>
          </div>
          <div class="chip-row">
            <button
              v-for="font in fonts"
              :key="font.name"
              type="button"
              class="chip"
              :class="{ active: currentFont === font.name }"
              @click="setFont(font.name)"
            >
              {{ font.label }}
            </button>
          </div>
          <p class="font-sample-line">
            {{ t(LocaleKeys.auth.fontSample) }} —
            {{ fonts.find((f) => f.name === currentFont)?.label }}
          </p>
          <p class="hint">
            {{
              t(LocaleKeys.chrome.current, {
                label: fonts.find((f) => f.name === currentFont)?.label ?? ''
              })
            }}
          </p>
        </section>

        <div class="live-sample">
          <Button severity="primary" variant="solid">{{ t(LocaleKeys.chrome.primaryBtn) }}</Button>
          <Button severity="secondary" variant="outlined">{{ t(LocaleKeys.chrome.secondaryBtn) }}</Button>
          <InputText :placeholder="t(LocaleKeys.chrome.sampleInput)" class="sample-input" />
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  background: var(--surface-0);
}

.login-layout {
  width: 100%;
  max-width: 960px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  align-items: stretch;
}

.login-container,
.style-demo-panel {
  padding: var(--spacing-xl);
  background: var(--surface-1);
  border-radius: var(--theme-card-radius, var(--border-radius-xl));
  border: 1px solid var(--ds-border, var(--border-color));
  box-shadow: var(--shadow-lg);
}

.demo-credentials {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--surface-2);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--ds-border, var(--border-color));
}

.demo-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-heading, 500);
  color: var(--text-muted);
  margin-bottom: var(--spacing-sm);
}

.demo-info {
  display: flex;
  gap: var(--spacing-lg);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.panel-header {
  margin-bottom: var(--spacing-lg);
}

.panel-header h2 {
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.panel-header p {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.demo-block {
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--ds-border, var(--border-color));
}

.demo-block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  gap: var(--spacing-md);
}

.demo-block-head h3 {
  font-size: var(--font-size-md);
  color: var(--text-primary);
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--ds-border, var(--border-color));
  background: var(--surface-2);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: border-color var(--transition-normal), box-shadow var(--transition-normal);
}

.chip.active {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 1px var(--primary-500);
  color: var(--primary-400);
}

.dot {
  width: var(--spacing-sm);
  height: var(--spacing-sm);
  border-radius: var(--border-radius-full, 999px);
}

.icon-stage {
  margin-top: var(--spacing-md);
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  background: var(--surface-2);
  border: 1px solid var(--ds-border, var(--border-color));
  color: var(--text-primary);
}

.hint {
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.font-sample-line {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  background: var(--surface-2);
  border: 1px solid var(--ds-border, var(--border-color));
  color: var(--text-primary);
  font-size: var(--font-size-md);
  letter-spacing: var(--letter-spacing);
}

.live-sample {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  align-items: center;
}

.sample-input {
  min-width: 10rem;
}

@media (max-width: 860px) {
  .login-layout {
    grid-template-columns: 1fr;
  }
}
</style>
