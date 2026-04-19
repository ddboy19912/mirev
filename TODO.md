# Mirev TODO

## 1. Product Lock

- [x] Confirm final project name
- [x] Confirm one-line pitch
- [x] Confirm brief description for hackathon submission
- [x] Confirm category: Consumer Finance
- [x] Freeze MVP scope from the PRD

## 2. Technical Decisions

- [x] Confirm frontend stack: Next.js + TypeScript + Tailwind + shadcn/ui
- [x] Confirm backend approach: Next.js Route Handlers or Hono
- [x] Confirm database: Postgres + Prisma
- [x] Confirm wallet/auth flow: wallet connect + signed session
- [x] Choose one Solana yield venue for MVP
- [x] Define whether MVP is fully non-custodial or app-assisted non-custodial

## 3. App Setup

- [x] Initialize project repository
- [x] Set up Next.js app
- [x] Install TypeScript, Tailwind, and UI dependencies
- [x] Configure linting, formatting, and environment variables
- [x] Add wallet adapter setup
- [x] Add database and Prisma setup
- [x] Create base app layout and navigation

## 4. Data Model

- [x] Create `users` model
- [x] Create `wallets` model
- [x] Create `bucket_policies` model
- [x] Create `accounts` model
- [x] Create `strategy_allocations` model
- [x] Create `automation_actions` model
- [x] Run initial migration

## 5. Core Product Flows

- [x] Build wallet connection flow
- [x] Build signed-session auth flow
- [ ] Build USDC deposit flow
- [ ] Build autopilot profile selection: Safe / Balanced / Growth
- [ ] Build custom allocation rule flow for Spend / Save / Earn
- [ ] Build minimum liquidity buffer setting
- [ ] Build autopilot enable/disable control

## 6. Automation Engine

- [ ] Implement deposit detection or simulated deposit trigger
- [ ] Implement allocation logic for Spend / Save / Earn
- [ ] Implement smart liquidity buffer logic
- [ ] Implement automatic routing of idle funds into earn
- [ ] Implement move-from-earn-to-spend flow
- [ ] Add clear status handling for success / pending / failed actions

## 7. Yield Integration

- [x] Pick one approved yield strategy
- [x] Implement strategy adapter interface
- [x] Implement deposit into strategy
- [x] Implement withdraw from strategy
- [x] Surface current APY and liquidity characteristics
- [x] Add fallback behavior if strategy is unavailable

## 8. Dashboard

- [x] Build home/dashboard screen
- [ ] Show total balance
- [ ] Show available-now balance
- [ ] Show Spend / Save / Earn balances
- [x] Show current APY
- [x] Show recent automated actions
- [ ] Show liquidity buffer status

## 9. Automation Feed

- [x] Build plain-language activity feed
- [ ] Log deposit received events
- [ ] Log funds allocated events
- [x] Log funds routed to earn events
- [x] Log funds returned to spend events
- [ ] Add timestamps and transaction status

## 10. Trust and Safety UX

- [x] Explain where earn funds are routed
- [x] Explain why the route was chosen
- [x] Show risk disclosure for yield
- [x] Show expected liquidity / unwind time
- [ ] Add pause autopilot control
- [ ] Add edit allocation rules flow

## 11. Demo Readiness

- [ ] Seed a clean demo account or test scenario
- [ ] Prepare a deposit demo with 1,000 USDC
- [ ] Prepare autopilot allocation demo
- [ ] Prepare yield-routing demo
- [ ] Prepare move-back-to-spend demo
- [ ] Ensure automation feed updates live during demo
- [ ] Rehearse 30-second demo story

## 12. Submission Assets

- [ ] Finalize project name
- [ ] Finalize hackathon description
- [ ] Finalize category
- [ ] Write problem statement
- [ ] Write why now / why Solana
- [ ] Write startup potential summary
- [ ] Capture product screenshots
- [ ] Record demo video

## 13. Post-MVP Ideas

- [ ] Multiple yield strategies
- [ ] Recurring deposits
- [ ] Spending integrations
- [ ] Notifications by email or Telegram
- [ ] Team / shared treasury mode
- [ ] Business accounts
- [ ] Credit products
- [ ] Mobile app
