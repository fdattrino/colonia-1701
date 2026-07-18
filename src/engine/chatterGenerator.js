import { useGameStore } from '../store/gameStore'

const FALLBACK_LINES = {
  'quiet-nature-lover': {
    happy: [
      'Ascolta gli uccelli del bosco...',
      'Il fiume è così tranquillo.',
      'Niente mercati, niente clamore. Perfetto.',
      'Ho visto un cervo stamattina!',
    ],
    neutral: [
      'Si sta bene quaggiù. In pace.',
      'Più tardi vado a leggere in riva al fiume.',
      'Stanotte le stelle saranno splendide.',
    ],
    annoyed: [
      'I vicini fanno troppo chiasso...',
      'Basta con quei canti, per carità.',
      'Sono venuto per la pace, non per la sagra.',
    ],
    excited: ["Ho avvistato un'aquila!", 'Questo tramonto è un dono del cielo.'],
    tired: [
      'Giornata lunga nei campi. Sono distrutto.',
      'Stanotte dormirò come un sasso.',
    ],
  },
  'social-party': {
    happy: [
      'Un bicchiere al focolare, vicino?',
      'Ho conosciuto tanta brava gente qui!',
      'Una partita a carte stasera?',
      'Castagne sul fuoco. Che serata.',
    ],
    neutral: [
      "C'è qualche festa stasera?",
      'Serve altra legna per il fuoco.',
      'Dovrei invitare i vicini di capanna.',
    ],
    annoyed: [
      'Che mortorio. Dove sono tutti?',
      'Niente taverna? Sul serio?',
      "L'emporio chiude già al tramonto?",
    ],
    excited: [
      'Gran falò stasera. Siete tutti invitati!',
      'La miglior traversata della mia vita!',
    ],
    tired: [
      'Ieri sera abbiamo fatto tardi. Serve una tisana.',
      "Non dovevo restare alzato fino all'alba.",
    ],
  },
  'budget-backpacker': {
    happy: [
      'Niente male per il prezzo.',
      'Acqua fresca al pozzo! Che fortuna.',
      'Legna gratis? Affare fatto.',
    ],
    neutral: [
      'Funziona. Un tetto sulla testa.',
      'Zuppa di nuovo. Un classico.',
      'La baracca regge, almeno.',
    ],
    annoyed: [
      'Un furto per quello che offrono.',
      'Nessun pozzo qui vicino? Sul serio?',
      'Quelli delle case in pietra guardano male la mia baracca.',
    ],
    excited: [
      'Pane gratis in piazza?! Dove?!',
      'Una strada libera qui vicino. Andiamo!',
    ],
    tired: [
      'Dormire per terra stanca presto.',
      '15 miglia oggi. Zuppa e branda.',
    ],
  },
  'comfort-glamper': {
    happy: [
      'Il bagno pubblico è dignitoso, devo ammettere.',
      'Vino sotto le stelle. Perfetto.',
      'Un ottimo posto per passeggiare, che vista.',
    ],
    neutral: [
      'Rustico. Pittoresco, suppongo.',
      'Portano la colazione agli alloggi?',
      'Il materasso di piume è valso la pena.',
    ],
    annoyed: [
      'Una formica nei miei bagagli. Inaccettabile.',
      'Il bagno pubblico va ripulito a fondo.',
      'Sistemate quel baccano o rivoglio i miei ducati.',
    ],
    excited: [
      "Caffè d'importazione all'emporio!",
      'Questo tramonto. Degno di un quadro.',
    ],
    tired: [
      'Mi servono il mio cuscino e otto ore.',
      'La vita coloniale è sfiancante.',
    ],
  },
  'adventure-seeker': {
    happy: [
      '12 miglia di sentiero. Incredibile.',
      'Ho pescato tre pesci per cena!',
      'Le rapide a monte sono selvagge.',
    ],
    neutral: [
      'Preparo la rotta di domani.',
      "Controllo l'equipaggiamento per l'alba.",
      'Buona base per le esplorazioni.',
    ],
    annoyed: [
      'Sentieri troppo facili. Voglio una sfida.',
      'Niente cavalli da noleggiare? Andiamo.',
      'Pioggia di nuovo. Tre giorni di fila.',
    ],
    excited: [
      'Una cascata a 2 miglia. Chi viene?',
      "Grotte qui vicino! L'ho visto sulla mappa.",
    ],
    tired: [
      'Mi fa male tutto. Ne è valsa la pena.',
      '14 miglia oggi. Dormo fino a mezzogiorno.',
    ],
  },
  'family-focused': {
    happy: [
      'I bambini adorano la piazza del villaggio.',
      'Giochi attorno al focolare. Questa è vita.',
      'La piccola ha pescato il suo primo pesce!',
      'Tutti insieme, finalmente!',
    ],
    neutral: [
      'Devo trovare qualcosa da far fare ai bambini.',
      'Abbiamo preso il cappello di paglia? Lo dimentico sempre.',
      "I bambini dormono. Un po' di pace.",
    ],
    annoyed: [
      'I giochi della piazza sembrano malmessi.',
      'Troppo rumore, i bambini non dormono.',
      'Niente attività per le famiglie? Che delusione.',
    ],
    excited: [
      "I bambini vogliono restare un'altra settimana!",
      'Domani caccia al tesoro per le famiglie!',
    ],
    tired: [
      'Viaggiare coi bambini. Mandate rinforzi.',
      'Tre figli, una capanna. Nessuno ha dormito.',
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
      'La pioggia sul tetto. Che quiete.',
      "L'odore del bosco dopo la pioggia.",
      'Disegno gli alberi nella nebbia.',
    ],
    'social-party': [
      'Tempo di giochi da tavolo! Chi ha i dadi?',
      'Giorno di pioggia, giorno di riposo.',
      'Latte caldo e miele, qualcuno?',
    ],
    'budget-backpacker': [
      "La baracca tiene l'acqua. Più o meno.",
      'Coperta e un libro finché non smette.',
      'Un bagno gratis dal cielo.',
    ],
    'comfort-glamper': [
      'Meno male che ho portato lo scialle di lana.',
      'Giornata di pioggia, giornata di ozio.',
      'Atmosfera raccolta. Ma servirebbe un caffè.',
    ],
    'adventure-seeker': [
      'Camminata sotto la pioggia! Sentieri deserti.',
      'Fango perfetto per allenarsi.',
      'Mantello incerato e si parte.',
    ],
    'family-focused': [
      'I bambini hanno fatto un fortino di coperte. Geniale.',
      'Ora delle storie. La pioggia fa gli effetti sonori.',
      'Giochiamo a indovinelli sotto il tetto.',
    ],
  },
  stormy: {
    'quiet-nature-lover': [
      'Tuoni sulle montagne. Che spettacolo.',
      'I lampi visti dalla capanna. Impressionante.',
    ],
    'social-party': [
      'Che brividi quel tuono!',
      'Tutti stretti in una capanna. Che nottata!',
    ],
    'budget-backpacker': [
      'Se la baracca regge, le devo tutto.',
      'Spettacolo gratis. Calze fradice.',
    ],
    'comfort-glamper': [
      'NON è per questo che ho pagato la traversata.',
      'La mia parrucca non è fatta per le tempeste.',
    ],
    'adventure-seeker': [
      'QUESTA sì che è vita di frontiera!',
      'Vento selvaggio. Lego tutto ben stretto.',
    ],
    'family-focused': [
      'Ombre cinesi finché passa la tempesta.',
      'I bambini sono spaventati e felici. Più felici.',
    ],
  },
}

const ACTIONABLE_PATTERNS =
  /\b(serve|servono|dove|niente|nessun|chiuso|chiude|furto|caro|rott[oa]|malmess|riparat|sistemate|manca|sporc\w*|pulit\w*|ripulit\w*|rimborso|ducati|prezzo|rumore|chiasso|baccano|silenzio|pozzo|bagno|piazza|emporio|magazzino|strada|sentier\w*)\b/i

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
  const text = lines ? pick(lines) : 'Si sta bene quaggiù.'
  return { text, mood, actionable: ACTIONABLE_PATTERNS.test(text) }
}
