/*
  Warnings:

  - You are about to drop the column `attendeeEmail` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `attendeeLanguage` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `attendeeName` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `attendeePhoneNumber` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `attendeeTimeZone` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `end` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `timeZone` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "attendeeEmail",
DROP COLUMN "attendeeLanguage",
DROP COLUMN "attendeeName",
DROP COLUMN "attendeePhoneNumber",
DROP COLUMN "attendeeTimeZone",
DROP COLUMN "end",
DROP COLUMN "timeZone",
ADD COLUMN     "attendee" JSONB,
ALTER COLUMN "start" SET DATA TYPE TEXT;
