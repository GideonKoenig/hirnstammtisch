import typescriptEslint from "@typescript-eslint/eslint-plugin";
import drizzle from "eslint-plugin-drizzle";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import reactCompiler from "eslint-plugin-react-compiler";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    {
        ignores: ["**/next.config.js"],
    },
    ...compat.extends(
        "next/core-web-vitals",
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
    ),
    {
        plugins: {
            "@typescript-eslint": typescriptEslint,
            drizzle,
            import: importPlugin,
            "react-compiler": reactCompiler,
        },

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2022,
            sourceType: "module",
            parserOptions: {
                project: true,
            },
        },

        settings: {
            "import/resolver": {
                typescript: {
                    alwaysTryTypes: true,
                    project: "./tsconfig.json",
                },
            },
        },

        rules: {
            "@typescript-eslint/array-type": "off",
            "@typescript-eslint/consistent-type-definitions": "off",

            "@typescript-eslint/consistent-type-imports": [
                "warn",
                {
                    prefer: "type-imports",
                    fixStyle: "inline-type-imports",
                },
            ],

            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                },
            ],

            "@typescript-eslint/require-await": "off",

            "@typescript-eslint/no-misused-promises": [
                "error",
                {
                    checksVoidReturn: {
                        attributes: false,
                    },
                },
            ],

            "drizzle/enforce-delete-with-where": [
                "error",
                {
                    drizzleObjectName: ["db", "ctx.db"],
                },
            ],

            "drizzle/enforce-update-with-where": [
                "error",
                {
                    drizzleObjectName: ["db", "ctx.db"],
                },
            ],

            "react-compiler/react-compiler": "error",

            "import/no-relative-packages": "error",
            "import/no-relative-parent-imports": "off",
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["../*", "./*"],
                            message:
                                "Relative imports are not allowed. Please use absolute imports with @ alias instead.",
                        },
                    ],
                },
            ],

            // Enforce throwing proper Error objects
            "no-throw-literal": "error",
        },
    },
];
