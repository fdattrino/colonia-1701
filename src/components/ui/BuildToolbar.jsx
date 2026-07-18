import Button from 'react-bootstrap/Button'
import { useGameStore } from '../../store/gameStore'
import {
  PLOT_TYPES,
  FACILITY_TYPES,
  BUILD_COSTS,
  STRUCTURE_LABELS,
} from '../../store/constants'

function BuildButton({ type }) {
  const buildMode = useGameStore((s) => s.buildMode)
  const money = useGameStore((s) => s.money)
  const setBuildMode = useGameStore((s) => s.setBuildMode)

  const isActive = buildMode === type
  const canAfford = money >= BUILD_COSTS[type]

  return (
    <Button
      size='sm'
      variant={isActive ? 'warning' : 'outline-secondary'}
      onClick={() => setBuildMode(isActive ? null : type)}
      disabled={!canAfford && !isActive}
      className='w-100 text-start d-flex flex-column align-items-start py-1'>
      <span className='small'>{STRUCTURE_LABELS[type]}</span>
      <span
        className={`small ${isActive ? '' : canAfford ? 'text-success' : 'text-danger'}`}>
        🪙 {BUILD_COSTS[type]}
      </span>
    </Button>
  )
}

export function BuildToolbar() {
  const buildMode = useGameStore((s) => s.buildMode)
  const setBuildMode = useGameStore((s) => s.setBuildMode)

  return (
    <div className='d-flex flex-column gap-3'>
      <div>
        <h6 className='text-secondary text-uppercase small fw-semibold mb-1'>
          Alloggi
        </h6>
        <div className='d-grid gap-1'>
          {PLOT_TYPES.map((type) => (
            <BuildButton key={type} type={type} />
          ))}
        </div>
      </div>

      <div>
        <h6 className='text-secondary text-uppercase small fw-semibold mb-1'>
          Servizi
        </h6>
        <div className='d-grid gap-1'>
          {FACILITY_TYPES.map((type) => (
            <BuildButton key={type} type={type} />
          ))}
        </div>
      </div>

      <div>
        <h6 className='text-secondary text-uppercase small fw-semibold mb-1'>
          Strumenti
        </h6>
        <Button
          size='sm'
          variant={buildMode === 'demolish' ? 'danger' : 'outline-secondary'}
          onClick={() =>
            setBuildMode(buildMode === 'demolish' ? null : 'demolish')
          }
          className='w-100 text-start'>
          🔨 Demolisci (rimborso 50%)
        </Button>
      </div>

      {buildMode && (
        <Button
          size='sm'
          variant='secondary'
          onClick={() => setBuildMode(null)}>
          Annulla costruzione
        </Button>
      )}
    </div>
  )
}
