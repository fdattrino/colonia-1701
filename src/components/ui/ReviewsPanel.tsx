import { useGameStore } from '../../store/gameStore'

export function ReviewsPanel() {
  const reviews = useGameStore((s) => s.reviews)

  if (reviews.length === 0) return null

  return (
    <div>
      <h3 className='text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2'>
        Recent Reviews
      </h3>
      <div className='flex flex-col gap-1.5 max-h-40 overflow-y-auto'>
        {reviews.slice(0, 10).map((review) => (
          <div
            key={review.touristId}
            className='bg-stone-700/30 rounded px-2 py-1.5 border border-stone-600/30'>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-medium text-stone-300'>
                {review.touristName}
              </span>
              <span className='text-xs text-amber-400'>
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </span>
            </div>
            <p className='text-[10px] text-stone-400 mt-0.5 leading-relaxed'>
              {review.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
