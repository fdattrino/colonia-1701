import { useGameStore } from '../../store/gameStore'

const MOOD_EMOJI = {
  happy: '😊',
  neutral: '😐',
  annoyed: '😤',
  excited: '🤩',
  tired: '😴',
}

const PERSONALITY_COLOR = {
  'quiet-nature-lover': 'text-green-400',
  'social-party': 'text-red-400',
  'budget-backpacker': 'text-yellow-500',
  'comfort-glamper': 'text-purple-400',
  'adventure-seeker': 'text-orange-400',
  'family-focused': 'text-cyan-400',
}

const PERSONALITY_TAG = {
  'quiet-nature-lover': '🌿',
  'social-party': '🎉',
  'budget-backpacker': '🎒',
  'comfort-glamper': '✨',
  'adventure-seeker': '🧗',
  'family-focused': '👨‍👩‍👧',
}

export function GuestChatter() {
  const chatter = useGameStore((s) => s.chatter)
  const tourists = useGameStore((s) => s.tourists)
  const stayingCount = tourists.filter((t) => t.status === 'staying').length

  return (
    <div className='h-full bg-stone-900/95 border-r border-stone-700 flex flex-col overflow-hidden'>
      <div className='px-2 py-1.5 border-b border-stone-700 flex items-center justify-between'>
        <div className='flex items-center gap-1.5'>
          <span className='text-xs'>📡</span>
          <h3 className='text-[10px] font-bold text-stone-300 uppercase tracking-wide'>
            Guest Chatter
          </h3>
        </div>
        <span className='text-[10px] text-stone-500'>
          {stayingCount > 0
            ? `${stayingCount} guest${stayingCount > 1 ? 's' : ''}`
            : 'empty'}
        </span>
      </div>

      <div className='flex-1 overflow-y-auto'>
        {chatter.length === 0 ? (
          <div className='px-2 py-4 text-center'>
            <p className='text-[10px] text-stone-600 italic'>
              {stayingCount > 0
                ? 'Waiting for guests to speak up...'
                : 'Build plots to attract guests'}
            </p>
          </div>
        ) : (
          <div className='flex flex-col'>
            {chatter.map((msg) => (
              <div
                key={msg.id}
                className={`px-2 py-1 border-b border-stone-800/50 hover:bg-stone-800/30 transition-colors ${msg.replyTo ? 'pl-4 border-l-2 border-l-amber-700/40' : ''} ${msg.actionable ? 'bg-yellow-900/20 border-l-2 border-l-yellow-500/60' : ''}`}>
                {msg.actionable && (
                  <div className='flex items-center gap-1 mb-0.5'>
                    <span className='text-[9px] font-bold uppercase tracking-wider text-yellow-500/90 bg-yellow-500/10 px-1 py-px rounded'>
                      Actionable
                    </span>
                  </div>
                )}
                {msg.replyTo && (
                  <div className='text-[10px] text-stone-500 mb-0.5 truncate'>
                    <span className='text-stone-600'>replying to</span>{' '}
                    <span className='text-amber-600/80'>
                      {msg.replyTo.name}
                    </span>
                    <span className='text-stone-600'>
                      : "{msg.replyTo.text.slice(0, 40)}
                      {msg.replyTo.text.length > 40 ? '...' : ''}"
                    </span>
                  </div>
                )}
                <div className='flex items-start gap-1.5'>
                  <span className='text-xs shrink-0'>
                    {MOOD_EMOJI[msg.mood]}
                  </span>
                  <div className='min-w-0'>
                    <span
                      className={`text-[11px] font-semibold ${PERSONALITY_COLOR[msg.personality]}`}>
                      {msg.touristName.split(' ')[0]}
                    </span>
                    <span className='text-[10px] ml-1'>
                      {PERSONALITY_TAG[msg.personality]}
                    </span>
                    <span className='text-[10px] text-stone-600 ml-1'>
                      d{msg.day} {String(msg.hour).padStart(2, '0')}h
                    </span>
                    <p
                      className={`text-[11px] leading-snug ${msg.actionable ? 'text-yellow-200/90' : 'text-stone-300'}`}>
                      "{msg.text}"
                    </p>
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
