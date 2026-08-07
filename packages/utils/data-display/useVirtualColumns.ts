import {
  computed,
  onUnmounted,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from "vue";

const DEFAULT_OVERSCAN = 2;
const DEFAULT_CONTAINER_WIDTH = 640;

export interface VirtualColumnSpec {
  key: string;
  width: number;
  fixed?: "left" | "right";
}

export interface VirtualColumnsOptions {
  containerRef?: Ref<HTMLElement | null>;
  containerWidth?: MaybeRefOrGetter<number>;
  overscan?: MaybeRefOrGetter<number>;
  enabled?: MaybeRefOrGetter<boolean>;
}

export function useVirtualColumns(
  columns: Ref<VirtualColumnSpec[]>,
  options: VirtualColumnsOptions = {},
) {
  const scrollLeft = ref(0);
  const measuredWidth = ref(0);
  let scrollElement: HTMLElement | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let rafId = 0;

  const enabled = computed(() => toValue(options.enabled) !== false);
  const overscanValue = computed(() =>
    Math.max(0, Math.floor(Number(toValue(options.overscan) ?? DEFAULT_OVERSCAN))),
  );
  const containerWidthValue = computed(() =>
    Math.max(
      1,
      measuredWidth.value ||
        Number(toValue(options.containerWidth) ?? DEFAULT_CONTAINER_WIDTH),
    ),
  );

  const fixedLeft = computed(() =>
    columns.value.filter((column) => column.fixed === "left"),
  );
  const fixedRight = computed(() =>
    columns.value.filter((column) => column.fixed === "right"),
  );
  const scrollable = computed(() =>
    columns.value.filter(
      (column) => column.fixed !== "left" && column.fixed !== "right",
    ),
  );

  const fixedLeftWidth = computed(() =>
    fixedLeft.value.reduce((sum, column) => sum + column.width, 0),
  );
  const fixedRightWidth = computed(() =>
    fixedRight.value.reduce((sum, column) => sum + column.width, 0),
  );
  const scrollableWidth = computed(() =>
    scrollable.value.reduce((sum, column) => sum + column.width, 0),
  );
  const totalWidth = computed(
    () =>
      fixedLeftWidth.value + scrollableWidth.value + fixedRightWidth.value,
  );

  const prefixes = computed(() => {
    const offsets: number[] = [0];
    let acc = 0;
    for (const column of scrollable.value) {
      acc += column.width;
      offsets.push(acc);
    }
    return offsets;
  });

  const viewportForScrollable = computed(() =>
    Math.max(
      1,
      containerWidthValue.value - fixedLeftWidth.value - fixedRightWidth.value,
    ),
  );

  const startIndex = computed(() => {
    if (!enabled.value) return 0;
    const offsets = prefixes.value;
    const target = Math.max(0, scrollLeft.value);
    let lo = 0;
    let hi = Math.max(0, scrollable.value.length - 1);
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if ((offsets[mid] ?? 0) <= target) lo = mid;
      else hi = mid - 1;
    }
    return Math.max(0, lo - overscanValue.value);
  });

  const endIndex = computed(() => {
    if (!enabled.value) return scrollable.value.length;
    const offsets = prefixes.value;
    const target = scrollLeft.value + viewportForScrollable.value;
    let lo = startIndex.value;
    let hi = scrollable.value.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if ((offsets[mid] ?? 0) < target) lo = mid + 1;
      else hi = mid;
    }
    return Math.min(
      scrollable.value.length,
      lo + overscanValue.value,
    );
  });

  const visibleScrollable = computed(() => {
    if (!enabled.value) {
      return scrollable.value.map((column, index) => ({ column, index }));
    }
    return scrollable.value
      .slice(startIndex.value, endIndex.value)
      .map((column, offset) => ({
        column,
        index: startIndex.value + offset,
      }));
  });

  const offsetX = computed(() =>
    enabled.value ? (prefixes.value[startIndex.value] ?? 0) : 0,
  );
  const trailingWidth = computed(() => {
    if (!enabled.value) return 0;
    const end = prefixes.value[endIndex.value] ?? scrollableWidth.value;
    return Math.max(0, scrollableWidth.value - end);
  });

  const maxScrollLeft = computed(() =>
    Math.max(0, totalWidth.value - containerWidthValue.value),
  );

  function syncContainer(element: HTMLElement | null) {
    resizeObserver?.disconnect();
    scrollElement = element;
    measuredWidth.value = element?.clientWidth ?? 0;
    if (!element || typeof ResizeObserver === "undefined") return;
    resizeObserver = new ResizeObserver(([entry]) => {
      measuredWidth.value = Math.round(
        entry?.contentRect.width || element.clientWidth,
      );
    });
    resizeObserver.observe(element);
  }

  if (options.containerRef) {
    watch(options.containerRef, syncContainer, {
      immediate: true,
      flush: "post",
    });
  }

  watch(
    () =>
      [columns.value.length, containerWidthValue.value, totalWidth.value] as const,
    () => {
      const next = Math.min(scrollLeft.value, maxScrollLeft.value);
      if (next === scrollLeft.value) return;
      scrollLeft.value = next;
      if (scrollElement && scrollElement.scrollLeft > next) {
        scrollElement.scrollLeft = next;
      }
    },
    { flush: "sync" },
  );

  function commitScroll(element: HTMLElement) {
    scrollElement = element;
    scrollLeft.value = Math.min(
      Math.max(0, element.scrollLeft),
      maxScrollLeft.value,
    );
    rafId = 0;
  }

  function onScroll(event: Event) {
    const element = (event.currentTarget ?? event.target) as HTMLElement;
    if (rafId && typeof cancelAnimationFrame !== "undefined") {
      cancelAnimationFrame(rafId);
    }
    if (typeof requestAnimationFrame === "undefined") {
      commitScroll(element);
      return;
    }
    rafId = requestAnimationFrame(() => commitScroll(element));
  }

  function reset() {
    scrollLeft.value = 0;
    if (scrollElement) scrollElement.scrollLeft = 0;
  }

  onUnmounted(() => {
    if (rafId && typeof cancelAnimationFrame !== "undefined") {
      cancelAnimationFrame(rafId);
    }
    resizeObserver?.disconnect();
  });

  return {
    enabled,
    scrollLeft,
    containerWidth: containerWidthValue,
    fixedLeft,
    fixedRight,
    visibleScrollable,
    totalWidth,
    offsetX,
    trailingWidth,
    fixedLeftWidth,
    fixedRightWidth,
    startIndex,
    endIndex,
    onScroll,
    reset,
  };
}
