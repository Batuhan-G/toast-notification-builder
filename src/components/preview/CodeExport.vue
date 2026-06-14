<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBuilderStore } from '@/stores/builder'
import { generateCodeSnippet, generateHighlightedHtml } from '@/utils/codeExport'
import ClipboardIcon from '@/components/icons/ClipboardIcon.vue'

const builder = useBuilderStore()
const copied = ref(false)
const copyFailed = ref(false)
let copyTimer: number | undefined

const highlightedHtml = computed(() => generateHighlightedHtml(builder.config))
const plainSnippet = computed(() => generateCodeSnippet(builder.config))

async function copyToClipboard(): Promise<void> {
  copyFailed.value = false
  try {
    await navigator.clipboard.writeText(plainSnippet.value)
    copied.value = true
    clearTimeout(copyTimer)
    copyTimer = window.setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    copied.value = false
    copyFailed.value = true
  }
}
</script>

<template>
  <div class="code-export">
    <h3 class="code-export__heading">Code Export</h3>

    <pre class="code-export__block"><code v-html="highlightedHtml" /></pre>

    <button
      type="button"
      class="code-export__copy-btn"
      :aria-label="copied ? 'Copied to clipboard' : 'Copy to clipboard'"
      @click="copyToClipboard"
    >
      <ClipboardIcon class="code-export__copy-icon" />
      {{ copied ? 'Copied!' : 'Copy to Clipboard' }}
    </button>

    <p v-if="copyFailed" class="code-export__error" role="alert">
      Copy failed — select the code and copy manually.
    </p>

  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.code-export {
  margin-top: $space-5;
}

.code-export__heading {
  font-size: $font-size-sm;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 $space-3;
  letter-spacing: 0.04em;
}

.code-export__block {
  background-color: var(--bg-code);
  border-radius: $radius-md;
  padding: $space-4;
  font-family: $font-family-mono;
  font-size: $font-size-xs;
  line-height: 1.7;
  overflow-x: auto;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--text-on-code);

  :deep(.code-keyword) { color: #c084fc; }
  :deep(.code-key)     { color: #7dd3fc; }
  :deep(.code-string)  { color: #86efac; }
  :deep(.code-number)  { color: #fb923c; }
  :deep(.code-boolean) { color: #c084fc; }
  :deep(.code-punct)   { color: #e6edf3; }
}

.code-export__copy-btn {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  margin-top: $space-3;
  padding: $space-2 $space-4;
  background-color: var(--bg-btn-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  border-radius: $radius-md;
  font-size: $font-size-sm;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 150ms ease,
    color 150ms ease,
    border-color 150ms ease;

  &:hover {
    filter: brightness(0.95);
  }

  &:focus-visible {
    outline: 2px solid var(--border-focus);
    outline-offset: 2px;
  }
}

.code-export__copy-icon {
  flex-shrink: 0;
}

.code-export__error {
  margin: $space-2 0 0;
  font-size: $font-size-xs;
  color: var(--color-danger);
}

</style>
