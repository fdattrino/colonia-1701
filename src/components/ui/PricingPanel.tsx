import { useGameStore } from '../../store/gameStore'
import { PLOT_TYPES, STRUCTURE_LABELS, type PlotType } from '../../store/types'

function PriceRow({ plotType }: { plotType: PlotType }) {
  const price = useGameStore((s) => s.pricing[plotType])
  const setPrice = useGameStore((s) => s.setPrice)

  return (
    <div className='flex items-center justify-between gap-2'>
      <span className='text-xs text-stone-300'>
        {STRUCTURE_LABELS[plotType]}
      </span>
      <div className='flex items-center gap-1'>
        <button
          onClick={() => setPrice(plotType, price - 5)}
          className='w-5 h-5 rounded bg-stone-700 text-stone-300 text-xs hover:bg-stone-600 flex items-center justify-center'>
          -
        </button>
        <span className='text-xs font-bold text-green-400 w-8 text-center'>
          ${price}
        </span>
        <button
          onClick={() => setPrice(plotType, price + 5)}
          className='w-5 h-5 rounded bg-stone-700 text-stone-300 text-xs hover:bg-stone-600 flex items-center justify-center'>
          +
        </button>
      </div>
    </div>
  )
}

export function PricingPanel() {
  return (
    <div>
      <h3 className='text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2'>
        Nightly Rates
      </h3>
      <div className='flex flex-col gap-1.5'>
        {PLOT_TYPES.map((type) => (
          <PriceRow key={type} plotType={type} />
        ))}
      </div>
    </div>
  )
}
