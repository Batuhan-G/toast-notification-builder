# Toast Notification Builder

A toast notification configuration tool built with Vue 3 and TypeScript. Users configure toast notifications (type, title, message, duration, position, colors, icon/close toggles, animation, custom icon), see a live preview, trigger real toasts that stack at the chosen position, and save/load/delete presets persisted in localStorage. The builder supports a light/dark theme toggle.

**Live Demo:** https://toast-notification-builder-mu.vercel.app/

## Setup

**Prerequisites:** Node.js >= 18

```bash
npm install        # install dependencies
npm run dev        # start dev server
npm run build      # type-check + production build
npm run test       # run tests
npm run lint       # lint
npm run format     # format
```

## Approach

The app uses Vue 3 Composition API with TypeScript in strict mode. State management is handled by four Pinia stores, each with a single responsibility: `builder` (current config), `notifications` (active toasts + timers), `presets` (localStorage-backed CRUD), and `theme` (light/dark toggle with system preference fallback).

The UI is split into a left Configuration panel and a right Preview panel. A single `ToastItem` component is shared between the static preview and live toasts, ensuring visual fidelity. Real toasts render through a `ToastContainer` mounted via `<Teleport to="body">`, with one stacking column per position. Timer logic lives in the notifications store, not in components, preventing memory leaks and making behavior testable with Jest fake timers.

Custom icon upload uses pure validation functions (`validateIconFile`) at the input boundary, keeping the component thin and the logic independently testable. Theme switching is driven by a single `[data-theme]` attribute on `<html>`, with all chrome styles reading from CSS custom properties -- toast colors remain user-configured and identical across themes.

## Assumptions

1. "Persistent" maps to `duration: 0`.
2. Top-center and bottom-center positions are an additive enhancement beyond the four required corners, matching the reference design (6 positions total).
3. Duration slider uses whole seconds in the UI but stores milliseconds internally.
4. Changing the notification type always applies that type's default colors.
5. Custom icon is implemented as file upload (not icon library) to stay within the brief's allowed-libraries list. Upload limit is 100 KB.
6. Theme defaults to system preference on first load; once toggled, the choice persists.
7. Toggling "Persistent" off restores the previously set slider value.

## Bonus Features

All six bonus features are implemented:

1. **Animation styles** -- fade, slide, and bounce entrance/exit animations
2. **Code export** -- generated `const notification = { ... }` snippet with copy-to-clipboard
3. **Preset delete** -- per-preset delete button
4. **Progress bar** -- visual countdown bar on timed toasts
5. **Custom icon upload** -- upload a custom image (max 100 KB) to replace the default type icon
6. **Dark/light theme toggle** -- builder chrome themes via CSS custom properties; toast colors stay user-configured

## Testing

The project uses Jest with Vue Test Utils. 12 tests across 6 suites cover the critical paths:

- **notifications store** -- toast lifecycle (show, auto-dismiss with fake timers, persistent mode, manual dismiss)
- **builder store** -- type change applies default colors and resets `colorsCustomized`
- **presets store** -- delete removes preset and persists to localStorage
- **iconUpload utils** -- validates MIME type, file size limit (100 KB), and accepts valid files
- **codeExport utils** -- generated snippet matches expected output
- **ToastItem component** -- renders title/message, emits `close` on button click

```bash
npm run test       # run full suite
```
