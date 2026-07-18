import { useState } from 'react'

const STEPS = [
  {
    title: 'Welcome to Campground Tycoon',
    content: `You own a campground. Your job is to build it up, attract tourists, and keep them happy.

AI-powered tourists arrive on their own. They pick a spot, stay for a while, and leave a review. Your campground's reputation depends on their experience.

Let's see how to play.`,
    icon: '🏕️',
  },
  {
    title: 'Build Your Campground',
    content: `Use the build panel on the right to place camping plots and facilities on the map.

**Plots** are where tourists stay:
- **Small Tent** ($200) — cheap, attracts backpackers
- **Large Tent** ($400) — fits families
- **Campervan** ($600) — for road trippers
- **RV Hookup** ($1000) — premium spots with electricity

Click a plot type, then click on any green grass tile to place it. You can't build on water, trees, or paths.`,
    icon: '🔨',
  },
  {
    title: 'Add Facilities',
    content: `Tourists care about what's nearby. Facilities boost satisfaction:

- **Restroom** — essential. Without one nearby, guests get unhappy fast
- **Shower** — comfort-seekers and families love these
- **Fire Pit** — social campers gather here
- **Playground** — families with kids need this
- **Trail Head** — nature lovers and adventurers want trails
- **Camp Store** — a convenience everyone appreciates
- **Lake Access** — build a dock near water for nature lovers

Place facilities near your plots. Proximity matters — tourists check what's within 3 tiles of their spot.`,
    icon: '🚿',
  },
  {
    title: 'Set Your Prices',
    content: `Use the **Nightly Rates** section to adjust pricing for each plot type.

Pricing is a balancing act:
- Too high? Budget travelers leave without booking
- Too low? You won't cover maintenance costs
- Just right? High occupancy and happy guests

Each tourist has a budget. A solo backpacker might have $30/night. A glamping couple might pay $150. Watch who's arriving and adjust.`,
    icon: '💰',
  },
  {
    title: 'The AI Tourists',
    content: `Every morning, new tourist groups arrive. Each one is unique:

- **Quiet Nature Lover** — wants water, trails, and privacy
- **Social Party Type** — wants fire pits and neighbors
- **Budget Backpacker** — price-sensitive, low expectations
- **Comfort Glamper** — needs showers, restrooms, and a store
- **Adventure Seeker** — wants trails and water access
- **Family Focused** — needs playgrounds and clean restrooms

Tourists evaluate your available plots. If nothing fits their preferences or budget, they leave — and that's lost revenue.`,
    icon: '🧑‍🤝‍🧑',
  },
  {
    title: 'Satisfaction & Reviews',
    content: `Staying tourists gain or lose satisfaction every few hours based on:

- **Nearby facilities** — restrooms are critical
- **Neighbors** — quiet types hate crowds, social types love them
- **Weather** — rain lowers mood, perfect days boost it
- **Price fairness** — overcharging hurts satisfaction

When tourists leave, they write a review. Reviews determine your reputation score (0–100). Higher reputation attracts more visitors and lets you charge more.`,
    icon: '⭐',
  },
  {
    title: 'Seasons & Weather',
    content: `Time passes automatically. Every 30 days, the season changes:

- **Summer** — peak demand. Families everywhere. Charge more.
- **Fall** — nature lovers arrive. Quieter, fewer guests.
- **Winter** — slow season. Discount or lose money.
- **Spring** — demand picks up again.

Weather changes daily. Storms hurt satisfaction. Perfect weather boosts it. You can't control the weather, but you can prepare for it with good facilities.`,
    icon: '🌦️',
  },
  {
    title: 'Speed Controls & Saving',
    content: `Use the speed buttons at the top of the control panel:

- **Pause** — stop time to plan and build
- **1x** — normal speed, watch events unfold
- **2x** — faster for when things are running smoothly
- **5x** — fast-forward through quiet periods

The game autosaves at the start of each new day. You can also manually save and load using the buttons below the speed controls.`,
    icon: '⏩',
  },
  {
    title: 'Tips for Success',
    content: `A few things to keep in mind:

1. **Always build a restroom first** — tourists hate not having one
2. **Place plots near facilities** — proximity matters
3. **Keep quiet plots away from party spots** — nature lovers and party types don't mix
4. **Watch the event log** — it tells you why tourists leave
5. **Start small** — build 3-4 plots, see what works, then expand
6. **Match the season** — add playgrounds before summer, trails before fall

You start with $5,000. Spend wisely. Each plot earns revenue every night, but maintenance costs add up.

Have fun managing your campground!`,
    icon: '💡',
  },
]

export function Tutorial({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div className='fixed inset-0 z-100 flex items-center justify-center bg-black/70'>
      <div className='bg-stone-800 border border-stone-600 rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden'>
        {/* Header */}
        <div className='flex items-center gap-3 px-6 pt-5 pb-3'>
          <span className='text-3xl'>{current.icon}</span>
          <h2 className='text-lg font-bold text-stone-100'>{current.title}</h2>
        </div>

        {/* Step indicator */}
        <div className='flex gap-1 px-6 pb-3'>
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-amber-500' : 'bg-stone-600'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className='px-6 pb-5 text-sm text-stone-300 leading-relaxed max-h-[50vh] overflow-y-auto'>
          {current.content.split('\n\n').map((paragraph, i) => (
            <p key={i} className='mb-3 last:mb-0'>
              {paragraph.split('\n').map((line, j) => {
                const formatted = line.replace(
                  /\*\*(.+?)\*\*/g,
                  '<strong class="text-stone-100 font-semibold">$1</strong>'
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
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between px-6 py-4 border-t border-stone-700 bg-stone-800/50'>
          <span className='text-xs text-stone-500'>
            {step + 1} of {STEPS.length}
          </span>
          <div className='flex gap-2'>
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className='px-4 py-1.5 rounded text-sm bg-stone-700 text-stone-300 hover:bg-stone-600 transition-colors'>
                Back
              </button>
            )}
            {isLast ? (
              <button
                onClick={onClose}
                className='px-4 py-1.5 rounded text-sm bg-amber-500 text-stone-900 font-semibold hover:bg-amber-400 transition-colors'>
                Start Playing
              </button>
            ) : (
              <button
                onClick={() => setStep(step + 1)}
                className='px-4 py-1.5 rounded text-sm bg-amber-500 text-stone-900 font-semibold hover:bg-amber-400 transition-colors'>
                Next
              </button>
            )}
            {!isLast && (
              <button
                onClick={onClose}
                className='px-4 py-1.5 rounded text-sm text-stone-500 hover:text-stone-300 transition-colors'>
                Skip
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
