import { useState } from 'react'
import { useGameStore, extractGameState } from '../../store/gameStore'
import { saveGame, loadGame, clearSave } from '../../db/database'

export function SaveLoadPanel() {
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [confirming, setConfirming] = useState(false)
  const resetGame = useGameStore((s) => s.resetGame)

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveGame(extractGameState(useGameStore.getState()))
      setMessage('Saved!')
      setTimeout(() => setMessage(''), 2000)
    } catch {
      setMessage('Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleLoad = async () => {
    setLoading(true)
    try {
      const saved = await loadGame()
      if (saved) {
        useGameStore.setState(saved)
        setMessage('Loaded!')
      } else {
        setMessage('No save found')
      }
      setTimeout(() => setMessage(''), 2000)
    } catch {
      setMessage('Load failed')
    } finally {
      setLoading(false)
    }
  }

  const handleNewGame = async () => {
    if (!confirming) {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3000)
      return
    }
    setConfirming(false)
    resetGame()
    await clearSave().catch(() => {})
    setMessage('New game started!')
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <div className='flex items-center gap-1.5 flex-wrap'>
      <button
        onClick={handleSave}
        disabled={saving}
        className='px-2 py-1 rounded text-xs bg-stone-700 text-stone-300 hover:bg-stone-600 transition-colors disabled:opacity-50'>
        {saving ? '...' : '💾 Save'}
      </button>
      <button
        onClick={handleLoad}
        disabled={loading}
        className='px-2 py-1 rounded text-xs bg-stone-700 text-stone-300 hover:bg-stone-600 transition-colors disabled:opacity-50'>
        {loading ? '...' : '📂 Load'}
      </button>
      <button
        onClick={handleNewGame}
        className={`px-2 py-1 rounded text-xs transition-colors ${
          confirming
            ? 'bg-red-600/30 border border-red-500 text-red-300'
            : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
        }`}>
        {confirming ? 'Confirm?' : '🆕 New'}
      </button>
      {message && <span className='text-xs text-amber-400'>{message}</span>}
    </div>
  )
}
