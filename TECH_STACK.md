# Mirev Tech Stack

## Architecture Goal

Build a hackathon-ready product that feels consumer-grade, is fast to ship, and leaves room to evolve into a real startup platform.

The architecture should optimize for:

- rapid product iteration
- clean wallet UX
- safe automation rules
- observable fund movement
- low operational overhead for an MVP

## Recommended Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

Why:

- fast product iteration
- strong app-router ergonomics
- easy deployment
- good balance between speed and polish for demo work

### Wallet and Solana Client

- Solana Wallet Adapter
- `@solana/web3.js`
- Jupiter API/SDK for routing where needed

Why:

- standard wallet connection flow
- mature Solana integration surface
- flexible transaction construction

### Backend

- Next.js Route Handlers or a small Hono API
- TypeScript
- Node.js

Why:

- keeps the team in one language
- fast to deploy
- enough for orchestration, rules evaluation, and action logging

If the app grows beyond MVP:

- move backend services into a dedicated API service
- separate automation engine from public API

### Database

- Postgres
- Prisma ORM

Why:

- clean developer experience
- easy schema iteration
- strong fit for storing:
  - users
  - wallets
  - bucket policies
  - strategy configs
  - action logs
  - notification history

### Auth

- Wallet-based auth with signed message sessions
- Privy as an optional upgrade if embedded wallet UX becomes necessary

Why:

- simplest Web3-native MVP flow
- avoids heavy auth complexity early

### Custody Model

- MVP custody model: `app-assisted non-custodial`

What this means:

- user funds remain in user-controlled wallets or transparent onchain positions
- Mirev does not take omnibus custody of funds
- Mirev prepares transactions, routing logic, and policy-driven execution flows
- users authorize critical onchain actions with signatures
- policy state, session state, strategy state, and automation history remain offchain in the app backend

Why:

- preserves the product promise of automation without taking on custodial risk
- matches the existing preference for user-controlled wallets and user-signed transactions
- avoids the complexity of delegated execution or custom account-abstraction infrastructure in MVP

### Onchain Program Strategy

For the hackathon MVP, prefer **offchain orchestration with onchain execution** over building a custom Solana program immediately.

Use:

- backend policy engine
- user-signed transactions
- existing audited protocols for yield venue integration

Avoid in MVP:

- fully custom vault program
- complex account abstraction infra
- custom yield protocol contracts unless absolutely necessary

Why:

- faster to ship
- lower security risk
- better demo reliability

### Yield Venue

Start with one transparent venue only.

Preferred rule:

- choose a conservative, reputable Solana yield destination with predictable liquidity characteristics

Examples to evaluate:

- lending market integration
- tokenized yield-bearing stablecoin
- stable liquidity vault with clear redemption profile

The key is not maximum APY. The key is trust, clarity, and reversibility.

MVP decision:

- use `Kamino Lend` as the single approved launch venue
- start with `USDC` supply only
- treat the strategy key as `kamino-usdc-supply`
- keep `Spend` fully liquid outside the venue
- use Mirev policy logic to move funds back from Kamino into `Spend` when needed

### Notifications and Analytics

- Resend or Postmark for email
- optional Telegram or push notifications later
- PostHog for product analytics

Why:

- action visibility is central to user trust
- analytics are needed to understand deposits, retention, and rule adoption

### Hosting and Infra

- Vercel for frontend/app hosting
- Neon or Supabase Postgres
- Upstash Redis only if job queues become necessary

Why:

- minimal ops burden
- fast deployment and preview environments
- strong fit for a demo-first startup MVP

## System Design

### Core Services

1. Client App
   - onboarding
   - bucket config
   - dashboard
   - action history

2. Policy Engine
   - reads allocation rules
   - determines how deposits are split
   - decides when to move funds between buckets

3. Execution Layer
   - builds transactions
   - submits or prepares user-sign flows
   - records status and errors

4. Strategy Adapter
   - abstracts supported yield venue
   - exposes deposit, withdraw, APY, liquidity state

5. Audit Log
   - records every automated action
   - powers activity feed and notifications

## Data Model

### Core Tables

`users`

- id
- created_at
- default_currency

`wallets`

- id
- user_id
- address
- wallet_type

`bucket_policies`

- id
- user_id
- spend_percent
- save_percent
- earn_percent
- risk_profile
- is_active

`accounts`

- id
- user_id
- bucket_type
- token
- current_balance

`strategy_allocations`

- id
- user_id
- strategy_name
- allocated_amount
- estimated_apy
- status

`automation_actions`

- id
- user_id
- action_type
- source_bucket
- destination_bucket
- amount
- tx_signature
- status
- created_at

## MVP Transaction Flow

### Deposit Allocation

1. User deposits USDC
2. Backend detects or receives deposit event
3. Policy engine calculates split
4. Spend balance remains liquid
5. Save balance remains parked in wallet or low-risk reserve
6. Earn balance is routed into selected strategy
7. Action log and dashboard update

### Move Back To Spend

1. User taps withdraw or spend more
2. Backend calculates required unwind from earn
3. Transaction is executed
4. Spend bucket updates
5. User sees confirmation and updated availability

## Security Approach

### MVP Security Rules

- minimize custody assumptions
- prefer user-controlled wallets
- minimize custom smart contract surface area
- integrate only one trusted strategy first
- maintain explicit action logs
- add guardrails around max allocation changes

### Things To Avoid

- unaudited protocol integrations
- hidden routing logic
- automatic movement into opaque strategies
- overpromising principal safety

## Product Engineering Priorities

### Priority 1

- reliable wallet connection
- clean bucket model
- visible automation actions
- deterministic demo flow

### Priority 2

- strong mobile responsiveness
- better funding flows
- transaction status clarity

### Priority 3

- advanced policy customization
- multiple strategy support
- team and business accounts

## Design Direction

The UI should feel:

- calm
- premium
- financial
- trustworthy

Avoid:

- degenerate trading aesthetics
- noisy crypto dashboards
- overly technical labels on the main user journey

Good product language:

- Spend
- Save
- Earn
- Available Now
- On Autopilot
- Recent Moves

## Suggested Repo Structure

```text
app/
components/
lib/
  solana/
  policies/
  strategies/
  analytics/
prisma/
docs/
```

## Final Recommendation

For the hackathon, build Mirev as:

- a polished Next.js consumer app
- a TypeScript backend policy engine
- wallet-authenticated users
- one stablecoin
- one yield strategy
- one magical deposit-to-autopilot flow

That is the highest-probability setup for shipping a credible product quickly while preserving a strong startup path.
