/*
  Warnings:

  - You are about to drop the `MassageAppointment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[wechatUsername]` on the table `Masseuse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `massageId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `masseuseId` to the `HolidayHours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `masseuseServiceId` to the `Masseuse` table without a default value. This is not possible if the table is not empty.
  - Made the column `wechatUsername` on table `Masseuse` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `locationId` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `masseuseId` to the `WorkingHours` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MassageAddons" AS ENUM ('cupping', 'backwalking', 'hotstones', 'aromatherapy', 'tigerbalm');

-- AlterEnum
ALTER TYPE "MassageType" ADD VALUE 'sauna';

-- DropForeignKey
ALTER TABLE "MassageAppointment" DROP CONSTRAINT "MassageAppointment_appointmentId_fkey";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "oauth_token" TEXT,
ADD COLUMN     "oauth_token_secret" TEXT;

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "massageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "HolidayHours" ADD COLUMN     "masseuseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Masseuse" ADD COLUMN     "masseuseServiceId" TEXT NOT NULL,
ALTER COLUMN "wechatUsername" SET NOT NULL;

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "locationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WorkingHours" ADD COLUMN     "masseuseId" TEXT NOT NULL;

-- DropTable
DROP TABLE "MassageAppointment";

-- CreateTable
CREATE TABLE "LocationClient" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "LocationClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasseuseService" (
    "id" TEXT NOT NULL,
    "type" "MassageType"[],
    "addons" "MassageAddons"[],
    "duration" INTEGER[],

    CONSTRAINT "MasseuseService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Massage" (
    "id" TEXT NOT NULL,
    "type" "MassageType" NOT NULL,

    CONSTRAINT "Massage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MassageAddon" (
    "id" TEXT NOT NULL,
    "type" "MassageAddons" NOT NULL,
    "massageId" TEXT NOT NULL,

    CONSTRAINT "MassageAddon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationMasseuse" (
    "id" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "masseuseId" TEXT NOT NULL,

    CONSTRAINT "LocationMasseuse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LocationClient_clientId_locationId_key" ON "LocationClient"("clientId", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "Massage_id_type_key" ON "Massage"("id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "MassageAddon_type_massageId_key" ON "MassageAddon"("type", "massageId");

-- CreateIndex
CREATE UNIQUE INDEX "LocationMasseuse_locationId_masseuseId_key" ON "LocationMasseuse"("locationId", "masseuseId");

-- CreateIndex
CREATE UNIQUE INDEX "Masseuse_wechatUsername_key" ON "Masseuse"("wechatUsername");

-- AddForeignKey
ALTER TABLE "Masseuse" ADD CONSTRAINT "Masseuse_masseuseServiceId_fkey" FOREIGN KEY ("masseuseServiceId") REFERENCES "MasseuseService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationClient" ADD CONSTRAINT "LocationClient_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationClient" ADD CONSTRAINT "LocationClient_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MassageAddon" ADD CONSTRAINT "MassageAddon_massageId_fkey" FOREIGN KEY ("massageId") REFERENCES "Massage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_massageId_fkey" FOREIGN KEY ("massageId") REFERENCES "Massage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationMasseuse" ADD CONSTRAINT "LocationMasseuse_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationMasseuse" ADD CONSTRAINT "LocationMasseuse_masseuseId_fkey" FOREIGN KEY ("masseuseId") REFERENCES "Masseuse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkingHours" ADD CONSTRAINT "WorkingHours_masseuseId_fkey" FOREIGN KEY ("masseuseId") REFERENCES "Masseuse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HolidayHours" ADD CONSTRAINT "HolidayHours_masseuseId_fkey" FOREIGN KEY ("masseuseId") REFERENCES "Masseuse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
