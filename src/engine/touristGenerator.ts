import { useGameStore } from '../store/gameStore'
import type {
  TouristGroup,
  Season,
  Weather,
  PlotType,
  Personality,
  Preference,
  Review,
} from '../store/types'

const FIRST_NAMES = [
  'Sarah',
  'Marcus',
  'Emma',
  'Jake',
  'Priya',
  'Carlos',
  'Yuki',
  'Liam',
  'Fatima',
  'David',
  'Sofia',
  'Noah',
  'Ava',
  'Raj',
  'Mia',
  'Owen',
  'Zara',
  'Tomás',
  'Ingrid',
  'Kenji',
  'Amara',
  'Leo',
  'Noor',
  'Finn',
  'Rosa',
  'Dmitri',
  'Aisha',
  'Mateo',
  'Hana',
  'Soren',
  'Leila',
  'Ezra',
]

const LAST_NAMES = [
  'Chen',
  'Rivera',
  'Thompson',
  'Patel',
  'Diaz',
  'Tanaka',
  'Hassan',
  'Kim',
  'Rossi',
  'Williams',
  'Johansson',
  'Sharma',
  'Jackson',
  'Fletcher',
  'Nakamura',
  'Okafor',
  'Lindgren',
  'Moreau',
  'Reyes',
  'Volkov',
  'Park',
  'Dubois',
  'Santos',
  'Andersen',
  'Kowalski',
  'Nguyen',
  'Larsson',
  'Ortiz',
]

function pickUniqueName(usedNames: Set<string>): string {
  for (let attempt = 0; attempt < 20; attempt++) {
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
    const full = `${first} ${last}`
    if (!usedNames.has(full)) return full
  }
  const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]
  const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
  return `${first} ${last}`
}

function getExistingNames(): string[] {
  return useGameStore
    .getState()
    .tourists.filter((t) => t.status === 'staying' || t.status === 'arriving')
    .map((t) => t.name)
}

const COMPOSITIONS_BASE = [
  'solo hiker',
  'solo photographer',
  'couple in their 20s',
  'couple in their 30s',
  'couple in their 50s',
  'retired couple',
  'couple with a baby',
  'couple with a dog',
  'father and son duo',
  'mother and daughter duo',
  'group of 3 friends',
  'group of 4 college friends',
  'two brothers on a road trip',
  'grandparents with a grandchild',
]

const FAMILY_COMPOSITIONS = [
  'family with a toddler',
  'family with a 5-year-old',
  'family with 2 young kids',
  'family with 2 teenagers',
  'family with 3 kids under 10',
  'family with a baby and a 4-year-old',
  'family with a 7-year-old and a 12-year-old',
  'family with a teen and a dog',
  'single mom with 2 kids',
  'single dad with a daughter',
  'large family with 4 kids',
  'family with twin toddlers',
]

function pickComposition(personality: string): string {
  if (personality === 'family-focused') {
    return FAMILY_COMPOSITIONS[
      Math.floor(Math.random() * FAMILY_COMPOSITIONS.length)
    ]
  }
  return COMPOSITIONS_BASE[Math.floor(Math.random() * COMPOSITIONS_BASE.length)]
}

const PERSONALITIES: Personality[] = [
  'quiet-nature-lover',
  'social-party',
  'budget-backpacker',
  'comfort-glamper',
  'adventure-seeker',
  'family-focused',
]

const PREFERENCE_SETS: Preference[][] = [
  ['near-water', 'quiet', 'shade'],
  ['social', 'near-facilities', 'electricity'],
  ['quiet', 'trail-access', 'shade'],
  ['electricity', 'near-facilities', 'playground'],
  ['trail-access', 'near-water', 'quiet'],
  ['playground', 'near-facilities', 'social'],
]

