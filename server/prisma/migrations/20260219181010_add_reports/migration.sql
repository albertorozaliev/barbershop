-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "dt" TIMESTAMP(3) NOT NULL,
    "project" TEXT NOT NULL,
    "manager" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);
