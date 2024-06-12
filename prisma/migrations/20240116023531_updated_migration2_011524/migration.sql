/*
  Warnings:

  - You are about to drop the column `closeTime` on the `WorkingHours` table. All the data in the column will be lost.
  - You are about to drop the column `openTime` on the `WorkingHours` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[locationId,holidayDate]` on the table `HolidayHours` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[masseuseId,holidayDate]` on the table `HolidayHours` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[locationId,dayOfWeek]` on the table `WorkingHours` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[masseuseId,dayOfWeek]` on the table `WorkingHours` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `closeAMPM` to the `WorkingHours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `closeHourTime` to the `WorkingHours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `closeMinuteTime` to the `WorkingHours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openAMPM` to the `WorkingHours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openHourTime` to the `WorkingHours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openMinuteTime` to the `WorkingHours` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkingHours" DROP COLUMN "closeTime",
DROP COLUMN "openTime",
ADD COLUMN     "closeAMPM" TEXT NOT NULL,
ADD COLUMN     "closeHourTime" INTEGER NOT NULL,
ADD COLUMN     "closeMinuteTime" INTEGER NOT NULL,
ADD COLUMN     "openAMPM" TEXT NOT NULL,
ADD COLUMN     "openHourTime" INTEGER NOT NULL,
ADD COLUMN     "openMinuteTime" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "HolidayHours_locationId_holidayDate_key" ON "HolidayHours"("locationId", "holidayDate");

-- CreateIndex
CREATE UNIQUE INDEX "HolidayHours_masseuseId_holidayDate_key" ON "HolidayHours"("masseuseId", "holidayDate");

-- CreateIndex
CREATE UNIQUE INDEX "WorkingHours_locationId_dayOfWeek_key" ON "WorkingHours"("locationId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "WorkingHours_masseuseId_dayOfWeek_key" ON "WorkingHours"("masseuseId", "dayOfWeek");
