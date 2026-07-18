export const TILE_W = 64
export const TILE_H = 32

export function gridToScreen(x, y) {
  return {
    screenX: (x - y) * (TILE_W / 2),
    screenY: (x + y) * (TILE_H / 2),
  }
}

export function screenToGrid(screenX, screenY) {
  const x = (screenX / (TILE_W / 2) + screenY / (TILE_H / 2)) / 2
  const y = (screenY / (TILE_H / 2) - screenX / (TILE_W / 2)) / 2
  return { x: Math.round(x), y: Math.round(y) }
}

export function generateInitialGrid(width, height) {
  const grid = []
  const midX = Math.floor(width / 2)
  const midY = Math.floor(height / 2)
  const entranceX = midX
  const entranceY = height - 1

  for (let y = 0; y < height; y++) {
    const row = []
    for (let x = 0; x < width; x++) {
      let terrain = 'grass'

      // Lake in the top-right area
      if (x >= width - 4 && y <= 3) {
        terrain = 'water'
      }
      // Sandy beach near lake
      if (
        (x === width - 5 && y <= 3) ||
        (x >= width - 4 && y === 4) ||
        (x === width - 5 && y === 4)
      ) {
        terrain = 'sand'
      }
      // Trees scattered along edges — skip the entrance tile
      if (
        (x === 0 || y === 0 || x === width - 1 || y === height - 1) &&
        terrain === 'grass' &&
        !(x === entranceX && y === entranceY)
      ) {
        terrain = 'trees'
      }
      // A few internal tree clusters
      if (
        ((x === 3 && y === 3) ||
          (x === 4 && y === 3) ||
          (x === 10 && y === 8) ||
          (x === 10 && y === 9)) &&
        terrain === 'grass'
      ) {
        terrain = 'trees'
      }
      // Main path through the middle
      if ((y === midY || x === midX) && terrain === 'grass') {
        terrain = 'path'
      }

      row.push({ x, y, terrain })
    }
    grid.push(row)
  }

  // Place the campground entrance at the bottom edge where the path exits
  grid[entranceY][entranceX] = {
    x: entranceX,
    y: entranceY,
    terrain: 'path',
    structure: { type: 'entrance', level: 1 },
  }

  return grid
}

export function getGridBounds(width, height) {
  const topLeft = gridToScreen(0, height - 1)
  const topRight = gridToScreen(width - 1, 0)
  const bottomLeft = gridToScreen(0, 0)
  const bottomRight = gridToScreen(width - 1, height - 1)

  const minX = topLeft.screenX
  const maxX = topRight.screenX + TILE_W
  const minY = Math.min(topRight.screenY, topLeft.screenY) - TILE_H
  const maxY = bottomRight.screenY + TILE_H

  return {
    minX,
    maxX,
    minY,
    maxY,
    totalWidth: maxX - minX,
    totalHeight: maxY - minY,
  }
}
