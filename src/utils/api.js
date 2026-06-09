import axios from 'axios'
import { enqueue, dequeue, getQueue, getQueueLength } from './offlineQueue'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 60000, // AI processing can take up to 60s
})

/**
 * Convert a base64 string back to a Blob so we can re-POST it as multipart.
 */
function base64ToBlob(base64, mimeType = 'image/jpeg') {
  const binary = atob(base64.replace(/^data:[^;]+;base64,/, ''))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mimeType })
}

/**
 * Internal helper — sends a single capture job to the API.
 * Accepts either a FormData or a plain queued-job object.
 */
async function _postCapture(formData) {
  const response = await api.post('/api/capture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

/**
 * Submit a captured photo for AI processing.
 * On network error (no response received), the job is saved to the offline
 * queue and `{ queued: true }` is returned so the UI can surface a banner.
 *
 * @param {FormData} formData - Must contain: image (File/Blob), eventId, theme
 * @param {{ imageBase64?: string }} [meta] - Pass the base64 preview so the job
 *   can be re-queued without losing the image bytes.
 * @returns {Promise<{ photoUrl: string, qrUrl: string } | { queued: true }>}
 */
export async function capturePhoto(formData, meta = {}) {
  try {
    return await _postCapture(formData)
  } catch (err) {
    // Only queue when there is genuinely no network response (offline / timeout).
    // Server-side errors (4xx / 5xx) still have a response and should surface normally.
    if (!err.response) {
      enqueue({
        id: crypto.randomUUID(),
        imageBase64: meta.imageBase64 ?? '',
        eventId: formData.get('eventId') ?? '',
        theme: formData.get('theme') ?? '',
        timestamp: Date.now(),
      })
      return { queued: true }
    }
    throw err
  }
}

/**
 * Drain the offline queue, retrying each job against the live API.
 * Jobs that succeed are removed; jobs that fail (no response) are re-queued
 * at the end so a partial flush doesn't lose work.
 *
 * @param {(completed: number, total: number) => void} [onProgress]
 * @returns {Promise<{ succeeded: number, failed: number }>}
 */
export async function flushQueue(onProgress) {
  const snapshot = getQueue()   // work from a snapshot so total is stable
  const total = snapshot.length
  if (total === 0) return { succeeded: 0, failed: 0 }

  // Drain the stored queue so we own all items; failures will be re-enqueued.
  // We do this by repeatedly calling dequeue() until empty.
  const jobs = []
  let job
  // eslint-disable-next-line no-cond-assign
  while ((job = dequeue()) !== null) jobs.push(job)

  let succeeded = 0
  let failed = 0

  for (const item of jobs) {
    try {
      const fd = new FormData()
      fd.append('eventId', item.eventId)
      fd.append('theme', item.theme)
      if (item.imageBase64) {
        fd.append('image', base64ToBlob(item.imageBase64), 'photo.jpg')
      }
      await _postCapture(fd)
      succeeded++
    } catch (err) {
      if (!err.response) {
        // Still offline — put it back
        enqueue(item)
        failed++
      } else {
        // Server rejected it (bad request, expired event, etc.) — discard
        failed++
      }
    } finally {
      if (typeof onProgress === 'function') {
        onProgress(succeeded + failed, total)
      }
    }
  }

  return { succeeded, failed }
}

/**
 * Deliver the processed photo to a guest's phone.
 * @param {string} eventId
 * @param {{ phone: string, method: 'sms' | 'whatsapp', photoUrl: string }} payload
 * @returns {Promise<{ success: boolean }>}
 */
export async function deliverPhoto(eventId, payload) {
  const response = await api.post(`/api/events/${eventId}/deliver`, payload)
  return response.data
}

export { getQueueLength, getQueue }

export default api
