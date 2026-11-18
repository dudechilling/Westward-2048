# WESTWARD: 2048

**The world ended. The journey didn't.**

An original, free browser survival game inspired by the decisions and difficulty of classic overland journey games. In 2048, five survivors travel 1,250 miles through a collapsed North America toward a rumoured safe settlement called Haven.

## Play

This is a static website. Serve the repository with an HTTP server:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`, enter a convoy name, select a difficulty and choose **Begin the Journey**. Do not open `index.html` directly with `file://`: browser module imports require an HTTP server.

## Game features

- Original retro-style canvas scenery and responsive desktop/mobile layout
- Route landmarks, randomized encounters and two-way consequential decisions
- Five survivors with health, morale and permanent losses
- Fuel, food, water, medicine, spare parts, vehicle condition and credits
- Adjustable travel pace and food rationing
- Scavenging, resting, repairs, medicine and roadside trading
- Two difficulty levels, victory and defeat states, and local best scores
- Autosave to browser localStorage; no login, account or backend
- Deterministic random seeds for testable game mechanics

## Development

Requires Node.js 20 or later. No `npm install` is necessary.

```sh
npm test
```

The source consists of `index.html` (interface), `style.css` (visual design), `app.mjs` (browser controller and pixel scenery) and `engine.mjs` (simulation). Unit tests and seed-based playthrough checks are in `engine.test.mjs`.

## Hosting

Deploy the repository root as a **static website** on Cloudflare Pages (no build command and no output folder) or a similar host. No server-side services are needed. The repository has **not** been deployed to a live game domain.

Advertising is **not** implemented. Add an approved ad provider only after the site has real original content, appropriate legal/privacy pages, suitable placements away from interactive controls, and approval from the provider. Do not assume ad revenue without actual traffic.

## Intellectual property

The game code, narrative, rules and procedural visual art were created for this project. No original *Oregon Trail* game code, text, graphics or audio is redistributed. This repository currently has **no open-source licence** for its own code; choose a licence explicitly before accepting outside contributions or granting reuse rights.
