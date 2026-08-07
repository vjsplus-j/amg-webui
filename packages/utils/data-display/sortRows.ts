import {
  sortRowsSync,
  type SortDirection,
} from "./sortRowsCore";

export {
  compareCellValues,
  sortRowsSync,
  type SortDirection,
} from "./sortRowsCore";

export const SORT_WORKER_THRESHOLD = 5_000;

type SortWorkerRequest = {
  id: number;
  rows: Record<string, unknown>[];
  field: string;
  order: SortDirection;
};

type SortWorkerResponse = {
  id: number;
  rows?: Record<string, unknown>[];
  error?: string;
};

let worker: Worker | null = null;
let workerFailed = false;
let requestId = 0;
const pending = new Map<
  number,
  {
    resolve: (rows: Record<string, unknown>[]) => void;
    reject: (error: Error) => void;
  }
>();

function ensureWorker(): Worker | null {
  if (workerFailed) return null;
  if (worker) return worker;
  if (typeof Worker === "undefined") {
    workerFailed = true;
    return null;
  }
  try {
    worker = new Worker(new URL("./sortRows.worker.ts", import.meta.url), {
      type: "module",
    });
    worker.onmessage = (event: MessageEvent<SortWorkerResponse>) => {
      const payload = event.data;
      const entry = pending.get(payload.id);
      if (!entry) return;
      pending.delete(payload.id);
      if (payload.error) entry.reject(new Error(payload.error));
      else entry.resolve(payload.rows ?? []);
    };
    worker.onerror = () => {
      workerFailed = true;
      for (const [, entry] of pending) {
        entry.reject(new Error("sort worker failed"));
      }
      pending.clear();
      worker?.terminate();
      worker = null;
    };
    return worker;
  } catch {
    workerFailed = true;
    return null;
  }
}

export function sortRowsAsync<T extends Record<string, unknown>>(
  rows: readonly T[],
  field: string,
  order: SortDirection,
  threshold = SORT_WORKER_THRESHOLD,
): Promise<T[]> {
  if (rows.length < threshold) {
    return Promise.resolve(sortRowsSync(rows, field, order));
  }
  const instance = ensureWorker();
  if (!instance) {
    return Promise.resolve(sortRowsSync(rows, field, order));
  }
  const id = ++requestId;
  return new Promise<T[]>((resolve, reject) => {
    pending.set(id, {
      resolve: (sorted) => resolve(sorted as T[]),
      reject,
    });
    const message: SortWorkerRequest = {
      id,
      rows: rows as Record<string, unknown>[],
      field,
      order,
    };
    try {
      instance.postMessage(message);
    } catch {
      pending.delete(id);
      resolve(sortRowsSync(rows, field, order));
    }
  });
}

export function disposeSortWorker() {
  for (const [, entry] of pending) {
    entry.reject(new Error("sort worker disposed"));
  }
  pending.clear();
  worker?.terminate();
  worker = null;
}
