/*
  Warnings:

  - You are about to drop the `LoginHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SearchHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TopUpHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransactionHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LoginHistory" DROP CONSTRAINT "LoginHistory_accountId_fkey";

-- DropForeignKey
ALTER TABLE "SearchHistory" DROP CONSTRAINT "SearchHistory_accountId_fkey";

-- DropForeignKey
ALTER TABLE "TopUpHistory" DROP CONSTRAINT "TopUpHistory_accountId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionHistory" DROP CONSTRAINT "TransactionHistory_accountId_fkey";

-- AlterTable
ALTER TABLE "account" ALTER COLUMN "date_created" SET DEFAULT TO_CHAR(NOW() :: DATE, 'YYYY-MM-DD'),
ALTER COLUMN "time_created" SET DEFAULT TO_CHAR(NOW() :: TIME, 'HH24:MI:SS');

-- DropTable
DROP TABLE "LoginHistory";

-- DropTable
DROP TABLE "SearchHistory";

-- DropTable
DROP TABLE "TopUpHistory";

-- DropTable
DROP TABLE "TransactionHistory";
