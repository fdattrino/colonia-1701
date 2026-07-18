import { useGameStore } from '../../store/gameStore'

const TYPE_COLORS = {
  arrival: 'text-cyan-400',
  departure: 'text-amber-400',
  review: 'text-purple-400',
  event: 'text-green-400',
  system: 'text-stone-400',
  weather: 'text-sky-400',
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
    <div className='flex flex-col h-full'>
      <h3 className='text-xs font-semibold text-stone-400 uppercase tracking-wide px-3 py-1.5 border-b border-stone-700'>
        Events
      </h3>
      <div className='flex-1 overflow-y-auto px-3 py-1'>
        {log.length === 0 ? (
          <p className='text-xs text-stone-500 py-2'>
            Start the simulation to see events...
          </p>
        ) : (
          log.map((entry) => (
            <div key={entry.id} className='flex gap-1.5 py-0.5 text-xs'>
              <span className='text-stone-600 tabular-nums shrink-0'>
                D{entry.day} {String(entry.hour).padStart(2, '0')}:00
              </span>
              <span className={`shrink-0 ${TYPE_COLORS[entry.type]}`}>
                {TYPE_ICONS[entry.type]}
              </span>
              <span className='text-stone-300'>{entry.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
