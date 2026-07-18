# AI Integration

This is the main topic of week 9: **integrating a local AI model into a real application**.

We use Ollama to run a language model on your own machine — no cloud API, no API keys, no usage costs. The AI generates tourist personalities, makes in-game decisions, writes reviews, and produces real-time guest chatter. When Ollama isn't available, the game falls back to template-based generation and keeps working.

## Why local AI?

Cloud AI APIs (OpenAI, Anthropic, Google) work great, but they come with trade-offs: you need API keys, you pay per request, you depend on an external service, and you send data over the network.

For a game that fires AI requests every few seconds, that adds up fast. A local model gives you:

- **Zero cost** — no API bills
- **Zero latency from network** — the model runs on localhost
- **Full privacy** — nothing leaves your machine
- **Offline support** — works without internet

The trade-off is that local models are smaller and less capable than cloud models. So you need to design your prompts and fallback systems carefully.

## Ollama setup

Ollama is a tool that runs open-source language models locally. You install it, pull a model, and it exposes a REST API on `localhost:11434`.

```bash
ollama pull gemma3:1b
ollama serve
```

That's it. Now you have an AI model running locally with an HTTP API.

## The Ollama client

All AI communication goes through a single file: `src/ai/ollamaClient.ts`.

Here's how a request works:

```ts
const res = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gemma3:1b',
    prompt,
    stream: false,
    options: {
      temperature: 0.8,
      num_predict: 500,
    },
  }),
})
```

We send the prompt, get back a JSON response with the generated text. That's the core of it.

### Key design decisions

**Temperature 0.8** — high enough for creative, varied responses (tourist names, chatter), but not so high that the output becomes incoherent.

**500 token limit** — we only need short outputs (a name, a one-line review, a chat message). Capping tokens keeps responses fast.

**Stream: false** — we wait for the complete response rather than streaming tokens. Simpler to parse, and our outputs are short enough that streaming doesn't help.

