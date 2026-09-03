import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import nextVitals from "eslint-config-next/core-web-vitals";
import tseslint from "typescript-eslint";

const sourceFiles = ["**/*.{js,jsx,ts,tsx}"];

const eslintConfig = [
  {
    ignores: ["build/**", "coverage/**", "dist/**", "node_modules/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...nextVitals,
  {
    files: sourceFiles,
    rules: {
      "react/prop-types": "off",
      "react-hooks/set-state-in-effect": "off",
      "@next/next/no-img-element": "off",
    },
  },
  {
    files: ["**/*.{js,jsx}"],
    rules: {
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: [
      "**/*.config.{js,mjs}",
      "**/*.test.{js,jsx,ts,tsx}",
      "eslint.config.mjs",
      "src/setupTests.ts",
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

export default eslintConfig;
