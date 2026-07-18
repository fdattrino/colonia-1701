import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type {
  GameState,
  Tile,
  StructureType,
  PlotType,
  Speed,
  TouristGroup,
  Review,
  LogEntry,
  ChatterMessage,
  Weather,
  Season,
} from './types'
import { BUILD_COSTS, DEFAULT_PRICING, isPlotType } from './types'
import { generateInitialGrid } from '../utils/grid'
import {
  GRID_WIDTH,
  GRID_HEIGHT,
  STARTING_MONEY,
  STARTING_REPUTATION,
} from '../utils/constants'
import { saveGame, loadGame } from '../db/database'

interface GameActions {
  setBuildMode: (mode: StructureType | 'demolish' | null) => void
  selectTile: (pos: { x: number; y: number } | null) => void
  placeStructure: (x: number, y: number) => void
  demolishStructure: (x: number, y: number) => void
  setSpeed: (speed: Speed) => void
  setPrice: (plotType: PlotType, price: number) => void
  advanceHour: () => void
  setWeather: (weather: Weather) => void
  setSeason: (season: Season) => void
  addTourist: (tourist: TouristGroup) => void
  updateTourist: (id: string, updates: Partial<TouristGroup>) => void
  removeTourist: (id: string) => void
  assignPlot: (touristId: string, x: number, y: number) => void
  vacatePlot: (x: number, y: number) => void
  addReview: (review: Review) => void
  addLog: (entry: Omit<LogEntry, 'id'>) => void
  addChatter: (msg: Omit<ChatterMessage, 'id'>) => void
  addMoney: (amount: number) => void
  setReputation: (rep: number) => void
  resetGame: () => void
}

function createInitialState(): GameState {
  return {
    grid: generateInitialGrid(GRID_WIDTH, GRID_HEIGHT),
    gridWidth: GRID_WIDTH,
    gridHeight: GRID_HEIGHT,
    tourists: [],
    reviews: [],
    log: [],
    chatter: [],
    day: 1,
    hour: 6,
    money: STARTING_MONEY,
    reputation: STARTING_REPUTATION,
    weather: 'sunny',
    season: 'summer',
    pricing: { ...DEFAULT_PRICING },
    speed: 0,
    buildMode: null,
    selectedTile: null,
    isRunning: false,
  }
}

export const useGameStore = create<GameState & GameActions>()(
  subscribeWithSelector((set, get) => ({
    ...createInitialState(),

    setBuildMode: (mode) => set({ buildMode: mode, selectedTile: null }),

    selectTile: (pos) => set({ selectedTile: pos }),

    placeStructure: (x, y) => {
      const { grid, buildMode, money } = get()
      if (!buildMode || buildMode === 'demolish') return
      const tile = grid[y]?.[x]
      if (!tile) return
      if (tile.terrain === 'water' || tile.terrain === 'trees') return
      if (tile.structure) return

      const cost = BUILD_COSTS[buildMode]
      if (money < cost) return

      const newGrid = grid.map((row) => row.map((t) => ({ ...t })))
      newGrid[y][x] = {
        ...newGrid[y][x],
        structure: { type: buildMode, level: 1 },
      }

      set({ grid: newGrid, money: money - cost })
    },

    demolishStructure: (x, y) => {
      const { grid } = get()
      const tile = grid[y]?.[x]
      if (!tile?.structure) return
      if (tile.occupant) return
      if (tile.structure.type === 'entrance') return

      const refund = Math.floor(BUILD_COSTS[tile.structure.type] * 0.5)
      const newGrid = grid.map((row) => row.map((t) => ({ ...t })))
      newGrid[y][x] = {
        ...newGrid[y][x],
        structure: undefined,
      }

      set((state) => ({ grid: newGrid, money: state.money + refund }))
    },

    setSpeed: (speed) => set({ speed, isRunning: speed > 0 }),

    setPrice: (plotType, price) =>
      set((state) => ({
        pricing: {
          ...state.pricing,
          [plotType]: Math.max(5, Math.min(200, price)),
        },
      })),

    advanceHour: () =>
      set((state) => {
        const newHour = (state.hour + 1) % 24
        const newDay = newHour === 0 ? state.day + 1 : state.day
        let newSeason = state.season
        if (newDay !== state.day) {
          const dayInYear = newDay % 120
          if (dayInYear < 30) newSeason = 'spring'
          else if (dayInYear < 60) newSeason = 'summer'
          else if (dayInYear < 90) newSeason = 'fall'
          else newSeason = 'winter'
        }
        return { hour: newHour, day: newDay, season: newSeason }
      }),

    setWeather: (weather) => set({ weather }),
    setSeason: (season) => set({ season }),

    addTourist: (tourist) =>
      set((state) => ({ tourists: [...state.tourists, tourist] })),

    updateTourist: (id, updates) =>
      set((state) => ({
        tourists: state.tourists.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        ),
      })),

    removeTourist: (id) =>
      set((state) => ({
        tourists: state.tourists.filter((t) => t.id !== id),
      })),

    assignPlot: (touristId, x, y) =>
      set((state) => {
        const newGrid = state.grid.map((row) => row.map((t) => ({ ...t })))
        newGrid[y][x] = { ...newGrid[y][x], occupant: touristId }
        return {
          grid: newGrid,
          tourists: state.tourists.map((t) =>
            t.id === touristId
              ? { ...t, assignedPlot: { x, y }, status: 'staying' as const }
              : t
          ),
        }
      }),

    vacatePlot: (x, y) =>
      set((state) => {
        const newGrid = state.grid.map((row) => row.map((t) => ({ ...t })))
        newGrid[y][x] = { ...newGrid[y][x], occupant: undefined }
        return { grid: newGrid }
      }),

    addReview: (review) =>
      set((state) => ({ reviews: [review, ...state.reviews] })),

    addLog: (entry) =>
      set((state) => ({
        log: [{ ...entry, id: crypto.randomUUID() }, ...state.log].slice(
          0,
          100
        ),
      })),

    addChatter: (msg) =>
      set((state) => ({
        chatter: [{ ...msg, id: crypto.randomUUID() }, ...state.chatter].slice(
          0,
          100
        ),
      })),

    addMoney: (amount) =>
      set((state) => ({
        money: Math.round((state.money + amount) * 100) / 100,
      })),

    setReputation: (rep) =>
      set({ reputation: Math.max(0, Math.min(100, Math.round(rep))) }),

    resetGame: () => set(createInitialState()),
  }))
)

