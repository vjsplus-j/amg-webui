<script setup lang="ts">
import { computed } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import { LocaleKeys } from "@amg-webui/locale";
import Icon from "../Icon/index.vue";
import type { TemplateDragProps, TemplateDragEmits } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<TemplateDragProps>(), {
  templates: () => [],
  loading: false,
  disabled: false,
  telemetry: undefined,
});
const emit = defineEmits<TemplateDragEmits>();
const { t } = useLocale();
const titleText = computed(
  () => props.title ?? t("component.template-drag.title"),
);

function onDragStart(e: DragEvent, tpl: (typeof props.templates)[number]) {
  if (props.disabled || tpl.disabled) {
    e.preventDefault();
    return;
  }
  e.dataTransfer?.setData("application/vp-template-id", tpl.id);
  if (e.dataTransfer) e.dataTransfer.effectAllowed = "copy";
  emit("dragStart", tpl, e);
}
function onDragEnd(e: DragEvent, tpl: (typeof props.templates)[number]) {
  emit("dragEnd", tpl, e);
}
function onClick(tpl: (typeof props.templates)[number]) {
  if (props.disabled || tpl.disabled) return;
  emit("apply", tpl);
  trackEmit({
    component: "TemplateDrag",
    type: "apply",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { id: tpl.id },
  });
}
function refresh() {
  emit("refresh");
  trackEmit({
    component: "TemplateDrag",
    type: "refresh",
    trackId: props.trackId,
    telemetry: props.telemetry,
  });
}
</script>

<template>
  <section
    :class="['vp-template-drag', 'vp-template-drag__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-template-drag-title"
    data-component="TemplateDrag"
  >
    <header class="vp-template-drag__header">
      <h3 id="vp-template-drag-title" class="vp-template-drag__title">
        {{ titleText }}
      </h3>
    </header>
    <div v-if="loading" class="vp-template-drag__loading" role="status">
      {{ t(LocaleKeys.common.loading) }}
    </div>
    <ul v-else class="vp-template-drag__list" role="listbox">
      <li
        v-for="tpl in templates"
        :key="tpl.id"
        :class="[
          'vp-template-drag__item',
          { 'vp-template-drag__item--disabled': tpl.disabled },
        ]"
        :draggable="!disabled && !tpl.disabled"
        role="option"
        :aria-disabled="disabled || tpl.disabled"
        :tabindex="disabled || tpl.disabled ? -1 : 0"
        @dragstart="onDragStart($event, tpl)"
        @dragend="onDragEnd($event, tpl)"
        @click="onClick(tpl)"
        @keydown.enter.prevent="onClick(tpl)"
        @keydown.space.prevent="onClick(tpl)"
      >
        <Icon v-if="tpl.icon" :name="tpl.icon" size="sm" /><span
          ><strong>{{ tpl.name }}</strong
          ><small v-if="tpl.description">{{ tpl.description }}</small></span
        >
      </li>
      <p v-if="!templates.length" class="vp-template-drag__empty">
        {{ t(LocaleKeys.common.noData) }}
      </p>
    </ul>
    <div class="vp-template-drag__toolbar">
      <button
        type="button"
        class="vp-template-drag__btn vp-template-drag__btn--ghost"
        :disabled="disabled"
        @click="refresh"
      >
        {{ t(LocaleKeys.button.refresh) }}
      </button>
    </div>
  </section>
</template>
