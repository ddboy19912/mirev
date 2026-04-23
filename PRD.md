# Mirev PRD

## Product Name

Mirev

## One-Line Pitch

Mirev is an AI treasury copilot for Phantom that keeps stablecoin balances liquid, productive, and ready to spend.

## Product Vision

Mirev turns a Phantom wallet into a self-custodial treasury autopilot.

The long-term vision is not "better DeFi discovery" or "another yield app." The vision is a money operating system that understands what a user's funds are for, enforces their policies, routes idle balances into approved strategies, and brings money back when it is needed for spending or safety.

Users should feel:

"My money knows what it is for, and it manages itself without putting me at risk."

## Product Thesis

Stablecoin adoption is growing, but money onchain is still too manual. Users must decide:

- which stablecoin to hold
- how much to keep liquid
- where to earn yield
- when to unwind positions
- how to stay ready for spending

Mirev solves that by acting as the policy and decision layer above Phantom, Phantom Cash, and approved Solana protocols.

## Problem Statement

Managing money onchain today is:

- fragmented across wallets, apps, and protocols
- reactive instead of proactive
- too technical for normal consumers
- unsafe-feeling because automation is often poorly explained

Users around the world hold different stablecoins for different reasons. Some want DeFi depth. Some want payment rails. Some want a spend-ready balance. But most users do not want to micromanage these tradeoffs every week.

## Why Now

- Solana is becoming a stronger home for payments, stablecoins, and tokenized assets.
- Phantom is evolving from a wallet into a broader money product.
- Phantom Cash creates a new spend-ready stablecoin rail inside Phantom.
- Users increasingly expect software to interpret intent, not just execute clicks.

This creates room for a treasury intelligence layer that sits on top of existing rails and makes them usable in one coherent experience.

## Core Insight

The winning product is not "AI picks yield."

The winning product is "AI manages treasury behavior under user-approved rules."

Mirev should own:

- stablecoin allocation
- liquidity management
- policy-based automation
- explainability
- spend readiness

## Target Users

### Primary

Global Phantom users who hold stablecoins and want a safer, simpler way to manage liquidity and yield.

Examples:

- remote workers paid in stablecoins
- freelancers and creators
- crypto-native consumers
- users in volatile local-currency environments
- users who want passive treasury management without learning DeFi

### Secondary

Power users, solo operators, and small internet businesses that want treasury automation without giving up self-custody.

## User Jobs To Be Done

When I receive money in stablecoins, I want it automatically organized so I can:

- keep enough available for spending
- earn on idle balances
- reduce unnecessary risk
- understand every move
- stay in control of what can and cannot happen automatically

## Product Principles

1. Liquidity first, yield second.
2. Stable value, not single-asset dogma.
3. Autonomy must be policy-bound.
4. Every action must be explainable.
5. Phantom is the center of the user experience.
6. Self-custody and transparency are core product constraints.

## Phantom-First Strategy

For this hackathon and near-term product direction, Mirev is Phantom-centered.

That means:

- Phantom is the primary wallet connection path
- Phantom Connect is the preferred onboarding surface
- Phantom wallet accounts are the core treasury accounts
- Phantom Cash is the spend-ready destination for compatible flows

Important product constraint:

- Phantom Cash is currently mobile-first and not available in the browser extension, so the product should treat Phantom Cash support as a first-class planning input without pretending every feature is available in every client today

## Stablecoin Strategy

Mirev should not position itself as a USDC-only product.

Instead, Mirev manages stable value across the rails that matter to the user.

### MVP Stablecoin Focus

- USDC for deep Solana DeFi liquidity
- CASH for Phantom-native spend-ready balances

### Near-Term Stablecoin Expansion

- USDT
- PYUSD
- USDG

### Stablecoin Positioning

Users do not care about ticker tribalism. They care about:

- trust
- liquidity
- spendability
- yield access
- regional practicality

Mirev should abstract that decision where possible and explain it where necessary.

## What Mirev Is

Mirev is:

- an AI treasury copilot
- a policy engine
- a stablecoin orchestrator
- a Phantom-native money management layer

Mirev is not:

- just another wallet
- just another yield aggregator
- just another rebalance bot
- a custodial fintech

## The AI System

AI should not be limited to parsing natural-language input. Mirev's AI should operate across five layers.

### 1. Intent Translation

Turns natural language into structured financial goals.

Example:

