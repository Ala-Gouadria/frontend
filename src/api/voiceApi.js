import { api } from './client.js'

export const voiceApi = {
  /**
   * Synthesize `text` to speech via the backend (ElevenLabs) and return a
   * playable object-URL for an <audio> element. Caller should revokeObjectURL
   * when done.
   */
  async speak(text, voiceId) {
    const res = await api.post(
      '/api/v1/voice/speak',
      { text, voiceId },
      { responseType: 'blob' },
    )
    // client.js response interceptor unwraps .data; for a blob that IS the blob.
    let blob = res instanceof Blob ? res : new Blob([res], { type: 'audio/mpeg' })

    // Guard: if the server returned a JSON error (still delivered as a blob when
    // responseType is 'blob'), surface it instead of feeding garbage to <audio>.
    if (blob.type && blob.type.includes('json')) {
      const txt = await blob.text()
      throw new Error(`Voice service error: ${txt.slice(0, 200)}`)
    }
    // Force an audio mime so the <audio> element decodes it regardless of how
    // the blob's type came through.
    if (blob.type !== 'audio/mpeg') {
      blob = new Blob([blob], { type: 'audio/mpeg' })
    }
    return URL.createObjectURL(blob)
  },
}
