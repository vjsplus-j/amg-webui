<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import { isClient } from "@amg-webui/utils/env";
import type { SelectProps, SelectEmits } from "./types";
import { useSelect } from "./useSelect";
import "./style.scss";

const props = withDefaults(defineProps<SelectProps>(), {
  options: () => [],
  size: "md",
  maxCollapseTags: 1,
  virtual: undefined,
  virtualThreshold: 60,
  filterDebounce: 200,
  telemetry: undefined,
});

const emit = defineEmits<SelectEmits>();
const { t } = useLocale();

const {
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
  close,
  shouldCloseAfterSelect,
  isOptionSelected,
  resolveSelectValue,
  resolveClearValue,
  resolveRemoveTagValue,
} = useSelect(props, (error, query) => emit("remote-error", error, query));

const handleTriggerClick = () => {
  toggle();
  if (isOpen.value) {
    emit("show");
  } else {
    emit("hide");
  }
};

const handleFocus = () => {
  emit("focus", {} as FocusEvent);
};

const handleBlur = () => {
  emit("blur", {} as FocusEvent);
};

const handleOptionClick = (
  option: (typeof props.options)[0],
  event: MouseEvent,
) => {
  if (option.disabled || props.disabled || props.readonly) return;
  const next = resolveSelectValue(option);
  emit("update:modelValue", next);
  emit("change", { originalEvent: event, value: next });
  if (shouldCloseAfterSelect()) {
    close();
    emit("hide");
  }
};

const handleClear = (event: MouseEvent) => {
  event.stopPropagation();
  const next = resolveClearValue();
  emit("update:modelValue", next);
  emit("clear");
};

const handleRemoveTag = (event: MouseEvent, value: string | number) => {
  event.stopPropagation();
  const next = resolveRemoveTagValue(value);
  emit("update:modelValue", next);
  emit("remove-tag", value);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) {
    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      toggle();
      emit("show");
    }
  } else if (event.key === "Escape") {
    event.preventDefault();
    close();
    emit("hide");
  }
};

onMounted(() => {
  if (!isClient) return;
  document.addEventListener("click", handleOutsideClick);
});

onUnmounted(() => {
  if (!isClient) return;
  document.removeEventListener("click", handleOutsideClick);
});

const handleOutsideClick = (event: MouseEvent) => {
  if (isOpen.value) {
    const target = event.target as HTMLElement;
    if (
      !triggerRef.value?.contains(target) &&
      !panelRef.value?.contains(target)
    ) {
      close();
      emit("hide");
    }
  }
};
</script>

<template>
  <div :class="selectClass" :style="{ ...style, ...selectStyle }">
    <div
      ref="triggerRef"
      :class="triggerClass"
      role="combobox"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-controls="listboxId"
      :aria-disabled="disabled || readonly || undefined"
      :aria-label="placeholder || t(LocaleKeys.component.select.aria)"
      tabindex="0"
      @click="handleTriggerClick"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
    >
      <span
        v-if="clearable && hasValue && !disabled && !readonly"
        class="vp-select__clear"
        role="button"
        :aria-label="t(LocaleKeys.component.select.clear)"
        @click="handleClear"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
          />
        </svg>
      </span>

      <div v-if="multiple && hasValue" class="vp-select__tags">
        <span
          v-for="tag in visibleTags"
          :key="String(tag.value)"
          class="vp-select__tag"
        >
          <span class="vp-select__tag-label">{{ tag.label }}</span>
          <span
            v-if="!disabled && !readonly"
            class="vp-select__tag-close"
            role="button"
            :aria-label="
              t(LocaleKeys.component.select.removeTag, { label: tag.label })
            "
            @click="handleRemoveTag($event, tag.value)"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
          </span>
        </span>
        <span
          v-if="collapsedCount > 0"
          class="vp-select__tag vp-select__tag--collapsed"
        >
          {{
            t(LocaleKeys.component.select.collapsedTags, {
              count: collapsedCount,
            })
          }}
        </span>
      </div>

      <span
        v-else
        :class="[
          'vp-select__label',
          { 'vp-select__label--placeholder': isPlaceholder },
        ]"
      >
        {{ displayLabel }}
      </span>

      <span class="vp-select__icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </span>
    </div>

    <div
      v-if="isOpen"
      ref="panelRef"
      :class="['vp-select__panel', panelClass]"
      :style="panelStyle"
    >
      <div v-if="showFilter" class="vp-select__filter-wrap">
        <input
          ref="filterRef"
          v-model="filterText"
          type="text"
          class="vp-select__filter"
          :placeholder="t(LocaleKeys.component.select.search)"
          :aria-label="t(LocaleKeys.component.select.search)"
          @click.stop
        />
      </div>

      <div
        ref="listRef"
        :id="listboxId"
        class="vp-select__list"
        role="listbox"
        :aria-label="t(LocaleKeys.component.select.listboxAria)"
        :aria-busy="loading || remoteLoading || undefined"
        @scroll="useVirtualScroll ? virtual.onScroll : undefined"
      >
        <div v-if="loading || remoteLoading" class="vp-select__loading">
          {{ t(LocaleKeys.component.select.loading) }}
        </div>

        <div
          v-else-if="filteredOptions.length === 0"
          class="vp-select__empty"
          role="status"
        >
          {{ t(LocaleKeys.component.select.empty) }}
        </div>

        <template v-else-if="useVirtualScroll">
          <div
            class="vp-select__virtual-spacer"
            :style="{ height: `${virtual.totalHeight.value}px` }"
          >
            <div
              class="vp-select__virtual-window"
              :style="{ transform: `translateY(${virtual.offsetY.value}px)` }"
            >
              <div
                v-for="{ item: option } in virtual.visibleItems.value"
                :key="String(option.value)"
                role="option"
                :class="[
                  'vp-select__option',
                  {
                    'vp-select__option--selected': isOptionSelected(option),
                    'vp-select__option--disabled': option.disabled,
                  },
                ]"
                :aria-selected="isOptionSelected(option)"
                :style="{ height: `${virtual.itemHeight.value}px` }"
                @click="handleOptionClick(option, $event)"
              >
                {{ option.label }}
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div
            v-for="option in filteredOptions"
            :key="String(option.value)"
            role="option"
            :class="[
              'vp-select__option',
              {
                'vp-select__option--selected': isOptionSelected(option),
                'vp-select__option--disabled': option.disabled,
              },
            ]"
            :aria-selected="isOptionSelected(option)"
            @click="handleOptionClick(option, $event)"
          >
            {{ option.label }}
          </div>
        </template>
      </div>
    </div>

    <slot />
  </div>
</template>
