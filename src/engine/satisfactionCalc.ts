import type { Tile, TouristGroup, Weather, FacilityType } from '../store/types'
import { isFacilityType, isPlotType } from '../store/types'

function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

function findNearbyFacilities(
  grid: Tile[][],
  x: number,
  y: number,
  radius: number
): FacilityType[] {
  const facilities: FacilityType[] = []
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const tile = grid[y + dy]?.[x + dx]
      if (tile?.structure && isFacilityType(tile.structure.type)) {
        facilities.push(tile.structure.type)
      }
    }
  }
  return facilities
}

function countNearbyOccupants(
  grid: Tile[][],
  x: number,
  y: number,
  radius: number
): number {
  let count = 0
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx === 0 && dy === 0) continue
      const tile = grid[y + dy]?.[x + dx]
      if (tile?.occupant) count++
    }
  }
  return count
}

function isNearWater(
  grid: Tile[][],
  x: number,
  y: number,
  radius: number
): boolean {
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const tile = grid[y + dy]?.[x + dx]
      if (tile?.terrain === 'water') return true
    }
  }
  return false
}

export function calculateSatisfactionDelta(
  tourist: TouristGroup,
  grid: Tile[][],
  weather: Weather,
  pricePerNight: number
): number {
  if (!tourist.assignedPlot) return 0

  const { x, y } = tourist.assignedPlot
  let delta = 0

  const nearbyFacilities = findNearbyFacilities(grid, x, y, 3)
  const neighbors = countNearbyOccupants(grid, x, y, 2)
  const nearWater = isNearWater(grid, x, y, 3)

  const hasRestroom = nearbyFacilities.includes('restroom')
  const hasShower = nearbyFacilities.includes('shower')
  const hasFirePit = nearbyFacilities.includes('fire-pit')
  const hasStore = nearbyFacilities.includes('store')
  const hasPlayground = nearbyFacilities.includes('playground')
  const hasTrail = nearbyFacilities.includes('trail-head')

  if (hasRestroom) delta += 2
  else delta -= 3

  if (hasShower) delta += 1

  // Preference-based bonuses
  if (tourist.preferences.includes('near-water') && nearWater) delta += 3
  if (tourist.preferences.includes('near-water') && !nearWater) delta -= 2
  if (tourist.preferences.includes('quiet') && neighbors === 0) delta += 2
  if (tourist.preferences.includes('quiet') && neighbors > 2) delta -= 3
  if (tourist.preferences.includes('social') && neighbors > 0) delta += 2
  if (tourist.preferences.includes('social') && neighbors === 0) delta -= 1
  if (
    tourist.preferences.includes('near-facilities') &&
    nearbyFacilities.length >= 2
  )
    delta += 2
  if (tourist.preferences.includes('playground') && hasPlayground) delta += 3
  if (tourist.preferences.includes('trail-access') && hasTrail) delta += 3

  // Weather effects
  switch (weather) {
    case 'perfect':
      delta += 3
      break
    case 'sunny':
      delta += 1
      break
    case 'cloudy':
      break
    case 'rainy':
      delta -= 2
      break
    case 'stormy':
      delta -= 5
      break
  }

  // Personality-specific
  switch (tourist.personality) {
    case 'quiet-nature-lover':
      if (nearWater) delta += 2
      if (hasTrail) delta += 2
      if (neighbors > 2) delta -= 3
      break
    case 'social-party':
      if (hasFirePit) delta += 2
      if (neighbors > 0) delta += 1
      break
    case 'budget-backpacker':
      if (pricePerNight > tourist.budget * 0.7) delta -= 2
      if (pricePerNight <= tourist.budget * 0.5) delta += 2
      break
    case 'comfort-glamper':
      if (hasShower) delta += 2
      if (hasStore) delta += 1
      if (!hasRestroom) delta -= 4
      break
    case 'adventure-seeker':
      if (hasTrail) delta += 3
      if (nearWater) delta += 1
      break
    case 'family-focused':
      if (hasPlayground) delta += 3
      if (hasRestroom && hasShower) delta += 2
      if (!hasRestroom) delta -= 4
      break
  }

  // Price fairness
  const priceRatio = pricePerNight / tourist.budget
  if (priceRatio > 0.9) delta -= 2
  if (priceRatio < 0.4) delta += 1

  return delta
}
