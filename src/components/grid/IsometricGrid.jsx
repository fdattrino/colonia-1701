import { useRef, useState, useCallback, useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { gridToScreen, TILE_W, TILE_H } from '../../utils/grid'
import { TerrainSprite, StructureSprite, TouristSprite } from './TileSprites'

export function IsometricGrid() {
  const containerRef = useRef(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hasDragged, setHasDragged] = useState(false)
  const [zoom, setZoom] = useState(1.2)

  const grid = useGameStore((s) => s.grid)
  const gridWidth = useGameStore((s) => s.gridWidth)
  const gridHeight = useGameStore((s) => s.gridHeight)
  const buildMode = useGameStore((s) => s.buildMode)
  const selectedTile = useGameStore((s) => s.selectedTile)
  const tourists = useGameStore((s) => s.tourists)
  const placeStructure = useGameStore((s) => s.placeStructure)
  const demolishStructure = useGameStore((s) => s.demolishStructure)
  const selectTile = useGameStore((s) => s.selectTile)

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setOffset({
        x: rect.width / 2,
        y: 60,
      })
    }
  }, [])

  const dragStartPos = useRef({ x: 0, y: 0 })

  const handleMouseDown = useCallback(
    (e) => {
      if (e.button === 0 || e.button === 1) {
        setDragging(true)
        setHasDragged(false)
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
        dragStartPos.current = { x: e.clientX, y: e.clientY }
      }
    },
    [offset]
  )

  const handleMouseMove = useCallback(
    (e) => {
      if (dragging) {
        const dx = e.clientX - dragStartPos.current.x
        const dy = e.clientY - dragStartPos.current.y
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          setHasDragged(true)
        }
        setOffset({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
      }
    },
    [dragging, dragStart]
  )

  const handleMouseUp = useCallback(() => {
    setDragging(false)
  }, [])

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    setZoom((z) => Math.max(0.5, Math.min(3, z - e.deltaY * 0.001)))
  }, [])

  const handleTileClick = useCallback(
    (tile) => {
      if (hasDragged) return
      if (buildMode === 'demolish') {
        demolishStructure(tile.x, tile.y)
      } else if (buildMode) {
        placeStructure(tile.x, tile.y)
      } else {
        selectTile(
          selectedTile?.x === tile.x && selectedTile?.y === tile.y
            ? null
            : { x: tile.x, y: tile.y }
        )
      }
    },
    [
      buildMode,
      placeStructure,
      demolishStructure,
      selectTile,
      selectedTile,
      hasDragged,
    ]
  )

  const sortedTiles = []
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      sortedTiles.push(grid[y][x])
    }
  }

  return (
    <div
      ref={containerRef}
      className='iso-map position-relative w-100 h-100 overflow-hidden bg-body-secondary'
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}>
      <div
        className='position-absolute'
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}>
        {sortedTiles.map((tile) => {
          const { screenX, screenY } = gridToScreen(tile.x, tile.y)
          const isSelected =
            selectedTile?.x === tile.x && selectedTile?.y === tile.y
          const occupantTourist = tile.occupant
            ? tourists.find((t) => t.id === tile.occupant)
            : undefined
          const canBuild =
            buildMode &&
            buildMode !== 'demolish' &&
            tile.terrain !== 'water' &&
            tile.terrain !== 'trees' &&
            !tile.structure
          const canDemolish =
            buildMode === 'demolish' &&
            tile.structure &&
            !tile.occupant &&
            tile.structure.type !== 'entrance'

          return (
            <div
              key={`${tile.x}-${tile.y}`}
              className='position-absolute'
              style={{
                left: screenX,
                top: screenY,
                width: TILE_W,
                zIndex: tile.x + tile.y,
              }}
              onClick={() => handleTileClick(tile)}>
              <div
                className={`iso-tile ${canBuild ? 'iso-tile--buildable' : ''} ${canDemolish ? 'iso-tile--demolishable' : ''} ${isSelected ? 'iso-tile--selected' : ''} ${!buildMode && tile.structure ? 'iso-tile--clickable' : ''}`}>
                <TerrainSprite terrain={tile.terrain} />
                {tile.structure && (
                  <div
                    className='position-absolute'
                    style={{
                      left: 0,
                      bottom: -4,
                    }}>
                    <StructureSprite
                      type={tile.structure.type}
                      occupied={!!tile.occupant}
                    />
                  </div>
                )}
                {occupantTourist && (
                  <div
                    className='position-absolute'
                    style={{ left: TILE_W / 2 - 6, bottom: TILE_H - 2 }}>
                    <TouristSprite personality={occupantTourist.personality} />
                  </div>
                )}
                {isSelected && (
                  <div
                    className='position-absolute top-0 start-0 end-0 bottom-0 pe-none'
                    style={{ top: tile.structure ? -20 : 0 }}>
                    <svg
                      width={TILE_W}
                      height={TILE_H}
                      viewBox={`0 0 ${TILE_W} ${TILE_H}`}>
                      <polygon
                        points={`${TILE_W / 2},0 ${TILE_W},${TILE_H / 2} ${TILE_W / 2},${TILE_H} 0,${TILE_H / 2}`}
                        fill='none'
                        stroke='#fbbf24'
                        strokeWidth={2}
                        strokeDasharray='4 2'
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div
        className='position-absolute small text-secondary user-select-none'
        style={{ bottom: 8, left: 8 }}>
        Trascina per spostarti | Rotella per lo zoom | mappa {gridWidth}x
        {gridHeight}
      </div>
    </div>
  )
}
