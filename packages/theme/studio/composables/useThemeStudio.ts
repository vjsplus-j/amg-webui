import { computed, onUnmounted, ref, watch, type Ref } from 'vue'
import { ThemeService } from '../../services/ThemeService'
import type { ColorScheme, DesignStyleName } from '../../core/registry'
import {
  createEmptyDraft,
  mergeDraftTokens,
  seedTokensFromDesign,
  STUDIO_STORAGE_KEY
} from '../model'
import type { ThemeStudioDraft } from '../types'
import { validateThemeDraft } from '../validation'

export interface UseThemeStudioOptions {
  storageKey?: string
  previewHost?: HTMLElement | null
}

export function useThemeStudio(options: UseThemeStudioOptions = {}) {
  const storageKey = options.storageKey ?? STUDIO_STORAGE_KEY
  const draft = ref<ThemeStudioDraft>(loadDraft(storageKey))
  const validation = computed(() => validateThemeDraft(draft.value))

  function loadDraft(key: string): ThemeStudioDraft {
    if (typeof localStorage === 'undefined') return createEmptyDraft()
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return createEmptyDraft()
      const parsed = JSON.parse(raw) as ThemeStudioDraft
      if (!parsed.baseDesign || !parsed.scheme) return createEmptyDraft()
      return {
        name: parsed.name || 'custom-theme',
        baseDesign: parsed.baseDesign,
        scheme: parsed.scheme,
        tokens: parsed.tokens ?? {}
      }
    } catch {
      return createEmptyDraft()
    }
  }

  function persist() {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(storageKey, JSON.stringify(draft.value))
  }

  function applyPreview() {
    ThemeService.setStyle(draft.value.baseDesign)
    ThemeService.setScheme(draft.value.scheme)
    if (Object.keys(draft.value.tokens).length) {
      ThemeService.replaceCustom(draft.value.tokens)
    } else {
      ThemeService.clearCustom()
    }
  }

  function setDesign(design: DesignStyleName) {
    draft.value = {
      ...draft.value,
      baseDesign: design,
      tokens: seedTokensFromDesign(design)
    }
    applyPreview()
    persist()
  }

  function setScheme(scheme: ColorScheme) {
    draft.value = { ...draft.value, scheme }
    applyPreview()
    persist()
  }

  function patchTokens(patch: Record<string, string>) {
    draft.value = mergeDraftTokens(draft.value, patch)
    applyPreview()
    persist()
  }

  function setToken(key: string, value: string) {
    patchTokens({ [key]: value })
  }

  function loadImported(next: ThemeStudioDraft) {
    draft.value = next
    applyPreview()
    persist()
  }

  function resetDraft() {
    draft.value = createEmptyDraft(draft.value.baseDesign, draft.value.scheme)
    ThemeService.clearCustom()
    persist()
  }

  watch(draft, applyPreview, { deep: true, immediate: true })

  onUnmounted(() => {
    ThemeService.clearCustom()
  })

  return {
    draft: draft as Ref<ThemeStudioDraft>,
    validation,
    setDesign,
    setScheme,
    patchTokens,
    setToken,
    loadImported,
    resetDraft,
    applyPreview,
    persist
  }
}

export type ThemeStudioContext = ReturnType<typeof useThemeStudio>
