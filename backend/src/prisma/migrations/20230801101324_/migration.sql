/*
  Warnings:

  - A unique constraint covering the columns `[channel_id,user_id]` on the table `ChannelMembership` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChannelMembership_channel_id_user_id_key" ON "ChannelMembership"("channel_id", "user_id");
