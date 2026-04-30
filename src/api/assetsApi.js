const assetModules = import.meta.glob(
  [
    '../assets/**/*.{png,jpg,jpeg,webp}',
    '../features/**/*.{png,jpg,jpeg,webp}',
  ],
  {
    eager: true,
    import: 'default',
    query: '?url',
  },
)

const imageAssets = Object.entries(assetModules)
  .filter(([path]) => !path.includes('/icons/'))
  .map(([path, url], index) => {
    const fileName = path.split('/').at(-1) ?? `asset-${index + 1}`
    const title = fileName.replace(/\.(png|jpg|jpeg|webp)$/i, '').replace(/[-_]/g, ' ')

    return {
      id: `image-${index + 1}`,
      title,
      src: url,
      date: 'Mar 14, 11:00 AM',
      type: 'image',
    }
  })

const postSourceImages = imageAssets.filter((asset) => (
  /social|image generation|caption|strategy|hero|background/i.test(asset.title)
))

const captionText = 'Most people don’t fail because they lack talent. They fail because they lack consistency...'

function delay(ms) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, ms))
}

function makePost(index) {
  const source = postSourceImages[index % postSourceImages.length] ?? imageAssets[index % imageAssets.length]

  return {
    id: `post-${index + 1}`,
    image: source?.src,
    text: captionText,
    location: 'Manchester, United Kingdom',
    type: 'post',
  }
}

function makeCaption(index) {
  return {
    id: `caption-${index + 1}`,
    text: captionText,
    location: 'Manchester, United Kingdom',
    type: 'caption',
  }
}

const projectAssets = {
  images: imageAssets,
  posts: Array.from({ length: 8 }, (_, index) => makePost(index)),
  captions: Array.from({ length: 8 }, (_, index) => makeCaption(index)),
}

export const assetsApi = {
  async getProjectAssets() {
    await delay(140)

    return {
      images: projectAssets.images.map((asset) => ({ ...asset })),
      posts: projectAssets.posts.map((asset) => ({ ...asset })),
      captions: projectAssets.captions.map((asset) => ({ ...asset })),
    }
  },
}
