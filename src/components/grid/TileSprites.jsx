const TILE_W = 64
const TILE_H = 32

function IsoDiamond({ fill, stroke = '#0002' }) {
  return (
    <polygon
      points={`${TILE_W / 2},0 ${TILE_W},${TILE_H / 2} ${TILE_W / 2},${TILE_H} 0,${TILE_H / 2}`}
      fill={fill}
      stroke={stroke}
      strokeWidth={0.5}
    />
  )
}

export function TerrainSprite({ terrain }) {
  switch (terrain) {
    case 'grass':
      return (
        <svg
          width={TILE_W}
          height={TILE_H + 8}
          viewBox={`0 0 ${TILE_W} ${TILE_H + 8}`}>
          <g transform='translate(0,4)'>
            <IsoDiamond fill='#5d9e4e' />
            {/* Pixel grass tufts */}
            <rect x={20} y={12} width={2} height={3} fill='#4a8040' />
            <rect x={40} y={14} width={2} height={2} fill='#4a8040' />
            <rect x={30} y={10} width={2} height={2} fill='#6bb55c' />
          </g>
        </svg>
      )
    case 'water':
      return (
        <svg
          width={TILE_W}
          height={TILE_H + 8}
          viewBox={`0 0 ${TILE_W} ${TILE_H + 8}`}>
          <g transform='translate(0,4)'>
            <IsoDiamond fill='#3b82c4' />
            {/* Pixel wave lines */}
            <line
              x1={18}
              y1={13}
              x2={24}
              y2={13}
              stroke='#5ba0e0'
              strokeWidth={1.5}
            />

            <line
              x1={34}
              y1={15}
              x2={42}
              y2={15}
              stroke='#5ba0e0'
              strokeWidth={1.5}
            />

            <line
              x1={26}
              y1={17}
              x2={32}
              y2={17}
              stroke='#5ba0e0'
              strokeWidth={1.5}
            />
          </g>
        </svg>
      )
    case 'trees':
      return (
        <svg
          width={TILE_W}
          height={TILE_H + 20}
          viewBox={`0 0 ${TILE_W} ${TILE_H + 20}`}>
          <g transform='translate(0,16)'>
            <IsoDiamond fill='#4a7c3f' />
          </g>
          {/* Pixel pine trees */}
          <g transform='translate(24, 0)'>
            <rect x={6} y={20} width={4} height={6} fill='#5a3a1e' />
            <polygon points='8,4 0,18 16,18' fill='#2d6b25' />
            <polygon points='8,8 2,16 14,16' fill='#3a8432' />
          </g>
          <g transform='translate(38, 6)'>
            <rect x={4} y={14} width={3} height={4} fill='#5a3a1e' />
            <polygon points='5,2 0,13 11,13' fill='#2d6b25' />
            <polygon points='5,5 1,11 9,11' fill='#3a8432' />
          </g>
        </svg>
      )
    case 'path':
      return (
        <svg
          width={TILE_W}
          height={TILE_H + 8}
          viewBox={`0 0 ${TILE_W} ${TILE_H + 8}`}>
          <g transform='translate(0,4)'>
            <IsoDiamond fill='#8b7355' />
            {/* Gravel texture */}
            <circle cx={22} cy={14} r={1} fill='#7a6548' />
            <circle cx={34} cy={12} r={1} fill='#9c8666' />
            <circle cx={28} cy={16} r={1} fill='#7a6548' />
            <circle cx={40} cy={15} r={1} fill='#9c8666' />
          </g>
        </svg>
      )
    case 'sand':
      return (
        <svg
          width={TILE_W}
          height={TILE_H + 8}
          viewBox={`0 0 ${TILE_W} ${TILE_H + 8}`}>
          <g transform='translate(0,4)'>
            <IsoDiamond fill='#d4a853' />
            <circle cx={20} cy={14} r={1} fill='#c49843' />
            <circle cx={38} cy={13} r={1} fill='#e0bc6a' />
          </g>
        </svg>
      )
  }
}

