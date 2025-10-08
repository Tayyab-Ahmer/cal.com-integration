/*
  Warnings:

  - You are about to drop the column `attendeePhone` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `end` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "attendeePhone",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "attendeePhoneNumber" TEXT,
ADD COLUMN     "end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "language" TEXT DEFAULT 'en',
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "timeZone" TEXT;
