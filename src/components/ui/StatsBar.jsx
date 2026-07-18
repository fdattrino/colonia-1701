import { useGameStore } from '../../store/gameStore'
import { WEATHER_LABELS, SEASON_LABELS } from '../../utils/constants'

export function StatsBar({ onHelpClick }) {
  const day = useGameStore((s) => s.day)
  const hour = useGameStore((s) => s.hour)
  const money = useGameStore((s) => s.money)
  const reputation = useGameStore((s) => s.reputation)
  const weather = useGameStore((s) => s.weather)
  const season = useGameStore((s) => s.season)
  const tourists = useGameStore((s) => s.tourists)

  const activeTourists = tourists.filter((t) => t.status === 'staying').length
  const arrivingTourists = tourists.filter(
    (t) => t.status === 'arriving'
  ).length

  const repColor =
    reputation >= 70
      ? 'text-green-400'
      : reputation >= 40
        ? 'text-yellow-400'
        : 'text-red-400'

  return (
    <div className='flex items-center gap-4 px-4 py-2 bg-stone-900/90 border-b border-stone-700 text-sm'>
      <div className='flex items-center gap-1.5'>
        <span className='text-stone-400'>Day</span>
        <span className='font-bold text-lg tabular-nums'>{day}</span>
        <span className='text-stone-500 tabular-nums'>
          {String(hour).padStart(2, '0')}:00
        </span>
      </div>

      <div className='w-px h-6 bg-stone-700' />

      <div>{SEASON_LABELS[season]}</div>

      <div>{WEATHER_LABELS[weather]}</div>

      <div className='w-px h-6 bg-stone-700' />

      <div className='flex items-center gap-1'>
        <span className='text-green-400 font-bold text-lg'>
          ${money.toLocaleString()}
        </span>
      </div>

      <div className='w-px h-6 bg-stone-700' />

      <div className='flex items-center gap-1'>
        <span className='text-stone-400'>Rep</span>
        <span className={`font-bold ${repColor}`}>{reputation}</span>
        <span className='text-stone-500'>/100</span>
      </div>

      <div className='w-px h-6 bg-stone-700' />

      <div className='flex items-center gap-1.5'>
        <span className='text-stone-400'>Guests</span>
        <span className='font-bold text-cyan-400'>{activeTourists}</span>
        {arrivingTourists > 0 && (
          <span className='text-stone-500'>(+{arrivingTourists} arriving)</span>
        )}
      </div>

      <div className='flex-1' />

      <button
        onClick={onHelpClick}
        className='px-2 py-1 rounded text-xs bg-stone-700 text-stone-400 hover:bg-stone-600 hover:text-stone-200 transition-colors'
        title='How to play'>
        ? Help
      </button>

      <div className='text-stone-500 font-semibold tracking-wide'>
        CAMPGROUND TYCOON
      </div>
    </div>
  )
}