**30-second timeout** — if the model takes too long (maybe it's overloaded), we abort and fall back to templates. The game can't freeze waiting for AI.

### Request queue

Local models can only handle one request at a time efficiently. If you fire 5 requests in parallel, they'll all slow down.

So we serialize everything through a queue:

```ts
let requestQueue: Promise<unknown> = Promise.resolve()

export async function queryOllama(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    requestQueue = requestQueue.then(async () => {
      // ... make the actual fetch call
    })
  })
}
```

Every call to `queryOllama` chains onto the previous one. Only one request runs at a time. The rest wait their turn.

### Availability check

Before making AI requests, we check if Ollama is actually running:

```ts
const res = await fetch('http://localhost:11434/api/tags', {
  signal: AbortSignal.timeout(3000),
})
```

This pings the Ollama tags endpoint with a 3-second timeout. If it responds, we're good. If not, we skip AI and use fallbacks.

The tourist generator caches this check for 60 seconds so we're not pinging on every arrival.

## What the AI generates

The AI powers four features. Each one follows the same pattern: build a prompt, send it to Ollama, parse the JSON response, fall back to templates if anything goes wrong.

### 1. Tourist generation

When a new tourist group arrives, the AI creates their identity.

**What we send**: current season, weather, campground reputation, and a list of names already at the campground (so the AI doesn't repeat names).

**What we get back**:

```json
{
  "name": "Priya Nakamura",
  "composition": "family with 2 teenagers",
  "personality": "family-focused",
  "budget": 85,
  "preferences": ["playground", "near-facilities", "quiet"],
  "tripDuration": 4
}
```

The AI picks from six personality types: quiet-nature-lover, social-party, budget-backpacker, comfort-glamper, adventure-seeker, and family-focused. Each personality affects how the tourist behaves for the rest of their stay.

**Fallback**: random selection from first/last name pools (900+ combinations), season-weighted personality distribution, and varied family compositions. The fallback produces realistic-feeling tourists — just without the AI's creativity in naming and composition.

### 2. Plot selection

After arriving, each tourist evaluates the available plots and decides where to stay — or whether to leave.

**What we send**: the tourist's personality, composition, budget, preferences, and a list of available plots with details (type, price, nearby facilities, water proximity, neighbors).

**What we get back**:

```json
{
  "decision": "stay",
  "plotIndex": 2,
  "reasoning": "Great price and close to the playground for the kids"
}
```

The reasoning shows up in the event log, so you can see why tourists pick certain spots.

**Fallback**: a scoring algorithm that evaluates each plot on affordability, preference matching, and personality fit. It works well — you just lose the natural-language reasoning.

### 3. Reviews

When a tourist leaves, they write a review.

**What we send**: their name, personality, composition, plot type, stay duration, final satisfaction score, weather during their stay, and the price they paid.

**What we get back**:

```json
{
  "rating": 4,
  "text": "Kids had a blast at the playground. Showers could use an upgrade though."
}
```

Reviews affect your reputation, which affects future arrivals. The AI writes reviews that match the tourist's personality — a comfort glamper complains about different things than a budget backpacker.

**Fallback**: rating derived from satisfaction tiers (80+ = 5 stars, etc.), text picked from personality-specific template pools.

### 4. Guest chatter

This is the most frequent AI feature. Every in-game hour from 7 to 22, staying guests generate short messages that appear in the sidebar.

**What we send**: the tourist's name, personality, satisfaction, weather, time of day, nearby camper names, nearby facilities, recent overheard chatter, and a random topic suggestion.

**What we get back**:

```json
{
  "text": "Caught three fish for dinner!",
  "mood": "happy",
  "actionable": false
}
```

The prompt tells the AI to keep it to one short sentence — a quick quip you'd overhear walking past a campsite.

Messages flagged as `actionable` (complaints, requests, suggestions) are highlighted in the UI so you know when a guest needs something.

**Reply threads**: up to 2 conversations per chatter cycle. The system checks if any nearby guest (within 3 tiles) said something recently, and generates a reply that references the original message.

**Fallback**: each personality has a hand-written table of lines organized by mood. Weather-specific lines are mixed in during rain and storms. The `actionable` flag is set by regex matching against keywords like "need", "broken", "fix", "refund".

## The prompt design pattern

All four AI features follow the same structure:

1. **Set the scene** — tell the AI who it is and what's happening
2. **Provide structured data** — available plots, satisfaction, facilities, existing names
3. **Request JSON output** — specify the exact schema you want back
4. **Parse the first `{...}` block** — extract JSON from whatever the model returns

Here's the key insight: **small local models are less reliable at following instructions than large cloud models**. They sometimes add extra text before or after the JSON, or wrap it in markdown code blocks. So instead of expecting clean JSON, we grab the first JSON object from the response:

```ts
export function parseJsonResponse<T>(response: string): T | null {
  const jsonMatch = response.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return null
  return JSON.parse(jsonMatch[0]) as T
}
```

This regex approach is forgiving. It doesn't matter if the model says "Here's your tourist:" before the JSON — we just grab the object.

## The fallback system

Every AI feature has a complete template-based fallback. This is critical for two reasons:

1. **Ollama might not be running** — the game should work without it
2. **The AI might return garbage** — bad JSON, missing fields, nonsensical values

The fallback chain for each feature looks like this:

```
Is Ollama available?
  ├─ No → use template fallback
  └─ Yes → send prompt to Ollama
              ├─ JSON parse fails → use template fallback
              ├─ Missing required fields → use template fallback
              ├─ Request times out → use template fallback
              └─ Valid response → use AI result
```

Every path ends with a working result. The game never crashes or stalls because of AI.

### Template quality matters

The fallback templates aren't placeholder garbage. They're carefully written to match each personality:

- A quiet-nature-lover says "Spotted a bald eagle!" — not generic filler
- A budget-backpacker says "Rip-off for what you get." — personality-appropriate
- A comfort-glamper says "Espresso machine in the store!" — character-consistent

The game should feel alive even without AI. The AI makes it better, but the templates make it work.

## The AI log

Every AI request, response, error, and fallback is recorded in an in-memory log (max 80 entries). The DevConsole panel in the UI shows this log in real time.

This is useful for debugging: you can see exactly what prompt was sent, what the AI returned, how long it took, and whether a fallback was used. Each entry is expandable to show the full prompt and response.

The console also shows the Ollama connection status (health-checked every 10 seconds) and the count of pending requests in the queue.

## How AI fits into the game loop

The game loop runs in `src/engine/gameLoop.ts`. Each tick advances the clock by one hour and triggers time-gated handlers:

| Hours | What happens | Uses AI? |
|-------|-------------|----------|
| 7–10 | Tourist arrivals + plot selection | Yes |
| 10 | Departures + reviews | Yes |
| Every 6h | Satisfaction recalculated | No |
| 7–22 | Guest chatter | Yes |
| 22 | Nightly revenue collected | No |
| 23 | Maintenance costs deducted | No |

Two concurrency guards prevent pileups:

- **`aiProcessing`** — gates arrivals and departures so they don't overlap
- **`chatterProcessing`** — gates chatter separately

If the game is running at 5x speed and the AI is still processing the last request, that tick's AI handler is skipped. The game keeps flowing — it doesn't freeze waiting for the model.

## File overview

```
src/ai/
├── ollamaClient.ts       HTTP client, request queue, JSON parser, AI log
├── prompts.ts             All prompt templates (tourist, plot, review, chatter)
├── touristGenerator.ts    Tourist creation, plot selection, reviews + fallbacks
└── chatterGenerator.ts    Guest chatter with mood/personality fallback tables
```

Four files. That's the entire AI layer.

## Lessons learned

**Keep prompts short and structured.** Small models work best with clear, constrained prompts. Tell them exactly what JSON shape you want. Give them a role. Keep instructions concise.

**Always have a fallback.** AI is probabilistic. Sometimes the model returns something unusable. Your app needs to handle that gracefully, every time.

**Serialize requests to local models.** Unlike cloud APIs that handle concurrency, a local model on a laptop works best with one request at a time.

**Cap output length.** Small models can ramble. Set `num_predict` to limit tokens, and add a hard character cap on the application side as a safety net.

**Log everything.** When AI behaves unexpectedly, you need to see what prompt produced what response. The AI console makes debugging straightforward.

**Don't depend on AI for core gameplay.** The game loop, economy, and satisfaction system are all deterministic code. AI adds personality and variety, but removing it doesn't break the game. This separation is key.
