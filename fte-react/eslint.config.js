import js from "@eslint/js";
import jest from "eslint-plugin-jest"; // ✅ Add this import
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default [
    { ignores: ["dist"] },

    {
        files: ["**/*.{js,jsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: "latest",
                ecmaFeatures: { jsx: true },
                sourceType: "module",
            },
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            "no-unused-vars": ["error", { varsIgnorePattern: "^(motion|[A-Z_])" }],
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
        },
    },

    {
        files: ["**/*.test.{js,jsx}"],
        plugins: {
            jest,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jest, // ✅ Adds globals like `jest`, `test`, `describe`, etc.
            },
        },
        rules: {
            ...jest.configs.recommended.rules,
        },
    },
];
