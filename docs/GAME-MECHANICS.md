# Game Mechanics

## Time System

The game runs on a tick-based clock where each tick equals one in-game hour. A day has 24 hours (0–23). The game starts at Day 1, Hour 6.

### Speed Controls

| Speed | Real time per in-game hour |
|-------|---------------------------|
| Paused | — |
| 1x | 1 second |
| 2x | 500 ms |
| 5x | 200 ms |

Speed is persisted to `localStorage` and restored on reload, so the game resumes at the speed you left it.

### Daily Schedule

| Hour | Event |
|------|-------|
| 0 | Day rolls over, season recalculated |
| 0 | Weather rolled for the new day |
| 7–10 | Tourist arrivals (each hour in this window) |
| 10 | Departures processed (guests whose stay is complete) |
| 0, 6, 12, 18 | Satisfaction recalculated for all staying guests |
| 7–22 | Guest chatter generated (every hour) |
| 22 | Nightly revenue collected from all occupied plots |
| 23 | Daily maintenance costs deducted |

## Seasons

A year is 120 days. The season is determined by `day % 120`:

| Day range (mod 120) | Season |
|---------------------|--------|
| 0–29 | Spring |
| 30–59 | Summer |
| 60–89 | Fall |
| 90–119 | Winter |

Seasons affect tourist demand and weather probabilities.

### Seasonal Demand Multiplier

| Season | Multiplier |
|--------|-----------|
| Spring | 0.7x |
| Summer | 1.3x |
| Fall | 0.5x |
| Winter | 0.3x |

These scale the number of arriving tourist groups each morning.

## Weather

Weather changes once per day (at midnight). Each season has its own weighted probabilities:

| Weather | Spring | Summer | Fall | Winter |
|---------|--------|--------|------|--------|
| Sunny | 25% | 35% | 15% | 10% |
| Cloudy | 30% | 15% | 35% | 30% |
| Rainy | 25% | 10% | 25% | 20% |
| Stormy | 10% | 5% | 15% | 25% |
| Perfect | 10% | 35% | 10% | 15% |

Weather affects guest satisfaction (see below) and guest chatter topics.

## Economy

### Starting Conditions

- **Money**: $5,000
- **Reputation**: 50/100

### Revenue

Revenue comes from two sources:

1. **Booking fee**: When a tourist chooses a plot, the first night's price is collected immediately.
2. **Nightly revenue** (hour 22): Every staying guest pays the current nightly rate for their plot type.

### Maintenance

At hour 23, maintenance costs are deducted for every structure on the map. See [Building System](./BUILDING-SYSTEM.md) for per-structure costs.

### Pricing

You set nightly prices per plot type (not per individual plot). Prices can be adjusted in $5 increments, clamped between $5 and $200.

Default prices:

| Plot Type | Default Price |
|-----------|--------------|
| Small Tent | $15/night |
| Large Tent | $25/night |
| Campervan | $35/night |
| RV Hookup | $50/night |

Pricing affects whether tourists choose to stay (they compare price to their budget) and ongoing satisfaction (overpriced plots reduce satisfaction).

## Tourists

### Arrival

Each morning hour (7, 8, 9, 10), the game rolls for new arrivals. The number of groups is:

```
base = 1 + random(0–2)
arrivals = round(base × seasonDemand × (0.5 + reputation/100))
```

Each tourist group has:

- **Name** — group leader's name
- **Composition** — "couple in their 30s", "family with 2 young kids", etc.
- **Personality** — one of six types (see below)
- **Budget** — $20–200/night maximum they'll pay
- **Preferences** — 2–3 from: near-water, quiet, near-facilities, electricity, shade, social, playground, trail-access
- **Trip duration** — 1–7 nights
- **Satisfaction** — starts at 70, updated every 6 hours

### Personalities

| Personality | Description |
|-------------|-------------|
| Quiet Nature Lover | Wants peace, water, trails. Dislikes crowds. |
| Social Party | Wants fire pits, neighbors, nightlife. Dislikes isolation. |
| Budget Backpacker | Price-sensitive. Happy with cheap rates, annoyed by overpricing. |
| Comfort Glamper | Needs showers, restrooms, stores. Low tolerance for roughing it. |
| Adventure Seeker | Wants trails, water access. Weather-resilient. |
| Family Focused | Needs playgrounds, restrooms, showers. Kid-friendly concerns. |

### Plot Selection

When a tourist arrives, they evaluate available plots based on:

- **Affordability** — plot price vs. their budget
- **Preferences** — do nearby tiles match what they want?
- **Facilities** — what's within 3 tiles?
- **Neighbors** — are there other campers nearby? (good or bad depending on personality)
- **Water** — is there water within 3 tiles?

If nothing fits, they leave without booking — logged as a lost customer.

### Departure

At hour 10, any guest whose stay is complete (`currentDay - arrivalDay >= tripDuration`) departs. They leave a review with a 1–5 star rating based on their final satisfaction level, and their plot is freed up.

### Reputation

Reputation is the average of all review ratings, multiplied by 20 and rounded. A campground with all 5-star reviews has reputation 100. Reputation affects future arrival rates.

## Satisfaction System

Every 6 in-game hours, each staying guest's satisfaction is recalculated. The system computes a delta (positive or negative) and clamps the result between 0 and 100.

### Facility Bonuses (within 3 tiles)

| Factor | Effect |
|--------|--------|
| Restroom nearby | +2 |
| No restroom nearby | -3 |
| Shower nearby | +1 |

### Preference Matching

| Preference | Condition | Effect |
|------------|-----------|--------|
| Near water | Water within 3 tiles | +3 |
| Near water | No water nearby | -2 |
| Quiet | No neighbors within 2 tiles | +2 |
| Quiet | 3+ neighbors | -3 |
| Social | Has neighbors | +2 |
| Social | No neighbors | -1 |
| Near facilities | 2+ facilities nearby | +2 |
| Playground | Playground nearby | +3 |
| Trail access | Trail Head nearby | +3 |

### Weather Effects

| Weather | Satisfaction delta |
|---------|-------------------|
| Perfect | +3 |
| Sunny | +1 |
| Cloudy | 0 |
| Rainy | -2 |
| Stormy | -5 |

### Personality-Specific Bonuses

Each personality has extra modifiers. For example:

- **Quiet Nature Lover**: +2 near water, +2 near trails, -3 if 3+ neighbors
- **Social Party**: +2 near fire pit, +1 if has neighbors
- **Budget Backpacker**: -2 if price > 70% of budget, +2 if price ≤ 50% of budget
- **Comfort Glamper**: +2 for shower, +1 for store, -4 if no restroom
- **Adventure Seeker**: +3 near trail, +1 near water
- **Family Focused**: +3 for playground, +2 if restroom AND shower, -4 if no restroom

### Price Fairness

| Price / Budget ratio | Effect |
|---------------------|--------|
| > 90% | -2 |
| < 40% | +1 |

## Guest Chatter

Every in-game hour from 7 to 22, staying guests generate chatter — short messages that appear in the sidebar. The system picks a number of solo speakers proportional to guest count, and up to 2 reply threads between nearby guests (within 3 tiles Chebyshev distance).

Messages can be flagged **Actionable** if they contain requests or complaints the campground manager should address (missing facilities, noise, pricing, cleanliness).
