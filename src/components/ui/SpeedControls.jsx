import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import { useGameStore } from '../../store/gameStore'

export function SpeedControls() {
  const speed = useGameStore((s) => s.speed)
  const setSpeed = useGameStore((s) => s.setSpeed)

  const speeds = [
    { value: 0, label: '⏸' },
    { value: 1, label: '1x' },
    { value: 2, label: '2x' },
    { value: 5, label: '5x' },
  ]

  return (
    <ButtonGroup size='sm'>
      {speeds.map(({ value, label }) => (
        <Button
          key={value}
          onClick={() => setSpeed(value)}
          variant={speed === value ? 'warning' : 'secondary'}
          className='fw-bold'>
          {label}
        </Button>
      ))}
    </ButtonGroup>
  )
}
