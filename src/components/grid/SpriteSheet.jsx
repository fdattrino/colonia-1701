const SHEET = '/sprites.png'
const SHEET_W = 1376
const SHEET_H = 768

const TERRAIN_SPRITES = {
  grass: { x: 22, y: 21, w: 238, h: 180 },
  water: { x: 293, y: 41, w: 238, h: 150 },
  trees: { x: 565, y: 0, w: 239, h: 201 },
  path: { x: 838, y: 44, w: 240, h: 147 },
  sand: { x: 1113, y: 25, w: 245, h: 170 },
}

const TERRAIN_COLORS = {
  grass: '#6ba84e',
  water: '#2e8acc',
  trees: '#3a6b30',
  path: '#9b7040',
  sand: '#e0c468',
}

const PLOT_SPRITES = {
  'tent-small': { x: 26, y: 195, w: 272, h: 226 },
  'tent-large': { x: 351, y: 195, w: 301, h: 226 },
  campervan: { x: 741, y: 195, w: 203, h: 226 },
  'rv-hookup': { x: 1031, y: 207, w: 272, h: 212 },
}

const FACILITY_SPRITES = {
  restroom: { x: 16, y: 415, w: 170, h: 186 },
  shower: { x: 216, y: 415, w: 107, h: 184 },
  'fire-pit': { x: 365, y: 416, w: 114, h: 160 },
  picnic: { x: 506, y: 415, w: 171, h: 185 },
  store: { x: 686, y: 417, w: 174, h: 184 },
  playground: { x: 867, y: 418, w: 177, h: 182 },
  'lake-access': { x: 1053, y: 418, w: 179, h: 183 },
  'trail-head': { x: 1260, y: 435, w: 76, h: 146 },
}

const STRUCTURE_SPRITES = {
  ...PLOT_SPRITES,
  ...FACILITY_SPRITES,
}

const TOURIST_SPRITES = {
  'quiet-nature-lover': { x: 104, y: 620, w: 70, h: 121 },
  'social-party': { x: 343, y: 617, w: 68, h: 123 },
  'budget-backpacker': { x: 537, y: 609, w: 69, h: 132 },
  'comfort-glamper': { x: 750, y: 619, w: 70, h: 139 },
  'adventure-seeker': { x: 955, y: 617, w: 62, h: 143 },
  'family-focused': { x: 1118, y: 600, w: 186, h: 162 },
}

function Sprite({ sprite, displayWidth, displayHeight, className = '' }) {
  const scaleX = displayWidth / sprite.w
  const scaleY = displayHeight / sprite.h

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        width: displayWidth,
        height: displayHeight,
        backgroundImage: `url(${SHEET})`,
        backgroundPosition: `-${sprite.x * scaleX}px -${sprite.y * scaleY}px`,
        backgroundSize: `${SHEET_W * scaleX}px ${SHEET_H * scaleY}px`,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
      }}
    />
  )
}

const TILE_CLIP =
  'polygon(50% 0%, 100% 33.33%, 100% 66.67%, 50% 100%, 0% 66.67%, 0% 33.33%)'

export function TerrainSprite({ terrain }) {
  const sprite = TERRAIN_SPRITES[terrain]
  if (!sprite) return null

  const displayW = 66
  const displayH = 50
  const scaleX = displayW / sprite.w
  const scaleY = displayH / sprite.h

  return (
    <div
      style={{
        width: displayW,
        height: displayH,
        margin: '-1px 0 0 -1px',
        clipPath: TILE_CLIP,
        backgroundColor: TERRAIN_COLORS[terrain],
        position: 'relative',
      }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${SHEET})`,
          backgroundPosition: `-${sprite.x * scaleX}px -${sprite.y * scaleY}px`,
          backgroundSize: `${SHEET_W * scaleX}px ${SHEET_H * scaleY}px`,
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  )
}

export function StructureSprite({ type, occupied, wide }) {
  const sprite = STRUCTURE_SPRITES[type]
  if (!sprite) return null

  let displayWidth
  let displayHeight

  if (wide) {
    displayWidth = 72
    displayHeight = 48
  } else if (type in PLOT_SPRITES) {
    displayWidth = 48
    displayHeight = 40
  } else {
    displayWidth = 36
    displayHeight = 32
  }

  return (
    <Sprite
      sprite={sprite}
      displayWidth={displayWidth}
      displayHeight={displayHeight}
      className={occupied ? 'drop-shadow-[0_0_4px_rgba(255,204,68,0.7)]' : ''}
    />
  )
}

export function TouristSprite({ personality }) {
  const sprite = TOURIST_SPRITES[personality || '']
  if (!sprite) return null
  return <Sprite sprite={sprite} displayWidth={16} displayHeight={24} />
}
