import Button from 'react-bootstrap/Button'
import { useGameStore } from '../../store/gameStore'
import { PLOT_TYPES, STRUCTURE_LABELS } from '../../store/constants'

function PriceRow({ plotType }) {
  const price = useGameStore((s) => s.pricing[plotType])
  const setPrice = useGameStore((s) => s.setPrice)

  return (
    <div className='d-flex align-items-center justify-content-between gap-2'>
      <span className='small'>{STRUCTURE_LABELS[plotType]}</span>
      <div className='d-flex align-items-center gap-1'>
        <Button
          size='sm'
          variant='secondary'
          className='px-2 py-0'
          onClick={() => setPrice(plotType, price - 5)}>
          -
        </Button>
        <span
          className='small fw-bold text-success text-center'
          style={{ minWidth: '3rem' }}>
          🪙 {price}
        </span>
        <Button
          size='sm'
          variant='secondary'
          className='px-2 py-0'
          onClick={() => setPrice(plotType, price + 5)}>
          +
        </Button>
      </div>
    </div>
  )
}

export function PricingPanel() {
  return (
    <div>
      <h6 className='text-secondary text-uppercase small fw-semibold mb-2'>
        Affitti per notte
      </h6>
      <div className='d-flex flex-column gap-2'>
        {PLOT_TYPES.map((type) => (
          <PriceRow key={type} plotType={type} />
        ))}
      </div>
    </div>
  )
}
