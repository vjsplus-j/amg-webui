<script setup lang="ts">
import { computed } from "vue";
import InputNumber from "../InputNumber/index.vue";
import { trackEmit } from "@amg-webui/telemetry";
import type { RangeInputProps, RangeInputEmits, RangeValue } from "./types";
import { useFormItem } from "../FormItem/useFormItem";
import "./style.scss";

defineOptions({ inheritAttrs: false, name: "RangeInput" });

const props = withDefaults(defineProps<RangeInputProps>(), {
  modelValue: () => ({ min: null, max: null }),
  precision: 0,
  step: 1,
  allowCross: false,
  telemetry: undefined,
});

const emit = defineEmits<RangeInputEmits>();

const {
  inputId,
  isDisabled,
  isInvalid,
  isRequired,
  ariaDescribedby,
  validateOnChange,
} = useFormItem({
  id: () => props.id,
  disabled: () => props.disabled,
  invalid: () => props.invalid,
});

const local = computed(() => props.modelValue ?? { min: null, max: null });

const emitValue = (next: RangeValue) => {
  let min = next.min ?? null;
  let max = next.max ?? null;
  if (!props.allowCross && min != null && max != null && min > max) {
    [min, max] = [max, min];
  }
  const value = { min, max };
  emit("update:modelValue", value);
  emit("change", value);
  void validateOnChange();
  trackEmit({
    component: "RangeInput",
    type: "change",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: value,
  });
};
</script>

<template>
  <div
    :id="inputId"
    :class="[
      'vp-range-input',
      { 'vp-range-input--invalid': isInvalid },
      props.class,
    ]"
    :style="style"
    data-component="RangeInput"
    role="group"
    :aria-label="ariaLabel"
    :aria-invalid="isInvalid || undefined"
    :aria-required="isRequired || undefined"
    :aria-describedby="ariaDescribedby"
  >
    <InputNumber
      class="vp-range-input__field"
      :model-value="local.min"
      :disabled="isDisabled"
      :step="step"
      :precision="precision"
      :min="min"
      :max="max"
      :invalid="isInvalid"
      :placeholder="startPlaceholder"
      skip-form-item
      @update:model-value="emitValue({ ...local, min: $event })"
    />
    <span class="vp-range-input__sep" aria-hidden="true">–</span>
    <InputNumber
      class="vp-range-input__field"
      :model-value="local.max"
      :disabled="isDisabled"
      :step="step"
      :precision="precision"
      :min="min"
      :max="max"
      :invalid="isInvalid"
      :placeholder="endPlaceholder"
      skip-form-item
      @update:model-value="emitValue({ ...local, max: $event })"
    />
  </div>
</template>
