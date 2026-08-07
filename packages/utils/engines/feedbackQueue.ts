/**
 * ENG-010 Feedback Queue — Message/Toast/Notification lifecycle.
 */
import { shallowRef } from 'vue'

export interface FeedbackItem {
  id: string
  type: 'message' | 'toast' | 'notification'
  content: string
  duration: number
  createdAt: number
  onClose?: () => void
}

let feedbackSeq = 0

export function createFeedbackQueue(max = 8) {
  const items = shallowRef<FeedbackItem[]>([])
  const timers = new Map<string, ReturnType<typeof setTimeout>>()

  function remove(id: string) {
    const t = timers.get(id)
    if (t) clearTimeout(t)
    timers.delete(id)
    const item = items.value.find((i) => i.id === id)
    item?.onClose?.()
    items.value = items.value.filter((i) => i.id !== id)
  }

  function clear() {
    for (const id of [...timers.keys()]) remove(id)
    items.value = []
  }

  function push(
    partial: Omit<FeedbackItem, 'id' | 'createdAt'> & { id?: string }
  ): FeedbackItem {
    feedbackSeq += 1
    const item: FeedbackItem = {
      id: partial.id ?? `fb-${feedbackSeq}`,
      type: partial.type,
      content: partial.content,
      duration: partial.duration,
      createdAt: Date.now(),
      onClose: partial.onClose
    }
    items.value = [...items.value, item].slice(-max)
    if (item.duration > 0) {
      timers.set(
        item.id,
        setTimeout(() => remove(item.id), item.duration)
      )
    }
    return item
  }

  function dispose() {
    clear()
  }

  return { items, push, remove, clear, dispose }
}
