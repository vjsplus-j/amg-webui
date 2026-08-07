import {
  computed,
  onUnmounted,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from "vue";

const DEFAULT_ITEM_HEIGHT = 36;
const DEFAULT_CONTAINER_HEIGHT = 280;
const DEFAULT_OVERSCAN = 6;

export interface VirtualListOptions {
  itemHeight?: MaybeRefOrGetter<number>;
  containerHeight?: MaybeRefOrGetter<number>;
  overscan?: MaybeRefOrGetter<number>;
  containerRef?: Ref<HTMLElement | null>;
  /**
   * Optional element (e.g. first rendered row) observed via ResizeObserver.
   * Measured height wins over the estimate when available.
   */
  itemMeasureRef?: Ref<HTMLElement | null>;
}

export function useVirtualList<T>(
  items: Ref<T[]>,
  options: VirtualListOptions = {},
) {
  const scrollTop = ref(0);
  const measuredHeight = ref(0);
  const measuredItemHeight = ref(0);
  let scrollElement: HTMLElement | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let itemResizeObserver: ResizeObserver | null = null;
  let rafId = 0;

  const estimatedItemHeight = computed(() =>
    Math.max(1, Number(toValue(options.itemHeight) ?? DEFAULT_ITEM_HEIGHT)),
  );
  const itemHeightValue = computed(() =>
    Math.max(1, measuredItemHeight.value || estimatedItemHeight.value),
  );
  const containerHeightValue = computed(() =>
    Math.max(
      1,
      measuredHeight.value ||
        Number(toValue(options.containerHeight) ?? DEFAULT_CONTAINER_HEIGHT),
    ),
  );
  const overscanValue = computed(() =>
    Math.max(
      0,
      Math.floor(Number(toValue(options.overscan) ?? DEFAULT_OVERSCAN)),
    ),
  );
  const visibleCount = computed(() =>
    Math.max(
      1,
      Math.ceil(containerHeightValue.value / itemHeightValue.value) +
        overscanValue.value * 2,
    ),
  );
  const maxScrollTop = computed(() =>
    Math.max(
      0,
      items.value.length * itemHeightValue.value - containerHeightValue.value,
    ),
  );
  const rawStartIndex = computed(() =>
    Math.max(
      0,
      Math.floor(scrollTop.value / itemHeightValue.value) - overscanValue.value,
    ),
  );
  const maxStartIndex = computed(() =>
    Math.max(0, items.value.length - visibleCount.value),
  );
  const startIndex = computed(() =>
    Math.min(rawStartIndex.value, maxStartIndex.value),
  );
  const endIndex = computed(() =>
    Math.min(items.value.length, startIndex.value + visibleCount.value),
  );
  const visibleItems = computed(() =>
    items.value.slice(startIndex.value, endIndex.value).map((item, index) => ({
      item,
      index: startIndex.value + index,
    })),
  );
  const totalHeight = computed(
    () => items.value.length * itemHeightValue.value,
  );
  const offsetY = computed(() => startIndex.value * itemHeightValue.value);

  function syncContainer(element: HTMLElement | null) {
    resizeObserver?.disconnect();
    scrollElement = element;
    measuredHeight.value = element?.clientHeight ?? 0;
    if (!element || typeof ResizeObserver === "undefined") return;
    resizeObserver = new ResizeObserver(([entry]) => {
      measuredHeight.value = Math.round(
        entry?.contentRect.height || element.clientHeight,
      );
    });
    resizeObserver.observe(element);
  }

  function syncItemMeasure(element: HTMLElement | null) {
    itemResizeObserver?.disconnect();
    if (!element) {
      measuredItemHeight.value = 0;
      return;
    }
    const apply = () => {
      const next = Math.round(element.getBoundingClientRect().height);
      if (next > 0) measuredItemHeight.value = next;
    };
    apply();
    if (typeof ResizeObserver === "undefined") return;
    itemResizeObserver = new ResizeObserver(() => apply());
    itemResizeObserver.observe(element);
  }

  if (options.containerRef)
    watch(options.containerRef, syncContainer, {
      immediate: true,
      flush: "post",
    });

  if (options.itemMeasureRef)
    watch(options.itemMeasureRef, syncItemMeasure, {
      immediate: true,
      flush: "post",
    });

  watch(
    () =>
      [
        items.value.length,
        containerHeightValue.value,
        itemHeightValue.value,
      ] as const,
    () => {
      const next = Math.min(scrollTop.value, maxScrollTop.value);
      if (next === scrollTop.value) return;
      scrollTop.value = next;
      if (scrollElement && scrollElement.scrollTop > next)
        scrollElement.scrollTop = next;
    },
    { flush: "sync" },
  );

  function commitScroll(element: HTMLElement) {
    scrollElement = element;
    scrollTop.value = Math.min(
      Math.max(0, element.scrollTop),
      maxScrollTop.value,
    );
    rafId = 0;
  }

  function onScroll(event: Event) {
    const element = (event.currentTarget ?? event.target) as HTMLElement;
    if (rafId && typeof cancelAnimationFrame !== "undefined")
      cancelAnimationFrame(rafId);
    if (typeof requestAnimationFrame === "undefined") {
      commitScroll(element);
      return;
    }
    rafId = requestAnimationFrame(() => commitScroll(element));
  }

  function scrollToIndex(
    index: number,
    align: "start" | "center" | "end" = "start",
  ) {
    const safeIndex = Math.min(
      Math.max(0, index),
      Math.max(0, items.value.length - 1),
    );
    const base = safeIndex * itemHeightValue.value;
    const next =
      align === "center"
        ? base - (containerHeightValue.value - itemHeightValue.value) / 2
        : align === "end"
          ? base - containerHeightValue.value + itemHeightValue.value
          : base;
    const clamped = Math.min(maxScrollTop.value, Math.max(0, next));
    scrollTop.value = clamped;
    if (scrollElement) scrollElement.scrollTop = clamped;
  }

  function reset() {
    scrollTop.value = 0;
    if (scrollElement) scrollElement.scrollTop = 0;
  }

  onUnmounted(() => {
    if (rafId && typeof cancelAnimationFrame !== "undefined")
      cancelAnimationFrame(rafId);
    resizeObserver?.disconnect();
    itemResizeObserver?.disconnect();
  });

  return {
    itemHeight: itemHeightValue,
    estimatedItemHeight,
    measuredItemHeight,
    containerHeight: containerHeightValue,
    measuredContainerHeight: measuredHeight,
    scrollTop,
    startIndex,
    endIndex,
    visibleItems,
    totalHeight,
    offsetY,
    onScroll,
    scrollToIndex,
    reset,
  };
}
