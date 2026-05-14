import {
  SETUP_FLOW_CONTENT,
  SETUP_FLOW_STEPS,
  SETUP_INITIAL_VALUES,
} from './setupMockData'

function delay(ms) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, ms))
}

function cloneUpload(value) {
  return { ...value }
}

function cloneValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => (typeof item === 'object' && item !== null ? cloneUpload(item) : item))
  }

  if (typeof value === 'object' && value !== null) {
    return { ...value }
  }

  return value
}

function cloneValues(values) {
  return Object.fromEntries(
    Object.entries(values).map(([stepId, stepValues]) => [
      stepId,
      Object.fromEntries(Object.entries(stepValues).map(([fieldId, value]) => [fieldId, cloneValue(value)])),
    ]),
  )
}

function isFieldFilled(field, value) {
  if (field.type === 'upload') {
    return Array.isArray(value) && value.length > 0
  }

  if (field.type === 'chips') {
    return Array.isArray(value) && value.length > 0
  }

  return String(value ?? '').trim().length > 0
}

function getStepCompletion(step, values) {
  const requiredFields = step.fields.filter((field) => field.required)
  if (requiredFields.length === 0) {
    return 100
  }

  const filled = requiredFields.filter((field) => isFieldFilled(field, values?.[field.id])).length
  return Math.round((filled / requiredFields.length) * 100)
}

function buildProgress(steps, values) {
  const stepProgress = Object.fromEntries(
    steps.map((step) => [step.id, getStepCompletion(step, values[step.id] ?? {})]),
  )

  const totalRequired = steps.reduce(
    (sum, step) => sum + step.fields.filter((field) => field.required).length,
    0,
  )

  const totalFilled = steps.reduce((sum, step) => {
    const stepValues = values[step.id] ?? {}
    return sum + step.fields.filter((field) => field.required && isFieldFilled(field, stepValues[field.id])).length
  }, 0)

  const overallProgress = totalRequired === 0 ? 100 : Math.round((totalFilled / totalRequired) * 100)

  return {
    stepProgress,
    overallProgress,
  }
}

function buildUploadRecord(file, fieldId) {
  return {
    id: `${fieldId}-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    name: file.name,
    size: file.size,
    sizeLabel: file.size >= 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : file.size >= 1024
        ? `${Math.round(file.size / 1024)} KB`
        : `${file.size} B`,
    type: file.type || 'application/octet-stream',
  }
}

export const setupApi = {
  async getFlow() {
    await delay(220)
    const values = cloneValues(SETUP_INITIAL_VALUES)
    const progress = buildProgress(SETUP_FLOW_STEPS, values)

    return {
      content: { ...SETUP_FLOW_CONTENT },
      steps: SETUP_FLOW_STEPS.map((step) => ({
        ...step,
        fields: step.fields.map((field) => ({ ...field })),
      })),
      values,
      ...progress,
    }
  },

  async saveStep({ steps, values, stepId }) {
    await delay(180)
    const progress = buildProgress(steps, values)

    return {
      stepId,
      savedAt: new Date().toISOString(),
      ...progress,
    }
  },

  async uploadFieldFiles(fieldId, files) {
    await delay(260)
    return files.map((file) => buildUploadRecord(file, fieldId))
  },

  async completeFlow({ steps, values }) {
    await delay(240)
    const progress = buildProgress(steps, values)

    return {
      status: 'completed',
      savedAt: new Date().toISOString(),
      summary: `Setup mock completed with ${progress.overallProgress}% required progress captured.`,
      ...progress,
    }
  },
}
