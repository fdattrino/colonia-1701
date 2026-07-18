import { useState, useEffect, useSyncExternalStore, useCallback } from 'react'
import {
  getAILog,
  subscribeAILog,
  isOllamaAvailable,
  getPendingRequests,
  type AILogEntry,
} from '../../ai/ollamaClient'
import { useGameStore } from '../../store/gameStore'

const TYPE_STYLES: Record<AILogEntry['type'], string> = {
  request: 'text-cyan-400',
  response: 'text-green-400',
  error: 'text-red-400',
  status: 'text-yellow-400',
  fallback: 'text-orange-400',
}

const TYPE_LABELS: Record<AILogEntry['type'], string> = {
  request: 'REQ',
  response: 'RES',
  error: 'ERR',
  status: 'SYS',
  fallback: 'FBK',
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
}

export function DevConsole() {
  const log = useSyncExternalStore(subscribeAILog, getAILog)

  const [ollamaStatus, setOllamaStatus] = useState<
    'checking' | 'connected' | 'disconnected'
  >('checking')
  const [filter, setFilter] = useState<AILogEntry['type'] | 'all'>('all')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const tourists = useGameStore((s) => s.tourists)
  const chatter = useGameStore((s) => s.chatter)
  const day = useGameStore((s) => s.day)
  const hour = useGameStore((s) => s.hour)
  const isRunning = useGameStore((s) => s.isRunning)

  const checkStatus = useCallback(async () => {
    const ok = await isOllamaAvailable()
    setOllamaStatus(ok ? 'connected' : 'disconnected')
  }, [])

  useEffect(() => {
    checkStatus()
    const iv = setInterval(checkStatus, 10000)
    return () => clearInterval(iv)
  }, [checkStatus])

  const pending = getPendingRequests()
  const staying = tourists.filter((t) => t.status === 'staying').length
  const arriving = tourists.filter((t) => t.status === 'arriving').length

  const filtered = filter === 'all' ? log : log.filter((e) => e.type === filter)

  return (
    <div className='flex flex-col h-full font-mono text-xs'>
      <div className='flex items-center gap-2 px-3 py-1.5 border-b border-stone-700 shrink-0 flex-wrap'>
        <span className='font-bold text-stone-300 tracking-wider text-[11px]'>
          AI CONSOLE
        </span>

        <div className='flex items-center gap-1.5'>
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              ollamaStatus === 'connected'
                ? 'bg-green-400 shadow-[0_0_4px_var(--color-green-400)]'
                : ollamaStatus === 'disconnected'
                  ? 'bg-red-400 shadow-[0_0_4px_var(--color-red-400)]'
                  : 'bg-yellow-400 animate-pulse'
            }`}
          />
          <span
            className={
              ollamaStatus === 'connected'
                ? 'text-green-400'
                : ollamaStatus === 'disconnected'
                  ? 'text-red-400'
                  : 'text-yellow-400'
            }>
            {ollamaStatus}
          </span>
        </div>

        {pending > 0 && (
          <span className='text-cyan-400 animate-pulse'>{pending} pending</span>
        )}

        <span className='text-stone-600'>
          D{day} {String(hour).padStart(2, '0')}:00 {isRunning ? '▶' : '⏸'} ·{' '}
          {staying}+{arriving} guests · {chatter.length} chats
        </span>

        <div className='flex-1' />

        <div className='flex items-center gap-0.5'>
          {(
            [
              'all',
              'request',
              'response',
              'error',
              'status',
              'fallback',
            ] as const
          ).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-1 py-0.5 rounded text-[10px] ${
                filter === f
                  ? 'bg-stone-700 text-stone-200'
                  : 'text-stone-500 hover:text-stone-300'
              }`}>
              {f === 'all' ? 'ALL' : TYPE_LABELS[f]}
            </button>
          ))}
        </div>

        <button
          onClick={checkStatus}
          className='px-1 py-0.5 rounded text-[10px] text-stone-400 hover:text-stone-200 bg-stone-800 hover:bg-stone-700'
          title='Check Ollama connection'>
          Ping
        </button>
      </div>

      <div className='flex-1 overflow-y-auto px-3 py-1'>
        {filtered.length === 0 ? (
          <p className='text-stone-600 py-2 text-center'>No AI activity yet.</p>
        ) : (
          filtered.map((entry) => {
            const isExpanded = expandedId === entry.id
            const hasFull = !!entry.full
            return (
              <div
                key={entry.id}
                className={`border-b border-stone-900/50 ${hasFull ? 'cursor-pointer hover:bg-stone-900/40' : ''}`}
                onClick={() => {
                  if (hasFull) setExpandedId(isExpanded ? null : entry.id)
                }}>
                <div className='flex gap-1.5 py-0.5'>
                  <span className='text-stone-600 shrink-0 w-14'>
                    {formatTime(entry.time)}
                  </span>
                  <span
                    className={`shrink-0 w-7 font-bold ${TYPE_STYLES[entry.type]}`}>
                    {TYPE_LABELS[entry.type]}
                  </span>
                  <span className='text-stone-300 break-all flex-1 truncate'>
                    {entry.message}
                  </span>
                  {hasFull && (
                    <span className='text-stone-600 shrink-0 text-[10px]'>
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  )}
                </div>
                {isExpanded && entry.full && (
                  <pre className='ml-23 mr-1 mb-1 mt-0.5 p-2 rounded bg-stone-900 text-stone-300 text-[11px] leading-relaxed whitespace-pre-wrap break-all max-h-48 overflow-y-auto border border-stone-800'>
                    {entry.full}
                  </pre>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
