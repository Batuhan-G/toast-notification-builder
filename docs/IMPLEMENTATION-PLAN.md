# Implementation Plan

Phased so each phase ends in a working, committable state. After every phase: `npm run build` + `npm run test` must pass, then commit. Total target: 3–5 h dev time.

## Phase 0 — Scaffold (~30 min)

1. `npm create vue@latest toast-notification-builder` (TypeScript + ESLint + Prettier; Pinia added manually, Jest integrated manually per `docs/TESTING.md` since the spec mandates Jest over Vitest).
2. Add deps: `pinia`, `nanoid`, `sass`. Dev deps: `jest@29`, `@vue/test-utils`, `@vue/vue3-jest@29`, `babel-jest@29`, `@babel/core`, `@babel/preset-env`, `@babel/preset-typescript`, `jest-environment-jsdom`, `ts-jest` (types), `eslint` + `eslint-plugin-vue` + TS plugins, `prettier` (+ eslint-config-prettier).
3. Configure `tsconfig.json` (`strict: true`, `@/*` path alias), `vite.config.ts` (alias), `jest.config.cjs` + `babel.config.cjs` per `docs/TESTING.md`.
4. Write a smoke test (`expect(true)`) to verify the Jest pipeline, then delete it in Phase 6.
5. Wire `main.ts` with Pinia; empty `App.vue` shell; base SCSS variables.

✅ Exit: dev server runs, `npm run test` green, initial commit.

## Phase 1 — Types, defaults, storage (~20 min)

1. `src/types/notification.ts` — all types from CLAUDE.md.
2. `src/utils/defaults.ts` — `TYPE_DEFAULTS: Record<NotificationType, { backgroundColor; textColor; icon }>` + `createDefaultConfig()`.
3. `src/utils/storage.ts` — safe load/save with type guard.

✅ Exit: compiles clean. Commit.

## Phase 2 — Stores (~30 min)

1. `stores/builder.ts` — state: `config: Omit<NotificationConfig,'id'>`, `colorsCustomized`; actions: `setType`, `setTitle`, `setMessage`, `setDuration`, `setPersistent`, `setPosition`, `setBackgroundColor`, `setTextColor`, `toggleIcon`, `toggleCloseButton`, `setAnimation`, `applyPreset`.
2. `stores/notifications.ts` — state: `toasts: ActiveNotification[]`; getters: `byPosition`; actions: `show(config)`, `dismiss(id)`, `clearAll`; module-level timer Map.
3. `stores/presets.ts` — state hydrated from storage on init; actions: `savePreset(name)`, `deletePreset(id)`, with write-through to storage.

✅ Exit: stores compile; quick console sanity via dev tools optional. Commit.

## Phase 3 — Toast rendering (~45 min)

1. `ToastItem.vue` — icon (inline SVG per type), title, message, close button, progress bar; styles driven by `config.backgroundColor/textColor`; emits `close`.
2. `ToastContainer.vue` — Teleport, six position wrappers, `<TransitionGroup>` with dynamic name from each toast's animation, renders from notifications store.
3. `_animations.scss` — fade/slide/bounce enter/leave + `-move` classes.
4. Temporary dev button to spawn toasts; verify stacking, auto-dismiss, manual close, persistent.

✅ Exit: toasts work standalone. Commit.

## Phase 4 — Builder UI + Preview (~60 min)

1. Build `ConfigPanel` controls bound to builder store (`v-model` on `computed` get/set wrappers or explicit handlers).
2. `PreviewPane.vue` — gray stage, static `ToastItem` aligned to selected position, Show Notification → `notifications.show(builder.config)`.
3. `App.vue` two-column layout per `docs/ARCHITECTURE.md`; remove dev button.

✅ Exit: full configure → preview → trigger loop works. Commit.

## Phase 5 — Presets + Code Export (~40 min)

1. `PresetSaveForm`, `PresetList`, `PresetListItem` (Load/Delete, summary line, type color dot).
2. `utils/codeExport.ts` + `CodeExport.vue` with Copy to Clipboard (clipboard API + "Copied!" feedback state, fallback message on failure).

✅ Exit: presets survive reload; export copies correctly. Commit.

## Phase 6 — Tests (~45 min)

Per `docs/TESTING.md`. Target suite (≥6 tests):
1. `notifications` store: `show` adds toast with id/createdAt; auto-dismiss fires after duration (fake timers); `duration: 0` never auto-dismisses; manual `dismiss` clears timer.
2. `presets` store: save → persists to (mocked) localStorage; corrupt JSON → empty list; delete removes.
3. `codeExport`: snapshot/equality of generated snippet.
4. `ToastItem`: renders title/message; hides icon when `showIcon: false`; emits `close` on button click; close button absent when `showCloseButton: false`.
5. `builder` store: type change applies default colors; manual color change sets `colorsCustomized` and survives type change.

✅ Exit: all green. Commit.

## Phase 7 — Polish + README + ship (~30 min)

1. UI pass against the reference screenshot: spacing, focus states, hover states, responsive (single column < 900px).
2. A11y pass: aria-live, labels, keyboard reachability.
3. README.md: setup, approach (architecture summary + why Pinia/structure), assumptions (copy from `docs/REQUIREMENTS.md`), test instructions, optional deploy link.
4. Final clean clone test: `npm install && npm run dev && npm run test`.
5. Optional: deploy to Vercel/Netlify, add link to README.

✅ Exit: push, verify repo renders nicely on GitHub.

## Git strategy

`main` only is fine for this scale, but commit per phase with conventional commits (`feat:`, `test:`, `chore:`, `docs:`, `fix:`). A readable history is part of the Code Quality score. Never commit broken builds.
