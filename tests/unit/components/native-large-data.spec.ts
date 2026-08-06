import { beforeAll, afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { LocaleService } from "@amg-webui/locale";
import DataTable from "../../../packages/components/base/DataTable/index.vue";
import VirtualTable from "../../../packages/components/base/VirtualTable/index.vue";
import Tree from "../../../packages/components/base/Tree/index.vue";
import LazyTree from "../../../packages/components/base/LazyTree/index.vue";
import VirtualTree from "../../../packages/components/base/VirtualTree/index.vue";
import Select from "../../../packages/components/base/Select/index.vue";
import Transfer from "../../../packages/components/base/Transfer/index.vue";

beforeAll(() => LocaleService.init());
afterEach(() => vi.useRealTimers());

const rows = Array.from({ length: 10_000 }, (_, id) => ({
  id,
  name: `Row ${id}`,
}));
const treeNodes = Array.from({ length: 2_000 }, (_, id) => ({
  label: `Node ${id}`,
  value: id,
  isLeaf: true,
}));
const selectOptions = Array.from({ length: 10_000 }, (_, id) => ({
  label: `Option ${id}`,
  value: id,
}));
const transferItems = Array.from({ length: 10_000 }, (_, id) => ({
  key: id,
  label: `Item ${id}`,
}));

describe("native large-data readiness", () => {
  it("DataTable virtualizes 10k rows and clamps the window after data shrinks", async () => {
    vi.useFakeTimers();
    const wrapper = mount(DataTable, {
      props: {
        value: rows,
        columns: [{ field: "name", header: "Name" }],
      },
    });

    expect(wrapper.findAll(".vp-datatable__body tbody tr").length).toBeLessThan(
      30,
    );
    const body = wrapper.get(".vp-datatable__body");
    body.element.scrollTop = 400_000;
    await body.trigger("scroll");
    await vi.advanceTimersByTimeAsync(20);
    await wrapper.setProps({ value: rows.slice(0, 5) });
    await nextTick();

    expect(body.element.scrollTop).toBe(0);
    expect(wrapper.findAll(".vp-datatable__body tbody tr")).toHaveLength(5);
  });

  it("DataTable lazy mode emits debounced filters without reprocessing server rows", async () => {
    vi.useFakeTimers();
    const wrapper = mount(DataTable, {
      props: {
        value: rows.slice(0, 2),
        columns: [{ field: "name", header: "Name" }],
        filterGlobal: true,
        filterDebounce: 100,
        lazy: true,
        virtual: false,
        totalRecords: 10_000,
      },
    });

    await wrapper
      .get(".vp-datatable__filter input")
      .setValue("not-on-this-page");
    expect(wrapper.findAll(".vp-datatable__body tbody tr")).toHaveLength(2);
    expect(wrapper.emitted("filter")).toBeUndefined();
    await vi.advanceTimersByTimeAsync(100);
    expect(wrapper.emitted("filter")?.[0]).toEqual([
      { global: "not-on-this-page", fields: {} },
    ]);
    expect(wrapper.findAll(".vp-datatable__body tbody tr")).toHaveLength(2);
  });

  it("VirtualTable keeps a bounded DOM and debounces large local searches", async () => {
    vi.useFakeTimers();
    const wrapper = mount(VirtualTable, {
      props: {
        rows,
        columns: [{ field: "name", header: "Name", sortable: true }],
        filterDebounce: 200,
      },
    });

    expect(wrapper.findAll(".vp-virtual-table__row").length).toBeLessThan(30);
    await wrapper.get(".vp-virtual-table__filter").setValue("Row 9999");
    expect(wrapper.text()).not.toContain("Row 9999");
    await vi.advanceTimersByTimeAsync(200);
    await nextTick();
    expect(wrapper.text()).toContain("Row 9999");
  });

  it("Tree auto-enables virtual scrolling and debounces recursive filtering", async () => {
    vi.useFakeTimers();
    const wrapper = mount(Tree, {
      props: { options: treeNodes, filterDebounce: 200 },
    });

    expect(wrapper.classes()).toContain("vp-tree--virtual");
    expect(wrapper.findAll(".vp-tree__row").length).toBeLessThan(30);
    await wrapper.get(".vp-tree__search").setValue("Node 1999");
    expect(wrapper.text()).not.toContain("Node 1999");
    await vi.advanceTimersByTimeAsync(200);
    await nextTick();
    expect(wrapper.findAll(".vp-tree__row")).toHaveLength(1);
    expect(wrapper.text()).toContain("Node 1999");
  });

  it("VirtualTree honors an explicit virtual=false escape hatch", () => {
    const wrapper = mount(VirtualTree, {
      props: { options: treeNodes.slice(0, 120), virtual: false },
    });
    expect(wrapper.findAll(".vp-virtual-tree__row")).toHaveLength(120);
  });

  it("LazyTree virtualizes large roots, deduplicates loads and reports failures", async () => {
    let reject = false;
    const load = vi.fn(async () => {
      if (reject) throw new Error("load failed");
      return [{ label: "Loaded child", value: "child", isLeaf: true }];
    });
    const options = [
      { label: "Lazy root", value: "lazy" },
      ...treeNodes.slice(1),
    ];
    const wrapper = mount(LazyTree, { props: { options, load } });

    expect(wrapper.classes()).toContain("vp-lazy-tree--virtual");
    const firstToggle = wrapper.get(".vp-lazy-tree__toggle");
    await Promise.all([
      firstToggle.trigger("click"),
      firstToggle.trigger("click"),
    ]);
    await flushPromises();
    expect(load).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain("Loaded child");

    reject = true;
    await wrapper.setProps({
      options: [
        { label: "Failing root", value: "fail" },
        ...treeNodes.slice(1),
      ],
    });
    await wrapper.get(".vp-lazy-tree__toggle").trigger("click");
    await flushPromises();
    expect(wrapper.emitted("load-error")?.[0]?.[0]).toBeInstanceOf(Error);
  });

  it("Select virtualizes 10k options and cancels stale remote searches", async () => {
    vi.useFakeTimers();
    const contexts: AbortSignal[] = [];
    const remoteMethod = vi.fn(
      async (query: string, context: { signal: AbortSignal }) => {
        contexts.push(context.signal);
        return selectOptions.filter((option) => option.label.includes(query));
      },
    );
    const wrapper = mount(Select, {
      props: {
        remote: true,
        filterable: true,
        remoteMethod,
        filterDebounce: 200,
      },
    });

    await wrapper.get(".vp-select__trigger").trigger("click");
    await flushPromises();
    expect(wrapper.findAll(".vp-select__option").length).toBeLessThan(30);
    const input = wrapper.get(".vp-select__filter");
    await input.setValue("9");
    await input.setValue("99");
    await vi.advanceTimersByTimeAsync(200);
    await flushPromises();

    expect(remoteMethod).toHaveBeenCalledTimes(2);
    expect(contexts[0]?.aborted).toBe(true);
    expect(wrapper.findAll(".vp-select__option").length).toBeLessThan(30);
  });

  it("Transfer virtualizes both 5k panels and debounces its filter event", async () => {
    vi.useFakeTimers();
    const wrapper = mount(Transfer, {
      props: {
        data: transferItems,
        modelValue: transferItems.slice(5_000).map((item) => item.key),
        filterable: true,
        filterDebounce: 200,
      },
    });

    expect(wrapper.findAll(".vp-transfer__item").length).toBeLessThan(40);
    await wrapper.findAll('input[type="text"]')[0]!.setValue("Item 4999");
    expect(wrapper.emitted("filter-change")).toBeUndefined();
    await vi.advanceTimersByTimeAsync(200);
    await nextTick();

    expect(wrapper.emitted("filter-change")?.[0]).toEqual([
      { direction: "left", query: "Item 4999" },
    ]);
    expect(
      wrapper.findAll(".vp-transfer__panel")[0]!.findAll(".vp-transfer__item"),
    ).toHaveLength(1);
    expect(wrapper.text()).toContain("Item 4999");
  });
});
