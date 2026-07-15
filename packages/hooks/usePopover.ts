import { ref, onMounted, onUnmounted } from 'vue'

export function usePopover() {
  const isOpen = ref(false)
  const triggerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const onOutside = (event: MouseEvent) => {
    if (!isOpen.value) return
    const target = event.target as Node
    if (!triggerRef.value?.contains(target) && !panelRef.value?.contains(target)) {
      close()
    }
  }

  const onEscape = (event: KeyboardEvent) => {
    if (isOpen.value && event.key === 'Escape') {
      close()
    }
  }

  onMounted(() => {
    document.addEventListener('click', onOutside)
    document.addEventListener('keydown', onEscape)
  })

  onUnmounted(() => {
    document.removeEventListener('click', onOutside)
    document.removeEventListener('keydown', onEscape)
  })

  return { isOpen, triggerRef, panelRef, open, close, toggle }
}
