-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'IN_ACTIVE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "Status" "UserStatus",
ADD COLUMN     "createdDate" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