export function generateTourist(
  day: number,
  season: Season,
  weather: Weather,
  reputation: number
): Omit<TouristGroup, 'id'> {
  const usedNames = new Set(getExistingNames())
  const name = pickUniqueName(usedNames)

  let personality: Personality
  const roll = Math.random()
  if (season === 'summer') {
    personality =
      roll < 0.4
        ? 'family-focused'
        : roll < 0.6
          ? 'social-party'
          : PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)]
  } else if (season === 'fall') {
    personality =
      roll < 0.4
        ? 'quiet-nature-lover'
        : roll < 0.6
          ? 'adventure-seeker'
          : PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)]
  } else if (season === 'winter') {
    personality =
      roll < 0.3
        ? 'adventure-seeker'
        : roll < 0.6
          ? 'budget-backpacker'
          : PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)]
  } else {
    personality =
      PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)]
  }

  const composition = pickComposition(personality)
  const budget = Math.floor(20 + Math.random() * 180)
  const preferences =
    PREFERENCE_SETS[Math.floor(Math.random() * PREFERENCE_SETS.length)]
  const tripDuration = Math.floor(1 + Math.random() * 7)

  return {
    name,
    composition,
    personality,
    budget,
    preferences,
    tripDuration,
    arrivalDay: day,
    satisfaction: 70,
    status: 'arriving',
  }
}

export function selectPlot(
  tourist: TouristGroup,
  availablePlots: Array<{
    index: number
    type: PlotType
    price: number
    nearFacilities: string[]
    hasNeighbors: boolean
    nearWater: boolean
    x: number
    y: number
  }>
): {
  decision: 'stay' | 'leave'
  plotIndex: number | null
  reasoning: string
} {
  if (availablePlots.length === 0) {
    return {
      decision: 'leave',
      plotIndex: null,
      reasoning: 'No plots available.',
    }
  }

  const affordable = availablePlots.filter((p) => p.price <= tourist.budget)
  if (affordable.length === 0) {
    return {
      decision: 'leave',
      plotIndex: null,
      reasoning: 'Too expensive for my budget.',
    }
  }

  const scored = affordable.map((p) => {
    let score = 0
    if (tourist.preferences.includes('near-water') && p.nearWater) score += 3
    if (tourist.preferences.includes('quiet') && !p.hasNeighbors) score += 2
    if (
      tourist.preferences.includes('near-facilities') &&
      p.nearFacilities.length > 0
    )
      score += 2
    if (tourist.preferences.includes('social') && p.hasNeighbors) score += 2
    score += (tourist.budget - p.price) / tourist.budget
    return { ...p, score }
  })

  scored.sort((a, b) => b.score - a.score)
  const best = scored[0]
  return {
    decision: 'stay',
    plotIndex: best.index,
    reasoning: 'Looks like a good spot!',
  }
}

export function generateReview(
  tourist: TouristGroup,
  plotType: PlotType,
  weather: Weather,
  price: number
): Review {
  const rating =
    tourist.satisfaction >= 80
      ? 5
      : tourist.satisfaction >= 60
        ? 4
        : tourist.satisfaction >= 40
          ? 3
          : tourist.satisfaction >= 20
            ? 2
            : 1
  const texts: Record<number, string[]> = {
    5: [
      'Amazing stay! Everything was perfect.',
      'Loved every minute of it. Will be back!',
    ],
    4: [
      'Really nice campground. Minor things could improve but overall great.',
      'Good experience, nice facilities.',
    ],
    3: [
      'It was okay. Nothing special but got the job done.',
      'Average stay. Some things were nice, others not so much.',
    ],
    2: [
      'Disappointing. Expected better for the price.',
      'Not great. Facilities need work.',
    ],
    1: [
      'Terrible experience. Would not recommend.',
      'Worst campground ever. Never again.',
    ],
  }
  return {
    touristId: tourist.id,
    touristName: tourist.name,
    rating,
    text: texts[rating][Math.floor(Math.random() * texts[rating].length)],
    day: 0,
  }
}
