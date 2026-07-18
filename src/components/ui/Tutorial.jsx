import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ProgressBar from 'react-bootstrap/ProgressBar'

const STEPS = [
  {
    title: 'Benvenuto a Colonia 1701',
    content: `Sei il governatore di una giovane colonia d'oltremare, nell'anno 1701. Il tuo compito è farla crescere, accogliere i coloni che sbarcano dalle navi e tenerli soddisfatti.

I coloni arrivano da soli. Scelgono un alloggio, si fermano per un po' e poi spediscono una lettera in patria. Il prestigio della colonia dipende dalla loro esperienza.

Vediamo come si gioca.`,
    icon: '⛵',
  },
  {
    title: 'Costruisci gli alloggi',
    content: `Usa il pannello di costruzione a destra per piazzare alloggi e servizi sulla mappa.

Gli **alloggi** sono dove vivono i coloni:
- **Baracca di legno** (🪙 200) — economica, per i pionieri squattrinati
- **Capanna del pioniere** (🪙 400) — adatta alle famiglie
- **Casa in legno** (🪙 600) — per chi è già sistemato
- **Casa in pietra** (🪙 1000) — dimora di pregio, vicina al pozzo

Scegli un tipo di alloggio, poi clicca su una casella di prato per costruirlo. Non si può costruire sul fiume, nel bosco o sulla strada.`,
    icon: '🔨',
  },
  {
    title: 'Aggiungi i servizi',
    content: `Ai coloni importa cosa c'è nei dintorni. I servizi aumentano la soddisfazione:

- **Pozzo** — essenziale. Senza acqua vicina, i coloni si scontentano in fretta
- **Bagno pubblico** — i nobili e le famiglie lo apprezzano molto
- **Focolare comune** — i più socievoli si ritrovano qui
- **Piazza del villaggio** — le famiglie con bambini ne hanno bisogno
- **Imbocco della strada** — contadini ed esploratori vogliono muoversi
- **Emporio** — una comodità che tutti apprezzano
- **Accesso al fiume** — un molo sull'acqua per pescare e lavare

Piazza i servizi vicino agli alloggi. La vicinanza conta: i coloni guardano cosa c'è entro 3 caselle da casa loro.`,
    icon: '⛲',
  },
  {
    title: 'Fissa gli affitti',
    content: `Usa la sezione **Affitti per notte** per regolare il prezzo di ogni tipo di alloggio.

Il prezzo è un equilibrio delicato:
- Troppo alto? I coloni poveri ripartono con la nave
- Troppo basso? Non copri i costi di manutenzione
- Giusto? Alloggi pieni e coloni contenti

Ogni colono ha una borsa. Un pioniere squattrinato può pagare 30 monete a notte. Un nobile anche 150. Guarda chi sbarca e regolati.`,
    icon: '🪙',
  },
  {
    title: 'I coloni',
    content: `Ogni mattina sbarcano nuovi gruppi di coloni. Ognuno è diverso:

- **Contadino solitario** — vuole il fiume, la strada e la pace
- **Mercante socievole** — vuole il focolare e i vicini
- **Pioniere squattrinato** — attento al prezzo, poche pretese
- **Nobile in cerca di comfort** — esige bagno pubblico, pozzo ed emporio
- **Esploratore avventuriero** — vuole strade e accesso al fiume
- **Capofamiglia** — cerca la piazza e un pozzo pulito

I coloni valutano gli alloggi liberi. Se niente rispetta le loro preferenze o la loro borsa, ripartono — e sono monete perse.`,
    icon: '🧑‍🌾',
  },
  {
    title: 'Soddisfazione e lettere',
    content: `I coloni che restano guadagnano o perdono soddisfazione ogni poche ore in base a:

- **Servizi vicini** — il pozzo è irrinunciabile
- **Vicinato** — i solitari odiano la folla, i socievoli la cercano
- **Meteo** — la pioggia abbatte l'umore, le belle giornate lo sollevano
- **Prezzo onesto** — affitti esosi rovinano la soddisfazione

Quando un colono riparte, spedisce una lettera in patria. Le lettere determinano il prestigio della colonia (0–100). Più prestigio significa più navi in arrivo e affitti più alti.`,
    icon: '📜',
  },
  {
    title: 'Stagioni e meteo',
    content: `Il tempo scorre da solo. Ogni 30 giorni cambia la stagione:

- **Estate** — arrivi al massimo. Famiglie ovunque. Alza i prezzi.
- **Autunno** — arrivano i contadini. Più quiete, meno sbarchi.
- **Inverno** — stagione morta. Sconta o perdi monete.
- **Primavera** — le navi ricominciano ad arrivare.

Il meteo cambia ogni giorno. Le tempeste abbattono la soddisfazione, le giornate splendide la sollevano. Il meteo non si comanda, ma con buoni servizi si affronta.`,
    icon: '🌦️',
  },
  {
    title: 'Velocità e salvataggio',
    content: `Usa i pulsanti della velocità in cima al pannello di controllo:

- **Pausa** — ferma il tempo per pianificare e costruire
- **1x** — velocità normale, osserva gli eventi
- **2x** — più veloce, quando tutto fila liscio
- **5x** — avanti tutta nei periodi tranquilli

La partita si salva da sola all'inizio di ogni giornata. Puoi anche salvare e caricare a mano con i pulsanti sotto i controlli di velocità.`,
    icon: '⏩',
  },
  {
    title: 'Consigli per il governatore',
    content: `Qualche cosa da tenere a mente:

1. **Costruisci subito un pozzo** — i coloni non ne fanno a meno
2. **Metti gli alloggi vicino ai servizi** — la vicinanza conta
3. **Tieni le case tranquille lontane dal focolare** — solitari e festaioli non vanno d'accordo
4. **Leggi la cronaca della colonia** — ti dice perché i coloni ripartono
5. **Parti in piccolo** — 3-4 alloggi, vedi cosa funziona, poi allarga
6. **Segui le stagioni** — piazze prima dell'estate, strade prima dell'autunno

Parti con 5.000 monete d'oro. Spendile con giudizio. Ogni alloggio rende ogni notte, ma la manutenzione si accumula.

Buon governo, e prospera la colonia!`,
    icon: '💡',
  },
]

