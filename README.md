# @smarttalk/eslint-config

Gemeinsame ESLint-Flat-Config fuer alle SmartTalk-Repos. Ein Paket statt
zwoelf Kopien, damit eine Regelaenderung einmal passiert.

## Einbinden

```bash
npm install -D eslint "@smarttalk/eslint-config@github:FlorianRieder/smarttalk-eslint-config#v0.2.0"
# oder
pnpm add -D eslint "@smarttalk/eslint-config@github:FlorianRieder/smarttalk-eslint-config#v0.2.0"
```

`eslint.config.mjs` im Paketverzeichnis:

```js
// API, Job, Tool:
export { default } from "@smarttalk/eslint-config";

// Vite/React-Oberflaeche:
export { default } from "@smarttalk/eslint-config/react";
```

`package.json`: `"lint": "eslint ."`

## Unterstuetzte Versionen

| Was | Bereich | Geprueft in CI |
|---|---|---|
| Node | ab 22.15 (`module.registerHooks`) | 26 |
| ESLint | ab 9.20 (Peer) | 9, 10 |
| TypeScript im Repo | 5.x, 6.0, 7.0 | 5.9, 6.0, 7.0 |
| Paketmanager | npm, pnpm | beide |

### TypeScript 7

TypeScript 7 ist der native Compiler; das npm-Paket bringt die JavaScript-API
nicht mehr mit. typescript-eslint 8 (Peer `typescript >=4.8.4 <6.1.0`) stuerzte
darum in Repos mit TS 7 ab:
`Cannot read properties of undefined (reading 'Intrinsic')` (ts-api-utils).
Eine typescript-eslint-Version mit TS-7-Unterstuetzung gibt es noch nicht
(Stand 25.09.2026, neueste 8.70.1).

Ab v0.2.0 bringt das Paket deshalb **TypeScript 6.0 als eigene Abhaengigkeit**
mit, und `typescript-resolve.js` sorgt dafuer, dass typescript-eslint genau
dieses laedt — auch unter npm, wo dessen Hilfspakete neben das TypeScript des
Repos gehoben werden. Das `tsc` des Repos bleibt unberuehrt. Fuer die Regeln
dieser Config (ohne Typinformation) reicht der Parser von TS 6 auch fuer
TS-7-Code.

Wer typbasierte Regeln (`recommendedTypeChecked`) ergaenzt, bekommt ebenfalls
die Typpruefung von TS 6 — Abweichungen zu TS 7 sind dort moeglich.

Faellt weg, sobald typescript-eslint TS 7 unterstuetzt: dann `typescript` aus
den dependencies und `typescript-resolve.js` entfernen.

## Pruefen

```bash
npm test                                  # TS 7, ESLint 9, npm
TS_VERSION=5.9 PM=pnpm npm test           # andere Kombination
```

`test/run.mjs` packt das Paket, installiert es in ein frisches Projekt aus
`test/fixture/` und vergleicht die Befunde mit den erwarteten. Der Workflow
`pruefen.yml` faehrt die ganze Matrix bei jedem PR und woechentlich.

## Stufen

1. **Warnend** — der CI-Schritt laeuft mit `continue-on-error: true`. So sieht
   jedes Repo seinen Stand, ohne dass Deploys haengen bleiben.
2. **Blockierend** — sobald `npm run lint` in einem Repo ohne Fehler durchlaeuft,
   `continue-on-error` dort entfernen.

## Regeln aendern

Hier aendern, Version anheben, Tag setzen (`git tag v0.x.y && git push --tags`),
in den Repos den Tag im `package.json` nachziehen. Repos pinnen immer einen Tag,
nie `main`.

## Version des Pakets pruefen

```bash
npm view "github:FlorianRieder/smarttalk-eslint-config" version
```
