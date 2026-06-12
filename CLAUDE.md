# CLAUDE.md — Toast Notification Builder

This file gives Claude Code the full context for this project. Read it before making any change. The detailed documents live in `/docs` — consult them when working on the relevant area.

## What this project is

A trial-day case project: a toast notification configuration tool. Users configure a toast (type, title, message, duration, position, colors, icon/close toggles, animation), see a **live preview**, trigger real toasts that **stack** at the chosen position, and **save/load/delete presets** persisted in localStorage. Bonus: code export with copy-to-clipboard, progress bar, animation styles.

Quality bar: working features first, then clean code, strict TypeScript, polished UI/UX, and meaningful tests — in that order. Prefer doing the core scope excellently over adding extra scope.

## Tech stack (fixed — do not substitute)

- Vue 3 with **Composition API** (`<script setup lang="ts">` everywhere)
- **TypeScript** (strict mode, no `any`, no `@ts-ignore`)
- **Vite** as build tool
- **Pinia** for state management
- **Jest + Vue Test Utils** for testing (the spec explicitly names Jest — do NOT switch to Vitest)
- **nanoid** for ID generation
- Plain **SCSS** — no UI framework (no Tailwind, no Vuetify, no Element Plus)

## Commands

```bash
npm install        # install
npm run dev        # start dev server (Vite)
npm run build      # type-check + production build
npm run test       # run Jest tests
npm run lint       # ESLint
npm run format     # Prettier
```

These exact commands must work — they are part of the submission criteria.

## Source of truth documents

| Document | Use it when |
|---|---|
| `docs/REQUIREMENTS.md` | Deciding scope, acceptance criteria, what "done" means |
| `docs/ARCHITECTURE.md` | Creating files, deciding where logic lives, data flow |
| `docs/IMPLEMENTATION-PLAN.md` | Choosing what to build next, phase order |
| `docs/CONVENTIONS.md` | Naming, code style, commit messages |
| `docs/TESTING.md` | Writing/configuring tests, Jest setup pitfalls |
| `docs/REFERENCE-DESIGN.png` | Matching the visual design — read this image before any UI work |

## Core data model (canonical — defined in `src/types/notification.ts`)

```ts
type NotificationType = 'success' | 'error' | 'warning' | 'info';
type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type AnimationStyle = 'fade' | 'slide' | 'bounce';

interface NotificationConfig {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration: number;          // ms, 0 = persistent
  position: Position;
  backgroundColor: string;
  textColor: string;
  showIcon: boolean;
  showCloseButton: boolean;
  animation: AnimationStyle; // bonus field, additive to spec
}

interface Preset {
  id: string;
  name: string;
  config: Omit<NotificationConfig, 'id'>;
  createdAt: string;         // ISO string
}

interface ActiveNotification extends NotificationConfig {
  createdAt: number;         // epoch ms
}
```

Never deviate from this shape. If a feature needs more data, extend additively and document it.

## Architecture in one paragraph

Three Pinia stores: `builder` (the config currently being edited), `notifications` (active on-screen toasts + timers), `presets` (localStorage-backed CRUD). UI splits into a left **ConfigPanel** (form controls writing to `builder`) and a right **PreviewPane** (renders a static `ToastItem` from `builder.config`, plus Show button, presets list, code export). Real toasts render through a `ToastContainer` mounted via `<Teleport to="body">`, one stacking column per position, animated with `<TransitionGroup>`. Timer logic (auto-dismiss, progress) lives in the `notifications` store, not in components.

## Hard rules

1. **TypeScript strictness is non-negotiable.** `strict: true`, explicit return types on store actions and utils, discriminated unions / `Record<NotificationType, ...>` maps over if-chains, `satisfies` where it helps. Never `any`; use `unknown` + narrowing for JSON parsing.
2. **localStorage access only via `src/utils/storage.ts`** — typed, try/catch-wrapped (handles quota errors and corrupt JSON). Stores never call `localStorage` directly.
3. **Timers are owned by the notifications store** and must be cleared on dismiss to avoid leaks. Use `window.setTimeout` and keep handles in a `Map<string, number>` outside reactive state.
4. **The live preview is a real `ToastItem`**, not a duplicate markup copy — single source of visual truth.
5. **Changing the type selector applies that type's default colors** (defaults live in `src/utils/defaults.ts`), but only if the user hasn't manually overridden colors — track a `colorsCustomized` flag in the builder store; reset it on type change apply.
6. **Accessibility**: toast container uses `role="status"` / `aria-live="polite"` (assertive for `error`), close button has `aria-label`, all form controls have labels.
7. **No dead code, no commented-out blocks, no console.log** in the final state.
8. After each phase in `docs/IMPLEMENTATION-PLAN.md`: run `npm run build` and `npm run test`, fix everything, then propose a conventional commit message (see `docs/CONVENTIONS.md`) and **wait for explicit approval before running `git commit`**. Never commit or push without approval.

## Definition of done (whole project)

- All Core Features from `docs/REQUIREMENTS.md` pass their acceptance criteria
- Bonus implemented: animation styles, code export + clipboard, preset delete, progress bar
- ≥ 6 meaningful Jest tests passing (spec minimum is 2; we deliberately go beyond it to cover the core behaviors)
- `npm install && npm run dev && npm run test` works from a clean clone
- README.md complete (setup, approach, assumptions)
- No TS errors, no ESLint errors, no runtime console errors
