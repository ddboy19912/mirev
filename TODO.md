# Mirev TODO

## 1. Product Positioning

- [x] Keep product name as `Mirev`
- [x] Reposition Mirev as an AI treasury copilot for Phantom
- [x] Shift narrative from USDC-only autopilot to stablecoin-aware treasury management
- [x] Define explicit consent model: inform-only, auto-within-guardrails, always-ask
- [x] Lock primary demo story around liquidity, yield, and spend readiness

## 2. Phantom-First Upgrade

- [ ] Remove non-Phantom wallet options from the primary UX
- [ ] Replace generic `WalletMultiButton` flow with a Phantom-centered connect experience
- [ ] Evaluate migration from Solana Wallet Adapter modal to Phantom React SDK
- [ ] Add a desktop extension path and a mobile deep-link path in the product plan
- [ ] Update auth copy so it clearly says users are connecting with Phantom
- [ ] Add Phantom-specific empty and install states
- [ ] Review all wallet-related branding to ensure the app feels Phantom-native

## 3. Phantom Cash Planning

- [ ] Model `CASH` as a supported spend-ready stablecoin rail
- [ ] Add `Phantom Cash aware` product language to dashboard and policy flow
- [ ] Separate what is available on mobile-only vs extension/web today
- [ ] Define when Mirev should recommend `CASH` vs `USDC`
- [ ] Document current Phantom Cash constraints so the demo stays truthful

## 4. AI Treasury Layer

- [ ] Build natural-language intent input that produces a visible treasury policy
- [ ] Persist structured policy fields: liquidity floor, approved assets, approved venues, approval thresholds
- [ ] Add policy presets: Safe, Balanced, Growth, Spend-First
- [ ] Add decision-engine rules for liquidity preservation and rebalance triggers
- [ ] Add simulation output before execution
- [ ] Add explanation cards that reference the exact policy rule used
- [ ] Show whether each action was recommended, auto-approved, or manually approved

## 5. Stablecoin Strategy

- [ ] Expand product copy beyond `USDC only`
- [ ] Define MVP asset handling for `USDC + CASH`
- [ ] Plan near-term support for `USDT`, `PYUSD`, and `USDG`
- [ ] Create a stablecoin-selection policy model based on spendability, trust, and yield access
- [ ] Add asset preference controls to the policy editor

## 6. Core Product Flows

- [x] Build wallet connection flow
- [x] Build signed-session auth flow
- [x] Build basic deposit and balance flow
- [x] Build profile-based allocation flow
- [ ] Build natural-language policy creation flow
- [ ] Build custom allocation rule flow for liquid / yield / growth
- [ ] Build liquidity floor setting
- [ ] Build autopilot enable or disable control
- [ ] Build approval threshold controls
- [ ] Build a clear "what Mirev can do automatically" summary block

## 7. Automation and Rebalancing

- [ ] Implement deposit detection or simulated deposit trigger
- [x] Implement base allocation logic
- [ ] Implement liquidity floor protection logic
- [x] Implement automatic routing of idle funds into earn
- [ ] Implement move-from-yield-to-liquid flow
- [ ] Implement rebalance triggers for yield drop and liquidity need
- [ ] Add clear status handling for success, pending, failed, and awaiting approval
- [ ] Add policy compliance checks before every action

## 8. Yield and Execution

- [x] Pick one approved yield strategy
- [x] Implement strategy adapter interface
- [x] Implement deposit into strategy
- [x] Implement withdraw from strategy
- [x] Surface current APY and liquidity characteristics
- [ ] Add transaction simulation summary before submit
- [ ] Add clearer user-facing risk labels for each strategy
- [ ] Add protocol fallback messaging if the selected venue is unavailable

## 9. Dashboard and Trust UX

- [x] Build dashboard screen
- [x] Show total balance
- [x] Show available balance
- [x] Show bucket balances
- [x] Show current APY
- [x] Show recent automated actions
- [ ] Show visible policy summary on the main dashboard
- [ ] Show liquidity floor status
- [ ] Show stablecoin mix and rail selection logic
- [ ] Show action approval mode and current safety settings
- [ ] Add pause autopilot control
- [ ] Add edit policy flow

## 10. Demo Readiness

- [ ] Create an end-to-end demo script around Phantom connect
- [ ] Seed a clean demo scenario with realistic balances
- [ ] Prepare a treasury policy example using the Ada story
- [ ] Prepare a "yield dropped, rebalancing now" wow moment
- [ ] Prepare a "you need liquidity, moving funds back" moment
- [ ] Ensure the explanation feed updates live during the demo
- [ ] Add backup simulated states in case live protocol responses are unreliable
- [ ] Rehearse a 30-second pitch and a 2-minute demo

## 11. Docs and Submission

- [x] Rewrite PRD around Phantom-first AI treasury positioning
- [x] Update README to match the new product thesis
- [x] Update TODO to reflect the next-level roadmap
- [ ] Finalize hackathon description
- [ ] Finalize problem statement
- [ ] Finalize why now / why Solana / why Phantom section
- [ ] Capture product screenshots
- [ ] Record demo video

## 12. Beyond Hackathon

- [ ] Add notifications and approval requests
- [ ] Add recurring treasury policies
- [ ] Add team and business treasury mode
- [ ] Add payroll and reserve policies
- [ ] Add broader stablecoin and RWA support
- [ ] Add cross-device Phantom experiences
- [ ] Add analytics for treasury health and runway
