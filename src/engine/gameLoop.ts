import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import {
  generateTourist,
  selectPlot,
  generateReview,
} from './touristGenerator'
import { generateChatter } from './chatterGenerator'
import { calculateSatisfactionDelta } from './satisfactionCalc'
import { rollWeather } from './weatherSystem'
import {
  TICK_INTERVALS,
  SEASON_DEMAND_MULTIPLIER,
  ARRIVAL_HOURS,
} from '../utils/constants'
import {
  isPlotType,
  isFacilityType,
  MAINTENANCE_COSTS,
  STRUCTURE_LABELS,
} from '../store/types'
import type { Tile, PlotType } from '../store/types'

function getAvailablePlots(grid: Tile[][]): Array<{
  index: number
  type: PlotType
  x: number
  y: number
  nearFacilities: string[]
  hasNeighbors: boolean
  nearWater: boolean
  price: number
}> {
  const pricing = useGameStore.getState().pricing
  const plots: ReturnType<typeof getAvailablePlots> = []
  let idx = 0

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const tile = grid[y][x]
      if (tile.structure && isPlotType(tile.structure.type) && !tile.occupant) {
        const nearFacilities: string[] = []
        let hasNeighbors = false
        let nearWater = false

        for (let dy = -3; dy <= 3; dy++) {
          for (let dx = -3; dx <= 3; dx++) {
            const nt = grid[y + dy]?.[x + dx]
            if (!nt || (dx === 0 && dy === 0)) continue
            if (nt.structure && isFacilityType(nt.structure.type)) {
              nearFacilities.push(STRUCTURE_LABELS[nt.structure.type])
            }
            if (nt.occupant) hasNeighbors = true
            if (nt.terrain === 'water') nearWater = true
          }
        }

        plots.push({
          index: idx,
          type: tile.structure.type as PlotType,
          x,
          y,
          nearFacilities: [...new Set(nearFacilities)],
          hasNeighbors,
          nearWater,
          price: pricing[tile.structure.type as PlotType],
        })
        idx++
      }
    }
  }
  return plots
}

async function handleArrival() {
  const state = useGameStore.getState()
  const { day, season, weather, reputation, grid } = state
  const demandMul = SEASON_DEMAND_MULTIPLIER[season]
  const repBonus = reputation / 100

  const baseArrivals = 1 + Math.random() * 2
  const numArrivals = Math.max(
    0,
    Math.round(baseArrivals * demandMul * (0.5 + repBonus))
  )

  for (let i = 0; i < numArrivals; i++) {
    const touristData = await generateTourist(day, season, weather, reputation)
    const tourist = { ...touristData, id: crypto.randomUUID() }

    useGameStore.getState().addTourist(tourist)
    useGameStore.getState().addLog({
      day,
      hour: state.hour,
      type: 'arrival',
      message: `${tourist.name} (${tourist.composition}) is looking for a spot`,
    })

    const availablePlots = getAvailablePlots(useGameStore.getState().grid)
    const decision = await selectPlot(tourist, availablePlots)

    if (decision.decision === 'stay' && decision.plotIndex !== null) {
      const plot = availablePlots[decision.plotIndex]
      if (plot) {
        useGameStore.getState().assignPlot(tourist.id, plot.x, plot.y)
        useGameStore.getState().addMoney(state.pricing[plot.type])
        useGameStore.getState().addLog({
          day,
          hour: state.hour,
          type: 'arrival',
          message: `${tourist.name} chose ${STRUCTURE_LABELS[plot.type]} — "${decision.reasoning}"`,
        })
      }
    } else {
      useGameStore.getState().updateTourist(tourist.id, { status: 'left' })
      useGameStore.getState().addLog({
        day,
        hour: state.hour,
        type: 'departure',
        message: `${tourist.name} left without booking — "${decision.reasoning}"`,
      })
    }
  }
}

