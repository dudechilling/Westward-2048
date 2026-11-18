# Westward: 2048

**Go west. Or get buried.**

A free, original browser-based survival adventure. Five survivors take a patched-up truck through a collapsed North America, 1,250 miles to a place called Haven. The world is deadly, the radio is unreliable, and the jokes are worse.

## Play locally

Requires a static HTTP server. For example:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`. The game also runs as a static GitHub Pages site, without a backend or account.

## How to play

- **Drive west** while watching fuel, water, rations, vehicle condition and crew morale.
- **Choose** how to survive roadside incidents, with visible resource trade-offs.
- **Scavenge**, repair the truck, use medicine or rest when the situation deteriorates.
- **Adjust** travel pace and rations for the risk and time remaining.
- **Visit** the Crew, Atlas, Trade, Journal and Radio views when you need more information.
- **Survive** the route to Haven before winter closes the pass. You cannot save everybody every time.

Five crew members have different specialties, with mechanical effects. The story includes 34 original roadside incidents, six landmark encounters and 18 shortwave broadcasts. Encounters are weighted towards fresh, unplayed situations until the pool is exhausted. The game has two difficulty settings and stores its autosave and best score in the current browser. Older version-1 saves remain supported.

The entire playable game uses HTML, CSS and native browser JavaScript. Its animated pixel-art world includes seven distinct environments, weather and time-of-day variants, multi-layer parallax, vehicle wear, satirical signage, rare ambient moments and illustrated roadside encounters. Original animations are rendered in canvas at a capped frame rate; there are no remote image, video or game-asset dependencies. The scene can be paused at any time, and system reduced-motion preferences disable automatic animation. Optional original sound effects remain off by default. Remote Google Fonts are optional; system fallbacks work offline.

## Tests

Node.js 20+ is required to execute the tests (no package installation needed):

```sh
npm test
```

Tests cover resource invariants, deterministic seeds, wins/losses, story choices, character perks, milestones, old saves, biome boundaries and the mapping of all encounters to their art states. Browser verification additionally covers viewport overflow, opening and closing field-manual panels, illustrated event states, motion pause and reduced-motion settings. GitHub Actions runs the Node test suite.

## Deployment

Use the `Publish Westward 2048` GitHub Actions workflow in `.github/workflows/pages.yml`. In repository settings, GitHub Pages must be configured with **Source: GitHub Actions**. The workflow stages the static assets, runs tests and deploys them. After publication the site is available at:

https://dudechilling.github.io/Westward-2048/

The game contains profanity, gallows humour and satirical depictions of distress. It is intended for mature audiences. Advertising is not integrated; any future ad network will have its own content and placement requirements.

## Rights

The game is original code, graphics and writing. No original *Oregon Trail* code, text, graphics or audio is distributed. The repository has no open-source licence at present; do not assume permission for third-party redistribution.
