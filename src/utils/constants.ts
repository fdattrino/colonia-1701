export const GRID_WIDTH = 16
export const GRID_HEIGHT = 16
export const STARTING_MONEY = 5000
export const STARTING_REPUTATION = 50
export const HOURS_PER_DAY = 24

export const TICK_INTERVALS: Record<number, number> = {
  0: 0,
  1: 1000,
  2: 500,
  5: 200,
}

export const SEASON_LENGTH = 30

export const ARRIVAL_HOURS = [7, 8, 9, 10]
export const EVENT_HOUR = 12
export const EVENING_HOUR = 18
export const DEPARTURE_HOUR = 10
export const REVIEW_HOUR = 22
export const DAY_RESET_HOUR = 0

export const WEATHER_LABELS: Record<string, string> = {
  sunny: '☀️ Sunny',
  cloudy: '⛅ Cloudy',
  rainy: '🌧️ Rainy',
  stormy: '⛈️ Stormy',
  perfect: '🌤️ Perfect',
}

export const SEASON_LABELS: Record<string, string> = {
  spring: '🌱 Spring',
  summer: '☀️ Summer',
  fall: '🍂 Fall',
  winter: '❄️ Winter',
}

export const SEASON_DEMAND_MULTIPLIER: Record<string, number> = {
  spring: 0.7,
  summer: 1.3,
  fall: 0.5,
  winter: 0.3,
}
