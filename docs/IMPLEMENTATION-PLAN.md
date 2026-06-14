# Implementation Plan

Phased so each phase ends in a working, committable state. After every phase: `npm run build` + `npm run test` must pass, then commit. **Total target: 5–6 h dev time** (expanded from the original 3–5 h to absorb the full bonus set — custom icon upload and theme toggle add ~70 min).

## Phase 0 — Scaffold (~30 min) ✓

1. `npm create vue@latest toast-notification-builder` (TypeScript + ESLint + Prettier; Pinia added manually, Jest integrated manually per `docs/TESTING.md` since the spec mandates Jest over Vitest).
2. Add deps: `pinia`, `nanoid`. Dev deps: `sass`, `jest@29`, `@vue/test-utils`, `@vue/vue3-jest@29`, `babel-jest@29`, `@babel/core`, `@babel/preset-env`, `@babel/preset-typescript`, `jest-environment-jsdom`, `@types/jest@29`, `eslint` + `eslint-plugin-vue` + TS plugins, `prettier` (+ eslint-config-prettier).
3. Configure `tsconfig.json` (`strict: true`, `@/*` path alias), `vite.config.ts` (alias), `jest.config.cjs` + `babel.config.cjs` per `docs/TESTING.md`.
4. Write a smoke test (`expect(true)`) to verify the Jest pipeline, then delete it in Phase 6.
5. Wire `main.ts` with Pinia; empty `App.vue` shell.

✅ Exit: dev server runs, `npm run test` green, initial commit.

## Phase 1 — Types, defaults, storage, theme tokens (~30 min)

