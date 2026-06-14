# Architecture

## Folder structure

```
toast-notification-builder/
├── CLAUDE.md
├── README.md
├── docs/
├── index.html
├── package.json
├── tsconfig.json                  # strict: true
├── vite.config.ts
├── jest.config.cjs
├── babel.config.cjs               # needed by vue3-jest
└── src/
    ├── main.ts                    # createApp + Pinia + theme init
    ├── App.vue                    # layout shell: header (with ThemeToggle) + 2-column grid + ToastContainer
    ├── types/
    │   └── notification.ts        # ALL shared types live here (single source)
    ├── utils/
    │   ├── defaults.ts            # type→color map, default config factory
    │   ├── storage.ts             # typed, safe localStorage wrapper (presets + theme)
    │   ├── codeExport.ts          # config → code snippet string (pure, tested)
    │   ├── codeExport.spec.ts     # ← co-located test
    │   ├── iconUpload.ts          # validateIconFile + fileToDataUrl (pure, tested)
    │   └── iconUpload.spec.ts     # ← co-located test
    ├── stores/
    │   ├── builder.ts             # config being edited + colorsCustomized flag
    │   ├── builder.spec.ts        # ← co-located test
    │   ├── notifications.ts       # active toasts, timers, show/dismiss
    │   ├── notifications.spec.ts  # ← co-located test
    │   ├── presets.ts             # CRUD + localStorage sync
    │   ├── presets.spec.ts        # ← co-located test
    │   └── theme.ts               # light/dark + persistence + system fallback
    ├── components/
    │   ├── ThemeToggle.vue        # header toggle, aria-pressed
    │   ├── icons/
    │   │   ├── typeIcons.ts        # TYPE_ICONS: Record<NotificationType, string> (inline SVG)
    │   │   ├── SunIcon.vue
    │   │   └── MoonIcon.vue
    │   ├── toast/
    │   │   ├── ToastItem.vue       # single toast (used by preview AND real toasts)
    │   │   ├── toastItem.spec.ts   # ← co-located test
    │   │   └── ToastContainer.vue  # Teleport + per-position stacks + TransitionGroup
    │   ├── builder/
    │   │   ├── ConfigPanel.vue    # composes the controls below
    │   │   ├── TypeSelector.vue
    │   │   ├── DurationControl.vue
    │   │   ├── PositionSelector.vue
    │   │   ├── ColorField.vue     # color swatch + hex input, reused for bg/text
    │   │   ├── ToggleOptions.vue  # icon / close button checkboxes
    │   │   ├── AnimationSelector.vue
    │   │   └── IconUploader.vue   # file input + preview + clear button (uses iconUpload.ts)
    │   └── preview/
    │       ├── PreviewPane.vue     # static ToastItem + Show Notification + presets + export
    │       ├── PresetList.vue      # kayıtlı preset listesi + inline save satırı
    │       ├── PresetListItem.vue  # tek preset satırı: load/delete, type-renk noktası
    │       └── CodeExport.vue      # config → highlighted snippet + copy-to-clipboard
    ├── styles/
    │   ├── _variables.scss        # non-theme tokens: radii, spacing, font sizes, z-index
    │   ├── _themes.scss           # CSS custom properties per [data-theme]
    │   ├── _animations.scss       # fade/slide/bounce transition classes
    │   └── main.scss
```

Component granularity rule: a component exists if it has its own state/logic or is reused; don't fragment for its own sake. **~15 components is the ceiling** with the two new bonus pieces.

## Data flow

```
                 ┌─────────────────────┐
 user input ───► │   builder store     │ ───reactive──► PreviewPane → ToastItem (static)
                 │ (current config inc.│ ───reactive──► CodeExport (via codeExport.ts)
                 │  customIcon)        │
                 └────────┬────────────┘
                          │ show()  (clones config + nanoid + createdAt)
                          ▼
                 ┌─────────────────────┐
                 │ notifications store │ ──► ToastContainer (Teleport, per-position
                 │ toasts[] + timers   │      stacks, TransitionGroup) → ToastItem ×N
                 └─────────────────────┘
                          ▲ dismiss(id) on close click / timer fire

                 ┌─────────────────────┐
 Save form ────► │   presets store     │ ◄──► utils/storage.ts ◄──► localStorage
 Load click ◄─── │ presets[]           │      (toast-builder:presets)
                 └─────────────────────┘
        Load applies preset.config back into builder store (incl. customIcon)

                 ┌─────────────────────┐
 ThemeToggle ──► │   theme store       │ ◄──► utils/storage.ts ◄──► localStorage
 click           │ theme: 'light'|'dark│      (toast-builder:theme)
                 └────────┬────────────┘
                          │ watch → document.documentElement.dataset.theme = theme
                          ▼
                 CSS custom properties in _themes.scss re-resolve;
                 all chrome restyles via var(--bg-surface), var(--text-primary), …
```

## Key decisions & rationale

