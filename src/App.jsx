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
    return !localStorage.getItem('colonia1701-tutorial-seen')
  })

  function closeTutorial() {
    localStorage.setItem('colonia1701-tutorial-seen', '1')
    setShowTutorial(false)
  }

  if (loading) {
    return (
      <div className='vh-100 d-flex align-items-center justify-content-center'>
        <p className='fs-5'>Carico la partita salvata…</p>
      </div>
    )
  }

  return (
    <div className='vh-100 d-flex flex-column'>
      <StatsBar onHelpClick={() => setShowTutorial(true)} />

      <div className='d-flex flex-grow-1 overflow-hidden'>
        <div
          className='position-relative flex-shrink-0'
          style={{ width: sidebarWidth }}>
          <GuestChatter />
          <div
            onMouseDown={onSidebarResizeStart}
            className='resize-handle-x position-absolute top-0 end-0 bottom-0'
            style={{ width: 6, zIndex: 10 }}>
            <div className='h-100 border-end' />
          </div>
        </div>
        <div className='flex-grow-1 position-relative'>
          <IsometricGrid />
          <TileInfo />
        </div>
        <ControlPanel />
      </div>

      <div
        className='position-relative flex-shrink-0'
        style={{ height: bottomHeight }}>
        <div
          onMouseDown={onResizeStart}
          className='resize-handle-y position-absolute top-0 start-0 end-0'
          style={{ height: 6, zIndex: 10 }}>
          <div className='border-top' />
          <div
            className='mx-auto rounded-pill bg-secondary'
            style={{ width: 40, height: 4, marginTop: 1 }}
          />
        </div>
        <div className='d-flex h-100 bg-body-tertiary pt-2'>
          <div className='w-100 overflow-hidden'>
            <EventLog />
          </div>
        </div>
      </div>

      {showTutorial && <Tutorial onClose={closeTutorial} />}
    </div>
  )
}
