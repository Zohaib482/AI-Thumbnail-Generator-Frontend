import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? ''

export const api = axios.create({
  baseURL,
  timeout: 300_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export async function fetchThumbnail(url: string) {
  const { data } = await api.post<{
    thumbnail_url: string
    source: string
    video_id?: string
  }>('/api/thumbnail/fetch', { url })
  return data
}

export async function uploadAssets(logo: File | null, images: File[]) {
  const formData = new FormData()
  if (logo) {
    formData.append('logo', logo)
  }
  images.forEach((file) => {
    formData.append('images[]', file)
  })
  const { data } = await api.post<{ logo_url: string | null; image_urls: string[] }>(
    '/api/assets/upload',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )
  return data
}

export async function analyzeThumbnail(thumbnailUrl: string) {
  const { data } = await api.post<{ analysis: Record<string, string> }>('/api/ai/analyze', {
    thumbnail_url: thumbnailUrl,
  })
  return data
}

export async function generateThumbnail(payload: {
  analysis: Record<string, string>
  brand_name?: string
  brand_color?: string
  logo_url?: string | null
  image_urls?: string[]
}) {
  const { data } = await api.post<{ mime_type: string; image_base64: string }>(
    '/api/ai/generate',
    payload,
  )
  return data
}
