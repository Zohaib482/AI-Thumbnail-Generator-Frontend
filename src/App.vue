<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import BrandAssetsForm from './components/BrandAssetsForm.vue'
import ComparisonView from './components/ComparisonView.vue'
import ThumbnailInput from './components/ThumbnailInput.vue'
import ThumbnailPreview from './components/ThumbnailPreview.vue'
import {
  analyzeThumbnail,
  fetchThumbnail,
  generateThumbnail,
  uploadAssets,
} from './services/api'
import { notifyError, notifySuccess, notifyWarning } from './utils/notify'

const inputUrl = ref('')
const thumbnailUrl = ref('')
const brandName = ref('')
const brandColor = ref('#6366f1')

const logoUrl = ref<string | null>(null)
const imageUrls = ref<string[]>([])

const analysis = ref<Record<string, string> | null>(null)
const generatedMime = ref('')
const generatedBase64 = ref('')

const fetchLoading = ref(false)
const uploadLoading = ref(false)
const generateLoading = ref(false)

function formatError(e: unknown, fallback: string): string {
  if (axios.isAxiosError(e)) {
    const data = e.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined
    if (data?.message && data.message !== 'The given data was invalid.') {
      return data.message
    }
    if (data?.errors) {
      const first = Object.values(data.errors)[0]
      if (first?.[0]) {
        return first[0]
      }
    }
  }
  return fallback
}

async function onFetchThumbnail() {
  fetchLoading.value = true
  try {
    const data = await fetchThumbnail(inputUrl.value.trim())
    thumbnailUrl.value = data.thumbnail_url
    analysis.value = null
    generatedBase64.value = ''
    logoUrl.value = null
    imageUrls.value = []
    notifySuccess('Thumbnail loaded.')
  } catch (e: unknown) {
    notifyError(formatError(e, 'Could not fetch thumbnail.'))
  } finally {
    fetchLoading.value = false
  }
}

async function onBrandUpload(payload: { logo: File | null; images: File[] }) {
  if (!payload.logo && payload.images.length === 0) {
    notifyWarning('Select a logo or at least one image before uploading.')
    return
  }
  uploadLoading.value = true
  try {
    const data = await uploadAssets(payload.logo, payload.images)
    logoUrl.value = data.logo_url
    imageUrls.value = data.image_urls
    const parts: string[] = []
    if (data.logo_url) {
      parts.push('logo')
    }
    if (data.image_urls.length) {
      parts.push(`${data.image_urls.length} reference image(s)`)
    }
    notifySuccess(parts.length ? `Uploaded: ${parts.join(', ')}.` : 'Upload completed.')
  } catch (e: unknown) {
    notifyError(formatError(e, 'Upload failed.'))
  } finally {
    uploadLoading.value = false
  }
}

async function onGenerate() {
  if (!thumbnailUrl.value) {
    notifyWarning('Fetch a thumbnail first.')
    return
  }
  generateLoading.value = true
  analysis.value = null
  generatedBase64.value = ''
  try {
    const analyzed = await analyzeThumbnail(thumbnailUrl.value)
    analysis.value = analyzed.analysis

    const gen = await generateThumbnail({
      analysis: analyzed.analysis,
      brand_name: brandName.value || undefined,
      brand_color: brandColor.value || undefined,
      logo_url: logoUrl.value ?? undefined,
      image_urls: imageUrls.value.length ? imageUrls.value : undefined,
    })
    generatedMime.value = gen.mime_type
    generatedBase64.value = gen.image_base64
    notifySuccess('Branded thumbnail generated. Scroll down to compare and download.')
  } catch (e: unknown) {
    notifyError(
      formatError(e, 'Generation failed. Check GEMINI_API_KEY and model names.'),
    )
  } finally {
    generateLoading.value = false
  }
}
</script>

<template>
  <div class="app">
    <header class="hero">
      <h1>AI YouTube thumbnail studio</h1>
      <p>Analyze a thumbnail with Gemini Vision, then regenerate a branded 1280×720 version.</p>
    </header>

    <ThumbnailInput v-model:url="inputUrl" :loading="fetchLoading" @submit="onFetchThumbnail" />

    <ThumbnailPreview v-if="thumbnailUrl" :thumbnail-url="thumbnailUrl" />

    <BrandAssetsForm
      v-model:brand-name="brandName"
      v-model:brand-color="brandColor"
      :uploading="uploadLoading"
      @upload="onBrandUpload"
    />

    <section v-if="thumbnailUrl" class="card generate">
      <h2>4. Generate</h2>
      <p class="hint">
        Uploads are optional. When you are ready, we analyze the original thumbnail and generate a new branded image.
      </p>
      <button
        type="button"
        class="btn primary lg"
        :disabled="generateLoading"
        @click="onGenerate"
      >
        {{ generateLoading ? 'Analyzing & generating…' : 'Generate branded thumbnail' }}
      </button>
      <p v-if="analysis" class="analysis">
        <strong>Analysis snapshot:</strong>
        {{ analysis.style }} — {{ analysis.layout }}
      </p>
    </section>

    <ComparisonView
      v-if="thumbnailUrl && generatedBase64"
      :original-url="thumbnailUrl"
      :mime-type="generatedMime"
      :image-base64="generatedBase64"
    />

    <footer class="foot">
      <span>Backend: Laravel · Frontend: Vue 3 · Model: Gemini</span>
    </footer>
  </div>
</template>

<style>
:root {
  --bg: #0c0f18;
  --panel: #131827;
  --border: #2a3148;
  --text: #e8ebf7;
  --muted: #8b93ab;
  --accent: #a5b4fc;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    Ubuntu,
    sans-serif;
  background: radial-gradient(1200px 600px at 20% -10%, #1e1b4b 0%, transparent 55%),
    radial-gradient(900px 500px at 100% 0%, #0f172a 0%, transparent 50%), var(--bg);
  color: var(--text);
}

#app {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.25rem 3rem;
}

.app {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.hero h1 {
  margin: 0 0 0.35rem;
  font-size: 1.65rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.hero p {
  margin: 0;
  color: var(--muted);
  font-size: 0.95rem;
}

.card.generate {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
}

.card.generate h2 {
  margin: 0 0 0.35rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.card.generate .hint {
  margin: 0 0 1rem;
  color: var(--muted);
  font-size: 0.9rem;
}

.btn.lg {
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
}

.btn.primary {
  background: var(--accent);
  border: 1px solid var(--accent);
  color: #0b1020;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn.primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.analysis {
  margin: 1rem 0 0;
  font-size: 0.9rem;
  color: var(--muted);
}

.foot {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: var(--muted);
}
</style>
