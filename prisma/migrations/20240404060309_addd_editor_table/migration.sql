-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;

-- CreateTable
CREATE TABLE "Editor" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "university" TEXT,
    "qualification" TEXT,
    "areaOfExpertise" TEXT,
    "email" TEXT,
    "password" TEXT,
    "imageUrl" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Editor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Editor" ADD CONSTRAINT "Editor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
