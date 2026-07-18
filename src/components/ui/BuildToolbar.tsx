import { useGameStore } from '../../store/gameStore'
import {
  PLOT_TYPES,
  FACILITY_TYPES,
  BUILD_COSTS,
  STRUCTURE_LABELS,
  type StructureType,
} from '../../store/types'

function BuildButton({ type }: { type: StructureType }) {
  const buildMode = useGameStore((s) => s.buildMode)
  const money = useGameStore((s) => s.money)
  const setBuildMode = useGameStore((s) => s.setBuildMode)

  const isActive = buildMode === type
  const canAfford = money >= BUILD_COSTS[type]

  return (
    <button
      onClick={() => setBuildMode(isActive ? null : type)}
      disabled={!canAfford && !isActive}
      className={`
        flex flex-col items-start px-2 py-1.5 rounded text-xs transition-colors w-full text-left
        ${
          isActive
            ? 'bg-amber-500/20 border border-amber-500 text-amber-200'
            : canAfford
              ? 'bg-stone-700/50 border border-stone-600 text-stone-300 hover:bg-stone-600/50'
              : 'bg-stone-800/50 border border-stone-700 text-stone-500 cursor-not-allowed'
        }
      `}>
      <span className='font-medium'>{STRUCTURE_LABELS[type]}</span>
      <span className={canAfford ? 'text-green-400' : 'text-red-400'}>
        ${BUILD_COSTS[type]}
      </span>
    </button>
  )
}

export function BuildToolbar() {
  const buildMode = useGameStore((s) => s.buildMode)
  const setBuildMode = useGameStore((s) => s.setBuildMode)

  return (
    <div className='flex flex-col gap-3'>
      <div>
        <h3 className='text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1.5'>
          Plots
        </h3>
        <div className='flex flex-col gap-1'>
          {PLOT_TYPES.map((type) => (
            <BuildButton key={type} type={type} />
          ))}
        </div>
      </div>

      <div>
        <h3 className='text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1.5'>
          Facilities
        </h3>
        <div className='flex flex-col gap-1'>
          {FACILITY_TYPES.map((type) => (
            <BuildButton key={type} type={type} />
          ))}
        </div>
      </div>

      <div>
        <h3 className='text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1.5'>
          Tools
        </h3>
        <button
          onClick={() =>
            setBuildMode(buildMode === 'demolish' ? null : 'demolish')
          }
          className={`
            px-2 py-1.5 rounded text-xs font-medium w-full text-left transition-colors
            ${
              buildMode === 'demolish'
                ? 'bg-red-500/20 border border-red-500 text-red-300'
                : 'bg-stone-700/50 border border-stone-600 text-stone-300 hover:bg-stone-600/50'
            }
          `}>
          🔨 Demolish (50% refund)
        </button>
      </div>

      {buildMode && (
        <button
          onClick={() => setBuildMode(null)}
          className='px-2 py-1 rounded text-xs bg-stone-600 text-stone-300 hover:bg-stone-500 transition-colors'>
          Cancel Build Mode
        </button>
      )}
    </div>
  )
}
