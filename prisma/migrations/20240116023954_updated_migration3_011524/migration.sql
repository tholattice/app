-- DropForeignKey
ALTER TABLE "HolidayHours" DROP CONSTRAINT "HolidayHours_locationId_fkey";

-- DropForeignKey
ALTER TABLE "HolidayHours" DROP CONSTRAINT "HolidayHours_masseuseId_fkey";

-- DropForeignKey
ALTER TABLE "WorkingHours" DROP CONSTRAINT "WorkingHours_locationId_fkey";

-- DropForeignKey
ALTER TABLE "WorkingHours" DROP CONSTRAINT "WorkingHours_masseuseId_fkey";

-- AlterTable
ALTER TABLE "HolidayHours" ALTER COLUMN "locationId" DROP NOT NULL,
ALTER COLUMN "masseuseId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "WorkingHours" ALTER COLUMN "locationId" DROP NOT NULL,
ALTER COLUMN "masseuseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "WorkingHours" ADD CONSTRAINT "WorkingHours_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkingHours" ADD CONSTRAINT "WorkingHours_masseuseId_fkey" FOREIGN KEY ("masseuseId") REFERENCES "Masseuse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HolidayHours" ADD CONSTRAINT "HolidayHours_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HolidayHours" ADD CONSTRAINT "HolidayHours_masseuseId_fkey" FOREIGN KEY ("masseuseId") REFERENCES "Masseuse"("id") ON DELETE SET NULL ON UPDATE CASCADE;
