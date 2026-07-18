import { useGameStore } from '../../store/gameStore'

const TYPE_COLORS = {
  arrival: 'text-info',
  departure: 'text-warning',
  review: 'text-primary',
  event: 'text-success',
  system: 'text-secondary',
  weather: 'text-info',
}

const TYPE_ICONS = {
  arrival: '→',
  departure: '←',
  review: '★',
  event: '!',
  system: '•',
  weather: '~',
}

export function EventLog() {
  const log = useGameStore((s) => s.log)

  return (
    <div className='d-flex flex-column h-100'>
      <h6 className='text-secondary text-uppercase small fw-semibold px-3 py-1 border-bottom mb-0'>
        Cronaca della colonia
      </h6>
      <div className='flex-grow-1 overflow-y-auto px-3 py-1'>
        {log.length === 0 ? (
          <p className='small text-secondary py-2'>
            Avvia la simulazione per leggere la cronaca...
          </p>
        ) : (
          log.map((entry) => (
            <div key={entry.id} className='d-flex gap-2 py-0 small'>
              <span className='text-secondary flex-shrink-0 font-monospace'>
                G{entry.day} {String(entry.hour).padStart(2, '0')}:00
              </span>
              <span className={`flex-shrink-0 ${TYPE_COLORS[entry.type]}`}>
                {TYPE_ICONS[entry.type]}
              </span>
              <span>{entry.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
