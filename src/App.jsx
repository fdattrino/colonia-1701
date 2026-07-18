import { useState, useEffect, useCallback, useRef } from 'react'
import { IsometricGrid } from './components/grid/IsometricGrid'
import { StatsBar } from './components/ui/StatsBar'
import { ControlPanel } from './components/ui/ControlPanel'
import { EventLog } from './components/ui/EventLog'
import { TileInfo } from './components/ui/TileInfo'
import { GuestChatter } from './components/ui/GuestChatter'
import { Tutorial } from './components/ui/Tutorial'
import { useGameLoop } from './engine/gameLoop'
import { loadSavedGame } from './store/gameStore'

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSavedGame().finally(() => setLoading(false))
  }, [])

  useGameLoop()

  const [bottomHeight, setBottomHeight] = useState(160)
  const [sidebarWidth, setSidebarWidth] = useState(240)
  const dragging = useRef(false)
  const dragStartY = useRef(0)
  const dragStartH = useRef(0)

  const onResizeStart = useCallback(
    (e) => {
      e.preventDefault()
      dragging.current = true
      dragStartY.current = e.clientY
      dragStartH.current = bottomHeight

      const onMove = (ev) => {
        if (!dragging.current) return
        const delta = dragStartY.current - ev.clientY
        const next = Math.max(
          80,
          Math.min(window.innerHeight * 0.6, dragStartH.current + delta)
        )
        setBottomHeight(next)
      }
      const onUp = () => {
        dragging.current = false
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
      }
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    },
    [bottomHeight]
  )

  const sidebarDragging = useRef(false)
  const sidebarDragStartX = useRef(0)
  const sidebarDragStartW = useRef(0)

  const onSidebarResizeStart = useCallback(
    (e) => {
      e.preventDefault()
      sidebarDragging.current = true
      sidebarDragStartX.current = e.clientX
      sidebarDragStartW.current = sidebarWidth

      const onMove = (ev) => {
        if (!sidebarDragging.current) return
        const delta = ev.clientX - sidebarDragStartX.current
        const next = Math.max(
          180,
          Math.min(window.innerWidth * 0.4, sidebarDragStartW.current + delta)
        )
        setSidebarWidth(next)
      }
      const onUp = () => {
        sidebarDragging.current = false
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
      }
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    },
    [sidebarWidth]
  )

  const [showTutorial, setShowTutorial] = useState(() => {
    return !localStorage.getItem('campground-tutorial-seen')
  })

  function closeTutorial() {
    localStorage.setItem('campground-tutorial-seen', '1')
    setShowTutorial(false)
  }

  if (loading) {
    return (
      <div className='h-screen flex items-center justify-center bg-stone-900 text-stone-300'>
        <p className='text-lg'>Loading saved game…</p>
      </div>
    )
  }

  return (
    <div className='h-screen flex flex-col'>
      <StatsBar onHelpClick={() => setShowTutorial(true)} />

      <div className='flex flex-1 overflow-hidden'>
        <div className='relative shrink-0' style={{ width: sidebarWidth }}>
          <GuestChatter />
          <div
            onMouseDown={onSidebarResizeStart}
            className='absolute top-0 right-0 bottom-0 w-1.5 cursor-col-resize z-10 group'>
            <div className='w-px h-full bg-stone-700 group-hover:bg-stone-500 transition-colors' />
          </div>
        </div>
        <div className='flex-1 relative'>
          <IsometricGrid />
          <TileInfo />
        </div>
        <ControlPanel />
      </div>

      <div className='relative shrink-0' style={{ height: bottomHeight }}>
        <div
          onMouseDown={onResizeStart}
          className='absolute top-0 left-0 right-0 h-1.5 cursor-row-resize z-10 group'>
          <div className='h-px bg-stone-700 group-hover:bg-stone-500 transition-colors' />
          <div className='mx-auto w-10 h-1 mt-px rounded-full bg-stone-700 group-hover:bg-stone-400 transition-colors' />
        </div>
        <div className='flex h-full bg-stone-900/95 pt-1.5'>
          <div className='w-full overflow-hidden'>
            <EventLog />
          </div>
        </div>
      </div>

      {showTutorial && <Tutorial onClose={closeTutorial} />}
    </div>
  )
}
