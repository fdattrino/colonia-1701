import { SpeedControls } from './SpeedControls'
import { BuildToolbar } from './BuildToolbar'
import { PricingPanel } from './PricingPanel'
import { TouristPanel } from './TouristPanel'
import { ReviewsPanel } from './ReviewsPanel'
import { SaveLoadPanel } from './SaveLoadPanel'

export function ControlPanel() {
  return (
    <div className='w-56 bg-stone-900/95 border-l border-stone-700 flex flex-col overflow-y-auto'>
      <div className='px-3 py-2 border-b border-stone-700 flex flex-col gap-2'>
        <SpeedControls />
        <SaveLoadPanel />
      </div>

      <div className='flex-1 overflow-y-auto'>
        <div className='px-3 py-3 border-b border-stone-700/50'>
          <BuildToolbar />
        </div>

        <div className='px-3 py-3 border-b border-stone-700/50'>
          <PricingPanel />
        </div>

        <div className='px-3 py-3 border-b border-stone-700/50'>
          <TouristPanel />
        </div>

        <div className='px-3 py-3'>
          <ReviewsPanel />
        </div>
      </div>
    </div>
  )
}
