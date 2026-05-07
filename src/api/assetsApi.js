import { get, post } from './client.js'

function mapBackendAsset(item) {
  return {
    id: item.id,
    title: item.name,
    src: item.url ?? '',
    date: item.createdAt ? new Date(item.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '',
    type: item.type ?? 'image',
  }
}

export const assetsApi = {
  async getProjectAssets() {
    try {
      const result = await get('/api/v1/brand/assets', { params: { pageSize: 100 } })
      const items = Array.isArray(result) ? result : (result?.items ?? result?.data ?? [])
      const images = items.map(mapBackendAsset)
      return { images, posts: [], captions: [] }
    } catch {
      return { images: [], posts: [], captions: [] }
    }
  },

  async uploadAsset(file) {
    const form = new FormData()
    form.append('file', file)
    form.append('name', file.name)
    form.append('type', file.type.startsWith('image/') ? 'image' : 'file')
    return post('/api/v1/brand/assets/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
