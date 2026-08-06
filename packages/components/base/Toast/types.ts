import type {
  NoticeCloseReason,
  NoticeEmits,
  NoticeProps,
} from "../../internal/notice";

export interface ToastProps extends NoticeProps {}
export interface ToastEmits extends NoticeEmits {}
export type { NoticeCloseReason as ToastCloseReason };
