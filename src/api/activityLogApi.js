const activityAssetModules = import.meta.glob(
  '../features/Social Media Stuffs/assets/*.{png,jpg,jpeg,webp}',
  {
    eager: true,
    import: 'default',
    query: '?url',
  },
)

const previewImages = Object.values(activityAssetModules)

const LOGS = Array.from({ length: 13 }, (_, index) => {
  const departments = ['strategy', 'Social Media', 'Analytics', 'Website', 'Website', 'Website']
  const failed = index === 4 || index === 11

  return {
    id: `LOG-${1024 + index}`,
    title: index < 4 ? 'Generate content strategy for campaign' : 'Team meeting scheduled for project kickoff',
    detailTitle: 'Instagram growth image batch generated',
    time: 'Mar 14, 11:00 AM',
    timestamp: '2026-03-14 10:42 AM',
    department: departments[index % departments.length],
    type: 'Planning',
    eventType: 'Social Media Content',
    impact: index < 4 ? 'Agenda shared with tea...' : '6 images created',
    impactDetail: '6 images created',
    status: failed ? 'Failed' : 'Successful',
    summary: 'Generated 6 image variants for the weekly Instagram growth campaign.',
    assets: previewImages.slice(0, 6).map((image, imageIndex) => ({
      id: `asset-${index + 1}-${imageIndex + 1}`,
      image,
      text: 'Most people don’t fail because they lack talent. They fail because they lack consistency...',
    })),
  }
})

function delay(ms) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, ms))
}

export const activityLogApi = {
  async listLogs() {
    await delay(140)
    return LOGS.map((log) => ({
      ...log,
      assets: log.assets.map((asset) => ({ ...asset })),
    }))
  },
}
