# Testing Strategy

## Why this needs its own doc

The spec mandates **Jest** (not Vitest), but the project is built with **Vite**. Jest doesn't understand Vite's transform pipeline, so the Jest setup is the single most common place this stack breaks. Get it right in Phase 0 and never touch it again.

## Dependencies (versions matter — keep Jest 29 line aligned)

```bash
npm i -D jest@29 jest-environment-jsdom@29 @vue/test-utils@2 \
  @vue/vue3-jest@29 babel-jest@29 @babel/core @babel/preset-env \
  @babel/preset-typescript @types/jest
```

## jest.config.cjs

```js
/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'ts', 'vue'],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.(ts|js)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(scss|css)$': '<rootDir>/test/styleMock.cjs',
  },
  testMatch: ['**/__tests__/**/*.spec.ts'],
  // vue3-jest needs this to know the Vue version context
  testEnvironmentOptions: { customExportConditions: ['node', 'node-addons'] },
};
```

`test/styleMock.cjs`: `module.exports = {};`

## babel.config.cjs

```js
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
};
```

## Known pitfalls

1. **ESM vs CJS**: Vite project `package.json` has `"type": "module"` → Jest/babel configs must be `.cjs`.
2. **`import.meta.env`** is unavailable under Jest. Don't use it in code under test (we don't need it at all in this project).
3. **SCSS imports** in components crash Jest → the `moduleNameMapper` style mock above.
4. **Teleport** in mounted components: test `ToastItem` directly (no Teleport) and test the notifications store separately. If `ToastContainer` must be mounted, use `global.stubs: { teleport: true }`.
5. **Pinia in tests**: `setActivePinia(createPinia())` in `beforeEach`. Reset modules if timer Map state leaks between tests (export a `__clearTimersForTest` helper or just `dismiss` everything in `afterEach`).
6. **nanoid is pure ESM** and breaks Jest's default transform. Either add `transformIgnorePatterns: ['/node_modules/(?!nanoid)']` with babel transforming it, or mock it: `jest.mock('nanoid', () => ({ nanoid: () => 'test-id-' + counter++ }))`. The mock is simpler and more deterministic — prefer it.

## Test plan (≥6 tests, ordered by value)

### 1. `stores/notifications.spec.ts` (highest value — core behavior)
```ts
jest.useFakeTimers();
// show() adds a toast with generated id and createdAt
// auto-dismiss: advanceTimersByTime(duration) → toast removed
// persistent: duration 0 → advance 60s → still present
// manual dismiss cancels timer: dismiss(id) then advance → no errors, list empty
```

### 2. `stores/presets.spec.ts`
Mock localStorage (`jest.spyOn(Storage.prototype, 'getItem'/'setItem')` or a manual stub):
```ts
// savePreset writes JSON containing the preset name
// init with corrupt JSON ("{oops") → presets === []
// deletePreset removes and persists
```

### 3. `utils/codeExport.spec.ts`
```ts
// generateCodeSnippet(config) === expected string (exact match)
// persistent config renders duration: 0
```

### 4. `components/ToastItem.spec.ts`
```ts
// renders title and message text
// showIcon: false → no icon element
// showCloseButton: true → click close → emitted('close')
// inline style applies backgroundColor
```

### 5. `stores/builder.spec.ts`
```ts
// setType('error') applies error default colors
// setBackgroundColor('#000000') then setType('info') → custom color preserved
```

## Conventions

- One `describe` per unit; test names read as behavior sentences ("dismisses automatically after the configured duration").
- AAA structure (arrange/act/assert), no logic in tests.
- No snapshot tests except possibly `codeExport` — explicit string equality makes the intent clearer than snapshots.
- `npm run test` must pass with zero open handles (clear all timers).
