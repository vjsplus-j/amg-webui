import { sortRowsSync, type SortDirection } from "./sortRowsCore";

type SortWorkerRequest = {
  id: number;
  rows: Record<string, unknown>[];
  field: string;
  order: SortDirection;
};

self.onmessage = (event: MessageEvent<SortWorkerRequest>) => {
  const { id, rows, field, order } = event.data;
  try {
    const sorted = sortRowsSync(rows, field, order);
    self.postMessage({ id, rows: sorted });
  } catch (error) {
    self.postMessage({
      id,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
