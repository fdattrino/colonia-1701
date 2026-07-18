import Badge from 'react-bootstrap/Badge'
import { useGameStore } from '../../store/gameStore'

const MOOD_EMOJI = {
  happy: '😊',
  neutral: '😐',
  annoyed: '😤',
  excited: '🤩',
  tired: '😴',
}

const PERSONALITY_COLOR = {
  'quiet-nature-lover': 'text-success',
  'social-party': 'text-danger',
  'budget-backpacker': 'text-warning',
  'comfort-glamper': 'text-primary',
  'adventure-seeker': 'text-warning',
  'family-focused': 'text-info',
}

const PERSONALITY_TAG = {
  'quiet-nature-lover': '🌾',
  'social-party': '🤝',
  'budget-backpacker': '🎒',
  'comfort-glamper': '👑',
  'adventure-seeker': '🗺️',
  'family-focused': '👨‍👩‍👧',
}

export function GuestChatter() {
  const chatter = useGameStore((s) => s.chatter)
  const tourists = useGameStore((s) => s.tourists)
  const stayingCount = tourists.filter((t) => t.status === 'staying').length

  return (
    <div className='h-100 bg-body-tertiary border-end d-flex flex-column overflow-hidden'>
      <div className='px-2 py-1 border-bottom d-flex align-items-center justify-content-between'>
        <div className='d-flex align-items-center gap-1'>
          <span className='small'>🗣️</span>
          <h6 className='small fw-bold text-uppercase mb-0'>
            Chiacchiere in piazza
          </h6>
        </div>
        <span className='small text-secondary'>
          {stayingCount > 0
            ? `${stayingCount} colon${stayingCount > 1 ? 'i' : 'o'}`
            : 'deserta'}
        </span>
      </div>

      <div className='flex-grow-1 overflow-y-auto'>
        {chatter.length === 0 ? (
          <div className='px-2 py-4 text-center'>
            <p className='small text-secondary fst-italic mb-0'>
              {stayingCount > 0
                ? 'In attesa che i coloni si facciano sentire...'
                : 'Costruisci alloggi per attirare coloni'}
            </p>
          </div>
        ) : (
          <div className='d-flex flex-column'>
            {chatter.map((msg) => (
              <div
                key={msg.id}
                className={`px-2 py-1 border-bottom ${msg.replyTo ? 'ps-4 border-start border-warning border-2' : ''} ${msg.actionable ? 'bg-warning-subtle border-start border-warning border-2' : ''}`}>
                {msg.actionable && (
                  <div className='mb-1'>
                    <Badge bg='warning' text='dark' className='small'>
                      Segnalazione
                    </Badge>
                  </div>
                )}
                {msg.replyTo && (
                  <div className='small text-secondary text-truncate'>
                    risponde a{' '}
                    <span className='text-warning'>{msg.replyTo.name}</span>
                    {': '}"{msg.replyTo.text.slice(0, 40)}
                    {msg.replyTo.text.length > 40 ? '...' : ''}"
                  </div>
                )}
                <div className='d-flex align-items-start gap-1'>
                  <span className='small flex-shrink-0'>
                    {MOOD_EMOJI[msg.mood]}
                  </span>
                  <div className='min-w-0'>
                    <span
                      className={`small fw-semibold ${PERSONALITY_COLOR[msg.personality]}`}>
                      {msg.touristName.split(' ')[0]}
                    </span>
                    <span className='small ms-1'>
                      {PERSONALITY_TAG[msg.personality]}
                    </span>
                    <span className='small text-secondary ms-1'>
                      g{msg.day} {String(msg.hour).padStart(2, '0')}h
                    </span>
                    <p className='small mb-0'>"{msg.text}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
