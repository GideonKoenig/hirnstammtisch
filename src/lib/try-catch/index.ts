export * from "./types";
export * from "./utils";
export * from "./sync";
export * from "./async";

import { SyncResultBuilder } from "./sync";
import { AsyncResultBuilder } from "./async";

export function tryCatch<T>(fn: () => T) {
    return new SyncResultBuilder(fn);
}

export function tryCatchAsync<T>(fn: () => Promise<T>) {
    return new AsyncResultBuilder(fn);
}
