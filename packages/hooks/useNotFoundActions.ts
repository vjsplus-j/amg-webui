import { computed } from "vue";
import { trackEmit } from "@amg-webui/telemetry";

export interface NotFoundAction {
  key: string;
  label: string;
  disabled?: boolean;
}

interface NotFoundActionProps {
  actions?: NotFoundAction[];
  modelValue?: string;
  disabled?: boolean;
  loading?: boolean;
  retryable?: boolean;
  trackId?: string;
  telemetry?: boolean;
}

type NotFoundEmit = (event: string, ...args: unknown[]) => void;

export function useNotFoundActions(
  component: string,
  props: NotFoundActionProps,
  emit: NotFoundEmit,
  fallbackLabel: () => string,
) {
  const resolvedActions = computed<NotFoundAction[]>(() =>
    props.actions?.length
      ? props.actions
      : [{ key: "continue", label: fallbackLabel() }],
  );

  function runAction(action: NotFoundAction, event: MouseEvent) {
    if (props.disabled || props.loading || action.disabled) return;
    trackEmit({
      component,
      type: "action",
      trackId: props.trackId,
      telemetry: props.telemetry,
      payload: { key: action.key },
    });
    emit("update:modelValue", action.key);
    emit("change", action.key);
    emit("action", action, event);
    emit("click", event);
  }

  function retry(event: MouseEvent) {
    if (props.disabled || props.loading) return;
    trackEmit({
      component,
      type: "retry",
      trackId: props.trackId,
      telemetry: props.telemetry,
    });
    emit("retry", event);
  }

  function goHome(event: MouseEvent) {
    if (props.disabled || props.loading) {
      event.preventDefault();
      return;
    }
    trackEmit({
      component,
      type: "home",
      trackId: props.trackId,
      telemetry: props.telemetry,
    });
    emit("home", event);
  }

  return { resolvedActions, runAction, retry, goHome };
}
