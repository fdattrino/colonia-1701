import type {
  Season,
  Weather,
  PlotType,
  Preference,
  Personality,
  ChatterMood,
} from '../store/types'

export function touristGenerationPrompt(
  season: Season,
  weather: Weather,
  reputation: number,
  existingNames: string[] = []
): string {
  const avoidClause =
    existingNames.length > 0
      ? `\nDo NOT reuse any of these names (already at the campground): ${existingNames.join(', ')}. Pick a completely different first AND last name.`
      : ''

  return `You are an AI for a campground simulation game. Generate a unique tourist group that would visit a campground.

Current conditions:
- Season: ${season}
- Weather: ${weather}
- Campground reputation: ${reputation}/100

Generate a tourist group with realistic traits. The personality should match the season (families in summer, nature lovers in fall, budget travelers in off-season).
Use diverse, varied names — different ethnicities, backgrounds, and styles. Never repeat a surname you've used before.${avoidClause}

Respond with ONLY a valid JSON object, no other text:
{
  "name": "first and last name of group leader",
  "composition": "brief description like 'couple in their 30s', 'solo hiker', 'family with a toddler', 'family with 2 teenagers', 'single dad with a daughter', 'retired couple', 'group of 4 college friends' — vary ages, sizes, and structure",
  "personality": "one of: quiet-nature-lover, social-party, budget-backpacker, comfort-glamper, adventure-seeker, family-focused",
  "budget": a number between 20 and 200 representing max dollars per night they'd pay,
  "preferences": ["array of 2-3 items from: near-water, quiet, near-facilities, electricity, shade, social, playground, trail-access"],
  "tripDuration": a number 1 to 7 representing nights they want to stay
}`
}

export function plotSelectionPrompt(
  personality: Personality,
  composition: string,
  budget: number,
  preferences: Preference[],
  availablePlots: Array<{
    index: number
    type: PlotType
    price: number
    nearFacilities: string[]
    hasNeighbors: boolean
    nearWater: boolean
  }>
): string {
  const plotList = availablePlots
    .map(
      (p) =>
        `  Plot ${p.index}: ${p.type}, $${p.price}/night, near: ${p.nearFacilities.join(', ') || 'nothing'}, ${p.nearWater ? 'near water' : ''}, ${p.hasNeighbors ? 'has neighbors' : 'secluded'}`
    )
    .join('\n')

  return `You are a ${personality} camper (${composition}). Your budget is $${budget}/night.
Your preferences: ${preferences.join(', ')}.

Available plots at this campground:
${plotList}

Choose the best plot for you based on your personality and preferences, or decide to leave if nothing fits.

Respond with ONLY a valid JSON object:
{
  "decision": "stay" or "leave",
  "plotIndex": the plot number you chose (or null if leaving),
  "reasoning": "one sentence explaining your choice"
}`
}

export function reviewPrompt(
  name: string,
  personality: Personality,
  composition: string,
  plotType: PlotType,
  duration: number,
  satisfaction: number,
  weather: Weather,
  price: number
): string {
  return `You are ${name}, a ${personality} (${composition}). You just finished a ${duration}-night stay at a campground.

Your experience:
- Plot type: ${plotType}
- Satisfaction: ${satisfaction}/100
- Weather during stay: ${weather}
- Price paid: $${price}/night

Write a brief, personality-appropriate campground review (2-3 sentences). Be specific about what you liked or disliked. Match the tone to your personality and satisfaction level.

Respond with ONLY a valid JSON object:
{
  "rating": a number 1 to 5,
  "text": "your review text"
}`
}

export function chatterPrompt(
  name: string,
  personality: Personality,
  composition: string,
  satisfaction: number,
  weather: Weather,
  hour: number,
  nearbyNames: string[],
  nearbyFacilities: string[],
  recentChatter: Array<{ name: string; text: string }> = [],
  replyTarget?: { name: string; text: string }
): string {
  const timeOfDay =
    hour < 8
      ? 'early morning'
      : hour < 12
        ? 'morning'
        : hour < 17
          ? 'afternoon'
          : hour < 21
            ? 'evening'
            : 'night'

  const hasCompany = nearbyNames.length > 0
  const socialContext = hasCompany
    ? `Nearby campers: ${nearbyNames.join(', ')}.`
    : 'No one else nearby.'

  const recentContext =
    recentChatter.length > 0
      ? `\nRecent things overheard:\n${recentChatter.map((c) => `- ${c.name}: "${c.text}"`).join('\n')}`
      : ''

  const replyInstruction = replyTarget
    ? `\n${replyTarget.name} just said: "${replyTarget.text}"\nReply to ${replyTarget.name} in one quick sentence.`
    : ''

  const topicVariety = [
    'what you ate or are cooking',
    'a funny thing that happened today',
    'plans for tomorrow',
    'a memory from a past trip',
    'something you noticed about the campground',
    'your gear or setup',
    'an animal or bird you saw',
    'a joke or pun',
    'something the kids are doing',
    'a book or podcast',
    'missing home vs. loving it here',
    'a skill you learned or want to learn',
    'advice for someone nearby',
  ]
  const suggestedTopic =
    topicVariety[Math.floor(Math.random() * topicVariety.length)]

  return `You are ${name}, a ${personality} (${composition}) camping at a campground. It's ${timeOfDay}, the weather is ${weather}. Satisfaction: ${satisfaction}/100.

${socialContext}
Nearby facilities: ${nearbyFacilities.join(', ') || 'none'}.${recentContext}${replyInstruction}

Say ONE short sentence (max 12 words). Think of a quick quip you'd overhear walking past a campsite — punchy and casual. Your personality and composition should shape what you say and how.

Do NOT comment on the weather unless it's extreme. Be specific, not generic. Topic inspiration: ${suggestedTopic}

Stay in character. Be BRIEF. No quotes around the text.

Respond with ONLY a valid JSON object:
{
  "text": "what you say or think",
  "mood": "one of: happy, neutral, annoyed, excited, tired",
  "actionable": true or false — set true ONLY if you're requesting something the campground manager could fix or improve (missing facility, broken equipment, noise complaint, suggestion for new amenity, pricing concern, cleanliness issue). General chit-chat and personal thoughts are NOT actionable.
}`
}
