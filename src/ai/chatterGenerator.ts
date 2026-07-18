import {
  queryOllama,
  parseJsonResponse,
  isOllamaAvailable,
  logFallback,
} from './ollamaClient'
import { chatterPrompt } from './prompts'
import { useGameStore } from '../store/gameStore'
import { isFacilityType, STRUCTURE_LABELS } from '../store/types'
import type { TouristGroup, ChatterMood, Personality } from '../store/types'

const FALLBACK_LINES: Record<Personality, Record<ChatterMood, string[]>> = {
  'quiet-nature-lover': {
    happy: [
      'Listen to those birds...',
      'The lake is so peaceful.',
      'No phone, no email. Perfect.',
      'Saw a deer this morning!',
    ],
    neutral: [
      "It's nice out here. Quiet.",
      'Might read by the water later.',
      'Stars should be great tonight.',
    ],
    annoyed: [
      'Neighbors are so loud...',
      'Turn down the music, please.',
      'Came here for quiet, not a party.',
    ],
    excited: ['Spotted a bald eagle!', 'This sunset is unreal.'],
    tired: ['Long hike. Legs are done.', 'Gonna sleep so well tonight.'],
  },
  'social-party': {
    happy: [
      'Drinks by the fire, neighbor?',
      'Met so many cool people here!',
      'Cards tonight, anyone?',
      "S'mores. Best night ever.",
    ],
    neutral: [
      'Any events tonight?',
      'Need more firewood.',
      'Should invite the next site over.',
    ],
    annoyed: [
      'Dead out here. Where is everyone?',
      'No Wi-Fi? Seriously?',
      "Store closed already? It's 8pm!",
    ],
    excited: [
      "Huge bonfire tonight. You're invited!",
      'Best camping trip ever!',
    ],
    tired: [
      'Last night was wild. Need coffee.',
      "Shouldn't have stayed up till 3am.",
    ],
  },
  'budget-backpacker': {
    happy: [
      'Not bad for the price.',
      'Hot water in the showers! Score.',
      'Free firewood? Steal.',
    ],
    neutral: [
      'It works. Roof over my head.',
      'Ramen again. Classic.',
      'Tent is holding up at least.',
    ],
    annoyed: [
      'Rip-off for what you get.',
      'No restroom nearby? Seriously?',
      'RV people judging my tent.',
    ],
    excited: [
      'Free pancake breakfast?! Where?!',
      "Free trail nearby. Let's go!",
    ],
    tired: [
      'Ground sleeping gets old fast.',
      '15 miles today. Noodles and bed.',
    ],
  },
  'comfort-glamper': {
    happy: [
      'Shower pressure is solid here.',
      'Wine under the stars. Perfect.',
      'Great yoga spot, great view.',
    ],
    neutral: [
      'Rustic. Charming, I guess.',
      'Do they deliver coffee to sites?',
      'Mattress pad was worth it.',
    ],
    annoyed: [
      'Ant in my setup. Unacceptable.',
      'Restrooms need a deep clean.',
      'Fix the noise or I want a refund.',
    ],
    excited: [
      'Espresso machine in the store!',
      'This sunset. So Instagrammable.',
    ],
    tired: ['Need my pillow and eight hours.', 'Nature is exhausting.'],
  },
  'adventure-seeker': {
    happy: [
      '12-mile trail. Incredible.',
      'Caught three fish for dinner!',
      'Rapids upstream are gnarly.',
    ],
    neutral: [
      "Planning tomorrow's route.",
      'Checking gear for the morning.',
      'Decent launchpad for trails.',
    ],
    annoyed: [
      'Trails too easy. Need a challenge.',
      'No mountain biking? Come on.',
      'Rain again. Three days straight.',
    ],
    excited: [
      "Waterfall 2 miles up. Who's in?",
      'Caves nearby! Saw the trail map.',
    ],
    tired: ['Everything hurts. Worth it.', '14-mile day. Sleeping till noon.'],
  },
  'family-focused': {
    happy: [
      'Kids love the playground.',
      "Game night by the fire. That's the stuff.",
      'Little one caught her first fish!',
      "Everyone's off their phones!",
    ],
    neutral: [
      'Gotta find the kids something to do.',
      'Did we pack sunscreen? Always forget.',
      'Kids asleep. Adult time.',
    ],
    annoyed: [
      'Playground equipment looks sketchy.',
      'Too loud for the kids to sleep.',
      'No family activities? Disappointing.',
    ],
    excited: [
      'Kids want to stay another week!',
      'Scavenger hunt for families tomorrow!',
    ],
    tired: [
      'Camping with kids. Send help.',
      'Three kids, one tent. Nobody slept.',
    ],
  },
}

