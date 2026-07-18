# UI Guide

## Layout

The app fills the full viewport with four regions:

```
┌─────────────────────────────────────────────────────┐
│                      StatsBar                       │
├──────────┬──────────────────────────┬───────────────┤
│          │                          │               │
│  Guest   │    Isometric Grid        │   Control     │
│  Chatter │    + TileInfo overlay    │   Panel       │
│  Sidebar │                          │               │
│          │                          │               │
├──────────┴──────────────────────────┴───────────────┤
│  ◂──── drag handle ────▸                            │
│   EventLog              │  DevConsole               │
└─────────────────────────┴───────────────────────────┘
```

### Resizable Areas

- **Bottom panel**: drag the handle at the top edge to resize vertically (80px to 60% of viewport)
- **Guest Chatter sidebar**: drag the right edge to resize horizontally (180px to 40% of viewport)

## Stats Bar

The top bar shows at-a-glance game state:

- **Day & Hour** — current in-game time
- **Season** — with emoji indicator (Spring, Summer, Fall, Winter)
- **Weather** — with emoji (Sunny, Cloudy, Rainy, Stormy, Perfect)
- **Money** — current balance
- **Reputation** — out of 100
- **Guest count** — staying + arriving
- **Dev Console toggle** — show/hide the AI console
- **Help button** — reopens the tutorial

## Control Panel (Right Sidebar)

Fixed-width panel (224px) stacking several sub-panels:

### Speed Controls

Four buttons: Pause (⏸), 1x (▶), 2x (▶▶), 5x (▶▶▶). The active speed is highlighted.

### Save/Load Panel

- **Save** — writes current state to IndexedDB
- **Load** — restores from last save
- **New Game** — clears all data and starts fresh (requires double-confirmation)

### Build Toolbar

Two sections:

**Plots** — Small Tent ($200), Large Tent ($400), Campervan ($600), RV Hookup ($1,000)

**Facilities** — Restroom ($800), Shower ($600), Fire Pit ($150), Picnic ($100), Store ($2,000), Playground ($1,200), Lake Access ($500), Trail Head ($300)

**Demolish** — enters demolish mode

Buttons show the structure name and cost. Structures you can't afford are disabled. Selecting a structure enters build mode — click tiles on the map to place. Click the same button again (or press Escape) to cancel.

### Pricing Panel

Per-plot-type price controls with +$5 / -$5 buttons. Shows current rate for each of the four plot types. Prices are clamped between $5 and $200.

### Tourist Panel

Lists all staying and arriving guests:
- Name and composition
- Personality badge
- Satisfaction bar (color-coded: green = happy, yellow = okay, red = unhappy)
- Status indicator (arriving, staying)

### Reviews Panel

Shows the latest 10 guest reviews with:
- Tourist name
- Star rating (filled/empty stars)
- Review text
- Day of departure

Hidden when no reviews exist yet.

## Guest Chatter (Left Sidebar)

A scrolling feed of guest messages displayed in compact cards:

- **Tourist name** and personality tag
- **Message text**
- **Mood indicator** (happy, neutral, annoyed, excited, tired)
- **Actionable badge** — highlighted for messages the manager should act on (complaints, requests, suggestions)
- **Reply threads** — replies are visually indented and show who they're responding to

Messages appear in real time during daytime hours (7–22).

## Isometric Grid (Center)

The main game view — a pan-and-zoomable isometric map.

### Interactions

- **Pan**: click and drag to move the camera
- **Zoom**: scroll wheel (0.5x to 3x)
- **Select tile**: click a tile to see its details in the TileInfo overlay
- **Build**: when a structure is selected in the toolbar, click empty buildable tiles to place
- **Demolish**: when in demolish mode, click structures to remove them

### Visual Indicators

- **Selection highlight** — diamond outline on the selected tile
- **Build preview** — cursor changes to show valid/invalid placement
- **Occupied plots** — tent and RV sprites change appearance when a tourist is staying
- **Tourist sprites** — small colored figures on occupied tiles, colored by personality

### Tile Info Overlay

A floating card that appears when a tile is selected, showing:

- Tile coordinates
- Terrain type
- Structure type and label (if any)
- Nightly rate (for plots)
- Occupant details (name, personality, satisfaction, stay duration)

## Event Log (Bottom Left)

A scrolling feed of game events, newest first. The store keeps the latest 100 entries. Event types with visual distinction:

| Type | Examples |
|------|----------|
| Arrival | "Alex Chen (couple) is looking for a spot" |
| Departure | "Alex Chen left without booking" |
| Review | "Maria Lopez left a ★★★★☆ review" |
| Weather | "Day 5 begins. Weather: rainy" |
| System | "Nightly revenue: +$120", "Daily maintenance: -$45" |

## Dev Console (Bottom Right)

The AI debugging console, visible by default. Shows the internal AI request pipeline:

- **Connection status** — green/red indicator, health-checked every 10 seconds
- **Pending requests** — count of queued AI calls
- **Log entries** — requests (with truncated prompt), responses (with timing), errors, fallback events, status changes
- **Expandable entries** — click to see the full prompt and full AI response
- **Filters** — toggle visibility by entry type (request, response, error, status, fallback)

## Tutorial

A multi-step modal shown on first visit (tracked via `localStorage`). Can be reopened from the Help button in the Stats Bar. Walks through:

1. Game concept and goal
2. Building plots and facilities
3. Tourist arrivals and satisfaction
4. Pricing strategy
5. Weather and seasons
6. AI features

## Theme Colors

The UI uses semantic Tailwind tokens defined in `src/index.css`:

| Token | Usage |
|-------|-------|
| `panel` | Panel backgrounds |
| `cream` | Light text/backgrounds |
| `gold` | Money, highlights |
| `grass` | Grass terrain, positive indicators |
| `water` | Water terrain, info indicators |

Components use these tokens (e.g., `bg-panel`, `text-gold`) rather than raw hex colors for consistency.
