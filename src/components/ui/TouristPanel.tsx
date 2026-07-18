import { useGameStore } from '../../store/gameStore'

const PERSONALITY_LABELS: Record<string, string> = {
  'quiet-nature-lover': '🌿 Nature Lover',
  'social-party': '🎉 Social',
  'budget-backpacker': '🎒 Backpacker',
  'comfort-glamper': '✨ Glamper',
  'adventure-seeker': '⛰️ Adventurer',
  'family-focused': '👨‍👩‍👧‍👦 Family',
}

export function TouristPanel() {
  const tourists = useGameStore((s) => s.tourists)
  const activeTourists = tourists.filter(
    (t) => t.status === 'staying' || t.status === 'arriving'
  )

  if (activeTourists.length === 0) {
    return (
      <div>
        <h3 className='text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2'>
          Current Guests
        </h3>
        <p className='text-xs text-stone-500'>
          No guests yet. Build some plots and start the simulation!
        </p>
      </div>
    )
  }

  return (
    <div>
      <h3 className='text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2'>
        Current Guests ({activeTourists.length})
      </h3>
      <div className='flex flex-col gap-1.5 max-h-48 overflow-y-auto'>
        {activeTourists.map((tourist) => (
          <div
            key={tourist.id}
            className='bg-stone-700/40 rounded px-2 py-1.5 border border-stone-600/50'>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-medium text-stone-200'>
                {tourist.name}
              </span>
              <span className='text-[10px] text-stone-400'>
                {tourist.status === 'arriving'
                  ? 'Arriving'
                  : `Day ${Math.max(1, useGameStore.getState().day - tourist.arrivalDay + 1)}/${tourist.tripDuration}`}
              </span>
            </div>
            <div className='flex items-center gap-2 mt-0.5'>
              <span className='text-[10px] text-stone-400'>
                {PERSONALITY_LABELS[tourist.personality] || tourist.personality}
              </span>
              <span className='text-[10px] text-stone-500'>•</span>
              <span className='text-[10px] text-stone-400'>
                {tourist.composition}
              </span>
            </div>
            <div className='flex items-center gap-2 mt-0.5'>
              <div className='flex-1 bg-stone-600 rounded-full h-1'>
                <div
                  className={`h-1 rounded-full transition-all ${
                    tourist.satisfaction >= 70
                      ? 'bg-green-400'
                      : tourist.satisfaction >= 40
                        ? 'bg-yellow-400'
                        : 'bg-red-400'
                  }`}
                  style={{ width: `${tourist.satisfaction}%` }}
                />
              </div>
              <span className='text-[10px] text-stone-400'>
                {tourist.satisfaction}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
