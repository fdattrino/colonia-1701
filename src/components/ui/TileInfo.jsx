import Card from 'react-bootstrap/Card'
import { useGameStore } from '../../store/gameStore'
import { STRUCTURE_LABELS, isPlotType } from '../../store/constants'

const TERRAIN_LABELS = {
  grass: 'prato',
  trees: 'bosco',
  water: 'fiume',
  path: 'strada',
  sand: 'sabbia',
}

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
    <Card
      bg='dark'
      className='position-absolute start-50 translate-middle-x border-secondary shadow'
      style={{ bottom: '3rem', minWidth: '200px', zIndex: 50 }}>
      <Card.Body className='p-3'>
        <div className='small text-secondary mb-1'>
          Casella ({tile.x}, {tile.y}) — {TERRAIN_LABELS[tile.terrain]}
        </div>

        {tile.structure && (
          <div className='fw-medium'>
            {STRUCTURE_LABELS[tile.structure.type]}
            {tile.structure.level > 1 && (
              <span className='text-warning ms-1'>
                Liv.{tile.structure.level}
              </span>
            )}
          </div>
        )}

        {tile.structure && isPlotType(tile.structure.type) && (
          <div className='small text-success'>
            🪙 {pricing[tile.structure.type]}/notte
          </div>
        )}

        {occupant && (
          <div className='mt-2 pt-2 border-top'>
            <div className='fw-medium text-info'>{occupant.name}</div>
            <div className='small text-secondary'>{occupant.composition}</div>
            <div className='small text-secondary'>
              Soddisfazione: {occupant.satisfaction}% | Giorno{' '}
              {Math.max(
                1,
                useGameStore.getState().day - occupant.arrivalDay + 1
              )}
              /{occupant.tripDuration}
            </div>
          </div>
        )}

        {!tile.structure && (
          <div className='small text-secondary mt-1'>
            {tile.terrain === 'water' || tile.terrain === 'trees'
              ? 'Non si può costruire qui'
              : 'Scegli una struttura da costruire qui'}
          </div>
        )}
      </Card.Body>
    </Card>
  )
}
