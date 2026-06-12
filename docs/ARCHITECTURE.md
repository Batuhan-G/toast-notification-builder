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
    ├── main.ts                    # createApp + Pinia
    ├── App.vue                    # layout shell: header + 2-column grid + ToastContainer
    ├── types/
    │   └── notification.ts        # ALL shared types live here (single source)
    ├── utils/
    │   ├── defaults.ts            # type→color map, default config factory
    │   ├── storage.ts             # typed, safe localStorage wrapper
    │   └── codeExport.ts          # config → code snippet string (pure, tested)
    ├── stores/
    │   ├── builder.ts             # config being edited + colorsCustomized flag
    │   ├── notifications.ts       # active toasts, timers, show/dismiss
    │   └── presets.ts             # CRUD + localStorage sync
    ├── components/
    │   ├── toast/
    │   │   ├── ToastItem.vue      # single toast (used by preview AND real toasts)
    │   │   └── ToastContainer.vue # Teleport + per-position stacks + TransitionGroup
    │   ├── builder/
    │   │   ├── ConfigPanel.vue    # composes the controls below
    │   │   ├── TypeSelector.vue
    │   │   ├── DurationControl.vue
    │   │   ├── PositionSelector.vue
    │   │   ├── ColorField.vue     # color swatch + hex input, reused for bg/text
    │   │   ├── ToggleOptions.vue  # icon / close button checkboxes
    │   │   └── AnimationSelector.vue
    │   ├── preview/
    │   │   └── PreviewPane.vue    # static ToastItem + Show Notification button
    │   ├── presets/
    │   │   ├── PresetList.vue
    │   │   ├── PresetListItem.vue
    │   │   └── PresetSaveForm.vue
    │   └── export/
    │       └── CodeExport.vue
    ├── styles/
    │   ├── _variables.scss        # colors, radii, shadows, spacing scale
    │   ├── _animations.scss       # fade/slide/bounce transition classes
    │   └── main.scss
    └── __tests__/                 # or co-located *.spec.ts — pick one, stay consistent
```

Component granularity rule: a component exists if it has its own state/logic or is reused; don't fragment for its own sake. ~13 components is the ceiling.

## Data flow

```
                 ┌─────────────────────┐
 user input ───► │   builder store     │ ───reactive──► PreviewPane → ToastItem (static)
                 │ (current config)    │ ───reactive──► CodeExport (via codeExport.ts)
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
 Load click ◄─── │ presets[]           │
                 └─────────────────────┘
        Load applies preset.config back into builder store
```

## Key decisions & rationale

1. **Pinia, three small stores** instead of one god-store or prop drilling. each store has one responsibility, which keeps the code easy to reason about and makes store unit tests trivial (`createPinia` + `setActivePinia` in tests).
2. **`ToastItem` is shared** between preview and live toasts. Props: `config` (+ optional `preview: boolean` to suppress dismiss behavior and `remainingRatio` not needed — progress bar is pure CSS keyed off `duration`). Guarantees preview fidelity.
3. **Teleport to `<body>`** for `ToastContainer` so toasts are never clipped by layout containers; six fixed-position wrappers (one per `Position`), each a `<TransitionGroup tag="div">`.
4. **Timers outside reactive state.** `const timers = new Map<string, number>()` module-level in the notifications store; `show()` registers, `dismiss()` clears. Prevents reactivity overhead and leaks; easy to test with `jest.useFakeTimers()`.
5. **Type-change color behavior**: builder store keeps `colorsCustomized: boolean`. `setType()` applies `TYPE_DEFAULTS[type]` colors only when `colorsCustomized === false`; `setBackgroundColor`/`setTextColor` set the flag. Loading a preset sets the flag (preset colors are explicit).
6. **Animations as CSS classes** named `toast-fade-*`, `toast-slide-*`, `toast-bounce-*`; the active animation name feeds `<TransitionGroup :name>`. Slide direction derives from position (left positions slide from left, right from right, centers from top/bottom). `move` class enables smooth restacking.
7. **Storage wrapper** exposes `loadPresets(): Preset[]` and `savePresets(presets: Preset[]): void`; parses with `unknown` + a type guard (`isPreset`), returns `[]` on any failure. This is the main I/O boundary of the app, so it gets the strictest typing.
8. **Code export** is a pure function `generateCodeSnippet(config: Omit<NotificationConfig,'id'>): string` — trivially testable, used by `CodeExport.vue` with lightweight syntax-highlight styling (spans, no library).

## Layout (match the reference screenshot)

The canonical visual reference is docs/REFERENCE-DESIGN.png; the description below summarizes it.
Header bar with title. Below: 2-column grid (`minmax(0, 1fr)` each, gap ~24px, max-width ~1400px centered, light gray page background, white cards with subtle border + radius 12px).
- Left card "Configuration": type cards row → Title → Message → Duration slider + persistent checkbox → Position grid (2×3: TL TC TR / BL BC BR) → "Style" section: Background + Text Color side by side → Options checkboxes → Animation segmented control.
- Right card "Preview": gray preview stage with the static toast positioned per config → full-width primary "Show Notification" button → "Saved Presets" list → name input + Save → "Code Export" dark block → Copy to Clipboard button.

Style tokens: primary `#6366f1` (indigo), page bg `#f3f4f6`, card border `#e5e7eb`, radius 8–12px, system font stack, monospace for message textarea + code block.