1. **Pinia, four small stores** instead of one god-store or prop drilling. Each store has one responsibility, which keeps the code easy to reason about and makes store unit tests trivial (`createPinia` + `setActivePinia` in tests).
2. **`ToastItem` is shared** between preview and live toasts. Props: `config` (+ optional `preview: boolean` to suppress dismiss behavior). Guarantees preview fidelity.
3. **Teleport to `<body>`** for `ToastContainer` so toasts are never clipped by layout containers; six fixed-position wrappers (one per `Position`), each a `<TransitionGroup tag="div">`.
4. **Timers outside reactive state.** `const timers = new Map<string, number>()` module-level in the notifications store; `show()` registers, `dismiss()` clears. Prevents reactivity overhead and leaks; easy to test with `jest.useFakeTimers()`.
5. **Type-change color behavior**: builder store keeps `colorsCustomized: boolean`. `setType()` always applies `TYPE_DEFAULTS[type]` colors and resets `colorsCustomized` to false; `setBackgroundColor`/`setTextColor` set the flag. Loading a preset sets the flag (preset colors are explicit).
6. **Animations** use a single `<TransitionGroup name="toast">` plus a per-toast `data-animation` attribute; transition CSS is qualified by `[data-animation='…']` so each toast animates with its own style even when several with different animations are stacked at one position. Slide direction is position-scoped via the `.toast-container--*` class.
7. **Storage wrapper** exposes `loadPresets(): Preset[]`, `savePresets(presets: Preset[]): void`, `loadTheme(): Theme`, `saveTheme(theme: Theme): void`. Parses with `unknown` + a type guard (`isPreset`, literal-union checks for theme), returns safe defaults on any failure. This is the main I/O boundary of the app, so it gets the strictest typing.
8. **Code export** is a pure function `generateCodeSnippet(config: Omit<NotificationConfig,'id'>): string` — trivially testable, used by `CodeExport.vue` with lightweight syntax-highlight styling (spans, no library).
9. **Custom icon as data URL** (not blob URL): blob URLs are tied to the document and don't survive reload from localStorage; data URLs serialize cleanly. Validation lives in `utils/iconUpload.ts` as two pure functions: `validateIconFile(file: File): { ok: true } | { ok: false; reason: string }` and `fileToDataUrl(file: File): Promise<string>`. The component is a thin shell around these.
10. **Theme via `[data-theme]` + CSS custom properties** (not a Vue-level class toggle on every component): one attribute on `<html>` switches *all* chrome at once via cascading variables — zero per-component theme code, near-zero refactor cost when adding components. Themes live in `_themes.scss`; consumer components reference `var(--token)` only.
11. **Toast colors are user data, not theme tokens.** `ToastItem` uses inline `:style="{ backgroundColor: config.backgroundColor, color: config.textColor }"` — these values are persisted in presets and emitted in code export verbatim, so they MUST be literal hex strings. Mixing theme variables here would corrupt both persistence and export.

## Layout (match the reference screenshot)

The canonical visual reference is `docs/REFERENCE-DESIGN.png`; the description below summarizes it.

Header bar with title on the left and **ThemeToggle on the right**. Below: 2-column grid (`minmax(0, 1fr)` each, gap ~24px, max-width ~1400px centered, page background via `var(--bg-page)`, cards via `var(--bg-surface)` with `var(--border-default)` border + radius 12px).

- **Left card "Configuration"**: type cards row → Title → Message → Duration slider + persistent checkbox → Position grid (2×3: TL TC TR / BL BC BR) → "Style" section: Background + Text Color side by side → Options checkboxes → **Custom Icon uploader (file input + preview thumb + clear)** → Animation segmented control.
- **Right card "Preview"**: gray preview stage (`var(--bg-elevated)`) with the static toast positioned per config → full-width primary "Show Notification" button (`var(--accent-primary)`) → "Saved Presets" list → name input + Save → "Code Export" dark block (`var(--bg-code)` regardless of theme — code blocks stay dark for readability) → Copy to Clipboard button.

Style tokens (light theme defaults, defined in `_themes.scss`):
- `--bg-page: #f3f4f6`, `--bg-surface: #ffffff`, `--bg-elevated: #f9fafb`, `--bg-code: #1f2937`
- `--text-primary: #111827`, `--text-secondary: #4b5563`, `--text-muted: #9ca3af`
- `--border-default: #e5e7eb`, `--border-focus: #6366f1`
- `--accent-primary: #6366f1`, `--accent-primary-hover: #4f46e5`
- `--shadow-card: 0 1px 2px rgba(0,0,0,0.04)`

Dark theme overrides under `[data-theme='dark']`: slate page bg `#0f172a`, surface `#1e293b`, elevated `#273449`, primary text `#f1f5f9`, accent shifted to `#818cf8` for contrast. Code block stays dark in both themes.

## File-uploads: why pure functions

`utils/iconUpload.ts` keeps the File API surface confined to a single module. Tests can pass a fake `File` object and assert the validation result without mounting a component or stubbing the DOM extensively. The Vue component owns nothing but markup, state binding to the builder store, and error display — making both pieces independently maintainable.
