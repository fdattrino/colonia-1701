import { SpeedControls } from './SpeedControls'
import { BuildToolbar } from './BuildToolbar'
import { PricingPanel } from './PricingPanel'
import { TouristPanel } from './TouristPanel'
import { ReviewsPanel } from './ReviewsPanel'
import { SaveLoadPanel } from './SaveLoadPanel'

export function ControlPanel() {
  return (
    <div
      className='bg-body-tertiary border-start d-flex flex-column overflow-y-auto'
      style={{ width: '14rem' }}>
      <div className='px-3 py-2 border-bottom d-flex flex-column gap-2'>
        <SpeedControls />
        <SaveLoadPanel />
      </div>

      <div className='flex-grow-1 overflow-y-auto'>
        <div className='px-3 py-3 border-bottom'>
          <BuildToolbar />
        </div>

        <div className='px-3 py-3 border-bottom'>
          <PricingPanel />
        </div>

        <div className='px-3 py-3 border-bottom'>
          <TouristPanel />
        </div>

        <div className='px-3 py-3'>
          <ReviewsPanel />
        </div>
      </div>
    </div>
  )
}
