<script setup lang="ts">
import { computed } from 'vue'
import { notifySuccess } from '@/utils/notify'

const props = defineProps<{
  originalUrl: string
  mimeType: string
  imageBase64: string
}>()

const generatedSrc = computed(
  () => `data:${props.mimeType};base64,${props.imageBase64}`,
)

function download() {
  const a = document.createElement('a')
  a.href = generatedSrc.value
  const ext = props.mimeType.includes('png') ? 'png' : 'jpg'
  a.download = `thumbnail-branded.${ext}`
  a.click()
  notifySuccess('Download started.')
}
</script>

<template>
  <section class="card">
    <h2>5. Compare & download</h2>
    <div class="compare">
      <figure>
        <figcaption>Original</figcaption>
        <div class="frame">
          <img :src="originalUrl" alt="Original" crossorigin="anonymous" />
        </div>
      </figure>
      <figure>
        <figcaption>AI generated (1280×720)</figcaption>
        <div class="frame">
          <img :src="generatedSrc" alt="Generated thumbnail" />
        </div>
      </figure>
    </div>
    <div class="actions">
      <button type="button" class="btn primary" @click="download">Download generated</button>
    </div>
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
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

@media (max-width: 900px) {
  .compare {
    grid-template-columns: 1fr;
  }
}

figure {
  margin: 0;
}

figcaption {
  font-size: 0.85rem;
  color: var(--muted);
  margin-bottom: 0.5rem;
}

.frame {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: #000;
}

img {
  display: block;
  width: 100%;
  height: auto;
}

.actions {
  margin-top: 1rem;
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

.btn.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #0b1020;
}
</style>
