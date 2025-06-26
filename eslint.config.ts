import imports from "eslint-plugin-import"
import jsxA11y from "eslint-plugin-jsx-a11y"
import prettier from "eslint-plugin-prettier"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import globals from "globals"
import { fileURLToPath } from "url"

import { dirname } from "path"

import { FlatCompat } from "@eslint/eslintrc"
import typescriptEslint from "@typescript-eslint/eslint-plugin"

// Calculate __dirname in an ES module environment
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Instantiate FlatCompat with directory options
const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: {
    extends: ["eslint:recommended"],
  },
})

export default [
  {
    languageOptions: {
      ecmaVersion: 12,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      import: imports,
      "@typescript-eslint": typescriptEslint,
      prettier,
    },
    rules: {
      "react/prop-types": "off", // Disable prop-types since you're using TypeScript
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal"],
          "newlines-between": "always",
        },
      ],
      "prettier/prettier": "error",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": { typescript: {} },
    },
  },
  ...compat.config({
    extends: [
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:jsx-a11y/recommended",
      "plugin:import/recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
    ],
  }),
]
