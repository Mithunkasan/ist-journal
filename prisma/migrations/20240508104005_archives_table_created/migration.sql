-- CreateTable
CREATE TABLE "Archives" (
    "id" SERIAL NOT NULL,
    "type" TEXT,
    "title" TEXT,
    "paperUrl" TEXT,
    "abstract" TEXT,
    "country" TEXT,
    "primaryDomain" TEXT,
    "secondaryDomain" TEXT,
    "authorNames" TEXT,
    "authorEmail" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3),
    "status" "Status",

    CONSTRAINT "Archives_pkey" PRIMARY KEY ("id")
);
