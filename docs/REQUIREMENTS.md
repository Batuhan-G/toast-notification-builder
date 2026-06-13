# Requirements & Acceptance Criteria

Distilled from the trial-day brief. Each item has acceptance criteria (AC) — a feature is done only when all its ACs pass manually and, where marked, by test.

## Evaluation criteria (from the brief)

| Criteria | Weight | What it means for us |
|---|---|---|
| Functionality | 30% | Every core feature works, edge cases handled |
| Code Quality | 25% | Small focused files, clear naming, no duplication, clean commits |
| TypeScript | 20% | Strict mode, precise types, no `any`, typed boundaries (localStorage, clipboard, file uploads) |
| UI/UX | 15% | Polished layout matching the reference screenshot, smooth animations, sensible defaults, both themes look intentional |
| Testing | 10% | Meaningful tests beyond the minimum 2 |

## F1 — Configuration Panel

- **F1.1 Type selector**: 4 options (success / error / warning / info) as visual cards with icon + label; selected state clearly highlighted.
  - AC: clicking a type updates the preview instantly and applies that type's default background color (unless colors were manually customized).
- **F1.2 Title input**: free text.
  - AC: empty title is allowed; toast renders without a title row.
- **F1.3 Message input**: textarea.
  - AC: long messages wrap; toast has a max-width and doesn't break layout.
- **F1.4 Duration**: slider 1–10 s + "Persistent (no auto-dismiss)" checkbox.
  - AC: slider shows current value (e.g. "3s"); checking Persistent disables the slider and sets duration to 0. [tested]
- **F1.5 Position selector**: 4 required corners (TL/TR/BL/BR); we additionally ship TC/BC (top-center/bottom-center) to match the reference UI — additive, allowed.
  - AC: selected position is where triggered toasts appear.

## F2 — Style Customization

- **F2.1 Background color**: native `<input type="color">` + hex text input, kept in sync.
  - AC: invalid hex typed into the text field does not corrupt state (validate before applying).
- **F2.2 Text color**: same pattern.
- **F2.3 Show icon toggle**, **F2.4 Show close button toggle**.
  - AC: both reflect immediately in preview and in real toasts.

## F3 — Live Preview

- **F3.1** A static (non-dismissing) toast rendered from the current config, updating reactively on every change.
  - AC: preview uses the same `ToastItem` component as real toasts.
- **F3.2** "Show Notification" button triggers a real toast.
  - AC: a new toast appears at the configured position with the configured style/animation. [tested]

## F4 — Notification Display

- **F4.1** Toast appears at the selected screen position (fixed, above all content, via Teleport).
- **F4.2** Auto-dismiss after `duration` ms; `duration === 0` means persistent.
  - AC: timer is cancelled if the user closes the toast manually (no ghost timers). [tested — fake timers]
- **F4.3** Entrance/exit animations per selected style (fade / slide / bounce) via `<TransitionGroup>`.
  - AC: removing a toast from the middle of a stack animates remaining toasts smoothly into place.
- **F4.4 Stacking**: multiple toasts coexist, arranged vertically per position.
  - AC: top positions stack downward (newest at top or bottom — pick one, be consistent); bottom positions stack upward. Toasts at different positions don't interfere. [tested]

## F5 — Preset Management

- **F5.1 Save**: name input + Save button stores current config as a preset.
  - AC: empty name is rejected with inline feedback; preset gets `id` (nanoid) and `createdAt` (ISO).
- **F5.2 Load**: applies preset config to the builder (preview updates).
- **F5.3 List**: shows name + summary line (e.g. "3s · Top Right", "Persistent · Bottom Right") + type color dot, matching the reference screenshot.
- **F5.4 Persistence**: localStorage, key `toast-builder:presets`, survives reload. Corrupt/missing data degrades to empty list, never crashes. [tested]
- **F5.5 Delete** (bonus, in scope): per-preset Delete button with confirmation hover state (no modal dialog needed).

## F6 — Bonus (full bonus set — all committed)

- **F6.1 Animation styles**: fade / slide / bounce selector (3-segment control).
- **F6.2 Code export**: dark code block showing a `const notification = { ... }` snippet generated from current config + "Copy to Clipboard" button (uses `navigator.clipboard`, with success feedback). [tested — pure generator function]
- **F6.3 Progress bar**: thin bar on the toast showing remaining time (hidden when persistent). CSS-animation driven (`animation-duration` = duration), pauses are not required.
- **F6.4 Custom icon upload**: file input in the config panel lets the user override the default type icon with their own image.
  - AC: only `image/*` MIME types accepted; max size 100 KB; both checks run client-side with an inline error message on rejection — invalid files do NOT mutate state.
  - AC: valid files are converted to a data URL via `FileReader.readAsDataURL` and stored in `config.customIcon`.
  - AC: when `customIcon` is non-null and `showIcon` is true, the toast renders an `<img>` with the data URL in place of the default type SVG.
  - AC: a "Use default icon" button (or X on the preview) sets `customIcon` back to `null`.
  - AC: presets serialize the data URL; code export includes the URL literally (no special handling — it's just another string field). [tested — validation pure function]
- **F6.5 Theme toggle**: light / dark theme for the builder interface.
  - AC: toggle button in the header switches `[data-theme]` on `<html>` between `'light'` and `'dark'`.
  - AC: choice persists to localStorage under key `toast-builder:theme`; on first visit, `window.matchMedia('(prefers-color-scheme: dark)')` decides the default.
  - AC: only builder chrome (page, cards, inputs, buttons, presets list, code block) themes — toast colors remain user-configured and identical in both themes.
  - AC: toggling is instant; chrome transitions are subtle (~150 ms ease) and suppressed under `prefers-reduced-motion: reduce`.
  - AC: toggle button has `aria-pressed` reflecting current state and is keyboard-reachable. [tested — theme store persistence + system preference fallback]

## Out of scope (do not build)

Backend, routing, i18n, pause-on-hover for progress, multi-user collaboration, exporting full SCSS/Vue snippets. If time remains, prefer polish and an extra meaningful test over new features.

## Assumptions (also record in README)

1. "Persistent" maps to `duration: 0` per the data model comment.
2. TC/BC positions are an additive enhancement seen in the reference design; the `Position` type is extended accordingly (6 values total).
3. Duration slider is in whole seconds in the UI but stored as milliseconds.
4. Type defaults: success `#22c55e`, error `#ef4444`, warning `#f59e0b`, info `#3b82f6`. Default text color is `#ffffff`; **warning uses `#1f2937`** for WCAG AA contrast on the amber background.
5. Custom icon is implemented as **upload, not third-party icon library**, to stay within the brief's allowed-libraries list. The brief lists both as acceptable bonus paths, so this is a deliberate choice in favour of zero-dependency demonstration. Upload limit (100 KB) keeps presets serializable within typical localStorage budgets.
6. Theme defaults to system preference on first load; once the user explicitly toggles, the choice sticks across sessions.
7. localStorage keys: `toast-builder:presets` and `toast-builder:theme` — same namespace prefix, distinct suffix per concern.
8. Toggling "Persistent" off restores the previously set duration (tracked internally as `previousDuration`), not a hard-coded default, so the user's last slider value is preserved.