export function StructureSprite({ type, occupied }) {
  switch (type) {
    case 'tent-small':
      return (
        <svg
          width={TILE_W}
          height={TILE_H + 24}
          viewBox={`0 0 ${TILE_W} ${TILE_H + 24}`}>
          <g transform='translate(0,16)'>
            <IsoDiamond fill='#5d9e4e' stroke='#4a8040' />
          </g>
          {/* Small pixel tent */}
          <g transform='translate(18, 4)'>
            <polygon
              points='14,0 0,18 28,18'
              fill={occupied ? '#e07040' : '#d4944a'}
            />

            <polygon
              points='14,0 14,18 28,18'
              fill={occupied ? '#c05030' : '#b87a3a'}
            />

            <rect
              x={11}
              y={12}
              width={6}
              height={6}
              fill={occupied ? '#a04020' : '#a06a30'}
            />
          </g>
          {occupied && (
            <circle
              cx={48}
              cy={10}
              r={4}
              fill='#ffcc44'
              stroke='#cc9900'
              strokeWidth={1}
            />
          )}
        </svg>
      )
    case 'tent-large':
      return (
        <svg
          width={TILE_W}
          height={TILE_H + 28}
          viewBox={`0 0 ${TILE_W} ${TILE_H + 28}`}>
          <g transform='translate(0,20)'>
            <IsoDiamond fill='#5d9e4e' stroke='#4a8040' />
          </g>
          {/* Large pixel tent */}
          <g transform='translate(12, 2)'>
            <polygon
              points='20,0 0,22 40,22'
              fill={occupied ? '#3a7acc' : '#6a8caa'}
            />

            <polygon
              points='20,0 20,22 40,22'
              fill={occupied ? '#2a6abb' : '#5a7c9a'}
            />

            <rect
              x={15}
              y={14}
              width={10}
              height={8}
              fill={occupied ? '#1a5aaa' : '#4a6c8a'}
            />

            <line x1={20} y1={0} x2={20} y2={3} stroke='#555' strokeWidth={2} />
          </g>
          {occupied && (
            <circle
              cx={50}
              cy={10}
              r={4}
              fill='#ffcc44'
              stroke='#cc9900'
              strokeWidth={1}
            />
          )}
        </svg>
      )
    case 'campervan':
      return (
        <svg
          width={TILE_W}
          height={TILE_H + 28}
          viewBox={`0 0 ${TILE_W} ${TILE_H + 28}`}>
          <g transform='translate(0,20)'>
            <IsoDiamond fill='#5d9e4e' stroke='#4a8040' />
          </g>
          {/* Pixel campervan */}
          <g transform='translate(14, 6)'>
            <rect
              x={0}
              y={4}
              width={36}
              height={16}
              rx={2}
              fill={occupied ? '#e8e8e8' : '#c0c0c0'}
            />

            <rect
              x={0}
              y={4}
              width={36}
              height={4}
              fill={occupied ? '#cc4444' : '#999'}
            />

            <rect x={28} y={8} width={6} height={6} fill='#88ccee' />
            <rect x={4} y={10} width={5} height={5} fill='#88ccee' />
            <rect x={12} y={10} width={5} height={5} fill='#88ccee' />
            <circle cx={8} cy={20} r={3} fill='#333' />
            <circle cx={28} cy={20} r={3} fill='#333' />
          </g>
        </svg>
      )
    case 'rv-hookup':
      return (
        <svg
          width={TILE_W}
          height={TILE_H + 28}
          viewBox={`0 0 ${TILE_W} ${TILE_H + 28}`}>
          <g transform='translate(0,20)'>
            <IsoDiamond fill='#7a7a6a' stroke='#6a6a5a' />
          </g>
          {/* Pixel RV with hookup post */}
          <g transform='translate(10, 2)'>
            <rect
              x={0}
              y={8}
              width={40}
              height={18}
              rx={2}
              fill={occupied ? '#f0f0e8' : '#c8c8c0'}
            />

            <rect
              x={0}
              y={8}
              width={40}
              height={5}
              fill={occupied ? '#2266aa' : '#888'}
            />

            <rect x={32} y={12} width={6} height={6} fill='#88ccee' />
            <rect x={4} y={14} width={6} height={5} fill='#88ccee' />
            <rect x={14} y={14} width={6} height={5} fill='#88ccee' />
            <circle cx={10} cy={26} r={3} fill='#333' />
            <circle cx={32} cy={26} r={3} fill='#333' />
            {/* Hookup post */}
            <rect x={42} y={4} width={4} height={20} fill='#666' />
            <rect x={40} y={2} width={8} height={4} fill='#ffcc00' />
          </g>
        </svg>
      )
    case 'restroom':
      return (
        <svg
          width={TILE_W}
          height={TILE_H + 28}
          viewBox={`0 0 ${TILE_W} ${TILE_H + 28}`}>
          <g transform='translate(0,20)'>
            <IsoDiamond fill='#5d9e4e' stroke='#4a8040' />
          </g>
          {/* Pixel restroom building */}
          <g transform='translate(16, 4)'>
            <rect x={0} y={6} width={32} height={18} fill='#b89878' />
            <rect x={0} y={6} width={32} height={4} fill='#8B4513' />
            <polygon points='0,6 16,0 32,6' fill='#a0522d' />
            <rect x={4} y={12} width={8} height={10} fill='#6a4e3a' />
            <rect x={20} y={12} width={8} height={10} fill='#6a4e3a' />
            <text x={7} y={20} fontSize={8} fill='#fff' fontWeight='bold'>
              M
            </text>
            <text x={23} y={20} fontSize={8} fill='#fff' fontWeight='bold'>
              F
            </text>
          </g>
        </svg>
      )
    case 'shower':
      return (
        <svg
          width={TILE_W}
          height={TILE_H + 28}
          viewBox={`0 0 ${TILE_W} ${TILE_H + 28}`}>
          <g transform='translate(0,20)'>
            <IsoDiamond fill='#5d9e4e' stroke='#4a8040' />
          </g>
          {/* Pixel shower building */}
          <g transform='translate(18, 4)'>
            <rect x={0} y={6} width={28} height={18} fill='#88aacc' />
            <polygon points='0,6 14,0 28,6' fill='#6688aa' />
            <rect x={8} y={12} width={12} height={10} fill='#5577aa' />
            {/* Water drops */}
            <circle cx={14} cy={3} r={2} fill='#44aaff' />
            <line
              x1={12}
              y1={5}
              x2={11}
              y2={8}
              stroke='#44aaff'
              strokeWidth={1}
            />

            <line
              x1={16}
              y1={5}
              x2={17}
              y2={8}
              stroke='#44aaff'
              strokeWidth={1}
            />
          </g>
        </svg>
      )
    case 'fire-pit':
      return (
        <svg
          width={TILE_W}
          height={TILE_H + 16}
          viewBox={`0 0 ${TILE_W} ${TILE_H + 16}`}>
          <g transform='translate(0,10)'>
            <IsoDiamond fill='#5d9e4e' stroke='#4a8040' />
          </g>
          {/* Pixel fire pit */}
          <g transform='translate(22, 4)'>
            <ellipse
              cx={10}
              cy={16}
              rx={10}
              ry={5}
              fill='#555'
              stroke='#444'
              strokeWidth={1}
            />

            <ellipse cx={10} cy={14} rx={7} ry={3} fill='#333' />
            {/* Fire */}
            <polygon points='10,2 6,12 14,12' fill='#ff6600' />
            <polygon points='10,4 8,10 12,10' fill='#ffcc00' />
            <polygon points='10,6 9,9 11,9' fill='#ffff66' />
          </g>
        </svg>
      )
    case 'picnic':
      return (
        <svg
          width={TILE_W}
          height={TILE_H + 20}
          viewBox={`0 0 ${TILE_W} ${TILE_H + 20}`}>
          <g transform='translate(0,14)'>
            <IsoDiamond fill='#5d9e4e' stroke='#4a8040' />
          </g>
          {/* Pixel picnic table */}
          <g transform='translate(16, 6)'>
            <rect x={2} y={6} width={28} height={3} fill='#8B6914' />
            <rect x={6} y={12} width={20} height={2} fill='#7a5a10' />
            <rect x={6} y={9} width={2} height={5} fill='#6a4e0e' />
            <rect x={24} y={9} width={2} height={5} fill='#6a4e0e' />
            <rect x={4} y={14} width={2} height={4} fill='#6a4e0e' />
            <rect x={26} y={14} width={2} height={4} fill='#6a4e0e' />
          </g>
        </svg>
      )
    case 'store':
      return (
        <svg
          width={TILE_W}
          height={TILE_H + 32}
          viewBox={`0 0 ${TILE_W} ${TILE_H + 32}`}>
          <g transform='translate(0,24)'>
            <IsoDiamond fill='#5d9e4e' stroke='#4a8040' />
          </g>
          {/* Pixel camp store */}
          <g transform='translate(10, 2)'>
            <rect x={0} y={8} width={44} height={22} fill='#ddc89e' />
            <polygon points='0,8 22,0 44,8' fill='#cc4444' />
            <rect x={16} y={16} width={12} height={12} fill='#8B6914' />
            <rect x={4} y={14} width={8} height={6} fill='#88ccee' />
            <rect x={32} y={14} width={8} height={6} fill='#88ccee' />
            {/* Sign */}
            <rect x={12} y={10} width={20} height={5} fill='#fff' />
            <text x={14} y={14} fontSize={4} fill='#333' fontWeight='bold'>
              EMPORIO
            </text>
          </g>
        </svg>
      )
    case 'playground':
      return (
        <svg
          width={TILE_W}
          height={TILE_H + 24}
          viewBox={`0 0 ${TILE_W} ${TILE_H + 24}`}>
          <g transform='translate(0,18)'>
            <IsoDiamond fill='#d4a853' stroke='#c09840' />
          </g>
          {/* Pixel playground - swing set */}
          <g transform='translate(16, 2)'>
            <line x1={2} y1={20} x2={8} y2={0} stroke='#888' strokeWidth={2} />
            <line
              x1={30}
              y1={20}
              x2={24}
              y2={0}
              stroke='#888'
              strokeWidth={2}
            />

            <line x1={8} y1={0} x2={24} y2={0} stroke='#888' strokeWidth={2} />
            {/* Swings */}
            <line
              x1={13}
              y1={0}
              x2={11}
              y2={14}
              stroke='#666'
              strokeWidth={1}
            />

            <rect x={9} y={14} width={4} height={2} fill='#cc4444' />
            <line
              x1={19}
              y1={0}
              x2={21}
              y2={14}
              stroke='#666'
              strokeWidth={1}
            />

            <rect x={19} y={14} width={4} height={2} fill='#4444cc' />
          </g>
        </svg>
      )
    case 'lake-access':
      return (
        <svg
          width={TILE_W}
          height={TILE_H + 20}
          viewBox={`0 0 ${TILE_W} ${TILE_H + 20}`}>
          <g transform='translate(0,14)'>
            <IsoDiamond fill='#d4a853' stroke='#c09840' />
          </g>
          {/* Pixel dock */}
          <g transform='translate(16, 4)'>
            <rect x={0} y={8} width={32} height={4} fill='#8B6914' />
            <rect x={2} y={12} width={3} height={6} fill='#6a4e0e' />
            <rect x={27} y={12} width={3} height={6} fill='#6a4e0e' />
            <rect x={14} y={12} width={3} height={6} fill='#6a4e0e' />
            {/* Railing posts */}
            <rect x={2} y={2} width={2} height={8} fill='#7a5a10' />
            <rect x={28} y={2} width={2} height={8} fill='#7a5a10' />
            <line
              x1={3}
              y1={4}
              x2={29}
              y2={4}
              stroke='#7a5a10'
              strokeWidth={1}
            />
          </g>
        </svg>
      )
    case 'trail-head':
      return (
        <svg
          width={TILE_W}
          height={TILE_H + 24}
          viewBox={`0 0 ${TILE_W} ${TILE_H + 24}`}>
          <g transform='translate(0,18)'>
            <IsoDiamond fill='#5d9e4e' stroke='#4a8040' />
          </g>
          {/* Pixel trail sign */}
          <g transform='translate(24, 2)'>
            <rect x={6} y={4} width={3} height={18} fill='#6a4e0e' />
            <rect x={0} y={2} width={16} height={8} fill='#8B6914' />
            <polygon points='16,2 20,6 16,10' fill='#8B6914' />
            <text x={2} y={8} fontSize={4} fill='#fff' fontWeight='bold'>
              STRADA
            </text>
          </g>
        </svg>
      )
    case 'entrance':
      return (
        <svg
          width={TILE_W}
          height={TILE_H + 36}
          viewBox={`0 0 ${TILE_W} ${TILE_H + 36}`}>
          <g transform='translate(0,28)'>
            <IsoDiamond fill='#8b7355' stroke='#7a6548' />
          </g>
          <g transform='translate(6, 0)'>
            {/* Left post */}
            <rect x={4} y={8} width={5} height={28} fill='#6a4e0e' />
            <rect x={3} y={6} width={7} height={4} fill='#8B6914' />
            {/* Right post */}
            <rect x={43} y={8} width={5} height={28} fill='#6a4e0e' />
            <rect x={42} y={6} width={7} height={4} fill='#8B6914' />
            {/* Cross beam */}
            <rect x={3} y={6} width={46} height={3} fill='#7a5a10' />
            <rect x={1} y={4} width={50} height={3} fill='#8B6914' />
            {/* Hanging sign */}
            <line
              x1={16}
              y1={7}
              x2={16}
              y2={12}
              stroke='#5a3a1e'
              strokeWidth={1}
            />

            <line
              x1={36}
              y1={7}
              x2={36}
              y2={12}
              stroke='#5a3a1e'
              strokeWidth={1}
            />

            <rect x={14} y={12} width={24} height={10} rx={1} fill='#d4a853' />
            <rect x={14} y={12} width={24} height={2} fill='#c49843' />
            <text
              x={26}
              y={20}
              fontSize={4}
              fill='#5a3a1e'
              fontWeight='bold'
              textAnchor='middle'>
              COLONIA
            </text>
          </g>
        </svg>
      )
  }
}

export function TouristSprite({ personality }) {
  const colors = {
    'quiet-nature-lover': '#228833',
    'social-party': '#ee4444',
    'budget-backpacker': '#888844',
    'comfort-glamper': '#cc66cc',
    'adventure-seeker': '#ee8822',
    'family-focused': '#4488cc',
  }
  const color = colors[personality || ''] || '#666'

  return (
    <svg width={12} height={16} viewBox='0 0 12 16'>
      <circle cx={6} cy={4} r={3} fill='#ffcc88' />
      <rect x={3} y={7} width={6} height={6} rx={1} fill={color} />
      <rect x={2} y={13} width={3} height={3} fill='#555' />
      <rect x={7} y={13} width={3} height={3} fill='#555' />
    </svg>
  )
}
