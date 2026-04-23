# Mirev App Pack

## Overview

Mirev is an AI treasury copilot for Phantom that keeps stablecoin balances liquid, productive, and ready to spend.

This document combines the product vision, operating model, roadmap, and technical context for the app.

## Product Summary

Mirev sits above Phantom accounts, Phantom Cash, and approved Solana protocols as the treasury intelligence layer.

It helps users:

- define treasury intent
- create enforceable treasury policies
- route idle stablecoin balances into approved yield
- preserve liquidity for spending
- adapt to balance and market changes
- understand every action in plain language

## Core Product Idea

The goal is not to build another yield app.

The goal is to build the autonomous cash layer for Phantom and Solana.

## Product Differentiation

Mirev combines:

- Phantom-first onboarding
- stablecoin-aware treasury management
- policy-based automation
- explainable AI
- spend-ready treasury planning

## AI System

Mirev uses AI across:

1. Intent translation
2. Policy generation
3. Decision engine
4. Simulation and evaluation
5. Explanation layer

## Consent Model

Mirev only acts automatically inside rules the user approved.

Control modes:

- Inform only
- Auto within guardrails
- Always ask

## Real-World Story

Ada is a remote designer in Lagos using Phantom as her primary wallet.

She tells Mirev:

"Keep enough for weekly spending, keep risk low, and earn the rest."

Mirev turns that into a treasury policy, routes surplus into approved yield, and moves funds back when her liquid balance approaches its minimum threshold.

## Stablecoin Direction

MVP focus:

- USDC
- CASH

Near-term support:

- USDT
- PYUSD
- USDG

## Phantom Direction

Mirev is being designed as a Phantom-first app.

That means:

- Phantom is the main connect flow
- Phantom signing is central to execution
- Phantom Cash is a strategic spend-ready rail

Important note:

- Phantom Cash is currently mobile-first, so demo and product planning should account for that

## Technical Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma
- Postgres
- Solana wallet integration

## Current Implementation State

The repo already includes:

- wallet-based auth
- signed session flow
- treasury bucket persistence
- strategy adapter infrastructure
- dashboard and activity feed
- Kamino-based earn integration for the current MVP path

## Next-Level Upgrade Priorities

1. Make wallet connection Phantom-centered
2. Replace generic allocation language with treasury policy language
3. Add visible approval boundaries and user control modes
4. Add natural-language policy input
5. Add simulation and explanation surfaces
6. Add stablecoin-aware positioning beyond USDC
7. Build a stronger rebalance wow moment for the demo

## Primary Docs

- PRD: `PRD.md`
- TODO: `TODO.md`
- README: `README.md`
