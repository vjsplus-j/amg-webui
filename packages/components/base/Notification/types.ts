import type {
  NoticeCloseReason,
  NoticeEmits,
  NoticeProps,
} from "../../internal/notice";

export interface NotificationProps extends NoticeProps {}
export interface NotificationEmits extends NoticeEmits {}
export type { NoticeCloseReason as NotificationCloseReason };
