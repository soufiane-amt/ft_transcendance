-- AlterTable
ALTER TABLE "DirectMessaging" ADD COLUMN     "blocker_id" TEXT DEFAULT '';

-- AddForeignKey
ALTER TABLE "DirectMessaging" ADD CONSTRAINT "DirectMessaging_blocker_id_fkey" FOREIGN KEY ("blocker_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
