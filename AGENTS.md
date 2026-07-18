## Learned User Preferences

- Always persist game progress so page refreshes never lose state (autosave on every meaningful change, auto-load on startup)
- Persist game speed across reloads — do not reset speed to paused on save
- Use pixel art sprites over SVG icons when available — user prefers the generated pixel art aesthetic; alternate third-party sprite packs were tried and reverted in favor of the established look
- Guest chatter should stay varied and character-distinct, with neighbors able to converse; keep lines short and about the campground experience (facilities, annoyances, stay quality)—not generic off-topic chat; highlight manager-relevant requests as "Actionable"; keep overall message volume readable (user increased frequency once but later said the feed was too busy)
- Dev console (AI Console) should be visible by default, not hidden behind a toggle
- Bottom panel (Events + AI Console) should be resizable via drag handle so the user can expand it
- Guest chatter sidebar should use a compact layout and allow manual horizontal resize so more messages fit on screen
- Use local Ollama with Gemma 4 (26b) for all AI generation — no cloud AI providers

## Learned Workspace Facts

- Project: "Campground Tycoon" — a SimCity-style campground management game (bootcamp week 9)
- Tech stack: Vite + React 19 + TypeScript + Tailwind CSS 4 + Zustand (state) + Dexie.js (IndexedDB persistence)
- AI integration: Ollama REST API at localhost:11434, model gemma4:26b, with template fallbacks when Ollama is unavailable
- Rendering: Isometric CSS grid with pixel art sprite sheet (public/sprites.png) and SVG fallback sprites
- Game loop: Real-time tick system (1 tick = 1 in-game hour), speed controls (pause/1x/2x/5x)
- State management: Zustand with subscribeWithSelector middleware; throttled autosave to IndexedDB about every 2 seconds (so saves still complete while the simulation runs at higher speeds), game speed also mirrored to localStorage for reliable restore, plus beforeunload flush
- Key directories: src/engine/ (game loop, tourist manager, economy), src/ai/ (Ollama client, prompts, generators), src/store/ (Zustand store, types), src/components/grid/ (isometric renderer), src/components/ui/ (panels)
- Part of a bootcamp series at ~/dev/bootcamp/ — other weeks use Astro + TypeScript + Tailwind
- UI colors use semantic theme tokens defined in src/index.css (e.g. panel, cream, gold, grass, water)—prefer those Tailwind tokens over raw hex classes in components
- Initial generated map includes a fixed campground entrance structure where the central path meets the map edge; it is not buildable from the toolbar and is not demolishable
