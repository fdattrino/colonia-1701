import type { Weather, Season } from '../store/types'

const WEATHER_WEIGHTS: Record<Season, Record<Weather, number>> = {
  spring: { sunny: 25, cloudy: 30, rainy: 25, stormy: 10, perfect: 10 },
  summer: { sunny: 35, cloudy: 15, rainy: 10, stormy: 5, perfect: 35 },
  fall: { sunny: 15, cloudy: 35, rainy: 25, stormy: 15, perfect: 10 },
  winter: { sunny: 10, cloudy: 30, rainy: 20, stormy: 25, perfect: 15 },
}

export function rollWeather(season: Season): Weather {
  const weights = WEATHER_WEIGHTS[season]
  const total = Object.values(weights).reduce((a, b) => a + b, 0)
  let roll = Math.random() * total

  for (const [weather, weight] of Object.entries(weights)) {
    roll -= weight
    if (roll <= 0) return weather as Weather
  }

  return 'sunny'
}
