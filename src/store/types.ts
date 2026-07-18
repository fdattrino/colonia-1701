export type PlotType = 'tent-small' | 'tent-large' | 'campervan' | 'rv-hookup'
export type FacilityType =
  | 'restroom'
  | 'shower'
  | 'fire-pit'
  | 'picnic'
  | 'store'
  | 'playground'
  | 'lake-access'
  | 'trail-head'
  | 'entrance'
export type TerrainType = 'grass' | 'trees' | 'water' | 'path' | 'sand'
export type StructureType = PlotType | FacilityType
export type Weather = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'perfect'
export type Season = 'spring' | 'summer' | 'fall' | 'winter'
export type Speed = 0 | 1 | 2 | 5

export interface Structure {
  type: StructureType
  level: 1 | 2 | 3
}

export interface Tile {
  x: number
  y: number
  terrain: TerrainType
  structure?: Structure
  occupant?: string
}

export type Personality =
  | 'quiet-nature-lover'
  | 'social-party'
  | 'budget-backpacker'
  | 'comfort-glamper'
  | 'adventure-seeker'
  | 'family-focused'

export type Preference =
  | 'near-water'
  | 'quiet'
  | 'near-facilities'
  | 'electricity'
  | 'shade'
  | 'social'
  | 'playground'
  | 'trail-access'

export interface TouristGroup {
  id: string
  name: string
  composition: string
  personality: Personality
  budget: number
  preferences: Preference[]
  tripDuration: number
  arrivalDay: number
  assignedPlot?: { x: number; y: number }
  satisfaction: number
  status: 'arriving' | 'staying' | 'departing' | 'left'
}

export interface Review {
  touristId: string
  touristName: string
  rating: number
  text: string
  day: number
}

export interface LogEntry {
  id: string
  day: number
  hour: number
  message: string
  type: 'arrival' | 'departure' | 'review' | 'event' | 'system' | 'weather'
}

export type ChatterMood = 'happy' | 'neutral' | 'annoyed' | 'excited' | 'tired'

export interface ChatterMessage {
  id: string
  touristId: string
  touristName: string
  personality: Personality
  mood: ChatterMood
  text: string
  day: number
  hour: number
  actionable?: boolean
  replyTo?: {
    name: string
    text: string
  }
}

export interface GameState {
  grid: Tile[][]
  gridWidth: number
  gridHeight: number
  tourists: TouristGroup[]
  reviews: Review[]
  log: LogEntry[]
  chatter: ChatterMessage[]
  day: number
  hour: number
  money: number
  reputation: number
  weather: Weather
  season: Season
  pricing: Record<PlotType, number>
  speed: Speed
  buildMode: StructureType | 'demolish' | null
  selectedTile: { x: number; y: number } | null
  isRunning: boolean
}

export const PLOT_TYPES: PlotType[] = [
  'tent-small',
  'tent-large',
  'campervan',
  'rv-hookup',
]
export const FACILITY_TYPES: FacilityType[] = [
  'restroom',
  'shower',
  'fire-pit',
  'picnic',
  'store',
  'playground',
  'lake-access',
  'trail-head',
]

export const BUILD_COSTS: Record<StructureType, number> = {
  'tent-small': 200,
  'tent-large': 400,
  campervan: 600,
  'rv-hookup': 1000,
  restroom: 800,
  shower: 600,
  'fire-pit': 150,
  picnic: 100,
  store: 2000,
  playground: 1200,
  'lake-access': 500,
  'trail-head': 300,
  entrance: 0,
}

export const MAINTENANCE_COSTS: Record<StructureType, number> = {
  'tent-small': 2,
  'tent-large': 3,
  campervan: 4,
  'rv-hookup': 5,
  restroom: 8,
  shower: 6,
  'fire-pit': 1,
  picnic: 1,
  store: 15,
  playground: 5,
  'lake-access': 3,
  'trail-head': 2,
  entrance: 0,
}

export const DEFAULT_PRICING: Record<PlotType, number> = {
  'tent-small': 15,
  'tent-large': 25,
  campervan: 35,
  'rv-hookup': 50,
}

export const STRUCTURE_LABELS: Record<StructureType, string> = {
  'tent-small': 'Small Tent',
  'tent-large': 'Large Tent',
  campervan: 'Campervan',
  'rv-hookup': 'RV Hookup',
  restroom: 'Restroom',
  shower: 'Shower',
  'fire-pit': 'Fire Pit',
  picnic: 'Picnic Area',
  store: 'Camp Store',
  playground: 'Playground',
  'lake-access': 'Lake Access',
  'trail-head': 'Trail Head',
  entrance: 'Entrance',
}

export function isPlotType(type: StructureType): type is PlotType {
  return PLOT_TYPES.includes(type as PlotType)
}

export function isFacilityType(type: StructureType): type is FacilityType {
  return FACILITY_TYPES.includes(type as FacilityType)
}
