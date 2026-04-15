# Mirev PRD

## Product Summary

Mirev is an autopilot for stablecoin cash flow. It helps users receive stablecoins, automatically split balances into spend, save, and earn buckets, and route only idle funds into transparent onchain yield while keeping daily liquidity instantly available.

The core idea is simple: users should get the upside of stablecoin finance without manually managing wallets, DeFi protocols, or portfolio moves.

## Problem

Stablecoin users have three recurring problems:

1. Their money is fragmented across wallets, exchanges, and apps.
2. Idle balances often earn nothing unless users actively manage DeFi.
3. Existing crypto products are either too technical for normal users or too narrow to become a daily money product.

Today, a user who wants to hold, spend, and earn on stablecoins must manually decide:

- how much to keep liquid
- how much to save
- where to earn yield
- when to move funds back for spending

That workflow is too complex for mainstream adoption.

## Vision

Make stablecoins feel like an intelligent operating account.

Users should be able to receive money once, define simple goals, and let Mirev handle the rest:

- keep spending money available
- preserve emergency liquidity
- move idle balances into approved yield strategies
- present one clean consumer experience

## Target User

### Primary User

Global stablecoin-native consumers who already hold or receive USDC/USDT and want a better way to manage cash without learning DeFi.

Examples:

- remote workers and freelancers
- crypto-native salary earners
- power users who keep balances in stablecoins
- users in unstable local-currency environments
- people who want "better than a bank account" behavior

### Secondary User

Small teams or solo operators using stablecoins as an operating balance for payouts, savings, and yield on idle funds.

## Jobs To Be Done

When I receive money in stablecoins, I want it automatically organized so I can spend confidently, save safely, and earn on idle balances without manually moving funds between apps.

## Product Principles

1. Cash flow first, yield second.
2. Consumer-simple UX, protocol-grade execution underneath.
3. Liquid funds must always remain accessible.
4. Yield must be transparent, reversible, and bounded by policy.
5. Users set intent; Mirev handles execution.

## MVP Scope

### Core MVP

1. Stablecoin wallet connection and deposit flow
2. Single-currency support to start: USDC on Solana
3. User-configurable allocation rules across:
   - Spend
   - Save
   - Earn
4. Autopilot profile selection:
   - Safe
   - Balanced
   - Growth
5. Automatic rebalancing on deposit
6. Smart liquidity buffer that preserves a user-defined amount for everyday availability before routing idle funds into earn
7. Instant "withdraw from earn to spend" flow
8. Yield routing into one approved strategy at launch
9. Simple dashboard with:
   - total balance
   - available now balance
   - bucket balances
   - current APY
   - recent automated actions
10. Live automation feed / notification log for every automated movement, such as:
   - deposit received
   - funds allocated to spend/save/earn
   - funds routed into earn
   - funds returned to spend

### Hackathon Demo MVP

The shortest compelling demo flow:

1. User connects wallet
2. User chooses an Autopilot profile and confirms allocation policy, e.g. 50% spend / 30% save / 20% earn
3. User sets a minimum available-now liquidity buffer
4. User receives 1,000 USDC
5. Mirev instantly allocates funds into buckets
6. Earn bucket is routed into yield while the liquidity buffer remains spendable
7. Automation feed shows each action in plain language
8. User taps "pay" or "move to spend"
9. Funds become available immediately without manually unwinding multiple positions

## Out of Scope for MVP

- cross-chain routing
- multi-asset basket management
- AI chat interface
- credit cards
- lending against user balances
- business invoicing/accounting
- fiat on/off ramps
- support for many yield strategies at launch
- social features

## Key User Stories

1. As a user, I can connect my wallet and deposit USDC.
2. As a user, I can define how incoming money should be split between spend, save, and earn.
3. As a user, I can choose a simple autopilot profile instead of configuring everything from scratch.
4. As a user, I can see exactly where my funds are allocated.
5. As a user, I can keep a known liquid balance for everyday spending.
6. As a user, I can earn yield on idle balances without manually choosing protocols.
7. As a user, I can instantly move funds back from earn into spend.
8. As a user, I can review every automated action taken on my behalf.
9. As a user, I can pause or edit autopilot rules at any time.

## User Experience

### Onboarding

1. Connect wallet
2. Deposit USDC
3. Choose cash flow profile:
   - Conservative
   - Balanced
   - Growth
4. Set minimum available-now balance
5. Review allocation rules
6. Enable Autopilot

### Main Dashboard

The main screen should answer:

- How much money do I have?
- How much is safe to spend now?
- How much is saved?
- How much is earning?
- What did Mirev do automatically?

### Trust Layer

The product must clearly communicate:

- where earn funds are routed
- why that route was chosen
- current APY
- potential risks
- how quickly funds can return to spend
- what liquidity buffer is being preserved

## Success Metrics

### Product Metrics

- activated wallets
- deposits completed
- autopilot rules enabled
- percentage of deposited funds allocated automatically
- 7-day and 30-day retention
- average balance per active user
- percent of users who use both spend and earn buckets

### Business Metrics

- assets under management
- take rate on yield
- net revenue per active user
- retained balances after 30 days

### Hackathon Success Criteria

- judges understand the product in under 30 seconds
- product shows a clear user benefit, not just protocol cleverness
- demo proves real automation and not mocked manual steps
- startup path is obvious from the product story

## Differentiation

Mirev is not:

- just a wallet
- just a yield aggregator
- just a bank replacement

Mirev is a stablecoin operating system for personal cash flow.

The wedge is the combination of:

- automated allocation
- autopilot profiles that feel consumer-native
- smart liquidity preservation
- instant liquidity preservation
- transparent yield routing
- one consumer-friendly balance experience

## Risks

### Product Risks

- users may not trust automation with money
- users may not understand yield risk
- users may want more manual control than expected

### Market Risks

- product gets mistaken for a generic wallet
- product gets compared only on APY with incumbents
- stablecoin consumer adoption may concentrate in specific regions or user niches first

### Technical Risks

- unreliable strategy execution
- slow liquidity exit from yield strategies
- account abstraction or wallet UX friction
- protocol dependency risk on selected yield venues

## Risk Mitigations

- start with one transparent, low-complexity strategy
- show clear controls and audit trail
- keep spend bucket fully liquid
- allow instant manual override
- communicate allocation rules in plain language

## Monetization

Primary model:

- percentage take rate on generated yield

Secondary models:

- premium autopilot plans
- advanced strategies for power users
- B2B or team treasury tier later

## Why Solana

Solana is a product advantage here because:

- low fees make frequent rebalancing practical
- stablecoin payments are fast and usable for everyday flows
- the ecosystem already has strong liquidity and consumer wallet behavior
- the UX ceiling is higher for a product that may automate many small money actions

## Roadmap

### Phase 1

- USDC only
- one yield strategy
- manual deposit
- simple autopilot rules
- single-user dashboard

### Phase 2

- multiple strategy policies
- recurring deposits
- spending integrations
- smarter liquidity forecasting

### Phase 3

- team/shared treasury mode
- credit products
- payroll and payout automation
- multi-asset and multi-chain support

## Submission Positioning

### One-Line Pitch

Mirev is an autopilot for stablecoin cash flow that automatically splits your money into spend, save, and earn while keeping daily liquidity instantly available.

### Category

Consumer Finance

### Why It Can Win

- immediate consumer value
- clear startup path
- easy demo
- strong Solana fit
- not just another wallet if positioned around cash flow automation
