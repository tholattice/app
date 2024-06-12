/*
  Warnings:

  - Made the column `layout` on table `Site` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Site" ALTER COLUMN "layout" SET NOT NULL,
ALTER COLUMN "layout" SET DEFAULT 1;
