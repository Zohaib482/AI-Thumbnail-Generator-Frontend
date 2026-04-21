<script setup lang="ts">
import { ref } from 'vue'

const brandName = defineModel<string>('brandName', { default: '' })
const brandColor = defineModel<string>('brandColor', { default: '#6366f1' })

defineProps<{
  uploading?: boolean
}>()

const emit = defineEmits<{
  upload: [payload: { logo: File | null; images: File[] }]
}>()

const logoInput = ref<HTMLInputElement | null>(null)
const imagesInput = ref<HTMLInputElement | null>(null)

const logoFile = ref<File | null>(null)
const imageFiles = ref<File[]>([])

function onLogoChange(e: Event) {
  const t = e.target as HTMLInputElement
  logoFile.value = t.files?.[0] ?? null
}

function onImagesChange(e: Event) {
  const t = e.target as HTMLInputElement
  imageFiles.value = t.files ? Array.from(t.files) : []
}

function clearLogo() {
  logoFile.value = null
  if (logoInput.value) logoInput.value.value = ''
}

function clearImages() {
  imageFiles.value = []
  if (imagesInput.value) imagesInput.value.value = ''
}

function submitUpload() {
  emit('upload', { logo: logoFile.value, images: imageFiles.value })
}
</script>

<template>
  <section class="card">
    <h2>3. Brand assets</h2>
    <p class="hint">Logo (PNG/JPG), optional reference images, brand name, and accent color.</p>

    <div class="grid">
      <label class="field">
        <span>Brand name</span>
        <input v-model="brandName" type="text" class="input" placeholder="My Channel" />
      </label>
      <label class="field">
        <span>Brand color</span>
        <input v-model="brandColor" type="color" class="color" />
      </label>
    </div>

    <div class="upload-row">
      <label class="file-label">
        <span>Logo</span>
        <input ref="logoInput" type="file" accept="image/png,image/jpeg" @change="onLogoChange" />
        <button type="button" class="btn ghost sm" @click="clearLogo">Clear</button>
      </label>
      <label class="file-label">
        <span>Reference images</span>
        <input
          ref="imagesInput"
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          multiple
          @change="onImagesChange"
        />
        <button type="button" class="btn ghost sm" @click="clearImages">Clear</button>
      </label>
    </div>

    <div class="actions">
      <button type="button" class="btn" :disabled="uploading" @click="submitUpload">
        {{ uploading ? 'Uploading…' : 'Upload to server' }}
      </button>
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
  margin: 0 0 0.35rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.hint {
  margin: 0 0 1rem;
  color: var(--muted);
  font-size: 0.9rem;
}

.grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: end;
  margin-bottom: 1rem;
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: var(--muted);
}

.input {
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
}

.color {
  width: 100%;
  min-height: 42px;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg);
  cursor: pointer;
}

.upload-row {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.file-label {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--muted);
}

.file-label input[type='file'] {
  font-size: 0.85rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.55rem 1rem;
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

.btn.ghost {
  background: transparent;
}

.btn.sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}
</style>
