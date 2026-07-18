import { useGameStore } from '../store/gameStore'

const FIRST_NAMES = [
  'Giovanni',
  'Maria',
  'Antonio',
  'Lucia',
  'Pietro',
  'Caterina',
  'Francesco',
  'Anna',
  'Giuseppe',
  'Rosa',
  'Marco',
  'Teresa',
  'Domenico',
  'Chiara',
  'Matteo',
  'Bianca',
  'Lorenzo',
  'Elena',
  'Battista',
  'Isabella',
  'Vincenzo',
  'Margherita',
  'Tommaso',
  'Agnese',
  'Cesare',
  'Violante',
  'Filippo',
  'Costanza',
  'Girolamo',
  'Livia',
  'Ottavio',
  'Beatrice',
]

const LAST_NAMES = [
  'Colombo',
  'Ferrari',
  'Esposito',
  'Ricci',
  'Moretti',
  'Barbieri',
  'Fontana',
  'Conti',
  'Greco',
  'Bruno',
  'Gallo',
  'De Luca',
  'Marino',
  'Rizzo',
  'Lombardi',
  'Serra',
  'Vitale',
  'Ferraro',
  'Pellegrini',
  'Sartori',
  'Bellini',
  'Orlando',
  'Baldi',
  'Negri',
  'Farina',
  'Grassi',
  'Leone',
  'Villa',
]

function pickUniqueName(usedNames) {
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

function getExistingNames() {
  return useGameStore
    .getState()
    .tourists.filter((t) => t.status === 'staying' || t.status === 'arriving')
    .map((t) => t.name)
}

const COMPOSITIONS_BASE = [
  'artigiano solo',
  'cacciatore solitario',
  'coppia di giovani sposi',
  'coppia sulla trentina',
  'coppia di mezza età',
  'coppia di anziani contadini',
  'coppia con un neonato',
  'coppia con un cane da pastore',
  'padre e figlio falegnami',
  'madre e figlia tessitrici',
  'gruppo di 3 compagni di viaggio',
  'gruppo di 4 giovani apprendisti',
  'due fratelli in cerca di fortuna',
  'nonni con un nipotino',
]

const FAMILY_COMPOSITIONS = [
  'famiglia con un neonato',
  'famiglia con un bimbo di 5 anni',
  'famiglia con 2 bambini piccoli',
  'famiglia con 2 ragazzi',
  'famiglia con 3 figli sotto i 10 anni',
  'famiglia con un neonato e un bimbo di 4 anni',
  'famiglia con figli di 7 e 12 anni',
  'famiglia con un ragazzo e un cane',
  'madre vedova con 2 figli',
  'padre vedovo con una figlia',
  'famiglia numerosa con 4 figli',
  'famiglia con due gemellini',
]

function pickComposition(personality) {
  if (personality === 'family-focused') {
    return FAMILY_COMPOSITIONS[
      Math.floor(Math.random() * FAMILY_COMPOSITIONS.length)
    ]
  }
  return COMPOSITIONS_BASE[Math.floor(Math.random() * COMPOSITIONS_BASE.length)]
}

const PERSONALITIES = [
  'quiet-nature-lover',
  'social-party',
  'budget-backpacker',
  'comfort-glamper',
  'adventure-seeker',
  'family-focused',
]

const PREFERENCE_SETS = [
  ['near-water', 'quiet', 'shade'],
  ['social', 'near-facilities', 'electricity'],
  ['quiet', 'trail-access', 'shade'],
  ['electricity', 'near-facilities', 'playground'],
  ['trail-access', 'near-water', 'quiet'],
  ['playground', 'near-facilities', 'social'],
]

export function generateTourist(day, season, weather, reputation) {
  const usedNames = new Set(getExistingNames())
  const name = pickUniqueName(usedNames)

  let personality
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

export function selectPlot(tourist, availablePlots) {
  if (availablePlots.length === 0) {
    return {
      decision: 'leave',
      plotIndex: null,
      reasoning: 'Nessun alloggio disponibile.',
    }
  }

  const affordable = availablePlots.filter((p) => p.price <= tourist.budget)
  if (affordable.length === 0) {
    return {
      decision: 'leave',
      plotIndex: null,
      reasoning: 'Troppo caro per la mia borsa.',
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
    reasoning: 'Sembra un buon posto per stabilirsi!',
  }
}

export function generateReview(tourist, plotType, weather, price) {
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
  const texts = {
    5: [
      'Una colonia meravigliosa! Scriverò a tutti in patria di venire.',
      'Ogni giorno qui è stato una benedizione. Ci resterà nel cuore!',
    ],
    4: [
      'Una colonia ben tenuta. Qualcosa da migliorare, ma si vive bene.',
      'Buona esperienza, servizi degni di una vera città.',
    ],
    3: [
      'Né bene né male. Si tira avanti.',
      'Un soggiorno mediocre. Alcune cose buone, altre meno.',
    ],
    2: [
      'Deludente. Mi aspettavo di più per quanto ho pagato.',
      'Poco curata. I servizi lasciano a desiderare.',
    ],
    1: [
      'Un\'esperienza terribile. Sconsiglio a chiunque di sbarcare qui.',
      'La peggior colonia del Nuovo Mondo. Mai più.',
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
