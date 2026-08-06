import type { BaseProps } from "@amg-webui/types";
export interface OcrScanResult {
  text: string;
  confidence?: number;
  data?: unknown;
}
export interface OcrScanContext {
  file: File;
  canvas: HTMLCanvasElement;
  signal: AbortSignal;
}
export type OcrRecognizer = (
  context: OcrScanContext,
) => Promise<string | OcrScanResult>;
export interface OcrScanProps extends BaseProps {
  modelValue?: string;
  disabled?: boolean;
  accept?: string;
  maxFileSize?: number;
  maxPreviewWidth?: number;
  showPreview?: boolean;
  autoScan?: boolean;
  recognizer?: OcrRecognizer;
  label?: string;
  scanText?: string;
  emptyText?: string;
}
export interface OcrScanEmits {
  (e: "update:modelValue", text: string): void;
  (e: "scan", text: string, result: OcrScanResult): void;
  (e: "ready", context: OcrScanContext): void;
  (e: "error", error: Error): void;
  (e: "change", file: File | null): void;
  (e: "reset"): void;
}
