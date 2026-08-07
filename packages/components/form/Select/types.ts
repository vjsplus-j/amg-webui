import { SelectOption, Size, BaseProps } from "@amg-webui/types";

export interface SelectRemoteContext {
  /** Cancelled when a newer query starts or the dropdown closes. */
  signal: AbortSignal;
  /** Monotonically increasing id for latest-request-wins integrations. */
  requestId: number;
}

/** Bound value for single or multiple selection */
export type SelectModelValue =
  string | number | boolean | (string | number)[] | undefined;

export interface SelectProps extends BaseProps {
  /** Native id — falls back to FormItem field id when nested */
  id?: string;
  /** Native name — falls back to FormItem `prop` when nested */
  name?: string;
  /** v-model — scalar for single mode, array for `multiple` */
  modelValue?: SelectModelValue;
  /** Option list rendered in the dropdown */
  options?: SelectOption[];
  /** Placeholder when nothing is selected */
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  /** Local filter on option labels */
  filterable?: boolean;
  /** Show clear control when a value is present */
  clearable?: boolean;
  invalid?: boolean;
  size?: Size;
  /** Stretch to container width */
  fluid?: boolean;
  width?: string;
  panelClass?: string;
  panelStyle?: Record<string, string>;
  /**
   * Multi-select mode — `modelValue` becomes `(string | number)[]`.
   * Dropdown stays open after each pick; selected values render as tags.
   */
  multiple?: boolean;
  /**
   * Collapse excess tags to `+N` (multiple mode only).
   * @default false
   */
  collapseTags?: boolean;
  /**
   * Max visible tags before collapse when `collapseTags` is true.
   * @default 1
   */
  maxCollapseTags?: number;
  /**
   * Enable virtual scrolling in the dropdown.
   * When `undefined`, auto-enables when option count exceeds `virtualThreshold`.
   * Set `false` to force full DOM render.
   */
  virtual?: boolean;
  /**
   * Option count threshold for auto virtual scroll.
   * @default 60
   */
  virtualThreshold?: number;
  /** Delay local and remote filtering to avoid repeated large-list work. @default 200 */
  filterDebounce?: number;
  /**
   * Remote search — skips local filtering; call `remoteMethod` on filter input.
   * Implies filterable search input when open.
   */
  remote?: boolean;
  /**
   * Invoked with the current filter query when `remote` is true.
   * Returning options enables built-in latest-request-wins handling; returning
   * void remains compatible with externally controlled `options`.
   */
  remoteMethod?: (
    query: string,
    context: SelectRemoteContext,
  ) => void | SelectOption[] | Promise<void | SelectOption[]>;
  /** Loading indicator while remote options are fetched */
  loading?: boolean;
}

export interface SelectEmits {
  (e: "update:modelValue", value: SelectModelValue): void;
  (e: "change", event: { originalEvent: Event; value: SelectModelValue }): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
  (e: "show"): void;
  (e: "hide"): void;
  (e: "clear"): void;
  /** Fired when a tag is removed in multiple mode */
  (e: "remove-tag", value: string | number): void;
  /** Fired for a non-abort remote lookup failure. */
  (e: "remote-error", error: Error, query: string): void;
}
