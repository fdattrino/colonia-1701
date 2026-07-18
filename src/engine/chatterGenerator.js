import { useGameStore } from '../store/gameStore'

const FALLBACK_LINES = {
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

function pickMood(satisfaction, weather) {
  const moods = []

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

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const WEATHER_SPECIFIC_LINES = {
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

export function generateChatter(tourist, replyTarget) {
  const weather = useGameStore.getState().weather
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
