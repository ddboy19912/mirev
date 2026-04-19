# Mirev

Mirev is a Next.js 16 app for consumer-grade treasury automation across spend, save, and earn buckets.

## Database stack

- Postgres is the confirmed database.
- Prisma is the confirmed ORM.
- Neon is the preferred hosted Postgres target.
- Docker Compose is included for local Postgres development.

## Wallet auth stack

- Solana Wallet Adapter for wallet connection
- Signed message challenge for login
- HttpOnly session cookie for app auth
- Postgres + Prisma for wallet, challenge, and session persistence

## MVP custody model

- `App-assisted non-custodial`
- User funds remain user-controlled in the wallet or in transparent protocol positions tied to the user
- Mirev does not take omnibus custody of assets
- Mirev prepares policy-driven actions and execution flows
- Users authorize critical onchain actions such as routing into Kamino Lend and withdrawing back to Spend

## MVP earn strategy

- Approved venue: `Kamino Lend`
- Strategy key: `kamino-usdc-supply`
- Asset routed: `USDC`
- Product behavior: idle USDC in the `Earn` bucket is supplied into Kamino Lend while `Spend` remains liquid outside the strategy
- Current implementation state: strategy config, adapter interface, and mocked adapter responses are wired into the app UI

## Local setup

1. Copy `.env.example` into `.env` and replace `DATABASE_URL` with your Neon connection string if you want hosted Postgres.
2. If you want local Postgres instead, keep the localhost `DATABASE_URL` and run `docker compose up -d`.
3. Install dependencies with `pnpm install`.
4. Generate the Prisma client with `pnpm db:generate`.
5. Apply the schema with `pnpm db:push` for a quick setup or `pnpm db:migrate` if you want a migration tracked in the repo.
6. Start the app with `pnpm dev`.
7. Connect a Solana wallet and sign the login message on the home page.

## Database health

- App page: `/`
- JSON health check: `/api/health/db`

The health route performs a simple Prisma query so you can verify whether the configured Postgres database is reachable.

## Prisma model coverage

The initial schema includes:

- `User`
- `Wallet`
- `BucketPolicy`
- `Account`
- `StrategyAllocation`
- `AutomationAction`
