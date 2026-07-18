import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import Stack from 'react-bootstrap/Stack'
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
      setMessage('Salvato!')
      setTimeout(() => setMessage(''), 2000)
    } catch {
      setMessage('Salvataggio fallito')
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
        setMessage('Caricato!')
      } else {
        setMessage('Nessun salvataggio')
      }
      setTimeout(() => setMessage(''), 2000)
    } catch {
      setMessage('Caricamento fallito')
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
    setMessage('Nuova partita avviata!')
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <Stack direction='horizontal' gap={1} className='flex-wrap'>
      <Button
        size='sm'
        variant='secondary'
        onClick={handleSave}
        disabled={saving}>
        {saving ? '...' : '💾 Salva'}
      </Button>
      <Button
        size='sm'
        variant='secondary'
        onClick={handleLoad}
        disabled={loading}>
        {loading ? '...' : '📂 Carica'}
      </Button>
      <Button
        size='sm'
        variant={confirming ? 'danger' : 'secondary'}
        onClick={handleNewGame}>
        {confirming ? 'Confermi?' : '🆕 Nuova'}
      </Button>
      {message && (
        <Badge bg='warning' text='dark'>
          {message}
        </Badge>
      )}
    </Stack>
  )
}