async function handleDepartures() {
  const state = useGameStore.getState()
  const { day, tourists, weather, pricing, grid } = state

  const departing = tourists.filter(
    (t) => t.status === 'staying' && day - t.arrivalDay >= t.tripDuration
  )

  for (const tourist of departing) {
    if (!tourist.assignedPlot) continue

    const tile = grid[tourist.assignedPlot.y]?.[tourist.assignedPlot.x]
    const plotType = tile?.structure?.type as PlotType | undefined

    useGameStore.getState().updateTourist(tourist.id, { status: 'departing' })

    const review = await generateReview(
      tourist,
      plotType || 'tent-small',
      weather,
      plotType ? pricing[plotType] : 15
    )
    review.day = day

    useGameStore.getState().addReview(review)
    useGameStore
      .getState()
      .vacatePlot(tourist.assignedPlot.x, tourist.assignedPlot.y)
    useGameStore.getState().updateTourist(tourist.id, { status: 'left' })

    useGameStore.getState().addLog({
      day,
      hour: state.hour,
      type: 'review',
      message: `${tourist.name} left a ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)} review: "${review.text}"`,
    })

    // Update reputation based on reviews
    const allReviews = useGameStore.getState().reviews
    if (allReviews.length > 0) {
      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      const newRep = Math.round(avgRating * 20)
      useGameStore.getState().setReputation(newRep)
    }
  }

  // Clean up left tourists (keep last 20 for history)
  const currentTourists = useGameStore.getState().tourists
  const active = currentTourists.filter((t) => t.status !== 'left')
  const left = currentTourists.filter((t) => t.status === 'left').slice(0, 20)
  if (currentTourists.length > active.length + 20) {
    // Just let them accumulate up to a point, the store handles it
  }
}

function handleSatisfaction() {
  const state = useGameStore.getState()
  const stayingTourists = state.tourists.filter((t) => t.status === 'staying')

  for (const tourist of stayingTourists) {
    if (!tourist.assignedPlot) continue

    const tile = state.grid[tourist.assignedPlot.y]?.[tourist.assignedPlot.x]
    const plotType = tile?.structure?.type as PlotType | undefined
    const price = plotType ? state.pricing[plotType] : 15

    const delta = calculateSatisfactionDelta(
      tourist,
      state.grid,
      state.weather,
      price
    )
    const newSat = Math.max(0, Math.min(100, tourist.satisfaction + delta))

    useGameStore.getState().updateTourist(tourist.id, { satisfaction: newSat })
  }
}

function handleMaintenance() {
  const state = useGameStore.getState()
  let totalMaintenance = 0

  for (const row of state.grid) {
    for (const tile of row) {
      if (tile.structure) {
        totalMaintenance += MAINTENANCE_COSTS[tile.structure.type]
      }
    }
  }

  if (totalMaintenance > 0) {
    useGameStore.getState().addMoney(-totalMaintenance)
    useGameStore.getState().addLog({
      day: state.day,
      hour: state.hour,
      type: 'system',
      message: `Daily maintenance: -$${totalMaintenance}`,
    })
  }
}

function handleNightlyRevenue() {
  const state = useGameStore.getState()
  let revenue = 0

  for (const tourist of state.tourists) {
    if (tourist.status === 'staying' && tourist.assignedPlot) {
      const tile = state.grid[tourist.assignedPlot.y]?.[tourist.assignedPlot.x]
      const plotType = tile?.structure?.type as PlotType | undefined
      if (plotType) {
        revenue += state.pricing[plotType]
      }
    }
  }

  if (revenue > 0) {
    useGameStore.getState().addMoney(revenue)
    useGameStore.getState().addLog({
      day: state.day,
      hour: state.hour,
      type: 'system',
      message: `Nightly revenue: +$${revenue}`,
    })
  }
}

let chatterProcessing = false