"Keep enough for weekly spending, keep risk low, and earn the rest."

Becomes:

- capital preservation priority
- liquidity floor
- stablecoin-only preference
- low-risk approved venues

### 2. Policy Generation

Turns user intent into enforceable treasury rules.

Example policy:

- keep $300 liquid at all times
- approved stablecoins: USDC, CASH
- approved venues: Kamino, Lulo
- auto-move limit: $150 per rebalance
- never enter volatile assets automatically

### 3. Decision Engine

Chooses treasury actions when balances or conditions change.

Examples:

- route idle surplus into approved yield
- unwind to protect liquidity
- reduce risk when volatility rises
- move toward a better approved venue when yield falls

### 4. Simulation and Evaluation

Shows likely effects before or alongside execution.

Examples:

- expected liquidity after action
- expected yield improvement
- protocol exposure note
- whether the action fits current user policy

### 5. Explanation Layer

Explains each action in plain English.

Example:

"Moved $250 of idle stablecoins into yield because your liquid balance was above your $300 safety threshold. Your spending buffer remains untouched."

## Consent and Safety Model

Mirev should never feel like an unbounded agent.

The correct mental model is:

"Mirev is autonomous inside rules the user already approved."

### User Control Modes

#### Inform Only

- Mirev recommends actions
- user approves every move

#### Auto Within Guardrails

- Mirev can execute only within user-approved boundaries
- examples: stablecoin reallocations below a set amount, only across approved venues

#### Always Ask for Risky Actions

- any move into volatile assets
- any move above an approval threshold
- any move into a new venue
- any action that changes risk class

### Default Rule

Mirev should not move money without consent by default.

For MVP:

- users approve the policy
- users approve critical execution
- simulated automation shows what future full autonomy would look like

## Real-World Example Story

### Ada's Story

Ada is a remote designer in Lagos who gets paid in stablecoins and uses Phantom as her main wallet.

She tells Mirev:

"Keep enough for weekly spending, keep risk low, and earn the rest."

Mirev creates a policy:

- keep $300 liquid
- use only approved stable assets
- route surplus into low-risk yield venues
- move funds back when liquid balance approaches the safety floor
- ask before anything outside those rules

Then a sequence happens:

1. Ada's wallet receives $1,000 in stablecoins.
2. Mirev detects the new balance.
3. It keeps $300 liquid.
4. It routes approved surplus into yield.
5. It explains why the move happened.
6. Later, Ada's expected spending rises.
7. Mirev returns enough funds to liquidity to preserve her buffer.

This story makes the product legible:

- AI interprets intent
- policy creates consent
- automation acts within boundaries
- explanations build trust

## Core Product Experience

Input -> Policy -> Decision -> Execution -> Explanation -> Adaptation

## Core Features

### 1. Phantom-Native Onboarding

- Phantom-first connect flow
- Phantom-branded connection UX
- signed wallet authentication
- future-ready path for Phantom Connect and mobile deep links

### 2. AI Treasury Policy Engine

Users express goals in natural language or choose a preset.

Example inputs:

- low risk yield
- keep money available for spending
- earn on idle stablecoins
- never move more than $200 automatically

Output:

- liquidity floor
- approved assets
- approved venues
- auto-move boundaries
- explanation of policy

### 3. Stablecoin Allocation Engine

Transforms policy into actionable treasury buckets.

Recommended buckets:

- Spend Now
- Safety Reserve
- Productive Reserve
- Optional Growth

For the hackathon MVP, the visible UI can simplify this to:

- Liquid
- Yield
- Growth

### 4. Execution Layer

- Phantom signing flow
- transaction preparation and simulation
- protocol routing for approved strategies
- real or simulated execution depending on readiness

### 5. Autonomous Rebalancing Engine

Reacts to conditions such as:

- deposit arrival
- liquidity dropping near floor
- yield decline
- volatility increase
- user request for more liquidity

Output:

- recommended or executed reallocation
- reason for change
- visible before/after allocation

### 6. Explanation and Audit Layer

Every action should show:

- what changed
- why it changed
- whether it was auto-approved or user-approved
- what policy rule was applied

### 7. Phantom Cash Awareness

When funds need to become spend-ready, Mirev should understand Phantom Cash as a destination rail.

Examples:

- route stable balances toward spend-ready cash
- preserve a spendable balance for users who prioritize payments
- explain when CASH is more practical than leaving funds parked in yield

