# Building System

## The Grid

The map is a 16×16 isometric grid rendered with a diamond projection. Each tile has a terrain type and can optionally hold a structure and/or an occupant (a staying tourist).

### Terrain Types

| Terrain | Description | Buildable? |
|---------|-------------|------------|
| Grass | Default open land | Yes |
| Path | Central cross-shaped walkway | Yes |
| Sand | Beach area near the lake | Yes |
| Water | Lake in the top-right corner | No |
| Trees | Edge border and interior clusters | No |

### Initial Map Layout

The generated map has:

- A **lake** in the top-right corner (4×4 water tiles) with a sand beach border
- **Trees** along all four edges (except the entrance tile)
- A few **internal tree clusters** for visual variety
- A **plus-shaped path** running through the center (horizontal at row 8, vertical at column 8)
- A **campground entrance** at the bottom-center where the path meets the map edge

The entrance is a permanent structure — it can't be demolished or built over.

## Structures

There are two categories of structures: **plots** (where tourists stay) and **facilities** (which provide services and affect satisfaction).

### Plots

Plots are camping spots that tourists can book. Each plot type has a build cost, daily maintenance, and a configurable nightly rate.

| Plot | Build Cost | Maintenance/day | Default Rate |
|------|-----------|-----------------|-------------|
| Small Tent | $200 | $2 | $15/night |
| Large Tent | $400 | $3 | $25/night |
| Campervan | $600 | $4 | $35/night |
| RV Hookup | $1,000 | $5 | $50/night |

### Facilities

Facilities don't house tourists but affect the satisfaction of guests within 3 tiles. Strategic placement matters.

| Facility | Build Cost | Maintenance/day | Effect |
|----------|-----------|-----------------|--------|
| Restroom | $800 | $8 | +2 satisfaction; -3 penalty if missing |
| Shower | $600 | $6 | +1 satisfaction; +2 for comfort glampers |
| Fire Pit | $150 | $1 | +2 for social-party types |
| Picnic Area | $100 | $1 | General amenity |
| Camp Store | $2,000 | $15 | +1 for comfort glampers |
| Playground | $1,200 | $5 | +3 for families and playground-preference guests |
| Lake Access | $500 | $3 | Provides water access point |
| Trail Head | $300 | $2 | +3 for adventure seekers and trail-access preference |

### Entrance

The entrance is placed automatically during map generation and cannot be built or demolished by the player. Build cost and maintenance are both $0.

## Placement Rules

- **Can build on**: grass, path, sand tiles without an existing structure
- **Cannot build on**: water, trees, or tiles that already have a structure
- **Must have funds**: the build cost is deducted immediately on placement
- **Build mode**: select a structure type from the toolbar, then click tiles to place

## Demolishing

- Switch to **demolish mode** from the toolbar
- Click any structure to remove it
- **Refund**: 50% of the original build cost
- **Cannot demolish**: occupied plots (tourist still staying) or the entrance
- Demolishing is useful for reorganizing your campground layout as you learn what works

## Strategy Tips

- **Restrooms are essential** — every guest gets a -3 penalty per satisfaction tick without one nearby. Place them centrally.
- **Cluster complementary facilities** — a shower + restroom pair near plots keeps comfort glampers and families happy.
- **Consider personality zones** — quiet nature lovers want seclusion near water/trails; social types want fire pits and neighbors. Don't mix them.
- **Watch maintenance costs** — a camp store costs $15/day. Make sure nightly revenue covers your overhead.
- **Lake-adjacent plots** are premium for water-preference guests — consider pricing those plot types higher.
