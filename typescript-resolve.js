// Pins the TypeScript that typescript-eslint parses with to the version this
// package ships (dependency "typescript": "~6.0.x").
//
// Why: TypeScript 7 is the native (Go) compiler; its npm package no longer
// exposes the JS compiler API. typescript-eslint 8 (latest 8.70, peer range
// "typescript >=4.8.4 <6.1.0") and ts-api-utils require("typescript") at load
// time and crash with "Cannot read properties of undefined (reading
// 'Intrinsic')". Seen 2026-09-25 in smarttalk-dialog; no typescript-eslint
// release supports TS 7 yet.
//
// pnpm already resolves the peer to our own dependency. npm hoists ts-api-utils
// and friends to the consumer's root, where "typescript" is TS 7 — so we
// redirect the resolution, but only for requests coming from typescript-eslint
// itself. The consumer's tsc stays untouched.
//
// Remove this file (and the dependency on typescript) once typescript-eslint
// supports TS 7.
import { createRequire, registerHooks } from "node:module";
import { pathToFileURL } from "node:url";

const requireOwn = createRequire(import.meta.url);

const TS_ESLINT_INTERNALS =
  /[\\/]node_modules[\\/](?:typescript-eslint|@typescript-eslint[\\/][^\\/]+|ts-api-utils)[\\/]/;

function isTypeScriptRequest(specifier) {
  return specifier === "typescript" || specifier.startsWith("typescript/");
}

// Guard against double registration when the config is imported from several
// entry points (index.js and react.js) or by several eslint.config files.
const MARKER = Symbol.for("@smarttalk/eslint-config/typescript-resolve");

if (!globalThis[MARKER]) {
  globalThis[MARKER] = true;
  registerHooks({
    resolve(specifier, context, nextResolve) {
      if (
        isTypeScriptRequest(specifier) &&
        context.parentURL &&
        TS_ESLINT_INTERNALS.test(decodeURIComponent(context.parentURL))
      ) {
        // Resolve ourselves: for require() the default resolver keeps using the
        // original parent's lookup paths even when parentURL is swapped.
        return { url: pathToFileURL(requireOwn.resolve(specifier)).href, shortCircuit: true };
      }
      return nextResolve(specifier, context);
    },
  });
}
