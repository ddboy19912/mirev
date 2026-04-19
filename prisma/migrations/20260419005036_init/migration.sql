-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "defaultCurrency" TEXT NOT NULL DEFAULT 'USDC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "walletType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BucketPolicy" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "spendPercent" INTEGER NOT NULL,
    "savePercent" INTEGER NOT NULL,
    "earnPercent" INTEGER NOT NULL,
    "riskProfile" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BucketPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bucketType" TEXT NOT NULL,
    "token" TEXT NOT NULL DEFAULT 'USDC',
    "currentBalance" DECIMAL(18,6) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrategyAllocation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "strategyName" TEXT NOT NULL,
    "allocatedAmount" DECIMAL(18,6) NOT NULL DEFAULT 0,
    "estimatedApy" DECIMAL(5,2),
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StrategyAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationAction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "sourceBucket" TEXT,
    "destinationBucket" TEXT,
    "amount" DECIMAL(18,6) NOT NULL DEFAULT 0,
    "txSignature" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutomationAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthChallenge" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_address_key" ON "Wallet"("address");

-- CreateIndex
CREATE INDEX "Wallet_userId_idx" ON "Wallet"("userId");

-- CreateIndex
CREATE INDEX "BucketPolicy_userId_idx" ON "BucketPolicy"("userId");

-- CreateIndex
CREATE INDEX "Account_userId_bucketType_idx" ON "Account"("userId", "bucketType");

-- CreateIndex
CREATE INDEX "StrategyAllocation_userId_status_idx" ON "StrategyAllocation"("userId", "status");

-- CreateIndex
CREATE INDEX "AutomationAction_userId_createdAt_idx" ON "AutomationAction"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AuthChallenge_walletAddress_key" ON "AuthChallenge"("walletAddress");

-- CreateIndex
CREATE INDEX "AuthChallenge_walletId_idx" ON "AuthChallenge"("walletId");

-- CreateIndex
CREATE INDEX "AuthChallenge_expiresAt_idx" ON "AuthChallenge"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "AuthSession_tokenHash_key" ON "AuthSession"("tokenHash");

-- CreateIndex
CREATE INDEX "AuthSession_userId_idx" ON "AuthSession"("userId");

-- CreateIndex
CREATE INDEX "AuthSession_walletId_idx" ON "AuthSession"("walletId");

-- CreateIndex
CREATE INDEX "AuthSession_expiresAt_idx" ON "AuthSession"("expiresAt");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketPolicy" ADD CONSTRAINT "BucketPolicy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrategyAllocation" ADD CONSTRAINT "StrategyAllocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationAction" ADD CONSTRAINT "AutomationAction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthChallenge" ADD CONSTRAINT "AuthChallenge_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
