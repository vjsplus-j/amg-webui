<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Tag from '../Tag/index.vue'
import Button from '../Button/index.vue'
import type { UserInfoCardProps, UserInfoCardEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<UserInfoCardProps>(), {
  name: '',
  role: '',
  department: '',
  email: '',
  avatar: '',
  status: 'offline'
})

const emit = defineEmits<UserInfoCardEmits>()
const { t } = useLocale()

const initials = computed(() => {
  const parts = (props.name || '?').trim().split(/\s+/)
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('')
})

const statusLabel = computed(() => {
  if (props.status === 'online') return t(LocaleKeys.common.success)
  if (props.status === 'busy') return t(LocaleKeys.common.loading)
  return t(LocaleKeys.common.no)
})

const statusSeverity = computed(() => {
  if (props.status === 'online') return 'success'
  if (props.status === 'busy') return 'warning'
  return 'secondary'
})
</script>

<template>
  <article :class="['vp-user-info-card', props.class]" :style="style" data-component="UserInfoCard">
    <div class="vp-user-info-card__avatar">
      <img v-if="avatar" :src="avatar" :alt="name" class="vp-user-info-card__img" />
      <span v-else class="vp-user-info-card__initials">{{ initials }}</span>
    </div>
    <div class="vp-user-info-card__body">
      <div class="vp-user-info-card__head">
        <h3 class="vp-user-info-card__name">{{ name || t(LocaleKeys.common.user) }}</h3>
        <Tag :label="statusLabel" :severity="statusSeverity" />
      </div>
      <dl class="vp-user-info-card__meta">
        <div v-if="role">
          <dt>{{ t(LocaleKeys.common.admin) }}</dt>
          <dd>{{ role }}</dd>
        </div>
        <div v-if="department">
          <dt>{{ t(LocaleKeys.nav.system) }}</dt>
          <dd>{{ department }}</dd>
        </div>
        <div v-if="email">
          <dt>{{ t(LocaleKeys.auth.email) }}</dt>
          <dd>{{ email }}</dd>
        </div>
      </dl>
      <div class="vp-user-info-card__actions">
        <Button variant="outlined" size="sm" :label="t(LocaleKeys.button.edit)" @click="emit('edit')" />
        <Button variant="text" size="sm" :label="t(LocaleKeys.common.more)" @click="emit('action', 'more')" />
      </div>
    </div>
    <slot />
  </article>
</template>
