/*
  Warnings:

  - You are about to drop the column `banned_at` on the `ChannelMembership` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChannelMembership" DROP COLUMN "banned_at",
ADD COLUMN     "ban_expires_at" TIMESTAMP(3);
