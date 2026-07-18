import { useGameStore } from '../../store/gameStore'
import type { Speed } from '../../store/types'

export function SpeedControls() {
  const speed = useGameStore((s) => s.speed)
  const setSpeed = useGameStore((s) => s.setSpeed)

  const speeds: { value: Speed; label: string }[] = [
    { value: 0, label: '⏸' },
    { value: 1, label: '1x' },
    { value: 2, label: '2x' },
    { value: 5, label: '5x' },
  ]

  return (
    <div className='flex items-center gap-1'>
      {speeds.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setSpeed(value)}
          className={`
            px-2.5 py-1 rounded text-xs font-bold transition-colors
            ${
              speed === value
                ? 'bg-amber-500 text-stone-900'
                : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
            }
          `}>
          {label}
        </button>
      ))}
    </div>
  )
}
