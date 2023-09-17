/*
  Warnings:

  - A unique constraint covering the columns `[dm_id]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_channel_id_fkey";

-- AlterTable
ALTER TABLE "DirectMessaging" ALTER COLUMN "status" SET DEFAULT 'ALLOWED';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "dm_id" TEXT,
ALTER COLUMN "channel_id" DROP NOT NULL,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "is_read" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Message_dm_id_key" ON "Message"("dm_id");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_dm_id_fkey" FOREIGN KEY ("dm_id") REFERENCES "DirectMessaging"("id") ON DELETE SET NULL ON UPDATE CASCADE;