function pickMood(satisfaction: number, weather: string): ChatterMood {
  const moods: ChatterMood[] = []

  if (weather === 'stormy' || weather === 'rainy') {
    // Bad weather biases mood but doesn't lock it
    if (satisfaction >= 70) {
      moods.push('neutral', 'happy', 'annoyed', 'tired')
    } else {
      moods.push('annoyed', 'tired', 'neutral', 'annoyed')
    }
  } else if (satisfaction >= 80) {
    moods.push('happy', 'excited', 'happy', 'neutral')
  } else if (satisfaction >= 50) {
    moods.push('neutral', 'happy', 'tired', 'neutral')
  } else {
    moods.push('annoyed', 'tired', 'neutral', 'annoyed')
  }

  return moods[Math.floor(Math.random() * moods.length)]
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

const WEATHER_SPECIFIC_LINES: Record<string, Record<Personality, string[]>> = {
  rainy: {
    'quiet-nature-lover': [
      'Rain on the tent. So soothing.',
      'Love that forest smell after rain.',
      'Sketching the misty trees.',
    ],
    'social-party': [
      'Board game time! Who has Uno?',
      'Rain day = nap day.',
      'Hot chocolate, anyone?',
    ],
    'budget-backpacker': [
      'Tent is waterproof. Mostly.',
      'Sleeping bag and a book till it stops.',
      'Free shower from the sky.',
    ],
    'comfort-glamper': [
      'Glad I brought the cashmere throw.',
      'Sheet mask time. Rainy day spa.',
      'Cozy vibes. Need a latte though.',
    ],
    'adventure-seeker': [
      'Rain hike! Trails are empty.',
      'Mud run conditions. Perfect.',
      "Rain gear on. Let's go.",
    ],
    'family-focused': [
      'Kids built a blanket fort. Genius.',
      'Story time. Rain makes sound effects.',
      'Playing I Spy under the rain fly.',
    ],
  },
  stormy: {
    'quiet-nature-lover': [
      'Thunder in the mountains. Humbling.',
      'Lightning from the tent. Wow.',
    ],
    'social-party': [
      'Scary movie vibes! That thunder!',
      'All huddled in one tent. Sleepover!',
    ],
    'budget-backpacker': [
      'If my tent survives this, I owe it.',
      'Free entertainment. Socks are soaked.',
    ],
    'comfort-glamper': [
      'Did NOT sign up for this.',
      'Hair products are NOT storm-rated.',
    ],
    'adventure-seeker': [
      'NOW this is camping!',
      'Wind is wild. Tying everything down.',
    ],
    'family-focused': [
      'Shadow puppets till the storm passes.',
      'Kids are terrified-thrilled. Mostly thrilled.',
    ],
  },
}

const ACTIONABLE_PATTERNS =
  /\b(need|where|no |closed|rip-off|broken|fix|missing|dirty|clean|refund|price|expensive|safe|loud|noise|quiet|wifi|wi-fi|restroom|bathroom|shower|playground|store|trail)\b/i

function fallbackChatter(
  tourist: TouristGroup,
  weather: string
): { text: string; mood: ChatterMood; actionable?: boolean } {
  const mood = pickMood(tourist.satisfaction, weather)

  // Use weather-specific lines sometimes for bad weather
  if ((weather === 'rainy' || weather === 'stormy') && Math.random() < 0.5) {
    const weatherLines = WEATHER_SPECIFIC_LINES[weather]?.[tourist.personality]
    if (weatherLines?.length) {
      const text = pick(weatherLines)
      return { text, mood, actionable: ACTIONABLE_PATTERNS.test(text) }
    }
  }

  const lines = FALLBACK_LINES[tourist.personality]?.[mood]
  const text = lines ? pick(lines) : "It's nice out here."
  return { text, mood, actionable: ACTIONABLE_PATTERNS.test(text) }
}

function getNearbyContext(tourist: TouristGroup) {
  const state = useGameStore.getState()
  const { grid, tourists } = state
  if (!tourist.assignedPlot) return { nearbyNames: [], nearbyFacilities: [] }

  const { x, y } = tourist.assignedPlot
  const nearbyNames: string[] = []
  const nearbyFacilities: string[] = []

  for (let dy = -3; dy <= 3; dy++) {
    for (let dx = -3; dx <= 3; dx++) {
      if (dx === 0 && dy === 0) continue
      const tile = grid[y + dy]?.[x + dx]
      if (!tile) continue
      if (tile.occupant) {
        const neighbor = tourists.find((t) => t.id === tile.occupant)
        if (neighbor && neighbor.id !== tourist.id) {
          nearbyNames.push(neighbor.name.split(' ')[0])
        }
      }
      if (tile.structure && isFacilityType(tile.structure.type)) {
        nearbyFacilities.push(STRUCTURE_LABELS[tile.structure.type])
      }
    }
  }

  return {
    nearbyNames: [...new Set(nearbyNames)],
    nearbyFacilities: [...new Set(nearbyFacilities)],
  }
}

export async function generateChatter(
  tourist: TouristGroup,
  replyTarget?: { name: string; text: string }
): Promise<{
  text: string
  mood: ChatterMood
  actionable?: boolean
}> {
  const state = useGameStore.getState()
  const available = await isOllamaAvailable()

  if (!available) {
    logFallback('chatter')
    return fallbackChatter(tourist, state.weather)
  }

  try {
    const { nearbyNames, nearbyFacilities } = getNearbyContext(tourist)

    const recentChatter = getRecentNearbyChatter(tourist)

    const prompt = chatterPrompt(
      tourist.name,
      tourist.personality,
      tourist.composition,
      tourist.satisfaction,
      state.weather,
      state.hour,
      nearbyNames,
      nearbyFacilities,
      recentChatter,
      replyTarget
    )

    const response = await queryOllama(prompt)
    const parsed = parseJsonResponse<{
      text: string
      mood: ChatterMood
      actionable?: boolean
    }>(response)

    if (parsed?.text && parsed?.mood) {
      let text = parsed.text.replace(/^["']|["']$/g, '').trim()
      if (text.length > 100) {
        const cut = text.lastIndexOf(' ', 100)
        text =
          text.slice(0, cut > 60 ? cut : 100).replace(/[.,!?;:\s]+$/, '') + '…'
      }
      return {
        text,
        mood: parsed.mood,
        actionable: parsed.actionable === true,
      }
    }

    logFallback('chatter — bad AI response')
    return fallbackChatter(tourist, state.weather)
  } catch {
    logFallback('chatter — AI error')
    return fallbackChatter(tourist, state.weather)
  }
}

function getRecentNearbyChatter(
  tourist: TouristGroup
): Array<{ name: string; text: string }> {
  const state = useGameStore.getState()
  const { nearbyNames } = getNearbyContext(tourist)
  const nearbyFirstNames = new Set(nearbyNames)
  nearbyFirstNames.add(tourist.name.split(' ')[0])

  return state.chatter
    .filter((msg) => {
      const firstName = msg.touristName.split(' ')[0]
      return nearbyFirstNames.has(firstName) && msg.touristId !== tourist.id
    })
    .slice(0, 5)
    .map((msg) => ({
      name: msg.touristName.split(' ')[0],
      text: msg.text,
    }))
}
