// Fuer die Vite/React-Oberflaechen: Basis plus Hooks- und Fast-Refresh-Regeln.
// First import on purpose, see typescript-resolve.js.
import "./typescript-resolve.js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { base } from "./index.js";

/** @type {import("eslint").Linter.Config[]} */
export const react = [
  ...base,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2022 },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
];

export default react;
