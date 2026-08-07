/**
 * ENG-009 Upload Engine — queue / progress / abort / retry / concurrency.
 */
import { computed, shallowRef } from 'vue'

export type UploadStatus =
  | 'idle'
  | 'queued'
  | 'uploading'
  | 'success'
  | 'error'
  | 'aborted'

export interface UploadFileItem {
  id: string
  file: File
  status: UploadStatus
  progress: number
  error?: string
  abort?: AbortController
}

export interface UploadEngineOptions {
  concurrency?: number
  autoUpload?: boolean
  request: (
    file: File,
    signal: AbortSignal,
    onProgress: (pct: number) => void
  ) => Promise<unknown>
}

let uploadSeq = 0

export function useUploadEngine(options: UploadEngineOptions) {
  const queue = shallowRef<UploadFileItem[]>([])
  const concurrency = options.concurrency ?? 3
  let active = 0

  const uploading = computed(() =>
    queue.value.some((f) => f.status === 'uploading' || f.status === 'queued')
  )

  function addFiles(files: FileList | File[]) {
    const list = [...files].map((file) => {
      uploadSeq += 1
      return {
        id: `up-${uploadSeq}`,
        file,
        status: 'queued' as UploadStatus,
        progress: 0
      }
    })
    queue.value = [...queue.value, ...list]
    if (options.autoUpload !== false) void pump()
    return list
  }

  async function pump() {
    while (active < concurrency) {
      const next = queue.value.find((f) => f.status === 'queued')
      if (!next) break
      active += 1
      next.status = 'uploading'
      next.abort = new AbortController()
      queue.value = [...queue.value]
      void runOne(next).finally(() => {
        active -= 1
        void pump()
      })
    }
  }

  async function runOne(item: UploadFileItem) {
    try {
      await options.request(item.file, item.abort!.signal, (pct) => {
        item.progress = pct
        queue.value = [...queue.value]
      })
      item.status = 'success'
      item.progress = 100
    } catch (err) {
      if (item.abort?.signal.aborted) {
        item.status = 'aborted'
      } else {
        item.status = 'error'
        item.error = err instanceof Error ? err.message : String(err)
      }
    }
    queue.value = [...queue.value]
  }

  function abort(id: string) {
    const item = queue.value.find((f) => f.id === id)
    item?.abort?.abort()
  }

  function abortAll() {
    for (const item of queue.value) item.abort?.abort()
  }

  function retry(id: string) {
    const item = queue.value.find((f) => f.id === id)
    if (!item) return
    item.status = 'queued'
    item.progress = 0
    item.error = undefined
    queue.value = [...queue.value]
    void pump()
  }

  function clear() {
    abortAll()
    queue.value = []
  }

  return {
    queue,
    uploading,
    addFiles,
    abort,
    abortAll,
    retry,
    clear,
    start: pump
  }
}
