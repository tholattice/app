/*
  Warnings:

  - You are about to drop the column `closeAMPM` on the `WorkingHours` table. All the data in the column will be lost.
  - You are about to drop the column `closeHourTime` on the `WorkingHours` table. All the data in the column will be lost.
  - You are about to drop the column `closeMinuteTime` on the `WorkingHours` table. All the data in the column will be lost.
  - You are about to drop the column `openAMPM` on the `WorkingHours` table. All the data in the column will be lost.
  - You are about to drop the column `openHourTime` on the `WorkingHours` table. All the data in the column will be lost.
  - You are about to drop the column `openMinuteTime` on the `WorkingHours` table. All the data in the column will be lost.
  - Made the column `phoneNumber` on table `Location` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "HolidayHours" ALTER COLUMN "openTime" SET DEFAULT '2024-01-01 09:00:00 +00:00',
ALTER COLUMN "closeTime" SET DEFAULT '2024-01-01 17:00:00 +00:00';

-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "phoneNumber" SET NOT NULL;

-- AlterTable
ALTER TABLE "WorkingHours" DROP COLUMN "closeAMPM",
DROP COLUMN "closeHourTime",
DROP COLUMN "closeMinuteTime",
DROP COLUMN "openAMPM",
DROP COLUMN "openHourTime",
DROP COLUMN "openMinuteTime",
ADD COLUMN     "closeTime" TIMESTAMP(3) NOT NULL DEFAULT '2024-01-01 17:00:00 +00:00',
ADD COLUMN     "openTime" TIMESTAMP(3) NOT NULL DEFAULT '2024-01-01 09:00:00 +00:00';
