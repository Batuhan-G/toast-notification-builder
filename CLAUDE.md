# CLAUDE.md — Toast Notification Builder

This file gives Claude Code the full context for this project. Read it before making any change. The detailed documents live in `/docs` — consult them when working on the relevant area.

## What this project is

A trial-day case project: a toast notification configuration tool. Users configure a toast (type, title, message, duration, position, colors, icon/close toggles, animation, optional custom icon), see a **live preview**, trigger real toasts that **stack** at the chosen position, and **save/load/delete presets** persisted in localStorage. The builder itself supports a **light/dark theme toggle**. Code export with copy-to-clipboard rounds out the feature set.

Quality bar: working features first, then clean code, strict TypeScript, polished UI/UX, and meaningful tests — in that order. Doing the full scope (core + all bonuses) excellently beats half-baked extras.

## Tech stack (fixed — do not substitute)

- Vue 3 with **Composition API** (`<script setup lang="ts">` everywhere)
- **TypeScript** (strict mode, no `any`, no `@ts-ignore`)
- **Vite** as build tool
- **Pinia** for state management
- **Jest + Vue Test Utils** for testing (the spec explicitly names Jest — do NOT switch to Vitest)
- **nanoid** for ID generation
- Plain **SCSS** — no UI framework (no Tailwind, no Vuetify, no Element Plus)
- **No icon library** — type icons are inline SVG; the custom-icon bonus uses user upload, not a third-party icon set, to stay within the brief's allowed-libraries list.

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

## Core data model (canonical — defined in `src/types/notification.ts`)

```ts
type NotificationType = 'success' | 'error' | 'warning' | 'info';

// 6 positions: spec mandates 4 corners; TC/BC are additive to match the reference design.
type Position =
  | 'top-left' | 'top-center' | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

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
  customIcon: string | null; // bonus: user-uploaded image as data URL; null = use type icon
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

type Theme = 'light' | 'dark';
```

Never deviate from this shape. If a feature needs more data, extend additively and document it.

## Architecture in one paragraph

Four Pinia stores: `builder` (the config currently being edited), `notifications` (active on-screen toasts + timers), `presets` (localStorage-backed CRUD), `theme` (light/dark + localStorage persistence + system-preference fallback). UI splits into a left **ConfigPanel** (form controls writing to `builder`, including an `IconUploader` for the custom-icon bonus) and a right **PreviewPane** (renders a static `ToastItem` from `builder.config`, plus Show button, presets list, code export). The header carries a `ThemeToggle`. Real toasts render through a `ToastContainer` mounted via `<Teleport to="body">`, one stacking column per position, animated with `<TransitionGroup>`. Timer logic (auto-dismiss, progress) lives in the `notifications` store, not in components. Builder chrome (panels, controls, presets, code block) is themed through CSS custom properties driven by `[data-theme]` on `<html>`; toast colors themselves are user-configured and not theme-bound.

## Hard rules

1. **TypeScript strictness is non-negotiable.** `strict: true`, explicit return types on store actions and utils, discriminated unions / `Record<NotificationType, ...>` maps over if-chains, `satisfies` where it helps. Never `any`; use `unknown` + narrowing for JSON parsing.
2. **localStorage access only via `src/utils/storage.ts`** — typed, try/catch-wrapped (handles quota errors and corrupt JSON). Stores never call `localStorage` directly. This includes the theme persistence.
3. **Timers are owned by the notifications store** and must be cleared on dismiss to avoid leaks. Use `window.setTimeout` and keep handles in a `Map<string, number>` outside reactive state.
4. **The live preview is a real `ToastItem`**, not a duplicate markup copy — single source of visual truth.
5. **Changing the type selector always applies that type's default colors** (defaults live in `src/utils/defaults.ts`) and resets the `colorsCustomized` flag. The flag is tracked in the builder store so that preset loading can mark colors as explicitly chosen.
6. **Builder chrome uses CSS variables; toast colors don't.** Chrome (page bg, cards, inputs, buttons, presets, code block) reads from theme tokens (`var(--bg-surface)`, `var(--text-primary)`, …) defined in `_themes.scss`. Toast `backgroundColor`/`textColor` come from `config` via inline style — these are user data, persisted in presets and emitted in code export, so they must be literal hex values, not CSS-var references.
7. **Custom icon validation lives at the upload boundary.** Accept `image/*` only; cap at 100 KB; convert via `FileReader.readAsDataURL`; on failure, show inline error and don't mutate `config.customIcon`. Validation logic is a pure function and is unit-tested.
8. **Accessibility**: toast container uses `role="status"` / `aria-live="polite"` (assertive for `error`), close button has `aria-label`, all form controls have labels, theme toggle has `aria-pressed`, file upload is keyboard-reachable.
9. **No dead code, no commented-out blocks, no console.log** in the final state.
10. After each phase in `docs/IMPLEMENTATION-PLAN.md`: run `npm run build` and `npm run test`, fix everything, then propose a conventional commit message (see `docs/CONVENTIONS.md`) and **wait for explicit approval before running `git commit`**. Never commit or push without approval.

## Definition of done (whole project)

- All Core Features from `docs/REQUIREMENTS.md` pass their acceptance criteria
- **All six bonuses implemented**: animation styles, code export + clipboard, preset delete, progress bar, custom icon upload, dark/light theme toggle
- ≥ 8 meaningful Jest tests passing (spec minimum is 2; we cover the core behaviors plus the two new bonuses' critical logic)
- `npm install && npm run dev && npm run test` works from a clean clone
- README.md complete (setup, approach, assumptions, bonuses implemented, time-spent breakdown if useful)
- No TS errors, no ESLint errors, no runtime console errors
- Dark mode renders without contrast regressions; light mode matches the reference design
