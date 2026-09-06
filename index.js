// Basis fuer alle TypeScript-Projekte (Fastify-APIs, Jobs, Tools).
// Bewusst schlank: die empfohlenen Regelsaetze von ESLint und typescript-eslint,
// dazu die wenigen Anpassungen, die in den Repos bereits gelebte Praxis sind.
// Stufe 1 ist "warnend im CI" (continue-on-error); erst wenn ein Repo sauber
// ist, wird der Lint dort blockierend.
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import("eslint").Linter.Config[]} */
export const base = [
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/node_modules/**",
      "**/generated/**",
      "**/.next/**",
      "**/*.d.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.es2022 },
    },
    rules: {
      // Unbenutzte Parameter mit Unterstrich sind ein bewusstes Signal.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      // any kommt vor (Prisma-JSON, externe APIs); als Warnung sichtbar halten.
      "@typescript-eslint/no-explicit-any": "warn",
      // Fastify-Handler und Jobs nutzen leere Funktionen als Platzhalter.
      "@typescript-eslint/no-empty-function": "off",
      "no-console": "off",
    },
  },
];

export default base;
