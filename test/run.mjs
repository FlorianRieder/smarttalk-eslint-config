// Installs this package the way a consuming repo would (packed tarball, fresh
// project, chosen package manager, TypeScript and ESLint version) and runs
// test/fixture/check.mjs inside it.
//
//   node test/run.mjs                      # TS 7, ESLint 9, npm
//   TS_VERSION=5.9 PM=pnpm node test/run.mjs
//
// The package manager matters: npm hoists typescript-eslint's helpers next to
// the project's own TypeScript, pnpm does not (see typescript-resolve.js).
import { execSync } from "node:child_process";
import { cpSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tsVersion = process.env.TS_VERSION ?? "7.0";
const eslintVersion = process.env.ESLINT_VERSION ?? "9";
const pm = process.env.PM ?? "npm";
if (!["npm", "pnpm"].includes(pm)) throw new Error(`PM muss npm oder pnpm sein, nicht ${pm}`);

const work = mkdtempSync(path.join(tmpdir(), "smarttalk-eslint-config-"));
const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: "inherit" });

console.log(`TypeScript ~${tsVersion}, ESLint ^${eslintVersion}, ${pm} in ${work}`);

run(`npm pack --silent --pack-destination "${work}"`, root);
const tarball = readdirSync(work).find((f) => f.endsWith(".tgz"));
if (!tarball) throw new Error("npm pack hat kein Tarball erzeugt");

const project = path.join(work, "project");
cpSync(path.join(root, "test", "fixture"), project, { recursive: true });
writeFileSync(
  path.join(project, "package.json"),
  JSON.stringify(
    {
      name: "fixture",
      private: true,
      type: "module",
      devDependencies: {
        "@smarttalk/eslint-config": `file:../${tarball}`,
        eslint: `^${eslintVersion}`,
        typescript: `~${tsVersion}.0`,
      },
    },
    null,
    2,
  ),
);

run(pm === "npm" ? "npm install --no-audit --no-fund" : "pnpm install", project);
run("node check.mjs", project);

// Only clean up on success, so a failing run can be inspected.
rmSync(work, { recursive: true, force: true });
