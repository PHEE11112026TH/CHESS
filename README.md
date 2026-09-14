# หมากฮอสไทย · Thai Checkers

Browser game with local two-player mode, worker-based AI, compulsory multi-captures, flying kings, threefold repetition, resignation, move history and automatic device-local saving.

## Run

Requires Node.js 20+. Uses native browser modules with no runtime or build dependencies.

```sh
npm run dev
npm test
npm run build
```

Deploy `dist/` to a static host. This repository is not automatically published by building it.

## Rules

Reference: https://mindsports.nl/index.php/arena/draughts/500-thai-checkers

8×8 board, eight men each. Ivory starts in this implementation. Men move and capture forward only. Capturing is compulsory; all continuations must be completed but maximum capture is not required. Kings move along clear diagonals and land immediately after the captured piece. Captured pieces disappear immediately. Promotion ends a man's turn. No legal move loses; three identical positions with the same player to move draw. This is a casual rule profile, not tournament certification.

## Architecture

- `src/engine.js`: pure legal full-turn generation, application and bounded minimax.
- `src/ai.worker.js`: keeps AI computation off the UI thread.
- `src/main.js`: step-by-step capture interface and local persistence.
- `tests/engine.test.js`: deterministic core rule regression tests.

Online multiplayer and accounts are not included. AI difficulty uses search depth, not a rated playing strength. Thai font uses Google Fonts with local system fallback. Saved games stay in this browser and may be removed by clearing browser data.

## Verification

Core regression tests pass, and an AI-versus-AI simulation completed with piece-count and legal-square invariants intact. Static build succeeds. The optional `node scripts/browser-check.cjs` script covers AI replies, persistence, local play, resignation, multi-capture and mobile overflow; it requires Playwright and its Chromium browser. Browser QA was not completed in the authoring environment because the browser download timed out. Visual, touch and keyboard behavior still need real-browser confirmation before production release.
