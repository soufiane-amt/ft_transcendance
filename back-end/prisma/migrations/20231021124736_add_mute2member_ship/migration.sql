-- AlterTable
ALTER TABLE "ChannelMembership" ADD COLUMN     "is_muted" BOOLEAN DEFAULT false,
ADD COLUMN     "mute_expires_at" TIMESTAMP(3);
