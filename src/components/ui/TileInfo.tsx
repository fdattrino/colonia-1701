import { useGameStore } from '../../store/gameStore'
import { STRUCTURE_LABELS, isPlotType, isFacilityType } from '../../store/types'

export function TileInfo() {
  const selectedTile = useGameStore((s) => s.selectedTile)
  const grid = useGameStore((s) => s.grid)
  const tourists = useGameStore((s) => s.tourists)
  const pricing = useGameStore((s) => s.pricing)

  if (!selectedTile) return null

  const tile = grid[selectedTile.y]?.[selectedTile.x]
  if (!tile) return null

  const occupant = tile.occupant
    ? tourists.find((t) => t.id === tile.occupant)
    : null

  return (
    <div className='absolute bottom-12 left-1/2 -translate-x-1/2 bg-stone-800/95 border border-stone-600 rounded-lg px-4 py-3 shadow-xl min-w-[200px] z-50'>
      <div className='text-xs text-stone-400 mb-1'>
        Tile ({tile.x}, {tile.y}) — {tile.terrain}
      </div>

      {tile.structure && (
        <div className='text-sm font-medium text-stone-200'>
          {STRUCTURE_LABELS[tile.structure.type]}
          {tile.structure.level > 1 && (
            <span className='text-amber-400 ml-1'>
              Lv.{tile.structure.level}
            </span>
          )}
        </div>
      )}

      {tile.structure && isPlotType(tile.structure.type) && (
        <div className='text-xs text-green-400 mt-0.5'>
          ${pricing[tile.structure.type]}/night
        </div>
      )}

      {occupant && (
        <div className='mt-2 pt-2 border-t border-stone-700'>
          <div className='text-sm font-medium text-cyan-300'>
            {occupant.name}
          </div>
          <div className='text-xs text-stone-400'>{occupant.composition}</div>
          <div className='text-xs text-stone-400 mt-0.5'>
            Satisfaction: {occupant.satisfaction}% | Day{' '}
            {Math.max(1, useGameStore.getState().day - occupant.arrivalDay + 1)}
            /{occupant.tripDuration}
          </div>
        </div>
      )}

      {!tile.structure && (
        <div className='text-xs text-stone-500 mt-1'>
          {tile.terrain === 'water' || tile.terrain === 'trees'
            ? 'Cannot build here'
            : 'Select a structure to build here'}
        </div>
      )}
    </div>
  )
}
