# Mirev

Mirev is an AI treasury copilot for Phantom that keeps stablecoin balances liquid, productive, and ready to spend.

Instead of acting like another wallet or another yield dashboard, Mirev is designed to be the policy and decision layer above Phantom accounts, Phantom Cash, and approved Solana yield venues.

## Product Thesis

Stablecoin money management is still too manual. Users must constantly decide:

- how much to keep liquid
- which stablecoin rail to use
- where to earn yield
- when to unwind to prepare for spending
- how much autonomy they can trust

Mirev solves that by letting users set treasury intent once, then enforcing that intent with visible rules, explanations, and bounded automation.

## What Mirev Does

Mirev helps users:

- connect with Phantom
- define a treasury policy in plain language or via presets
- keep a liquidity floor for spending
- route idle stable balances into approved strategies
- move funds back when liquidity or risk conditions change
- understand every action through plain-language explanations

## Phantom-First Direction

This project is being built with a Phantom-first product strategy.

That means:

- Phantom is the primary wallet connection experience
- Phantom is the main signing surface
- Phantom Cash is part of the long-term spend-ready treasury story

Current planning note:

- Phantom Cash is currently mobile-first and not available in the browser extension, so product and demo flows should respect that constraint

## Stablecoin Positioning

Mirev should not be thought of as a USDC-only product, even if USDC is the cleanest MVP asset for DeFi routing.

The intended treasury model is stablecoin-aware:

- `USDC` for deep DeFi liquidity
- `CASH` for Phantom-native spend-ready balances
- future support for `USDT`, `PYUSD`, and `USDG`

## AI System

The AI layer is broader than just an intent parser.

Mirev's AI is intended to handle:

1. Intent translation
2. Policy generation
3. Treasury decision-making
4. Simulation and evaluation
5. Plain-language explanations

The key rule is simple:

Mirev should only act automatically inside rules the user already approved.

## Consent Model

Mirev is not meant to be an unconstrained autonomous agent.

The intended control model is:

- `Inform only`: recommend, never execute
- `Auto within guardrails`: execute only inside user-approved boundaries
- `Always ask`: require confirmation for risky or out-of-policy actions

For the current MVP, execution remains user-authorized for critical flows.

## Current Technical Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Postgres
- Prisma
- Solana wallet integration

## Current Implementation State

The app already includes:

- a landing page and dashboard shell
- wallet-based signed-session auth
- Postgres plus Prisma persistence
- treasury bucket models and activity logging
- strategy adapter infrastructure
- Kamino-based earn routing for the current MVP path

## Local Setup

1. Copy `.env.example` to `.env`.
2. Set `HELIUS_API_KEY` so the app can read wallet balances server-side.
3. Replace `DATABASE_URL` with your Neon connection string if you want hosted Postgres.
4. If using local Postgres instead, keep the localhost `DATABASE_URL` and run `docker compose up -d`.
5. `NEXT_PUBLIC_SOLANA_RPC_URL` is optional and controls the client RPC endpoint.
6. Install dependencies with `pnpm install`.
7. Generate Prisma with `pnpm db:generate`.
8. Apply schema changes with `pnpm db:push` or `pnpm db:migrate`.
9. Start the app with `pnpm dev`.

## Available Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm validate`
- `pnpm db:up`
- `pnpm db:down`
- `pnpm db:generate`
- `pnpm db:migrate`
- `pnpm db:push`
- `pnpm db:studio`

## Database Health

- app route: `/`
- health route: `/api/health/db`

The health endpoint performs a simple Prisma query to verify database connectivity.

## Core Models

The current schema includes:

- `User`
- `Wallet`
- `BucketPolicy`
- `Account`
- `StrategyAllocation`
- `AutomationAction`

## Docs

- Product requirements: [PRD.md](/Users/apple/Documents/Fortune%20Stuff/colosseum/PRD.md)
- Execution roadmap: [TODO.md](/Users/apple/Documents/Fortune%20Stuff/colosseum/TODO.md)
- Technical stack notes: [TECH_STACK.md](/Users/apple/Documents/Fortune%20Stuff/colosseum/TECH_STACK.md)
