import { ref, watch, onBeforeUnmount, type Ref } from 'vue'

export function useObjectUrl(source: Ref<File | Blob | string | null | undefined>) {
  const url = ref<string>('')

  const revoke = () => {
    if (url.value.startsWith('blob:')) {
      URL.revokeObjectURL(url.value)
    }
    url.value = ''
  }

  watch(
    source,
    (val) => {
      revoke()
      if (!val) return
      if (typeof val === 'string') {
        url.value = val
        return
      }
      url.value = URL.createObjectURL(val)
    },
    { immediate: true }
  )

  onBeforeUnmount(revoke)

  return url
}
