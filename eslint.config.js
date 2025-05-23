// eslint.config.js (root directory)
import parserBabel from "@babel/eslint-parser";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
    {
        // General configuration for all JS/JSX files
        files: ["**/*.{js,jsx}"],
        ignores: ["dist/**", "node_modules/**"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parser: parserBabel,
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    presets: ["@babel/preset-react"],
                },
            },
            globals: {
                React: "readonly",
                process: "readonly",
            },
        },
        plugins: {
            react,
            import: importPlugin,
            "simple-import-sort": simpleImportSort,
        },
        settings: {
            react: {
                version: "detect", // Automatically detect the React version
            },
        },
        rules: {
            "no-console": "warn",
            "simple-import-sort/imports": "error", // This will show an error if imports are not sorted
            "simple-import-sort/exports": "error", // This will show an error if exports are not sorted
            "import/order": "off", // Disable import/order because simple-import-sort is used
        },
    },

    {
        // Prettier formatting rules
        rules: {
            ...prettier.rules,
        },
    },
];
