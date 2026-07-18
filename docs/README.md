# Campground Tycoon

Campground Tycoon is a real-time management simulation game. You run a campground — build plots, place facilities, set prices, and watch AI-driven tourists arrive, pick their favorite spot, chat with each other, and leave reviews.

It's the week 9 project of the bootcamp. The main topic: **integrating a local AI model into a game**.

## The idea

You start with an empty map, some money, and a 50/100 reputation. Your job is to build camping plots and facilities in the right spots, price them fairly, and grow your reputation so more tourists show up.

Tourists aren't random. Each one has a name, a personality, a budget, and preferences. They look at your available plots and decide if they want to stay or leave. While they're there, they chat with nearby campers. When they leave, they write a review.

All of this — the tourist generation, the plot decisions, the chatter, the reviews — is powered by a local AI model running on your machine through Ollama.

## Running it

```bash
npm install
npm run dev
```

The game opens at `http://localhost:5173`.

### Setting up AI

The game works without AI — it has a full template-based fallback system. But the real experience comes with Ollama running locally:

```bash
ollama pull gemma3:1b
ollama serve
```

The game connects to Ollama at `localhost:11434` automatically. The DevConsole panel (visible at the bottom of the screen) shows the connection status, every AI request, and every response in real time.

See [AI Integration](./AI-INTEGRATION.md) for the full breakdown of how AI is wired into the game.

## How the game works

Time flows in ticks. Each tick is one in-game hour. You control the speed — pause, 1x, 2x, or 5x.

Every morning (hours 7–10), tourists arrive. They evaluate your available plots based on their personality and budget. If they find something they like, they book it. If not, they leave — and you've lost a customer.

Staying guests have a satisfaction score that changes every 6 hours based on nearby facilities, weather, neighbors, and pricing. Happy guests leave good reviews. Good reviews raise your reputation. Higher reputation attracts more tourists. That's the loop.

At night, you collect revenue from occupied plots. Every day, you pay maintenance on every structure. The goal: build a campground that runs profitably and keeps guests happy.

## Tech stack

- **Vite + React 19 + TypeScript** — fast dev, strict types
- **Tailwind CSS 4** — utility-first styling with semantic color tokens
- **Zustand** — state management with selector subscriptions
- **Dexie.js** — IndexedDB for autosave persistence
- **Ollama** — local AI for tourist generation, decisions, chatter, and reviews

## Documentation

| File | What's inside |
|------|---------------|
| [AI Integration](./AI-INTEGRATION.md) | How local AI is integrated — the main topic of the week |
| [Game Mechanics](./GAME-MECHANICS.md) | Economy, tourists, satisfaction, weather, seasons |
| [Building System](./BUILDING-SYSTEM.md) | Grid, terrain, structures, placement rules, costs |
| [Architecture](./ARCHITECTURE.md) | State management, persistence, game loop, project structure |
| [UI Guide](./UI-GUIDE.md) | Layout, panels, controls, rendering |

## Project structure

```
src/
├── ai/           Ollama client, prompts, generators, fallbacks
├── engine/       Game loop, satisfaction, weather
├── store/        Zustand store, types, actions
├── db/           IndexedDB persistence
├── components/
│   ├── grid/     Isometric map renderer and sprites
│   └── ui/       All UI panels
└── utils/        Constants and grid math
```
