# Architecture

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Build | Vite with `@vitejs/plugin-react` |
| UI | React 19, functional components with hooks |
| Language | TypeScript (strict mode, `noEmit`) |
| Styling | Tailwind CSS 4 with `@tailwindcss/vite` plugin |
| State | Zustand with `subscribeWithSelector` middleware |
| Persistence | Dexie.js (IndexedDB) |
| AI | Ollama REST API (local) |

## State Management

All game state lives in a single Zustand store (`src/store/gameStore.ts`). The store holds the full `GameState` plus action methods.

### GameState Shape

```typescript
interface GameState {
  grid: Tile[][]           // 16×16 tile array
  gridWidth: number
  gridHeight: number
  tourists: TouristGroup[] // all tourists (arriving, staying, left)
  reviews: Review[]        // departure reviews
  log: LogEntry[]          // event log (max 100)
  chatter: ChatterMessage[] // guest chatter (max 100)
  day: number
  hour: number             // 0–23
  money: number
  reputation: number       // 0–100
  weather: Weather
  season: Season
  pricing: Record<PlotType, number>
  speed: Speed             // 0 | 1 | 2 | 5
  buildMode: StructureType | 'demolish' | null
  selectedTile: { x: number; y: number } | null
  isRunning: boolean
}
```

### Actions

The store exposes actions for building/demolishing, speed control, pricing, time advancement, tourist lifecycle (add, update, assign plot, vacate), reviews, logging, chatter, money, reputation, and game reset.

### Subscriptions

Two Zustand subscriptions run outside of React:

1. **Autosave**: Watches persistent state fields. On any change, debounces 2 seconds, then saves to IndexedDB via `saveGame()`. The `extractGameState()` function strips transient UI state (`buildMode` → null, `selectedTile` → null) before saving.

2. **Speed mirror**: Whenever `speed` changes, it's written to `localStorage` under `campground-speed`. This ensures speed survives page refreshes even if the IndexedDB save hasn't flushed yet.

### beforeunload

On page close, any pending autosave timer is cleared and an immediate save is triggered (if the game has progressed past the initial state).

## Persistence

### IndexedDB via Dexie

Database: `CampgroundTycoon`
Table: `saves` with auto-incrementing `id`, indexed by `name` and `savedAt`

- **`saveGame(state, name)`** — upserts a save by name (default: `'autosave'`)
- **`loadGame(name)`** — loads a save by name
- **`clearSave()`** — wipes all saves (used by New Game)

### Save/Load Flow

**Autosave** (continuous):
1. Zustand subscription detects state change
2. 2-second debounce timer starts (resets on subsequent changes)
3. Timer fires → `extractGameState()` → `saveGame()`
4. On `beforeunload` → flush immediately if game has progressed

**Load on startup**:
1. `App.tsx` calls `loadSavedGame()` on mount
2. Loads from IndexedDB `'autosave'` slot
3. Restores `speed` from `localStorage` (preferred) or saved state
4. Merges defaults for arrays that might be missing (`log`, `chatter`, `reviews`, `tourists`)
5. Sets `isRunning` based on restored speed

**Manual save/load**:
- Save button writes to the same `'autosave'` slot
- Load button reads from `'autosave'` and replaces store state
- New Game clears IndexedDB and calls `resetGame()` (with a double-confirm dialog)

## Game Loop

The game loop is a React hook (`useGameLoop`) that sets up a `setInterval` based on the current speed.

### Tick Processing

Each tick calls `processTick()` which:

1. Advances the hour (`advanceHour` action)
2. Checks if a new day started → rolls weather, logs it
3. Runs time-gated handlers:

| Handler | Trigger | Async? |
|---------|---------|--------|
| `handleArrival` | Hours 7–10 | Yes (AI) |
| `handleDepartures` | Hour 10 | Yes (AI) |
| `handleSatisfaction` | Every 6 hours | No |
| `handleChatter` | Hours 7–22 | Yes (AI) |
| `handleNightlyRevenue` | Hour 22 | No |
| `handleMaintenance` | Hour 23 | No |

### Concurrency Guards

Two boolean flags prevent overlapping async operations:

- **`aiProcessing`** — gates arrivals and departures (they share the flag so they don't overlap)
- **`chatterProcessing`** — gates chatter generation separately

If a tick fires while AI is still processing, that tick's async handler is skipped. This prevents pileups at higher speeds.

## Isometric Rendering

The map uses a diamond isometric projection:

```
screenX = (gridX - gridY) × (tileWidth / 2)
screenY = (gridX + gridY) × (tileHeight / 2)
```

Tile dimensions: 64×32 pixels. Tiles are rendered in row-major order with `zIndex = x + y` for correct painter's algorithm depth sorting.

The grid supports:
- **Pan**: click-drag to move the viewport
- **Zoom**: mouse wheel, clamped to 0.5x–3x
- **Tile selection**: click to select (distinguishes drag from click via movement threshold)
- **Build preview**: cursor shows placement validity

All terrain, structures, and tourists are rendered as inline SVG sprites defined in `TileSprites.tsx`.

## Project Organization

```
src/
├── store/     State types and Zustand store
├── engine/    Game loop, satisfaction, weather
├── ai/        Ollama client, prompts, generators
├── db/        IndexedDB persistence
├── components/
│   ├── grid/  Isometric renderer and sprites
│   └── ui/    All UI panels
└── utils/     Constants and grid math
```

Each directory has a single responsibility. The `engine/` runs the simulation, `ai/` handles all Ollama communication with fallbacks, `store/` owns the state, and `components/` renders it.
