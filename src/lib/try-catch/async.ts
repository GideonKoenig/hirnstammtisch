import type {
    UnwrapConfig,
    ExtractArrayElement,
    NonEmptyArray,
    Success,
    Failure,
} from "./types";
import { unwrapData } from "./utils";

export class AsyncResultBuilder<T> {
    private errorCallbacks: ((error: string) => void)[] = [];
    private successCallbacks: ((data: T) => void)[] = [];

    constructor(private fn: () => Promise<T>) {}

    async execute(defaultValue?: T) {
        try {
            const data = await this.fn();
            const result = { success: true as const, data } as Success<T>;

            for (const callback of this.successCallbacks) {
                callback(data);
            }

            return result;
        } catch (error) {
            if (defaultValue !== undefined) {
                const result = {
                    success: true as const,
                    data: defaultValue,
                } as Success<T>;

                for (const callback of this.successCallbacks) {
                    callback(defaultValue);
                }

                return result;
            }

            const errorMessage =
                error instanceof Error ? error.message : String(error);
            const result = {
                success: false as const,
                error: errorMessage,
            } as Failure;

            for (const callback of this.errorCallbacks) {
                callback(errorMessage);
            }

            return result;
        }
    }

    onError(callback: (error: string) => void) {
        this.errorCallbacks.push(callback);
        return this;
    }

    onSuccess(callback: (data: T) => void) {
        this.successCallbacks.push(callback);
        return this;
    }

    async unwrap(): Promise<T>;
    async unwrap(
        config: { expectation?: undefined } & UnwrapConfig<T>,
    ): Promise<T>;
    async unwrap(
        config: { expectation: "expectSingle" } & UnwrapConfig<T>,
    ): Promise<ExtractArrayElement<T>>;
    async unwrap(
        config: { expectation: "expectAtLeastOne" } & UnwrapConfig<T>,
    ): Promise<NonEmptyArray<T>>;
    async unwrap(
        config: { expectation: "expectNothing" } & UnwrapConfig<T>,
    ): Promise<void>;
    async unwrap(
        config?: UnwrapConfig<T>,
    ): Promise<T | ExtractArrayElement<T> | NonEmptyArray<T> | void> {
        const result = await this.execute();
        return unwrapData(result, config);
    }
}
