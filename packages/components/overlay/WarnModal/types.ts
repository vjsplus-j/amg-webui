import type {
  StatusModalCloseReason,
  StatusModalEmits,
  StatusModalInitialFocus,
  StatusModalProps,
} from "../../internal/statusModal";

export interface WarnModalProps extends StatusModalProps {}
export interface WarnModalEmits extends StatusModalEmits {}
export type { StatusModalCloseReason, StatusModalInitialFocus };
