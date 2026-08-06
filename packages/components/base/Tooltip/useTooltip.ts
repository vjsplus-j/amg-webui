import { onUnmounted, ref } from "vue";
export function useTooltipTimers() {
  const openTimer = ref<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = ref<ReturnType<typeof setTimeout> | null>(null);
  function clearOpen() {
    if (openTimer.value) clearTimeout(openTimer.value);
    openTimer.value = null;
  }
  function clearClose() {
    if (closeTimer.value) clearTimeout(closeTimer.value);
    closeTimer.value = null;
  }
  function clear() {
    clearOpen();
    clearClose();
  }
  function scheduleOpen(callback: () => void, delay: number) {
    clear();
    if (delay > 0) openTimer.value = setTimeout(callback, delay);
    else callback();
  }
  function scheduleClose(callback: () => void, delay: number) {
    clearOpen();
    clearClose();
    if (delay > 0) closeTimer.value = setTimeout(callback, delay);
    else callback();
  }
  onUnmounted(clear);
  return { clear, clearClose, scheduleOpen, scheduleClose };
}
