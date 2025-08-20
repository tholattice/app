-- CreateTable
CREATE TABLE "EmployeeSchedule" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "locationId" TEXT NOT NULL,
    "masseuseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmployeeSchedule_masseuseId_date_locationId_idx" ON "EmployeeSchedule"("masseuseId", "date", "locationId");

-- CreateIndex
CREATE INDEX "EmployeeSchedule_masseuseId_idx" ON "EmployeeSchedule"("masseuseId");

-- CreateIndex
CREATE INDEX "EmployeeSchedule_locationId_idx" ON "EmployeeSchedule"("locationId");

-- CreateIndex
CREATE INDEX "EmployeeSchedule_date_idx" ON "EmployeeSchedule"("date");

-- AddForeignKey
ALTER TABLE "EmployeeSchedule" ADD CONSTRAINT "EmployeeSchedule_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeSchedule" ADD CONSTRAINT "EmployeeSchedule_masseuseId_fkey" FOREIGN KEY ("masseuseId") REFERENCES "Masseuse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
