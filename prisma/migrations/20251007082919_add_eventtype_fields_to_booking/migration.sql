/*
  Warnings:

  - The `status` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[calComEventId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('SCHEDULED', 'CANCELLED', 'COMPLETED');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "eventTypeId" INTEGER,
ADD COLUMN     "eventTypeSlug" TEXT,
ADD COLUMN     "instant" BOOLEAN DEFAULT false,
ADD COLUMN     "teamSlug" TEXT,
ADD COLUMN     "username" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'SCHEDULED';

-- CreateIndex
CREATE UNIQUE INDEX "Booking_calComEventId_key" ON "Booking"("calComEventId");
