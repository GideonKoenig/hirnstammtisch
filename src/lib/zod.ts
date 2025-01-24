import { z, type ZodIssue, type ZodSchema } from "zod";

/**
 * Parses a JSON string and validates it against a provided Zod schema.
 *
 * @param schema - The Zod schema to validate against.
 * @param jsonString - The JSON string to parse and validate.
 * @returns An object containing either the validated data or validation errors.
 */
export function parseJson<T>(
    schema: ZodSchema<T>,
    jsonString: string,
): { success: true; data: T } | { success: false; errors: ZodIssue[] } {
    const preprocessed = z
        .preprocess((input) => {
            if (typeof input === "string") {
                try {
                    return JSON.parse(input);
                } catch {
                    return undefined;
                }
            }
            return input;
        }, schema)
        .safeParse(jsonString);

    if (preprocessed.success) {
        return { success: true, data: preprocessed.data };
    } else {
        return { success: false, errors: preprocessed.error.errors };
    }
}
