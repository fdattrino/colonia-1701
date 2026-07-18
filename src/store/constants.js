export const PLOT_TYPES = ['tent-small', 'tent-large', 'campervan', 'rv-hookup']

export const FACILITY_TYPES = [
  'restroom',
  'shower',
  'fire-pit',
  'picnic',
  'store',
  'playground',
  'lake-access',
  'trail-head',
]

export const BUILD_COSTS = {
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

export const MAINTENANCE_COSTS = {
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

export const DEFAULT_PRICING = {
  'tent-small': 15,
  'tent-large': 25,
  campervan: 35,
  'rv-hookup': 50,
}

export const STRUCTURE_LABELS = {
  'tent-small': 'Baracca di legno',
  'tent-large': 'Capanna del pioniere',
  campervan: 'Casa in legno',
  'rv-hookup': 'Casa in pietra',
  restroom: 'Pozzo',
  shower: 'Bagno pubblico',
  'fire-pit': 'Focolare comune',
  picnic: 'Area mercato',
  store: 'Emporio',
  playground: 'Piazza del villaggio',
  'lake-access': 'Accesso al fiume',
  'trail-head': 'Imbocco della strada',
  entrance: 'Porta della colonia',
}

export function isPlotType(type) {
  return PLOT_TYPES.includes(type)
}

export function isFacilityType(type) {
  return FACILITY_TYPES.includes(type)
}
