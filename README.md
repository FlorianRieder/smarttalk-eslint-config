# @smarttalk/eslint-config

Gemeinsame ESLint-Flat-Config fuer alle SmartTalk-Repos. Ein Paket statt
zwoelf Kopien, damit eine Regelaenderung einmal passiert.

## Einbinden

```bash
npm install -D eslint "@smarttalk/eslint-config@github:FlorianRieder/smarttalk-eslint-config#v0.1.0"
```

`eslint.config.mjs` im Paketverzeichnis:

```js
// API, Job, Tool:
export { default } from "@smarttalk/eslint-config";

// Vite/React-Oberflaeche:
export { default } from "@smarttalk/eslint-config/react";
```

`package.json`: `"lint": "eslint ."`

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
