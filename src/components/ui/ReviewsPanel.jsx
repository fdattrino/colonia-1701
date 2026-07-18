import Card from 'react-bootstrap/Card'
import { useGameStore } from '../../store/gameStore'

export function ReviewsPanel() {
  const reviews = useGameStore((s) => s.reviews)

  if (reviews.length === 0) return null

  return (
    <div>
      <h6 className='text-secondary text-uppercase small fw-semibold mb-2'>
        Lettere in patria
      </h6>
      <div
        className='d-flex flex-column gap-2 overflow-y-auto'
        style={{ maxHeight: '10rem' }}>
        {reviews.slice(0, 10).map((review) => (
          <Card key={review.touristId} bg='dark' className='border-secondary'>
            <Card.Body className='p-2'>
              <div className='d-flex align-items-center justify-content-between'>
                <span className='small fw-medium'>{review.touristName}</span>
                <span className='small text-warning'>
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </span>
              </div>
              <p className='small text-secondary mb-0 mt-1'>{review.text}</p>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  )
}
