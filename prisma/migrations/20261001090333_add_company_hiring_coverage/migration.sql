-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "checkedAt" TIMESTAMP(3),
ADD COLUMN     "hiringCountries" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "sourceUrl" TEXT;

-- Preserve useful filters for the existing fictional development catalog.
UPDATE "Company"
SET "hiringCountries" = ARRAY["country"];
