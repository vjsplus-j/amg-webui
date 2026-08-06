<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import InputText from "../InputText/index.vue";
import FilterBar from "../FilterBar/index.vue";
import Button from "../Button/index.vue";
import type { SearchFilterPanelProps, SearchFilterPanelEmits } from "./types";
import type { FilterCondition } from "../FilterBar/types";
import { trackEmit } from "@amg-webui/telemetry";
import "./style.scss";

const props = withDefaults(defineProps<SearchFilterPanelProps>(), {
  keyword: "",
  modelValue: () => [],
  fields: () => [],
  collapsed: false,
  loading: false,
  debounce: 400,
  searchOnInput: true,
  telemetry: undefined,
});

const emit = defineEmits<SearchFilterPanelEmits>();
const { t } = useLocale();

const localKeyword = ref(props.keyword);
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(
  () => props.keyword,
  (value) => {
    localKeyword.value = value;
  },
);

function clearDebounce() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = null;
}

function dispatchSearch(
  keyword = localKeyword.value,
  conditions = props.modelValue ?? [],
) {
  if (props.disabled || props.loading) return;
  const payload = { keyword, conditions };
  trackEmit({
    component: "SearchFilterPanel",
    type: "search",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { keyword, conditionCount: conditions.length },
  });
  emit("search", payload);
  emit("change", payload);
}

const onKeyword = (value: string) => {
  localKeyword.value = value;
  emit("update:keyword", value);
  clearDebounce();
  if (!props.searchOnInput) return;
  debounceTimer = setTimeout(
    () => {
      dispatchSearch(value);
    },
    Math.max(0, props.debounce),
  );
};

const onSearch = () => {
  clearDebounce();
  dispatchSearch();
};

const onReset = () => {
  if (props.disabled || props.loading) return;
  clearDebounce();
  localKeyword.value = "";
  emit("update:keyword", "");
  emit("update:modelValue", []);
  emit("reset");
  emit("change", { keyword: "", conditions: [] });
};

function onConditions(value: FilterCondition[]) {
  emit("update:modelValue", value);
}

function onCollapsed(value: boolean) {
  emit("update:collapsed", value);
}

function onFilterSearch(conditions: FilterCondition[]) {
  clearDebounce();
  dispatchSearch(localKeyword.value, conditions);
}

onBeforeUnmount(clearDebounce);
defineExpose({
  search: onSearch,
  reset: onReset,
  cancelPendingSearch: clearDebounce,
});
</script>

<template>
  <form
    :class="['vp-search-filter-panel', props.class]"
    :style="style"
    data-component="SearchFilterPanel"
    role="search"
    :aria-label="ariaLabel"
    @submit.prevent="onSearch"
  >
    <div class="vp-search-filter-panel__search">
      <InputText
        class="vp-search-filter-panel__keyword"
        :model-value="localKeyword"
        :disabled="disabled"
        :placeholder="t(LocaleKeys.common.search)"
        @update:model-value="onKeyword"
      />
      <Button
        :label="
          loading ? t(LocaleKeys.common.loading) : t(LocaleKeys.common.search)
        "
        :loading="loading"
        :disabled="disabled"
        @click="onSearch"
      />
      <Button
        variant="outlined"
        :label="t(LocaleKeys.button.reset)"
        :disabled="disabled"
        @click="onReset"
      />
    </div>
    <FilterBar
      :model-value="modelValue"
      :fields="fields"
      :collapsed="collapsed"
      :loading="loading"
      :disabled="disabled"
      @update:model-value="onConditions"
      @update:collapsed="onCollapsed"
      @search="onFilterSearch"
      @reset="onReset"
    />
    <slot />
  </form>
</template>
