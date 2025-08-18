-- CreateEnum
CREATE TYPE "TimeOffStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ScheduleChangeType" AS ENUM ('ADD', 'MODIFY', 'REMOVE', 'SWAP');

-- CreateEnum
CREATE TYPE "ScheduleChangeStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('owner', 'admin', 'masseuse', 'client');

-- CreateEnum
CREATE TYPE "MassageType" AS ENUM ('body', 'foot', 'sauna');

-- CreateEnum
CREATE TYPE "MassageAddons" AS ENUM ('cupping', 'backwalking', 'hotstones', 'aromatherapy', 'tigerbalm');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "oauth_token_secret" TEXT,
    "oauth_token" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Masseuse" (
    "id" TEXT NOT NULL,
    "wechatUsername" TEXT NOT NULL,
    "masseuseName" TEXT NOT NULL,
    "masseuseId" TEXT NOT NULL,
    "masseuseServiceId" TEXT NOT NULL,

    CONSTRAINT "Masseuse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

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
    "serviceNames" TEXT[],
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
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "masseuseAppointmentName" TEXT NOT NULL,
    "masseuseAppointmentId" TEXT NOT NULL,
    "clientAppointmentName" TEXT NOT NULL,
    "clientAppointmentId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "massageId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationMasseuse" (
    "id" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "masseuseId" TEXT NOT NULL,

    CONSTRAINT "LocationMasseuse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "phoneNumber" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkingHours" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "openTime" TIMESTAMP(3) NOT NULL DEFAULT '2024-01-01 09:00:00'::timestamp without time zone,
    "closeTime" TIMESTAMP(3) NOT NULL DEFAULT '2024-01-01 17:00:00'::timestamp without time zone,
    "locationId" TEXT,
    "masseuseId" TEXT,

    CONSTRAINT "WorkingHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeOffRequest" (
    "id" TEXT NOT NULL,
    "masseuseId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "TimeOffStatus" NOT NULL DEFAULT 'PENDING',
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeOffRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleChange" (
    "id" TEXT NOT NULL,
    "masseuseId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "oldStartTime" TIMESTAMP(3),
    "oldEndTime" TIMESTAMP(3),
    "newStartTime" TIMESTAMP(3),
    "newEndTime" TIMESTAMP(3),
    "changeType" "ScheduleChangeType" NOT NULL,
    "reason" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ScheduleChangeStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "ScheduleChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HolidayHours" (
    "id" TEXT NOT NULL,
    "holidayDate" TIMESTAMP(3) NOT NULL,
    "openTime" TIMESTAMP(3) NOT NULL DEFAULT '2024-01-01 09:00:00'::timestamp without time zone,
    "closeTime" TIMESTAMP(3) NOT NULL DEFAULT '2024-01-01 17:00:00'::timestamp without time zone,
    "locationId" TEXT,
    "masseuseId" TEXT,

    CONSTRAINT "HolidayHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hashedKey" TEXT NOT NULL,
    "partialKey" TEXT NOT NULL,
    "expires" TIMESTAMP(3),
    "lastUsed" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "content" TEXT,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "imageBlurhash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "siteId" TEXT,
    "userId" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "logo" TEXT,
    "font" TEXT NOT NULL DEFAULT 'font-cal',
    "layout" INTEGER NOT NULL DEFAULT 1,
    "image" TEXT,
    "imageBlurhash" TEXT,
    "subdomain" TEXT,
    "customDomain" TEXT,
    "message404" TEXT DEFAULT 'You''ve found a page that doesn''t exist.',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locationId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "stripeId" TEXT NOT NULL,
    "billingCycleStart" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_id_key" ON "User"("name", "id");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Masseuse_wechatUsername_key" ON "Masseuse"("wechatUsername");

-- CreateIndex
CREATE UNIQUE INDEX "Masseuse_masseuseName_masseuseId_key" ON "Masseuse"("masseuseName", "masseuseId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_clientName_clientId_key" ON "Client"("clientName", "clientId");

-- CreateIndex
CREATE UNIQUE INDEX "LocationClient_clientId_locationId_key" ON "LocationClient"("clientId", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "Massage_id_type_key" ON "Massage"("id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "MassageAddon_type_massageId_key" ON "MassageAddon"("type", "massageId");

-- CreateIndex
CREATE UNIQUE INDEX "LocationMasseuse_locationId_masseuseId_key" ON "LocationMasseuse"("locationId", "masseuseId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkingHours_locationId_dayOfWeek_key" ON "WorkingHours"("locationId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "WorkingHours_masseuseId_dayOfWeek_key" ON "WorkingHours"("masseuseId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "TimeOffRequest_masseuseId_idx" ON "TimeOffRequest"("masseuseId");

-- CreateIndex
CREATE INDEX "TimeOffRequest_status_idx" ON "TimeOffRequest"("status");

-- CreateIndex
CREATE INDEX "TimeOffRequest_startDate_endDate_idx" ON "TimeOffRequest"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "ScheduleChange_masseuseId_idx" ON "ScheduleChange"("masseuseId");

-- CreateIndex
CREATE INDEX "ScheduleChange_locationId_idx" ON "ScheduleChange"("locationId");

-- CreateIndex
CREATE INDEX "ScheduleChange_status_idx" ON "ScheduleChange"("status");

-- CreateIndex
CREATE UNIQUE INDEX "HolidayHours_locationId_holidayDate_key" ON "HolidayHours"("locationId", "holidayDate");

-- CreateIndex
CREATE UNIQUE INDEX "HolidayHours_masseuseId_holidayDate_key" ON "HolidayHours"("masseuseId", "holidayDate");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Token_hashedKey_key" ON "Token"("hashedKey");

-- CreateIndex
CREATE INDEX "Token_userId_idx" ON "Token"("userId");

-- CreateIndex
CREATE INDEX "Post_siteId_idx" ON "Post"("siteId");

-- CreateIndex
CREATE INDEX "Post_userId_idx" ON "Post"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_siteId_key" ON "Post"("slug", "siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Site_subdomain_key" ON "Site"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "Site_customDomain_key" ON "Site"("customDomain");

-- CreateIndex
CREATE INDEX "Site_userId_idx" ON "Site"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_role_key" ON "Subscription"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeId_key" ON "Subscription"("stripeId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Masseuse" ADD CONSTRAINT "Masseuse_masseuseName_masseuseId_fkey" FOREIGN KEY ("masseuseName", "masseuseId") REFERENCES "User"("name", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Masseuse" ADD CONSTRAINT "Masseuse_masseuseServiceId_fkey" FOREIGN KEY ("masseuseServiceId") REFERENCES "MasseuseService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_clientName_clientId_fkey" FOREIGN KEY ("clientName", "clientId") REFERENCES "User"("name", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationClient" ADD CONSTRAINT "LocationClient_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationClient" ADD CONSTRAINT "LocationClient_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MassageAddon" ADD CONSTRAINT "MassageAddon_massageId_fkey" FOREIGN KEY ("massageId") REFERENCES "Massage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clientAppointmentName_clientAppointmentId_fkey" FOREIGN KEY ("clientAppointmentName", "clientAppointmentId") REFERENCES "Client"("clientName", "clientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_massageId_fkey" FOREIGN KEY ("massageId") REFERENCES "Massage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_masseuseAppointmentName_masseuseAppointmentId_fkey" FOREIGN KEY ("masseuseAppointmentName", "masseuseAppointmentId") REFERENCES "Masseuse"("masseuseName", "masseuseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationMasseuse" ADD CONSTRAINT "LocationMasseuse_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationMasseuse" ADD CONSTRAINT "LocationMasseuse_masseuseId_fkey" FOREIGN KEY ("masseuseId") REFERENCES "Masseuse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkingHours" ADD CONSTRAINT "WorkingHours_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkingHours" ADD CONSTRAINT "WorkingHours_masseuseId_fkey" FOREIGN KEY ("masseuseId") REFERENCES "Masseuse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeOffRequest" ADD CONSTRAINT "TimeOffRequest_masseuseId_fkey" FOREIGN KEY ("masseuseId") REFERENCES "Masseuse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleChange" ADD CONSTRAINT "ScheduleChange_masseuseId_fkey" FOREIGN KEY ("masseuseId") REFERENCES "Masseuse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleChange" ADD CONSTRAINT "ScheduleChange_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HolidayHours" ADD CONSTRAINT "HolidayHours_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HolidayHours" ADD CONSTRAINT "HolidayHours_masseuseId_fkey" FOREIGN KEY ("masseuseId") REFERENCES "Masseuse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
