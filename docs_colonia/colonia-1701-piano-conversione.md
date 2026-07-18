# Colonia 1701 — Piano di conversione (da Campground Tycoon)

Progetto di partenza: `week-9-game` ("Campground Tycoon", React 19 + TS + Vite +
Tailwind + Zustand + Dexie/IndexedDB + Ollama). Obiettivo: stesso motore di
gioco, nuovo tema (colonia storica stile 1701), stack finale JS + React +
react-bootstrap + Express/Morgan + SQLite, **senza IA**.

La meccanica del gioco resta identica — cambia solo il "vestito" (nomi,
etichette, sprite/emoji). Questo è importante: non serve riscrivere la logica,
solo rinominare i concetti e i dati che li descrivono.

## 1. Mappatura terminologica

### Concetto generale
| Originale | Nuovo (Colonia 1701) |
|---|---|
| Campground Tycoon | Colonia 1701 |
| Campground (il campeggio) | Colonia / Insediamento |
| Money | Tesoro della colonia (monete d'oro) |
| Reputation | Prestigio della colonia |
| Tourists | Coloni (in arrivo via nave) |
| Reviews | Lettere dei coloni (in patria) |
| Chatter | Chiacchiere in piazza |

### Piazzole abitative — `PlotType` (scelte in base al budget del colono)
| Originale | Nuovo | Costo | Manutenzione |
|---|---|---|---|
| tent-small | Baracca di legno | 200 | 2 |
| tent-large | Capanna del pioniere | 400 | 3 |
| campervan | Casa in legno | 600 | 4 |
| rv-hookup | Casa in pietra | 1000 | 5 |

*(progressione naturale: più il colono è benestante, più chiede un'abitazione
solida — coerente con la logica esistente di budget/preferenze)*

### Strutture di servizio — `FacilityType`
| Originale | Nuovo |
|---|---|
| restroom | Pozzo |
| shower | Bagno pubblico |
| fire-pit | Focolare comune |
| picnic | Area mercato |
| store | Magazzino/Emporio |
| playground | Piazza del villaggio |
| lake-access | Accesso al fiume |
| trail-head | Imbocco della strada |
| entrance | Porta della colonia |

### Personalità dei coloni — `Personality`
| Originale | Nuovo |
|---|---|
| quiet-nature-lover | Contadino solitario |
| social-party | Mercante socievole |
| budget-backpacker | Pioniere squattrinato |
| comfort-glamper | Nobile in cerca di comfort |
| adventure-seeker | Esploratore avventuriero |
| family-focused | Capofamiglia |

### Preferenze — `Preference`
| Originale | Nuovo |
|---|---|
| near-water | Vicino al fiume |
| quiet | Zona tranquilla |
| near-facilities | Vicino ai servizi |
| electricity | Vicino al pozzo (sostituisce "elettricità", anacronistica) |
| shade | All'ombra degli alberi |
| social | Vicino alla piazza |
| playground | Vicino alla piazza del villaggio |
| trail-access | Vicino alla strada |

### Meteo e stagioni — invariati nella struttura, cambia solo l'effetto narrativo
`weather` e `season` restano identici nel codice (sunny/cloudy/rainy/stormy/
perfect; spring/summer/fall/winter) — nel 1701 il meteo condiziona i raccolti
e gli arrivi delle navi invece che l'umore dei turisti in campeggio. Nessuna
modifica ai tipi, solo alle label ed eventualmente ai testi generati.

## 2. Rimozione della parte IA (per Chromebook con poca memoria)

Il gioco ha già un fallback a template quando Ollama non è raggiungibile — va
tenuto e reso **l'unico percorso**, eliminando tutto il resto:

**Da eliminare:**
- `src/ai/` (intera cartella: ollamaClient.ts, prompts.ts, chatterGenerator.ts,
  touristGenerator.ts nella parte che chiama Ollama)
- `src/components/ui/DevConsole.tsx` (pannello di debug delle chiamate IA)
- Dipendenza/riferimenti a Ollama in `docs/AI-INTEGRATION.md` (il doc si può
  eliminare o sostituire con una nota "generazione a template")

**Da mantenere e promuovere a logica principale:**
- Le funzioni `fallbackReview()` e equivalenti nei generatori (già presenti,
  già testate) diventano l'unico modo in cui vengono generati coloni,
  chiacchiere e lettere.

## 3. Schema dati per il backend Express + SQLite (Fase 2 del metodo)

Il gioco oggi salva tutto in IndexedDB via Dexie (`src/db/database.ts`), in
un unico "blob" di stato. Passando a Express + SQLite conviene **non
normalizzare tutto**: lo stato di gioco cambia ad ogni tick (ogni ora), quindi
la maggior parte va bene come JSON serializzato in un'unica riga, mentre le
partite salvate come elenco vanno in una tabella separata.

```sql
CREATE TABLE IF NOT EXISTS saves (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,               -- nome del salvataggio, es. "Colonia del 12/3"
  state_json TEXT NOT NULL,         -- l'intero GameState serializzato
  day INTEGER NOT NULL,             -- estratto dal JSON, utile per ordinare/mostrare in lista senza parsare tutto
  money INTEGER NOT NULL,
  reputation INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

API REST derivate (coerenti con Fase 2 del metodo):
- `GET /api/saves` — elenco partite salvate (solo id, name, day, money, reputation, updated_at — non tutto il JSON)
- `POST /api/saves` — crea nuovo salvataggio (invia lo stato intero)
- `GET /api/saves/:id` — carica una partita (stato intero)
- `PUT /api/saves/:id` — aggiorna/sovrascrive un salvataggio esistente (autosave)
- `DELETE /api/saves/:id` — elimina un salvataggio

Questo sostituisce `src/db/database.ts` (Dexie) con un modulo client
`src/api/saves.js` che fa `fetch` verso queste rotte.

## 4. Ordine dei lavori consigliato (riprende le fasi del tuo metodo)

1. **Fase 0** — usare questo documento come mappa; classificare i file di
   `src/ai/` come "da eliminare", il resto come "da riusare/convertire"
2. **Fase 1** — conversione TS → JS di tutti i file (`.tsx`→`.jsx`, rimuovere
   `types.ts`/`vite-env.d.ts`, tenere però le costanti con i nuovi nomi)
3. Applicare la mappatura terminologica (tabelle sopra) su `constants.ts`,
   `types.ts`→ diventato semplici oggetti JS, e le stringhe nei componenti UI
4. Sostituire le classi Tailwind con componenti react-bootstrap (Card, Badge,
   ProgressBar, Button, ecc. al posto dei div stilizzati)
5. **Fase 2-3** — creare il backend Express + SQLite con lo schema sopra
6. **Fase 4** — sostituire `src/db/database.ts` con il modulo client verso le
   nuove API, rimuovendo Dexie da `package.json`
7. **Fase 5** — rifiniture (titolo pagina, eventuali sprite/immagini da
   ridisegnare per il nuovo tema se si vuole spingersi oltre il testo)

## Note per l'uso in classe

- La conversione tema (tabelle sopra) è un ottimo esercizio "a basso rischio"
  da far fare agli studenti per primo: sono trova-e-sostituisci su stringhe,
  fanno capire dove vive ogni informazione nel codice senza rompere la logica.
- La rimozione dell'IA riduce sensibilmente il peso del progetto (niente
  Ollama, niente modello locale da scaricare) — adatto a Chromebook.
- Il passaggio Dexie → Express/SQLite è il pezzo più "vero" del tuo metodo
  di conversione e vale la pena farlo con calma, testando con curl prima di
  toccare l'interfaccia (Fase 3 del metodo).
