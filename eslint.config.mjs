import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import nextVitals from "eslint-config-next/core-web-vitals";

const sourceFiles = ["**/*.{js,jsx}"];

const eslintConfig = [
  {
    ignores: ["build/**", "coverage/**", "dist/**", "node_modules/**"],
  },
  js.configs.recommended,
  ...nextVitals,
  {
    files: sourceFiles,
    rules: {
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "react/prop-types": "off",
      "react-hooks/set-state-in-effect": "off",
      "@next/next/no-img-element": "off",
    },
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

export default eslintConfig;
