declare module "eslint-plugin-drizzle" {
    interface RuleContext {
        report: (descriptor: { node: unknown; message: string }) => void;
        options: unknown[];
    }

    interface Rule {
        meta?: {
            docs?: {
                description?: string;
                recommended?: boolean;
                url?: string;
            };
            type?: string;
            schema?: unknown[];
        };
        create: (
            context: RuleContext,
        ) => Record<string, (node: unknown) => void>;
    }

    export const rules: {
        "enforce-delete-with-where": Rule;
        "enforce-update-with-where": Rule;
    };

    export const configs: {
        all: {
            plugins: string[];
            rules: Record<string, string | [string, ...unknown[]]>;
        };
        recommended: {
            plugins: string[];
            rules: Record<string, string | [string, ...unknown[]]>;
        };
    };

    export const meta: {
        name: string;
        version: string;
    };
}