1. `src/types/notification.ts` — all types from CLAUDE.md, **including the 6 `Position` members, `customIcon: string | null` on `NotificationConfig`, and the `Theme` union**.
2. `src/utils/defaults.ts` — `TYPE_DEFAULTS: Record<NotificationType, { backgroundColor; textColor }>` (no `icon` here — that's a presentation concern handled by `components/toast/icons.ts` in Phase 3) + `createDefaultConfig()` that returns a fresh `Omit<NotificationConfig, 'id'>` including `customIcon: null`. **Warning uses `textColor: '#1f2937'`** for WCAG AA contrast.
3. `src/utils/storage.ts` — typed safe wrappers for both concerns:
   - `loadPresets()` / `savePresets()` with `isPreset` guard that **validates union-literal values** (type, position, animation) not just `typeof string`.
   - `loadTheme()` / `saveTheme()` with the same defensive pattern; on miss/corrupt, fall back to `window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'`.
   - Two `STORAGE_KEYS` exports: `PRESETS: 'toast-builder:presets'`, `THEME: 'toast-builder:theme'`.
4. `src/styles/_variables.scss` — non-theme tokens only (radii, spacing, font sizes, z-index).
5. `src/styles/_themes.scss` — CSS custom properties under `:root, :root[data-theme='light']` and `:root[data-theme='dark']` per `docs/ARCHITECTURE.md` palette.
6. `src/styles/main.scss` — imports both, sets baseline `body` styling using tokens.

✅ Exit: compiles clean, smoke test green, no UI yet. Commit.

## Phase 2 — Stores (~40 min)

1. `stores/builder.ts` — state: `config: Omit<NotificationConfig,'id'>`, `colorsCustomized`; actions: `setType`, `setTitle`, `setMessage`, `setDuration`, `setPersistent`, `setPosition`, `setBackgroundColor`, `setTextColor`, `toggleIcon`, `toggleCloseButton`, `setAnimation`, `setCustomIcon(dataUrl: string | null)`, `applyPreset`.
2. `stores/notifications.ts` — state: `toasts: ActiveNotification[]`; getters: `byPosition`; actions: `show(config)`, `dismiss(id)`, `clearAll`; module-level timer Map.
3. `stores/presets.ts` — state hydrated from storage on init; actions: `savePreset(name, config)` (caller passes the config so the store stays decoupled from `builder`), `deletePreset(id)`, with write-through to storage.
4. `stores/theme.ts` — state: `theme: Theme`, hydrated via `loadTheme()`; action: `toggle()`; set `<html data-theme>` once imperatively at store init for correct first paint, then a **non-immediate** `watch(theme, …)` writes `<html data-theme>` and calls `saveTheme()` only on an actual change (the system-preference default must not be persisted before an explicit toggle — REQUIREMENTS F6.5 / Assumption #6). **Must be initialised at app bootstrap** (call `useThemeStore()` once in `main.ts` after `app.use(createPinia())`).

✅ Exit: stores compile; quick console sanity via dev tools optional. Commit.

## Phase 3 — Toast rendering (~50 min)

1. `components/toast/icons.ts` — `TYPE_ICONS: Record<NotificationType, string>` exporting inline SVG markup strings (success check, error X, warning triangle, info circle) per the reference design.
2. `ToastItem.vue` — icon area: if `config.customIcon` non-null → render `<img :src="config.customIcon" alt="">`, else inline SVG from `TYPE_ICONS[config.type]` via `v-html`; title, message, close button, progress bar; styles driven by `config.backgroundColor/textColor`; emits `close`.
3. `ToastContainer.vue` — Teleport, **six** position wrappers, a single `<TransitionGroup name="toast">`; the per-toast animation is driven by a `data-animation` attribute on each ToastItem, renders from notifications store.
4. `_animations.scss` — fade/slide/bounce enter/leave + `-move` classes; respect `prefers-reduced-motion`.
5. Temporary dev button to spawn toasts; verify stacking, auto-dismiss, manual close, persistent.

✅ Exit: toasts work standalone in both themes. Commit.

## Phase 4 — Builder UI + Preview + ThemeToggle (~80 min)

1. Build `ConfigPanel` controls bound to builder store (`v-model` on `computed` get/set wrappers or explicit handlers); chrome uses `var(--…)` tokens throughout.
2. `utils/iconUpload.ts` — `validateIconFile(file: File): { ok: true } | { ok: false; reason: string }` (checks `type.startsWith('image/')` and `size <= 100 * 1024`) and `fileToDataUrl(file: File): Promise<string>`. Pure, no DOM.
3. `IconUploader.vue` — file input + thumb preview + clear button; calls validation, displays inline error on rejection, otherwise calls `builder.setCustomIcon(dataUrl)`.
4. `ThemeToggle.vue` — button with `aria-pressed`, calls `theme.toggle()`; place in `App.vue` header right.
5. `PreviewPane.vue` — gray stage (`var(--bg-elevated)`), static `ToastItem` aligned to selected position, Show Notification → `notifications.show(builder.config)`.
6. `App.vue` two-column layout per `docs/ARCHITECTURE.md`; remove dev button.

✅ Exit: full configure → preview → trigger loop works in both themes; custom icons round-trip; toast colors unchanged across themes. Commit.

## Phase 5 — Presets + Code Export (~50 min)

1. `PresetList` (kayıtlı preset listesi + inline save satırı) + `PresetListItem` (Load/Delete, summary line, type color dot). Save satırı ayrı bileşen değil, `PresetList` içinde yaşıyor.
2. `utils/codeExport.ts` + `CodeExport.vue` with Copy to Clipboard (clipboard API + "Copied!" feedback state, fallback message on failure). Code export excludes `customIcon` and color fields — it represents behavioral/structural config only, not visual styling.

✅ Exit: presets survive reload (including custom icons); export copies correctly. Commit.

## Phase 6 — Tests (~50 min)

Per `docs/TESTING.md`. Target suite (12 tests):
1. `notifications` store: `show` adds toast with id/createdAt; auto-dismiss fires after duration (fake timers); `duration: 0` never auto-dismisses; manual `dismiss` clears timer.
2. `iconUpload`: validation rejects non-image MIME; rejects >100 KB; accepts valid file.
3. `ToastItem`: renders title/message; emits `close` on button click.
4. `builder` store: type change applies default colors and resets `colorsCustomized`.
5. `codeExport`: equality of generated snippet (exact match).
6. `presets` store: delete removes preset and persists (implicitly covers save).

✅ Exit: all green, zero open handles. Commit.

## Phase 7 — Polish + README + ship (~30 min)

1. UI pass against the reference screenshot in **both themes**: spacing, focus states, hover states.
2. A11y pass: aria-live on toast container, labels on every control, keyboard reachability for upload + theme toggle, focus-visible rings.
3. README.md: setup, approach (architecture summary + why Pinia/structure + theme architecture + why upload over icon-library), assumptions (copy from `docs/REQUIREMENTS.md`), bonuses implemented, test instructions, optional deploy link.
4. Final clean clone test: `npm install && npm run dev && npm run test`.
5. Optional: deploy to Vercel/Netlify, add link to README.

✅ Exit: push, verify repo renders nicely on GitHub.

## Git strategy

`main` only is fine for this scale, but commit per phase with conventional commits (`feat:`, `test:`, `chore:`, `docs:`, `fix:`). A readable history is part of the Code Quality score. Never commit broken builds.

## Time budget reality check

Phase 0 (30) + 1 (30) + 2 (40) + 3 (50) + 4 (80) + 5 (50) + 6 (50) + 7 (30) = **360 min ≈ 6 h**. This is over the brief's "3–5 h" hint because of the deliberate full-bonus scope. The trade is conscious: each bonus contributes to UI/UX (15%) and Functionality (30%), and the additional tests contribute to Testing (10%). If any phase overruns, **drop polish from Phase 7 before dropping tests from Phase 6** — Testing weight is fixed; polish has diminishing returns past a threshold.
