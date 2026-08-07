import { ref, computed, watch, nextTick, useId } from "vue";
import { useVirtualList } from "@amg-webui/utils/data-display/useVirtualList";
import { onUnmounted } from "vue";
import type { SelectProps, SelectModelValue } from "./types";
import type { SelectOption } from "@amg-webui/types";

const DEFAULT_VIRTUAL_THRESHOLD = 60;
const PANEL_HEIGHT = 200;
const ITEM_HEIGHT = 36;

export function useSelect(
  props: SelectProps,
  onRemoteError?: (error: Error, query: string) => void,
) {
  const isOpen = ref(false);
  const filterText = ref("");
  const appliedFilterText = ref("");
  const remoteOptions = ref<SelectOption[] | null>(null);
  const remoteLoading = ref(false);
  const triggerRef = ref<HTMLElement | null>(null);
  const panelRef = ref<HTMLElement | null>(null);
  const filterRef = ref<HTMLInputElement | null>(null);
  const listRef = ref<HTMLElement | null>(null);
  const listboxId = useId();
  let filterTimer: ReturnType<typeof setTimeout> | undefined;
  let remoteController: AbortController | undefined;
  let remoteRequestId = 0;

  const sourceOptions = computed(
    () => remoteOptions.value ?? props.options ?? [],
  );

  const selectedValues = computed((): (string | number)[] => {
    if (!props.multiple) return [];
    const v = props.modelValue;
    if (Array.isArray(v)) return v as (string | number)[];
    if (v != null && v !== "") return [v as string | number];
    return [];
  });

  const hasValue = computed(() => {
    if (props.multiple) return selectedValues.value.length > 0;
    return props.modelValue != null && props.modelValue !== "";
  });

  const filteredOptions = computed(() => {
    const opts = sourceOptions.value;
    if (props.remote) return opts;
    if (!props.filterable || !appliedFilterText.value) return opts;
    const searchText = appliedFilterText.value.toLowerCase();
    return opts.filter((option) =>
      option.label.toLowerCase().includes(searchText),
    );
  });

  const useVirtualScroll = computed(() => {
    if (props.virtual === false) return false;
    if (props.virtual === true) return true;
    const threshold = props.virtualThreshold ?? DEFAULT_VIRTUAL_THRESHOLD;
    return filteredOptions.value.length > threshold;
  });

  const virtualSource = computed(() => filteredOptions.value);
  const virtual = useVirtualList(virtualSource, {
    itemHeight: ITEM_HEIGHT,
    containerHeight: PANEL_HEIGHT,
    containerRef: listRef,
  });

  const selectedTags = computed(() =>
    selectedValues.value.map((value) => {
      const opt = sourceOptions.value.find((o) => o.value === value);
      return { value, label: opt?.label ?? String(value) };
    }),
  );

  const maxTags = computed(() => props.maxCollapseTags ?? 1);

  const visibleTags = computed(() => {
    if (!props.multiple) return [];
    if (!props.collapseTags) return selectedTags.value;
    return selectedTags.value.slice(0, maxTags.value);
  });

  const collapsedCount = computed(() => {
    if (!props.multiple || !props.collapseTags) return 0;
    return Math.max(0, selectedTags.value.length - maxTags.value);
  });

  const displayLabel = computed(() => {
    if (props.multiple) return "";
    if (props.modelValue == null || props.modelValue === "") {
      return props.placeholder || "";
    }
    const option = sourceOptions.value.find(
      (o) => o.value === props.modelValue,
    );
    return option?.label || String(props.modelValue);
  });

  const isPlaceholder = computed(() => {
    if (props.multiple) return !hasValue.value && !!props.placeholder;
    return !hasValue.value && !!props.placeholder;
  });

  const showFilter = computed(() => props.filterable || props.remote);

  const triggerClass = computed(() => {
    const classes = ["vp-select__trigger"];

    const sizeClass: Record<string, string> = {
      xs: "vp-select__trigger--xs",
      sm: "vp-select__trigger--sm",
      md: "vp-select__trigger--md",
      lg: "vp-select__trigger--lg",
      xl: "vp-select__trigger--xl",
    };
    classes.push(sizeClass[props.size || "md"]);

    if (props.invalid) classes.push("vp-select__trigger--invalid");
    if (props.readonly) classes.push("vp-select__trigger--readonly");
    if (props.multiple) classes.push("vp-select__trigger--multiple");

    return classes.join(" ");
  });

  const selectClass = computed(() => {
    const classes = ["vp-select"];

    if (props.fluid) classes.push("vp-select--fluid");
    if (isOpen.value) classes.push("vp-select--open");
    if (props.class) classes.push(props.class);

    return classes.join(" ");
  });

  const selectStyle = computed(() => {
    const style: Record<string, string> = {};
    if (props.width) style.width = props.width;
    return style;
  });

  const isOptionSelected = (option: SelectOption): boolean => {
    if (props.multiple) {
      return selectedValues.value.includes(option.value as string | number);
    }
    return option.value === props.modelValue;
  };

  const resolveSelectValue = (option: SelectOption): SelectModelValue => {
    if (props.multiple) {
      const val = option.value as string | number;
      const current = selectedValues.value;
      if (current.includes(val)) {
        return current.filter((v) => v !== val);
      }
      return [...current, val];
    }
    return option.value as SelectModelValue;
  };

  const resolveClearValue = (): SelectModelValue =>
    props.multiple ? [] : undefined;

  const resolveRemoveTagValue = (value: string | number): SelectModelValue =>
    selectedValues.value.filter((v) => v !== value);

  const toggle = () => {
    if (props.disabled || props.readonly) return;
    isOpen.value = !isOpen.value;
  };

  const open = () => {
    if (props.disabled || props.readonly) return;
    isOpen.value = true;
    nextTick(() => {
      if (showFilter.value && filterRef.value) {
        filterRef.value.focus();
      }
    });
  };

  const close = () => {
    isOpen.value = false;
    remoteController?.abort();
    remoteController = undefined;
    remoteLoading.value = false;
    filterText.value = "";
    appliedFilterText.value = "";
    virtual.reset();
  };

  const shouldCloseAfterSelect = () => !props.multiple;

  async function runRemote(query: string) {
    if (!props.remote || !props.remoteMethod) return;
    remoteController?.abort();
    const controller = new AbortController();
    remoteController = controller;
    const requestId = ++remoteRequestId;
    remoteLoading.value = true;

    try {
      const result = await props.remoteMethod(query, {
        signal: controller.signal,
        requestId,
      });
      if (controller.signal.aborted || requestId !== remoteRequestId) return;
      if (Array.isArray(result)) remoteOptions.value = result;
    } catch (cause) {
      if (controller.signal.aborted || requestId !== remoteRequestId) return;
      const error = cause instanceof Error ? cause : new Error(String(cause));
      onRemoteError?.(error, query);
    } finally {
      if (requestId === remoteRequestId) remoteLoading.value = false;
    }
  }

  watch(filterText, (query) => {
    if (filterTimer) clearTimeout(filterTimer);
    filterTimer = setTimeout(
      () => {
        appliedFilterText.value = query;
        virtual.reset();
        if (isOpen.value) void runRemote(query);
      },
      Math.max(0, props.filterDebounce ?? 200),
    );
  });

  watch(isOpen, (openNow) => {
    if (openNow) void runRemote(appliedFilterText.value);
  });

  watch(filteredOptions, virtual.reset);

  onUnmounted(() => {
    if (filterTimer) clearTimeout(filterTimer);
    remoteController?.abort();
  });

  return {
    isOpen,
    filterText,
    triggerRef,
    panelRef,
    filterRef,
    listRef,
    listboxId,
    filteredOptions,
    displayLabel,
    isPlaceholder,
    hasValue,
    selectedTags,
    visibleTags,
    collapsedCount,
    triggerClass,
    selectClass,
    selectStyle,
    useVirtualScroll,
    virtual,
    remoteLoading,
    showFilter,
    toggle,
    open,
    close,
    shouldCloseAfterSelect,
    isOptionSelected,
    resolveSelectValue,
    resolveClearValue,
    resolveRemoveTagValue,
  };
}