export function extractGameState(s: GameState & GameActions): GameState {
  return {
    grid: s.grid,
    gridWidth: s.gridWidth,
    gridHeight: s.gridHeight,
    tourists: s.tourists,
    reviews: s.reviews,
    log: s.log,
    chatter: s.chatter,
    day: s.day,
    hour: s.hour,
    money: s.money,
    reputation: s.reputation,
    weather: s.weather,
    season: s.season,
    pricing: s.pricing,
    speed: s.speed,
    buildMode: null,
    selectedTile: null,
    isRunning: s.speed > 0,
  }
}

let autosaveTimer: ReturnType<typeof setTimeout> | null = null

useGameStore.subscribe(
  (state) => ({
    grid: state.grid,
    day: state.day,
    hour: state.hour,
    money: state.money,
    reputation: state.reputation,
    tourists: state.tourists,
    reviews: state.reviews,
    log: state.log,
    chatter: state.chatter,
    weather: state.weather,
    season: state.season,
    pricing: state.pricing,
    speed: state.speed,
  }),
  () => {
    if (autosaveTimer) return
    autosaveTimer = setTimeout(() => {
      autosaveTimer = null
      const state = useGameStore.getState()
      saveGame(extractGameState(state)).catch(() => {})
    }, 2000)
  },
  { equalityFn: Object.is }
)

useGameStore.subscribe(
  (state) => state.speed,
  (speed) => {
    localStorage.setItem('campground-speed', String(speed))
  }
)

window.addEventListener('beforeunload', () => {
  if (autosaveTimer) clearTimeout(autosaveTimer)
  const state = useGameStore.getState()
  if (state.day > 1 || state.hour > 6 || state.money !== STARTING_MONEY) {
    saveGame(extractGameState(state)).catch(() => {})
  }
})

export async function loadSavedGame(): Promise<boolean> {
  const saved = await loadGame()
  if (saved) {
    const lsSpeed = localStorage.getItem('campground-speed')
    const speed: Speed =
      lsSpeed != null && [0, 1, 2, 5].includes(Number(lsSpeed))
        ? (Number(lsSpeed) as Speed)
        : (saved.speed ?? 0)
    useGameStore.setState({
      ...saved,
      speed,
      isRunning: speed > 0,
      log: saved.log ?? [],
      chatter: saved.chatter ?? [],
      reviews: saved.reviews ?? [],
      tourists: saved.tourists ?? [],
    })
    return true
  }
  return false
}
