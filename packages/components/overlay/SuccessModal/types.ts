import type {
  StatusModalCloseReason,
  StatusModalEmits,
  StatusModalInitialFocus,
  StatusModalProps,
} from "../../internal/statusModal";

export interface SuccessModalProps extends StatusModalProps {}
export interface SuccessModalEmits extends StatusModalEmits {}
export type { StatusModalCloseReason, StatusModalInitialFocus };
