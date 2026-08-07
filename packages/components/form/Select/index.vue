<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import { isClient, resolveKeyboardNavAction } from "@amg-webui/utils";
import type { SelectProps, SelectEmits } from "./types";
import { useSelect } from "./useSelect";
import { useFormItem } from "../FormItem/useFormItem";
import { useNativeInputAttrs } from "../FormItem/useNativeInputAttrs";
import "./style.scss";

defineOptions({ inheritAttrs: false, name: "Select" });

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
  inputId,
  isDisabled,
  isInvalid,
  isRequired,
  ariaDescribedby,
  validateOnBlur,
  validateOnChange,
} = useFormItem({
  id: () => props.id,
  disabled: () => props.disabled,
  invalid: () => props.invalid,
  name: () => props.name,
});

const { nativeAttrs } = useNativeInputAttrs();

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
  panelMergedStyle,
  useVirtualScroll,
  virtual,
  remoteLoading,
  showFilter,
  activeIndex,
  toggle,
  open,
  close,
  shouldCloseAfterSelect,
  isOptionSelected,
  resolveSelectValue,
  resolveClearValue,
  resolveRemoveTagValue,
  applyKeyboardAction,
  resolveActiveOption,
} = useSelect(props, (error, query) => emit("remote-error", error, query));

const handleTriggerClick = () => {
  if (isDisabled.value || props.readonly) return;
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
  void validateOnBlur();
};

const handleOptionClick = (
  option: (typeof props.options)[0],
  event: MouseEvent,
) => {
  if (option.disabled || isDisabled.value || props.readonly) return;
  const next = resolveSelectValue(option);
  emit("update:modelValue", next);
  emit("change", { originalEvent: event, value: next });
  void validateOnChange();
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
  void validateOnChange();
};

const handleRemoveTag = (event: MouseEvent, value: string | number) => {
  event.stopPropagation();
  const next = resolveRemoveTagValue(value);
  emit("update:modelValue", next);
  emit("remove-tag", value);
  void validateOnChange();
};

const handleKeydown = (event: KeyboardEvent) => {
  if (isDisabled.value || props.readonly) return;
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
    return;
  }

  const target = event.target as HTMLElement | null;
  const inFilter =
    Boolean(filterRef.value) &&
    (target === filterRef.value ||
      Boolean(target?.closest?.(".vp-select__filter")));

  const action = resolveKeyboardNavAction(event, { orientation: "vertical" });
  // Let the filter input accept Space / printable text; still handle Escape / arrows / Enter.
  if (inFilter && action === "select" && event.key === " ") return;
  if (action === "none") return;
  event.preventDefault();
  const handled = applyKeyboardAction(action);
  if (action === "close" && handled) {
    emit("hide");
    return;
  }
  if (action === "select") {
    const opt = resolveActiveOption();
    if (opt) handleOptionClick(opt, event as unknown as MouseEvent);
  }
};

const focus = () => {
  triggerRef.value?.focus();
};

const blur = () => {
  triggerRef.value?.blur();
};

const clear = () => {
  if (isDisabled.value || props.readonly) return;
  const next = resolveClearValue();
  emit("update:modelValue", next);
  emit("clear");
  void validateOnChange();
};

const closeAndHide = () => {
  close();
  emit("hide");
};

const openAndShow = () => {
  open();
  emit("show");
};

defineExpose({
  focus,
  blur,
  open: openAndShow,
  close: closeAndHide,
  clear,
});

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
      v-bind="nativeAttrs"
      :id="inputId"
      :class="triggerClass"
      role="combobox"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-controls="listboxId"
      :aria-disabled="isDisabled || readonly || undefined"
      :aria-invalid="isInvalid || undefined"
      :aria-required="isRequired || undefined"
      :aria-describedby="ariaDescribedby"
      :aria-label="placeholder || t(LocaleKeys.component.select.aria)"
      tabindex="0"
      @click="handleTriggerClick"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
    >
      <span
        v-if="clearable && hasValue && !isDisabled && !readonly"
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
            v-if="!isDisabled && !readonly"
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

    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="panelRef"
        :class="['vp-select__panel', panelClass]"
        :style="panelMergedStyle"
        @keydown="handleKeydown"
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
            @keydown="handleKeydown"
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
                  v-for="{ item: option, index } in virtual.visibleItems.value"
                  :key="String(option.value)"
                  role="option"
                  :class="[
                    'vp-select__option',
                    {
                      'vp-select__option--selected': isOptionSelected(option),
                      'vp-select__option--active': activeIndex === index,
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
              v-for="(option, index) in filteredOptions"
              :key="String(option.value)"
              role="option"
              :class="[
                'vp-select__option',
                {
                  'vp-select__option--selected': isOptionSelected(option),
                  'vp-select__option--active': activeIndex === index,
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
    </Teleport>

    <slot />
  </div>
</template>