export function Tutorial({ onClose }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <Modal show centered onHide={onClose} backdrop='static'>
      <Modal.Header>
        <Modal.Title className='d-flex align-items-center gap-2 fs-5'>
          <span className='fs-3'>{current.icon}</span>
          {current.title}
        </Modal.Title>
      </Modal.Header>

      <ProgressBar
        now={((step + 1) / STEPS.length) * 100}
        variant='warning'
        style={{ height: '4px' }}
        className='rounded-0'
      />

      <Modal.Body
        className='small overflow-y-auto'
        style={{ maxHeight: '50vh' }}>
        {current.content.split('\n\n').map((paragraph, i) => (
          <p key={i} className='mb-3'>
            {paragraph.split('\n').map((line, j) => {
              const formatted = line.replace(
                /\*\*(.+?)\*\*/g,
                '<strong>$1</strong>'
              )
              return (
                <span key={j}>
                  {j > 0 && <br />}
                  <span dangerouslySetInnerHTML={{ __html: formatted }} />
                </span>
              )
            })}
          </p>
        ))}
      </Modal.Body>

      <Modal.Footer className='justify-content-between'>
        <span className='small text-secondary'>
          {step + 1} di {STEPS.length}
        </span>
        <div className='d-flex gap-2'>
          {step > 0 && (
            <Button variant='secondary' onClick={() => setStep(step - 1)}>
              Indietro
            </Button>
          )}
          {isLast ? (
            <Button variant='warning' onClick={onClose}>
              Inizia a governare
            </Button>
          ) : (
            <Button variant='warning' onClick={() => setStep(step + 1)}>
              Avanti
            </Button>
          )}
          {!isLast && (
            <Button variant='link' className='text-secondary' onClick={onClose}>
              Salta
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  )
}
