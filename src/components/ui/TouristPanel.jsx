import Card from 'react-bootstrap/Card'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { useGameStore } from '../../store/gameStore'

const PERSONALITY_LABELS = {
  'quiet-nature-lover': '🌾 Contadino solitario',
  'social-party': '🤝 Mercante socievole',
  'budget-backpacker': '🎒 Pioniere squattrinato',
  'comfort-glamper': '👑 Nobile in cerca di comfort',
  'adventure-seeker': '🗺️ Esploratore avventuriero',
  'family-focused': '👨‍👩‍👧‍👦 Capofamiglia',
}

export function TouristPanel() {
  const tourists = useGameStore((s) => s.tourists)
  const activeTourists = tourists.filter(
    (t) => t.status === 'staying' || t.status === 'arriving'
  )

  if (activeTourists.length === 0) {
    return (
      <div>
        <h6 className='text-secondary text-uppercase small fw-semibold mb-2'>
          Coloni presenti
        </h6>
        <p className='small text-secondary mb-0'>
          Nessun colono per ora. Costruisci alloggi e avvia la simulazione!
        </p>
      </div>
    )
  }

  return (
    <div>
      <h6 className='text-secondary text-uppercase small fw-semibold mb-2'>
        Coloni presenti ({activeTourists.length})
      </h6>
      <div
        className='d-flex flex-column gap-2 overflow-y-auto'
        style={{ maxHeight: '12rem' }}>
        {activeTourists.map((tourist) => (
          <Card key={tourist.id} bg='dark' className='border-secondary'>
            <Card.Body className='p-2'>
              <div className='d-flex align-items-center justify-content-between'>
                <span className='small fw-medium'>{tourist.name}</span>
                <span className='small text-secondary'>
                  {tourist.status === 'arriving'
                    ? 'In arrivo'
                    : `Giorno ${Math.max(1, useGameStore.getState().day - tourist.arrivalDay + 1)}/${tourist.tripDuration}`}
                </span>
              </div>
              <div className='small text-secondary'>
                {PERSONALITY_LABELS[tourist.personality] || tourist.personality}
                {' • '}
                {tourist.composition}
              </div>
              <div className='d-flex align-items-center gap-2 mt-1'>
                <ProgressBar
                  now={tourist.satisfaction}
                  variant={
                    tourist.satisfaction >= 70
                      ? 'success'
                      : tourist.satisfaction >= 40
                        ? 'warning'
                        : 'danger'
                  }
                  className='flex-grow-1'
                  style={{ height: '4px' }}
                />
                <span className='small text-secondary'>
                  {tourist.satisfaction}%
                </span>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  )
}
