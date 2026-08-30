import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

const sourceFiles = ["**/*.{js,jsx}"];

export default [
  {
    ignores: ["build/**", "coverage/**", "dist/**", "node_modules/**"],
  },
  js.configs.recommended,
  {
    ...react.configs.flat.recommended,
    files: sourceFiles,
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      ecmaVersion: "latest",
      globals: globals.browser,
      parserOptions: {
        ...react.configs.flat.recommended.languageOptions.parserOptions,
        ecmaFeatures: { jsx: true },
      },
      sourceType: "module",
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat["jsx-runtime"].rules,
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "react/prop-types": "off",
    },
    settings: {
      react: { version: "detect" },
    },
  },
  {
    files: sourceFiles,
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
    },
  },
  {
    ...jsxA11y.flatConfigs.recommended,
    files: ["**/*.jsx"],
  },
  {
    files: [
      "**/*.config.{js,mjs}",
      "**/*.test.{js,jsx}",
      "eslint.config.mjs",
      "src/setupTests.js",
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.vitest,
      },
    },
  },
  eslintConfigPrettier,
];
