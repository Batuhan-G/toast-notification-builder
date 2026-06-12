# Conventions & Best Practices

## Vue

- `<script setup lang="ts">` in every component; block order: `<script>` → `<template>` → `<style scoped lang="scss">`.
- Props via `defineProps<{ ... }>()` with interfaces; emits via `defineEmits<{ close: [] }>()` (typed tuple syntax).
- Components are PascalCase files and usages (`<ToastItem />`).
- Derive, don't duplicate: use `computed` for anything derivable from store state (e.g. duration label "3s", preset summary line).
- No business logic in templates beyond simple conditionals; extract to computed/methods.
- Use `v-for` `:key` with stable ids (nanoid), never index, especially inside `<TransitionGroup>`.

## TypeScript

- `strict: true`; additionally `noUnusedLocals`, `noUnusedParameters`.
- Never `any` / `@ts-ignore` / non-null `!` assertions. Use `unknown` + type guards at I/O boundaries (localStorage, clipboard).
- Prefer union types + `Record<Union, T>` maps over enums and if/else chains:
  ```ts
  const TYPE_ICONS: Record<NotificationType, string> = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
  ```
- Export shared types only from `src/types/`; utils/stores import from there.
- Explicit return types on every exported function and store action.
- Use `Omit`, `Pick`, `Readonly` deliberately — the spec's own model uses `Omit`, mirror that style.
- `satisfies` for config-like objects where you want inference + checking.

## Pinia

- Setup-store style (`defineStore('builder', () => { ... })`) — consistent with Composition API.
- State refs are not exported mutable to components; components mutate only through actions. (Keeps data flow predictable and testable.)
- Keep non-reactive machinery (timer Map) module-scoped, not in state.

## SCSS / styling

- Tokens in `_variables.scss`; no magic hex values inside components (toast bg/text colors come from config via inline style — that's the one exception, by design).
- Scoped styles per component; shared animation classes are global (`_animations.scss`) because `TransitionGroup` classes must be resolvable.
- BEM-lite naming inside components (`.toast`, `.toast__title`, `.toast--persistent`).
- Respect `prefers-reduced-motion`: reduce/disable toast animations under the media query (cheap, high-signal polish).

## Tooling

- ESLint (flat config) with `eslint-plugin-vue` + TypeScript plugins; Prettier for formatting with `eslint-config-prettier` to avoid rule conflicts.
- `npm run lint` and `npm run format` must both be clean before every commit.
- `package.json` declares `"engines": { "node": ">=18" }` so the expected runtime is explicit.

## Naming

- Stores: `useBuilderStore`, `useNotificationsStore`, `usePresetsStore`.
- Actions: imperative verbs (`show`, `dismiss`, `applyPreset`, `savePreset`).
- Booleans: `show*`, `is*`, `has*` prefixes.
- Files: components PascalCase, everything else camelCase.

## Commits

Conventional commits, present tense, scoped where useful:

```
chore: scaffold vite + vue3 + ts project with jest pipeline
feat(types): add notification data model and type defaults
feat(stores): add builder, notifications and presets stores
feat(toast): render stacked toasts with animations and auto-dismiss
feat(builder): configuration panel with live preview
feat(presets): save/load/delete presets with localStorage persistence
feat(export): code export with copy to clipboard
test: cover stores, toast item and code export
docs: add readme with setup, approach and assumptions
```

## README.md outline (write in Phase 7)

1. Project title + one-line description (+ screenshot, + live demo link if deployed)
2. Setup: prerequisites (Node ≥ 18), `npm install`, `npm run dev`, `npm run test`, `npm run build`
3. Approach: stack, store layout, why shared ToastItem, how stacking/timers work (5–8 sentences)
4. Assumptions: list from `docs/REQUIREMENTS.md`
5. Bonus features implemented
6. What I'd do with more time (1–3 honest items, e.g. pause-on-hover for progress, E2E test)

## AI-assisted workflow

This project is built with an AI-assisted workflow. `CLAUDE.md` and this `docs/` set act as the constraint layer: plan → constrain → generate → verify. Every generated change is reviewed before commit, and each phase is gated by `npm run build` + `npm run test`. Nothing lands in the repo that hasn't been read and understood.
