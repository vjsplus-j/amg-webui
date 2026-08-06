import type {
  StatusModalCloseReason,
  StatusModalEmits,
  StatusModalInitialFocus,
  StatusModalProps,
} from "../../internal/statusModal";

export interface ErrorModalProps extends StatusModalProps {}
export interface ErrorModalEmits extends StatusModalEmits {}
export type { StatusModalCloseReason, StatusModalInitialFocus };
