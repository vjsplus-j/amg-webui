import type { BaseProps } from "@amg-webui/types";
import type { CanvasSchema } from "@amg-webui/utils";

export interface CanvasIoProps extends BaseProps {
  schema?: CanvasSchema;
  filename?: string;
  disabled?: boolean;
}

export interface CanvasIoEmits {
  (e: "import", schema: CanvasSchema): void;
  (e: "export", schema: CanvasSchema): void;
  (e: "error", error: Error): void;
}
