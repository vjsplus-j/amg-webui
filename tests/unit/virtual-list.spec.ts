import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, ref, defineComponent, h } from "vue";
import { useVirtualList } from "@amg-webui/utils/data-display/useVirtualList";
import { useVirtualColumns } from "@amg-webui/utils/data-display/useVirtualColumns";
import { sortRowsSync } from "@amg-webui/utils/data-display/sortRows";
import {
  parseWidthToPx,
  readCssPx,
} from "@amg-webui/utils/data-display/cssMeasure";

describe("virtual list height contract", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        cb: ResizeObserverCallback;
        constructor(cb: ResizeObserverCallback) {
          this.cb = cb;
        }
        observe(el: Element) {
          this.cb(
            [
              {
                target: el,
                contentRect: {
                  height: (el as HTMLElement).clientHeight || 200,
                  width: (el as HTMLElement).clientWidth || 400,
                },
              } as ResizeObserverEntry,
            ],
            this as unknown as ResizeObserver,
          );
        }
        unobserve() {}
        disconnect() {}
      },
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses containerHeight fallback until ResizeObserver measures", async () => {
    const Host = defineComponent({
      setup() {
        const items = ref(Array.from({ length: 100 }, (_, id) => ({ id })));
        const containerRef = ref<HTMLElement | null>(null);
        const api = useVirtualList(items, {
          containerHeight: 240,
          itemHeight: 40,
          containerRef,
          overscan: 0,
        });
        return () =>
          h("div", {
            ref: containerRef,
            style: { height: "240px" },
            "data-visible": api.visibleItems.value.length,
            "data-total": api.totalHeight.value,
          });
      },
    });
    const wrapper = mount(Host);
    await nextTick();
    expect(Number(wrapper.attributes("data-total"))).toBe(4000);
    expect(Number(wrapper.attributes("data-visible"))).toBeGreaterThanOrEqual(5);
  });

  it("windows columns by scrollLeft and keeps fixed columns out of the slice", () => {
    const columns = ref(
      Array.from({ length: 20 }, (_, i) => ({
        key: `c${i}`,
        width: 100,
        fixed: i === 0 ? ("left" as const) : undefined,
      })),
    );
    const enabled = ref(true);
    const api = useVirtualColumns(columns, {
      containerWidth: 350,
      enabled,
      overscan: 0,
    });
    expect(api.fixedLeft.value).toHaveLength(1);
    expect(api.visibleScrollable.value[0]?.column.key).toBe("c1");
    // emulate scroll into middle
    (api as { scrollLeft: { value: number } }).scrollLeft.value = 500;
    expect(api.startIndex.value).toBeGreaterThan(0);
    expect(api.offsetX.value).toBe(api.startIndex.value * 100);
  });
});

describe("sortRowsSync", () => {
  it("sorts numeric and string cells", () => {
    const rows = [
      { id: 2, name: "b" },
      { id: 1, name: "a" },
      { id: 10, name: "c" },
    ];
    expect(sortRowsSync(rows, "id", "asc").map((r) => r.id)).toEqual([1, 2, 10]);
    expect(sortRowsSync(rows, "name", "desc").map((r) => r.name)).toEqual([
      "c",
      "b",
      "a",
    ]);
  });
});

describe("cssMeasure", () => {
  it("parses width strings", () => {
    expect(parseWidthToPx("120px", 80)).toBe(120);
    expect(parseWidthToPx("2rem", 80, 16)).toBe(32);
    expect(parseWidthToPx(undefined, 80)).toBe(80);
  });

  it("falls back when element is missing", () => {
    expect(readCssPx(null, "--spacing-xs", 4)).toBe(4);
  });
});
