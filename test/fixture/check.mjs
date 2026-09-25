// Runs inside the installed fixture project (see test/run.mjs): lints the
// sample files with both configs and compares against the expected findings.
// Exits non-zero on any deviation, a parse error or a crash.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const cases = [
  {
    config: "api.eslint.config.mjs",
    files: ["api/**/*.ts"],
    expected: [
      "api/findings.ts:3 @typescript-eslint/no-unused-vars warn",
      "api/findings.ts:4 @typescript-eslint/no-explicit-any warn",
      "api/findings.ts:5 no-var error",
    ],
  },
  {
    config: "web.eslint.config.mjs",
    files: ["web/**/*.tsx"],
    expected: [
      "web/findings.tsx:4 react-refresh/only-export-components warn",
      "web/findings.tsx:8 react-hooks/rules-of-hooks error",
    ],
  },
];

const severity = { 1: "warn", 2: "error" };
let failed = false;

for (const testCase of cases) {
  const eslint = new ESLint({ cwd: here, overrideConfigFile: testCase.config });
  const results = await eslint.lintFiles(testCase.files);
  const actual = results
    .flatMap((result) =>
      result.messages.map((m) => {
        const file = path.relative(here, result.filePath).split(path.sep).join("/");
        // Fatal messages (parse errors) carry no ruleId.
        return `${file}:${m.line} ${m.ruleId ?? `FATAL(${m.message})`} ${severity[m.severity]}`;
      }),
    )
    .sort();
  const expected = [...testCase.expected].sort();
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? "ok  " : "FAIL"} ${testCase.config} (${results.length} Dateien)`);
  if (!ok) {
    failed = true;
    console.log("  erwartet:\n    " + expected.join("\n    "));
    console.log("  erhalten:\n    " + (actual.join("\n    ") || "(nichts)"));
  }
}

// Which TypeScript did typescript-eslint really load? Must be the 6.0.x this
// package ships (inside typescript-eslint's range), whatever the project uses.
const consumerTs = JSON.parse(
  readFileSync(require.resolve("typescript/package.json"), "utf8"),
).version;
const loadedTs = [
  ...new Set(
    Object.keys(require.cache)
      .filter((key) => /[\\/]typescript[\\/]lib[\\/]typescript\.js$/.test(key))
      .map(
        (key) =>
          JSON.parse(readFileSync(path.join(key, "..", "..", "package.json"), "utf8")).version,
      ),
  ),
];
console.log(`TypeScript im Projekt: ${consumerTs}, von typescript-eslint geladen: ${loadedTs.join(", ") || "(keins)"}`);
const supported = (v) => v.startsWith("6.0.");
if (loadedTs.length === 0 || !loadedTs.every(supported)) {
  failed = true;
  console.log("FAIL typescript-eslint hat keine unterstuetzte TypeScript-Version geladen");
}

process.exit(failed ? 1 : 0);
