-- CreateTable
CREATE TABLE "Journal" (
    "id" SERIAL NOT NULL,
    "type" TEXT,
    "title" TEXT,
    "abstract" TEXT,
    "paperUrl" TEXT,
    "primaryDomain" TEXT,
    "secondaryDomain" TEXT,
    "country" TEXT,
    "authorNames" TEXT,
    "authorEmail" TEXT,
    "howToKnow" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Journal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
