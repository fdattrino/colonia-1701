const OLLAMA_URL = 'http://localhost:11434/api/generate'
const MODEL = 'gemma3:1b'

interface OllamaResponse {
  response: string
}

export interface AILogEntry {
  id: number
  time: number
  type: 'request' | 'response' | 'error' | 'status' | 'fallback'
  message: string
  full?: string
}

let logId = 0
const aiLog: AILogEntry[] = []
const listeners: Set<() => void> = new Set()

function pushLog(type: AILogEntry['type'], message: string, full?: string) {
  aiLog.unshift({ id: ++logId, time: Date.now(), type, message, full })
  if (aiLog.length > 80) aiLog.length = 80
  listeners.forEach((fn) => fn())
}

export function getAILog(): AILogEntry[] {
  return aiLog
}

export function subscribeAILog(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

let requestQueue: Promise<unknown> = Promise.resolve()
let pendingRequests = 0

export function getPendingRequests(): number {
  return pendingRequests
}

export async function queryOllama(prompt: string): Promise<string> {
  const label = prompt.slice(0, 60).replace(/\n/g, ' ')
  pushLog('request', `→ ${label}…`, prompt)
  pendingRequests++

  return new Promise((resolve, reject) => {
    requestQueue = requestQueue.then(async () => {
      const start = performance.now()
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 30000)

        const res = await fetch(OLLAMA_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: MODEL,
            prompt,
            stream: false,
            options: {
              temperature: 0.8,
              num_predict: 500,
            },
          }),
          signal: controller.signal,
        })

        clearTimeout(timeout)

        if (!res.ok) {
          throw new Error(`Ollama returned ${res.status}`)
        }

        const data: OllamaResponse = await res.json()
        const ms = Math.round(performance.now() - start)
        pushLog(
          'response',
          `← ${ms}ms — ${data.response.slice(0, 80).replace(/\n/g, ' ')}…`,
          data.response
        )
        pendingRequests--
        resolve(data.response)
      } catch (err) {
        pendingRequests--
        const msg = err instanceof Error ? err.message : String(err)
        pushLog('error', `✗ ${msg}`)
        reject(err)
      }
    })
  })
}

export function parseJsonResponse<T>(response: string): T | null {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null
    return JSON.parse(jsonMatch[0]) as T
  } catch {
    pushLog('error', 'JSON parse failed on AI response')
    return null
  }
}

let lastOllamaStatus: boolean | null = null

export async function isOllamaAvailable(): Promise<boolean> {
  try {
    const res = await fetch('http://localhost:11434/api/tags', {
      signal: AbortSignal.timeout(3000),
    })
    const ok = res.ok
    if (ok !== lastOllamaStatus) {
      pushLog(
        'status',
        ok ? `✓ Ollama connected (${MODEL})` : '✗ Ollama not responding'
      )
      lastOllamaStatus = ok
    }
    return ok
  } catch {
    if (lastOllamaStatus !== false) {
      pushLog('status', '✗ Ollama unreachable — using fallbacks')
      lastOllamaStatus = false
    }
    return false
  }
}

export function logFallback(context: string) {
  pushLog('fallback', `↻ Fallback used: ${context}`)
}
