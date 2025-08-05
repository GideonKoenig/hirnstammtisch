export class Success<T> {
    readonly success = true as const;

    constructor(public readonly data: T) {}

    unwrap(): T {
        return this.data;
    }

    unwrapOr<U>(defaultValue: U): T {
        return this.data;
    }
}

export class Failure<E> {
    readonly success = false as const;

    constructor(public readonly error: E) {}

    unwrap(): never {
        throw this.error;
    }

    unwrapOr<U>(defaultValue: U): U {
        return defaultValue;
    }
}

export type Result<T, E> = Success<T> | Failure<E>;

function isPromise<T = any>(value: unknown): value is Promise<T> {
    return (
        !!value &&
        (typeof value === "object" || typeof value === "function") &&
        typeof (value as any).then === "function"
    );
}

export function tryCatch<T, E = Error>(
    operation: Promise<T>,
): Promise<Result<T, E>>;
export function tryCatch<T, E = Error>(
    operation: () => Promise<T>,
): Promise<Result<T, E>>;
export function tryCatch<T, E = Error>(operation: () => T): Result<T, E>;
export function tryCatch<T, E = Error>(
    operation: Promise<T> | (() => T) | (() => Promise<T>),
): Result<T, E> | Promise<Result<T, E>> {
    if (typeof operation === "function") {
        try {
            const result = operation();

            if (isPromise(result)) {
                return result
                    .then((data: T) => new Success(data))
                    .catch((error: E) => new Failure(error as E));
            }

            return new Success(result);
        } catch (error) {
            return new Failure(error as E);
        }
    }

    return operation
        .then((data: T) => new Success(data))
        .catch((error: E) => new Failure(error as E));
}
