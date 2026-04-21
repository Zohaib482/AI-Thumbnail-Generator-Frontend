<script setup lang="ts">
const url = defineModel<string>('url', { default: '' })

defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: []
}>()

function onSubmit(e: Event) {
  e.preventDefault()
  emit('submit')
}
</script>

<template>
  <section class="card">
    <h2>1. Thumbnail source</h2>
    <p class="hint">Paste a YouTube video URL or a direct link to an image (JPG, PNG, WebP).</p>
    <form class="row" @submit="onSubmit">
      <input
        v-model="url"
        type="url"
        name="url"
        class="input"
        placeholder="https://www.youtube.com/watch?v=…"
        autocomplete="off"
        required
      />
      <button type="submit" class="btn primary" :disabled="loading">
        {{ loading ? 'Fetching…' : 'Fetch thumbnail' }}
      </button>
    </form>
  </section>
</template>

<style scoped>
.card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
}

h2 {
  margin: 0 0 0.35rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.hint {
  margin: 0 0 1rem;
  color: var(--muted);
  font-size: 0.9rem;
}

.row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
}

.input {
  flex: 1;
  min-width: 200px;
  padding: 0.65rem 0.85rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-size: 1rem;
}

.btn {
  padding: 0.65rem 1.1rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--panel);
  color: var(--text);
  font-weight: 500;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #0b1020;
}
</style>
