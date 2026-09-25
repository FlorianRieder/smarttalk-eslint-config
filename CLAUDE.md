# CLAUDE.md — smarttalk-eslint-config

Gilt zusaetzlich zur globalen `~/.claude/CLAUDE.md`. Dieses Repo ist bewusst
**ohne Notion-Projekt** (globale CLAUDE.md, "Repos bewusst ohne Dev-Projekt") —
kein `NOTION_PROJECT_ID` anlegen.

## Was das ist

`@smarttalk/eslint-config`: die gemeinsame ESLint-Flat-Config aller
SmartTalk-Repos. `index.js` (base: Fastify-APIs, Jobs, Tools) und `react.js`
(base plus Hooks/Fast-Refresh fuer Vite/React). Nicht auf npm veroeffentlicht;
die Repos binden einen Git-Tag ein (`github:FlorianRieder/smarttalk-eslint-config#vX.Y.Z`).

`typescript-resolve.js` zwingt typescript-eslint auf das mitgelieferte
TypeScript 6.0, weil typescript-eslint 8 mit TypeScript 7 abstuerzt
(Hintergrund im README, Abschnitt "TypeScript 7"). Muss in `index.js` und
`react.js` der erste Import bleiben.

## Stack

| Was | Wie |
|---|---|
| Default-Branch | `main` |
| Node | CI 26 (`setup-node`); `engines` ab 22.15 |
| Paketmanager | pnpm 11.9.0 (`packageManager`, nur fuer CI); getestet wird mit npm und pnpm |
| Tests | `node test/run.mjs` (Fixture-Projekt, siehe README "Pruefen") |

## Bewusste Abweichungen von den Konventionen

- **`engines` ist nicht gleich der CI-Node-Version.** Das Paket laeuft in den
  Repos mit deren Node; `engines` nennt die Untergrenze (`module.registerHooks`
  gibt es ab 22.15), CI prueft auf 26.
- **Kein Lockfile.** Es gibt keine devDependencies, und ein Lockfile in einem
  Paket wirkt nicht auf die Repos, die es einbinden — die loesen die Bereiche
  selbst auf. Gegen Brueche durch neue Versionen laeuft `pruefen.yml`
  woechentlich.
- **Kein Lint dieses Repos und kein vitest.** Die Pruefung ist das
  Fixture-Projekt: es muss echt installiert werden, mit npm und pnpm und je
  TypeScript-Version, das kann ein In-Process-Test nicht abbilden.

## Pruefen

`npm test` (TS 7, ESLint 9, npm), andere Kombinationen per `TS_VERSION`,
`ESLINT_VERSION`, `PM`. Aendert sich eine Regel, `test/fixture/*/findings.*`
und die Erwartungen in `test/fixture/check.mjs` mitziehen.

## Release

`version` in `package.json` anheben, nach dem Merge `git tag vX.Y.Z && git push --tags`,
dann in den Repos den Tag nachziehen. Repos pinnen immer einen Tag, nie `main`.

## Konventionen (SmartTalk-weit)

Dieser Abschnitt ist in allen SmartTalk-Repos gleich (Stand 06.09.2026, aus der
Querschnittspruefung). Abweichungen gehoeren mit Begruendung in den Abschnitt
darueber, nicht hierher.

### Sprache
- Oberflaechentexte, README, Commit-Betreffs und Notion-Eintraege auf Deutsch.
- Kein scharfes S, immer `ss`.
- Fachbegriffe als Bezeichner auf Deutsch (`lehrmittel`, `faelligkeit`, `kursart`),
  technische Bezeichner auf Englisch.
- Kommentare halten das *Warum* fest, gern mit Datum und Vorfall
  ("Belegt 2026-08-13: ..."). Was der Code tut, steht im Code.

### Referenz-Stack
- TypeScript im ESM-Modus, `strict: true` und `noUncheckedIndexedAccess: true`.
- API: Fastify 5 + Prisma + Zod, PostgreSQL 16. Oberflaeche: React + Vite.
  Express nur im Altbestand (semco-mcp, Semco-Suite), nicht fuer Neues.
- Tests: vitest. `node --test` nur, wo es schon liegt.
- Lint: `@smarttalk/eslint-config` (github:FlorianRieder/smarttalk-eslint-config),
  zuerst warnend im CI, blockierend sobald ein Repo sauber ist.
- Node-Hauptversion pro Repo genau eine: Dockerfiles, `engines` und
  `setup-node` zeigen dieselbe Zahl (steht oben in "Stack").
- Paketmanager pro Repo genau einer (steht oben). Lockfile immer committen.
  pnpm-Version ausschliesslich ueber `packageManager` in package.json;
  `node:26`-Images bringen kein corepack mehr mit (`npm i -g corepack` davor).

### Git
- Arbeit auf Branches `feat/...`, `fix/...`, `chore/...`, `ci/...`, `docs/...`, dann PR
  gegen den Default-Branch. Dependabot-PRs werden in
  `chore/dependabot-sammel-JJJJ-MM` gebuendelt.
- Conventional Commits mit Bereich: `feat(teacher): ...`, `fix(deploy): ...`.
- `.gitattributes` normalisiert auf LF; nie mit `sed -i` ueber Dateien, die im
  Arbeitsverzeichnis CRLF haben (MSYS-sed schreibt die ganze Datei um).
- `.env` nie einchecken, `.env.example` mitpflegen.

### Betrieb
- Docker-Image nach `ghcr.io/florianrieder/<name>`, Compose auf dem
  Infomaniak-VPS unter `/opt/<app>`. Der Deploy-Job laeuft nur nach einem
  gruenen Pruefjob (typecheck, test), niemals direkt auf `push`.
- SSH auf den VPS nur ueber `svps` (Multiplexing), siehe globale CLAUDE.md.
- Portal-Apps: Rollen kommen aus dem Admin-Portal
  (`POST /internal/authz/resolve`, `PORTAL_API_URL`), Design-Tokens `--st-*`
  aus `team.smarttalk.ch/portal-api/design/tokens.css`, teilbare Links nach
  `smarttalk-lehrpersonen/docs/deeplinks.md`.

### Notion
- Jeder Task traegt Erfolgskriterium und Verifikation, bevor er auf
  Work-in-Progress geht (globale CLAUDE.md). Projekt-ID: `NOTION_PROJECT_ID`
  im Root, in Monorepos `NOTION_PROJECTS.md`.
