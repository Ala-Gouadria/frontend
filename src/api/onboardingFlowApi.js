import {
  ONBOARDING_FLOW_CONTENT,
  ONBOARDING_FLOW_STEPS,
  ONBOARDING_INITIAL_VALUES,
} from './onboardingFlowMockData'
import { get, post } from './client.js'

// Maps frontend step IDs to backend step numbers + payload builders
function buildBackendPayload(stepId, values) {
  const v = values[stepId] ?? {}

  switch (stepId) {
    case 'profile':
      return {
        step: 1,
        companyName: v.firstName && v.lastName ? `${v.firstName} ${v.lastName}` : (v.firstName ?? 'My Company'),
        industry: v.industry ?? 'Other',
        stage: 'early',
        description: v.brandStory ?? '',
      }
    case 'business':
      return {
        step: 1,
        companyName: values.profile?.firstName ? `${values.profile.firstName} ${values.profile.lastName ?? ''}`.trim() : 'My Company',
        industry: values.profile?.industry ?? 'Other',
        stage: 'early',
        website: v.websiteUrl ?? '',
        description: v.pricingRange ? `Pricing: ${v.pricingRange}` : '',
      }
    case 'audience':
      return {
        step: 2,
        icp: {
          ageRange: v.ageRange ?? '',
          primaryLocation: v.primaryLocation ?? '',
          painPoints: v.painPoints ?? '',
          interests: v.audienceInterests ?? '',
        },
      }
    case 'channels':
      return {
        step: 5,
        socialAccounts: [
          v.instagram && { platform: 'instagram', accountName: v.instagram, profileUrl: `https://instagram.com/${v.instagram.replace('@', '')}` },
          v.facebookPage && { platform: 'facebook', accountName: v.facebookPage, profileUrl: v.facebookPage },
          v.linkedIn && { platform: 'linkedin', accountName: v.linkedIn, profileUrl: v.linkedIn },
        ].filter(Boolean),
      }
    case 'brand':
      return {
        step: 8,
        tone: {
          brandTone: v.brandTone ?? '',
          primaryColor: v.primaryColor ?? '',
          secondaryColor: v.secondaryColor ?? '',
          brandStory: v.brandStory ?? '',
        },
        preferences: {},
      }
    case 'content':
      return {
        step: 8,
        tone: values.brand?.brandTone ? { brandTone: values.brand.brandTone } : {},
        preferences: {
          contentPillars: v.contentPillars ?? [],
          postingFrequency: v.postingFrequency ?? '',
        },
      }
    default:
      return null
  }
}

function isFieldFilled(field, value) {
  if (field.type === 'upload') return Array.isArray(value) && value.length > 0
  if (field.type === 'chips') return Array.isArray(value) && value.length > 0
  return String(value ?? '').trim().length > 0
}

function buildProgress(steps, values) {
  const stepProgress = Object.fromEntries(
    steps.map((step) => {
      const required = step.fields.filter((f) => f.required)
      if (!required.length) return [step.id, 100]
      const filled = required.filter((f) => isFieldFilled(f, values[step.id]?.[f.id])).length
      return [step.id, Math.round((filled / required.length) * 100)]
    }),
  )
  const totalRequired = steps.reduce((s, step) => s + step.fields.filter((f) => f.required).length, 0)
  const totalFilled = steps.reduce((s, step) => {
    return s + step.fields.filter((f) => f.required && isFieldFilled(f, values[step.id]?.[f.id])).length
  }, 0)
  return { stepProgress, overallProgress: totalRequired ? Math.round((totalFilled / totalRequired) * 100) : 100 }
}

function cloneValues(values) {
  return Object.fromEntries(
    Object.entries(values).map(([k, v]) => [k, { ...v }]),
  )
}

