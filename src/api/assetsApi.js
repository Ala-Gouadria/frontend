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

const SAMPLE_TEXT = "Most people don't fail because they lack talent. They fail because they lack consistency..."
const SAMPLE_DATE = 'Mar 14, 11:00 AM'

const SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=720&q=70'
const SAMPLE_POST_IMAGE = 'https://images.unsplash.com/photo-1518972559570-7cc1309f3229?auto=format&fit=crop&w=720&q=70'

function makeMockAssets() {
  const images = Array.from({ length: 8 }, (_, i) => ({
    id: `img-${i}`,
    title: 'Asset image',
    src: SAMPLE_IMAGE,
    date: SAMPLE_DATE,
    type: 'image',
  }))

  const posts = Array.from({ length: 8 }, (_, i) => ({
    id: `post-${i}`,
    image: SAMPLE_POST_IMAGE,
    text: SAMPLE_TEXT,
  }))

  const captions = Array.from({ length: 8 }, (_, i) => ({
    id: `caption-${i}`,
    text: SAMPLE_TEXT,
  }))

  return { images, posts, captions }
}

export const assetsApi = {
  async getProjectAssets() {
    try {
      const result = await get('/api/v1/brand/assets', { params: { pageSize: 100 } })
      const items = Array.isArray(result) ? result : (result?.items ?? result?.data ?? [])
      const images = items.map(mapBackendAsset)
      const mock = makeMockAssets()
      return {
        images: images.length ? images : mock.images,
        posts: mock.posts,
        captions: mock.captions,
      }
    } catch {
      return makeMockAssets()
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
