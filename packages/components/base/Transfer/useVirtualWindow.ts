import type { Ref } from "vue";
import { useVirtualList } from "@amg-webui/utils/data-display/useVirtualList";

const ITEM_HEIGHT = 36;
const OVERSCAN = 4;

export function useVirtualWindow<T>(
  items: Ref<T[]>,
  containerHeight = 280,
  containerRef?: Ref<HTMLElement | null>,
) {
  const virtual = useVirtualList(items, {
    itemHeight: ITEM_HEIGHT,
    containerHeight,
    overscan: OVERSCAN,
    containerRef,
  });

  return {
    ITEM_HEIGHT,
    ...virtual,
  };
}
