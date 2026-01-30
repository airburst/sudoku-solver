//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  ...tanstackConfig,
  {
    ignores: ["*.config.js"],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      // Remove unused imports automatically
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];
