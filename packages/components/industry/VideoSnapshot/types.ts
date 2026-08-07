import type { BaseProps } from "@amg-webui/types";

export type VideoSnapshotFormat = "image/png" | "image/jpeg" | "image/webp";
export type VideoSnapshotErrorCode =
  | "VIDEO_NOT_READY"
  | "CANVAS_UNAVAILABLE"
  | "CAPTURE_FAILED"
  | "DOWNLOAD_FAILED";

export interface VideoSnapshotResult {
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
  type: VideoSnapshotFormat;
  timestamp: number;
}

export interface VideoSnapshotError extends Error {
  code: VideoSnapshotErrorCode;
  cause?: unknown;
}

export interface VideoSnapshotProps extends BaseProps {
  videoRef?: HTMLVideoElement | null;
  src?: string;
  stream?: MediaStream | null;
  crossOrigin?: "" | "anonymous" | "use-credentials";
  controls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  format?: VideoSnapshotFormat;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  preview?: boolean;
  downloadable?: boolean;
  fileName?: string;
  disabled?: boolean;
  loading?: boolean;
  title?: string;
  emptyText?: string;
  ariaLabel?: string;
}

export interface VideoSnapshotEmits {
  (e: "capture", dataUrl: string, result: VideoSnapshotResult): void;
  (e: "clear"): void;
  (e: "download", result: VideoSnapshotResult): void;
  (e: "error", error: VideoSnapshotError): void;
}