## Hackathon MVP

The MVP should optimize for a coherent demo, not maximum protocol surface area.

### MVP Scope

- Phantom-first wallet connection
- signed session auth
- balance detection
- policy presets plus one natural-language prompt flow
- stablecoin-aware allocation focused on USDC and CASH framing
- one approved yield venue
- simulated or real rebalance trigger
- plain-language explanation feed
- strong guardrails and user approval language

### Suggested Approved Strategy Set

- one live yield venue for earn
- one spend-ready destination story
- one clear rebalance trigger

## Winning Demo Flow

### 1. Hook

"Managing money onchain is still manual. You have to decide what stays liquid, what earns, and when to move it back. Mirev turns your Phantom wallet into a treasury autopilot."

### 2. Connect Phantom

- connect with Phantom-first UX
- show wallet balance

### 3. Express Intent

User enters:

"Keep enough for weekly spending, keep risk low, and earn the rest."

### 4. AI Generates Policy

Display:

- liquidity floor
- approved assets
- approved venues
- what Mirev can do automatically
- what always requires approval

### 5. Execute Treasury Plan

- show allocation
- show transaction prep or simulated movement
- show explanation feed

### 6. WOW Moment

Trigger a condition change:

- liquidity need rises
- yield drops
- market risk rises

Mirev responds:

"Yield dropped on your current allocation, so I shifted idle funds to a better approved venue while preserving your spending floor."

### 7. Final State

- updated allocation
- updated explanation
- visible policy compliance

## Technical Scope

### Frontend

- Next.js
- TypeScript
- Tailwind
- shadcn/ui

### Wallet Layer

- Phantom-first integration
- signed auth
- mobile-aware product planning for Phantom Cash

### Backend

- Next.js Route Handlers
- Prisma
- Postgres

### Strategy Layer

- one approved yield venue at launch
- strategy adapter abstraction
- support for simulated and live execution states

## MVP Custody Model

Mirev MVP is app-assisted non-custodial.

That means:

- user funds remain in user-controlled wallets or transparent user-owned positions
- Mirev does not take omnibus custody
- Mirev prepares decisions and execution flows
- users authorize critical onchain actions in MVP

## Success Criteria

### Hackathon

- judges understand the product in under 30 seconds
- the Phantom focus is obvious
- the AI feels real, not cosmetic
- the app demonstrates decision-making, not just dashboards
- the product shows safe autonomy with explicit consent boundaries

### Product

- wallets connected
- treasury policies created
- percent of users enabling automation
- balances routed into productive strategies
- number of policy-compliant automated actions
- retention after first allocation

### Business

- assets under management
- treasury volume managed
- take rate on routed yield
- premium automation or business plan expansion

## Competitive Positioning

Existing products cover pieces of the problem:

- wallets handle storage and swapping
- yield apps handle optimization
- protocols handle vault-level automation
- spending products handle card and cash rails

Mirev is differentiated by combining:

- natural-language treasury intent
- policy-based consent
- multi-rail stablecoin reasoning
- Phantom-native treasury UX
- explainable automation

## Risks

### Product Risks

- users may distrust AI handling money
- users may confuse policy automation with unconstrained autonomy
- users may want more manual control than expected

### Technical Risks

- wallet UX fragmentation across desktop and mobile
- strategy execution failure
- protocol dependency risk
- incomplete support across Phantom surfaces, especially for Cash flows

### Market Risks

- being mistaken for a generic yield app
- feature overlap with wallets or DeFi venues
- regional differences in stablecoin usage and payment needs

## Risk Mitigations

- make consent model explicit
- keep policy display visible at all times
- start with one transparent strategy
- make every action reversible where possible
- keep explanation quality high
- respect current Phantom Cash platform constraints in product messaging

## Roadmap Beyond Hackathon

### Phase 1

- Phantom-first consumer treasury autopilot
- stablecoin policy engine
- simple autonomous rebalancing

### Phase 2

- broader stablecoin support
- smarter spending prediction
- more venues and policy classes
- notifications and approvals

### Phase 3

- power-user and business treasury
- payroll and reserve policies
- multi-user approvals
- RWA and low-risk treasury products

## Final Positioning

Mirev is building the autonomous cash layer for Phantom and Solana.

Not just a wallet.
Not just a yield app.
Not just an AI chat box.

Mirev helps users tell their money what it is for and lets the system manage the rest within rules they trust.