async function handleChatter() {
  const state = useGameStore.getState()
  const staying = state.tourists.filter((t) => t.status === 'staying')
  if (staying.length === 0) return

  const soloCount = Math.min(staying.length, 1 + Math.floor(staying.length / 3))
  const shuffled = [...staying].sort(() => Math.random() - 0.5)
  const soloSpeakers = shuffled.slice(0, soloCount)
  const usedIds = new Set(soloSpeakers.map((t) => t.id))

  for (const tourist of soloSpeakers) {
    const result = await generateChatter(tourist)
    useGameStore.getState().addChatter({
      touristId: tourist.id,
      touristName: tourist.name,
      personality: tourist.personality,
      mood: result.mood,
      text: result.text,
      day: useGameStore.getState().day,
      hour: useGameStore.getState().hour,
      actionable: result.actionable,
    })
  }

  // Conversation pairs: pick guests who can reply to recent nearby chatter
  const recentChatter = useGameStore.getState().chatter.slice(0, 10)
  const conversationCandidates = staying.filter((t) => {
    if (usedIds.has(t.id)) return false
    if (!t.assignedPlot) return false
    return true
  })

  const maxConversations = Math.min(
    2,
    Math.floor(conversationCandidates.length / 2)
  )
  let conversationsStarted = 0

  for (const candidate of conversationCandidates) {
    if (conversationsStarted >= maxConversations) break

    const nearbyMsg = recentChatter.find((msg) => {
      if (msg.touristId === candidate.id) return false
      const speaker = staying.find((t) => t.id === msg.touristId)
      if (!speaker?.assignedPlot || !candidate.assignedPlot) return false
      const dx = Math.abs(speaker.assignedPlot.x - candidate.assignedPlot!.x)
      const dy = Math.abs(speaker.assignedPlot.y - candidate.assignedPlot!.y)
      return dx <= 3 && dy <= 3
    })

    if (!nearbyMsg) continue

    const replyTarget = {
      name: nearbyMsg.touristName.split(' ')[0],
      text: nearbyMsg.text,
    }
    const result = await generateChatter(candidate, replyTarget)

    useGameStore.getState().addChatter({
      touristId: candidate.id,
      touristName: candidate.name,
      personality: candidate.personality,
      mood: result.mood,
      text: result.text,
      day: useGameStore.getState().day,
      hour: useGameStore.getState().hour,
      actionable: result.actionable,
      replyTo: replyTarget,
    })

    usedIds.add(candidate.id)
    conversationsStarted++
  }
}

let aiProcessing = false

function processTick() {
  const state = useGameStore.getState()
  const { hour, day } = state

  useGameStore.getState().advanceHour()
  const newHour = useGameStore.getState().hour
  const newDay = useGameStore.getState().day

  // New day started
  if (newDay > day) {
    const newWeather = rollWeather(useGameStore.getState().season)
    useGameStore.getState().setWeather(newWeather)
    useGameStore.getState().addLog({
      day: newDay,
      hour: 0,
      type: 'weather',
      message: `Day ${newDay} begins. Weather: ${newWeather}`,
    })
  }

  // Morning: arrivals (non-blocking)
  if (ARRIVAL_HOURS.includes(newHour) && !aiProcessing) {
    aiProcessing = true
    handleArrival().finally(() => {
      aiProcessing = false
    })
  }

  // Mid-morning: departures (non-blocking)
  if (newHour === 10 && !aiProcessing) {
    aiProcessing = true
    handleDepartures().finally(() => {
      aiProcessing = false
    })
  }

  // Satisfaction updates every 6 hours
  if (newHour % 6 === 0) {
    handleSatisfaction()
  }

  // Guest chatter every hour during daytime (non-blocking)
  if (newHour >= 7 && newHour <= 22 && !chatterProcessing) {
    chatterProcessing = true
    handleChatter().finally(() => {
      chatterProcessing = false
    })
  }

  // End of day: maintenance costs, revenue
  if (newHour === 22) {
    handleNightlyRevenue()
  }
  if (newHour === 23) {
    handleMaintenance()
  }
}

export function useGameLoop() {
  const speed = useGameStore((s) => s.speed)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (speed > 0) {
      const ms = TICK_INTERVALS[speed]
      intervalRef.current = setInterval(processTick, ms)
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [speed])
}
