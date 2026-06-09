/**
 * Offline queue — localStorage-backed job store for network-loss recovery.
 * Stores serializable snapshots of capture jobs so they survive page reloads.
 *
 * Each item shape:
 *   { id: string, imageBase64: string, eventId: string, theme: string, timestamp: number }
 *
 * NOTE: FormData cannot be serialized directly, so callers must convert to
 * the above plain-object shape before enqueueing.
 */

const QUEUE_KEY = 'flash_it_offline_queue';

/** Read the current queue array from localStorage (never throws). */
export function getQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Persist an array back to localStorage. */
function _save(queue) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

/**
 * Append an item to the end of the queue.
 * @param {{ id: string, imageBase64: string, eventId: string, theme: string, timestamp?: number }} item
 */
export function enqueue(item) {
  const queue = getQueue();
  queue.push({ ...item, timestamp: item.timestamp ?? Date.now() });
  _save(queue);
}

/**
 * Remove and return the first item in the queue (FIFO).
 * Returns null when the queue is empty.
 * @returns {{ id: string, imageBase64: string, eventId: string, theme: string, timestamp: number } | null}
 */
export function dequeue() {
  const queue = getQueue();
  if (queue.length === 0) return null;
  const [first, ...rest] = queue;
  _save(rest);
  return first;
}

/** Remove all pending jobs. */
export function clearQueue() {
  localStorage.removeItem(QUEUE_KEY);
}

/** How many jobs are waiting. */
export function getQueueLength() {
  return getQueue().length;
}
