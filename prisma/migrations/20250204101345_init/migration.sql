-- AlterTable
ALTER TABLE "account" ADD COLUMN     "walletBalance" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ALTER COLUMN "date_created" SET DEFAULT TO_CHAR(NOW() :: DATE, 'YYYY-MM-DD'),
ALTER COLUMN "time_created" SET DEFAULT TO_CHAR(NOW() :: TIME, 'HH24:MI:SS');

-- CreateTable
CREATE TABLE "TopUpHistory" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" VARCHAR(32) NOT NULL,
    "status" VARCHAR(16) NOT NULL,

    CONSTRAINT "TopUpHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionHistory" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "type" VARCHAR(32) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(16) NOT NULL,
    "description" TEXT,

    CONSTRAINT "TransactionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchHistory" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "query" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginHistory" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "logged_in" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logged_out" TIMESTAMP(3),

    CONSTRAINT "LoginHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TopUpHistory" ADD CONSTRAINT "TopUpHistory_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchHistory" ADD CONSTRAINT "SearchHistory_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginHistory" ADD CONSTRAINT "LoginHistory_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
