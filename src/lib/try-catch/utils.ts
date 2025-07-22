import type {
    Result,
    UnwrapConfig,
    UnwrapConfigExpectSingle,
    BaseUnwrapConfig,
} from "./types";

export function unwrapData<T>(result: Result<T>, config?: UnwrapConfig<T>) {
    const { TRPCError } = require("@trpc/server");

    if (!result.success) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: config?.errorMessage ?? result.error,
        });
    }

    const data = result.data;
    const expectation = config?.expectation;

    if (expectation === "expectSingle" && Array.isArray(data)) {
        if (data.length !== 1) {
            const singleConfig = config as UnwrapConfigExpectSingle<T>;
            if (singleConfig.defaultValue !== undefined) {
                return singleConfig.defaultValue;
            }
            throw new TRPCError({
                code: "NOT_FOUND",
                message: config?.notFoundMessage ?? "Record not found",
            });
        }
        return data[0];
    }

    if (
        expectation === "expectAtLeastOne" &&
        Array.isArray(data) &&
        data.length === 0
    ) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: config?.notFoundMessage ?? "No records found",
        });
    }

    if (expectation === "expectNothing") {
        if (Array.isArray(data) && data.length > 0) {
            throw new TRPCError({
                code: "CONFLICT",
                message: config?.errorMessage ?? "Expected no records",
            });
        }
        return undefined;
    }

    if (!expectation && config && "defaultValue" in config) {
        const baseConfig = config as BaseUnwrapConfig<T>;
        if (
            baseConfig.defaultValue !== undefined &&
            (data === null || data === undefined)
        ) {
            return baseConfig.defaultValue;
        }
    }

    return data;
}
