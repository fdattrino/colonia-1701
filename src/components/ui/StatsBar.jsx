import Button from 'react-bootstrap/Button'
import { useGameStore } from '../../store/gameStore'
import { WEATHER_LABELS, SEASON_LABELS } from '../../utils/constants'

export function StatsBar({ onHelpClick }) {
  const day = useGameStore((s) => s.day)
  const hour = useGameStore((s) => s.hour)
  const money = useGameStore((s) => s.money)
  const reputation = useGameStore((s) => s.reputation)
  const weather = useGameStore((s) => s.weather)
  const season = useGameStore((s) => s.season)
  const tourists = useGameStore((s) => s.tourists)

  const activeTourists = tourists.filter((t) => t.status === 'staying').length
  const arrivingTourists = tourists.filter(
    (t) => t.status === 'arriving'
  ).length

  const repColor =
    reputation >= 70
      ? 'text-success'
      : reputation >= 40
        ? 'text-warning'
        : 'text-danger'

  return (
    <div className='d-flex align-items-center gap-3 px-3 py-2 bg-body-tertiary border-bottom small'>
      <div className='d-flex align-items-center gap-1'>
        <span className='text-secondary'>Giorno</span>
        <span className='fw-bold fs-5'>{day}</span>
        <span className='text-secondary'>
          {String(hour).padStart(2, '0')}:00
        </span>
      </div>

      <div className='vr' />

      <div>{SEASON_LABELS[season]}</div>

      <div>{WEATHER_LABELS[weather]}</div>

      <div className='vr' />

      <div className='fw-bold fs-5 text-success'>
        🪙 {money.toLocaleString()}
      </div>

      <div className='vr' />

      <div className='d-flex align-items-center gap-1'>
        <span className='text-secondary'>Prestigio</span>
        <span className={`fw-bold ${repColor}`}>{reputation}</span>
        <span className='text-secondary'>/100</span>
      </div>

      <div className='vr' />

      <div className='d-flex align-items-center gap-1'>
        <span className='text-secondary'>Coloni</span>
        <span className='fw-bold text-info'>{activeTourists}</span>
        {arrivingTourists > 0 && (
          <span className='text-secondary'>
            (+{arrivingTourists} in arrivo)
          </span>
        )}
      </div>

      <div className='flex-grow-1' />

      <Button size='sm' variant='secondary' onClick={onHelpClick}>
        ? Aiuto
      </Button>

      <div className='text-secondary fw-semibold'>COLONIA 1701</div>
    </div>
  )
}
