import type {
  StatusModalCloseReason,
  StatusModalEmits,
  StatusModalInitialFocus,
  StatusModalProps,
} from "../../internal/statusModal";

export interface InfoModalProps extends StatusModalProps {}
export interface InfoModalEmits extends StatusModalEmits {}
export type { StatusModalCloseReason, StatusModalInitialFocus };