function buildUploadRecord(file, fieldId) {
  return {
    id: `${fieldId}-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    name: file.name,
    size: file.size,
    sizeLabel: file.size >= 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : file.size >= 1024 ? `${Math.round(file.size / 1024)} KB` : `${file.size} B`,
    type: file.type || 'application/octet-stream',
  }
}

export const onboardingFlowApi = {
  // Server-side source of truth for whether this user has finished onboarding.
  // Used to decide the post-login landing (so a returning user with a completed
  // profile skips Setup even if their browser localStorage was cleared).
  async isOnboardingComplete() {
    try {
      const status = await get('/api/v1/company/onboarding/status')
      return Boolean(status?.onboardingCompleted ?? status?.completed)
    } catch {
      return false
    }
  },

  async getFlow() {
    // Start from blank values, then hydrate with whatever the user has already
    // saved so returning users see their real data (not blanks, not mock).
    const values = cloneValues(ONBOARDING_INITIAL_VALUES)

    let profile = null
    try {
      profile = await get('/api/v1/company/profile')
    } catch {
      // No profile yet (new user) — keep the blank values.
    }

    if (profile) {
      // Map the saved backend profile back onto the form fields (reverse of
      // buildBackendPayload). Only set fields that actually have a value.
      const set = (stepId, fieldId, val) => {
        if (val !== undefined && val !== null && val !== '') {
          values[stepId] = { ...values[stepId], [fieldId]: val }
        }
      }
      // company name was stored as "First Last" — split back out
      if (profile.companyName) {
        const [first, ...rest] = String(profile.companyName).split(' ')
        set('profile', 'firstName', first)
        set('profile', 'lastName', rest.join(' '))
      }
      set('profile', 'industry', profile.industry)
      set('business', 'websiteUrl', profile.website)
      const icp = profile.icp ?? {}
      set('audience', 'ageRange', icp.ageRange)
      set('audience', 'primaryLocation', icp.primaryLocation)
      set('audience', 'painPoints', icp.painPoints)
      set('audience', 'audienceInterests', icp.interests)
      const tone = profile.tone ?? {}
      set('brand', 'primaryColor', tone.primaryColor)
      set('brand', 'secondaryColor', tone.secondaryColor)
      set('brand', 'brandTone', tone.brandTone)
      set('brand', 'brandStory', tone.brandStory)
      const prefs = profile.preferences ?? {}
      set('content', 'contentTypes', prefs.contentPillars)
      set('content', 'postFrequency', prefs.postingFrequency)
      set('content', 'visualStyle', prefs.visualStyle)
      set('content', 'ctaStyle', prefs.ctaStyle)
      set('goals', 'mainGoal', prefs.mainGoal)
      set('goals', 'monthlyTarget', prefs.monthlyTarget)
      set('goals', 'conversionGoal', prefs.conversionGoal)
      set('goals', 'successSignal', prefs.successSignal)
      set('optimization', 'priorityMetric', prefs.priorityMetric)
      set('optimization', 'brandAdmire', prefs.brandAdmire)
    }

    const progress = buildProgress(ONBOARDING_FLOW_STEPS, values)

    // If backend says onboarding is complete, reflect full progress.
    if (profile?.onboardingCompleted) {
      return {
        content: { ...ONBOARDING_FLOW_CONTENT },
        steps: ONBOARDING_FLOW_STEPS.map((s) => ({ ...s, fields: s.fields.map((f) => ({ ...f })) })),
        values,
        stepProgress: Object.fromEntries(ONBOARDING_FLOW_STEPS.map((s) => [s.id, 100])),
        overallProgress: 100,
      }
    }

    return {
      content: { ...ONBOARDING_FLOW_CONTENT },
      steps: ONBOARDING_FLOW_STEPS.map((s) => ({ ...s, fields: s.fields.map((f) => ({ ...f })) })),
      values,
      ...progress,
    }
  },

  async saveStep({ steps, values, stepId }) {
    const progress = buildProgress(steps, values)

    const payload = buildBackendPayload(stepId, values)
    if (payload) {
      try {
        await post('/api/v1/company/onboarding/step', payload)
      } catch (err) {
        // Non-fatal: UI continues even if this step's backend sync fails, but
        // surface it so a silent 401/400 isn't mistaken for a successful save.
        console.warn(`[onboarding] saveStep "${stepId}" failed to persist:`, err?.message ?? err)
      }
    }

    return { stepId, savedAt: new Date().toISOString(), ...progress }
  },

  async uploadFieldFiles(fieldId, files) {
    // Best-effort: upload to brand assets, fall back to local record on failure
    const results = []
    for (const file of files) {
      try {
        const form = new FormData()
        form.append('file', file)
        form.append('name', file.name)
        form.append('type', 'image')
        const result = await post('/api/v1/brand/assets/upload', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        results.push({ id: result.id ?? buildUploadRecord(file, fieldId).id, name: file.name, size: file.size, type: file.type })
      } catch {
        results.push(buildUploadRecord(file, fieldId))
      }
    }
    return results
  },

  async completeFlow({ steps, values }) {
    const progress = buildProgress(steps, values)

    // Try to sync the full company profile to the AI service
    try {
      await post('/api/v1/company/sync-to-ai')
    } catch (err) {
      // Non-fatal, but surface it — this is the step that feeds Nora's memory.
      console.warn('[onboarding] sync-to-ai failed:', err?.message ?? err)
    }

    return {
      status: 'completed',
      savedAt: new Date().toISOString(),
      summary: `Onboarding completed with ${progress.overallProgress}% required fields captured.`,
      ...progress,
    }
  },
}
