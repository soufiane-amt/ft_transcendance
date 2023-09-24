/*
  Warnings:

  - You are about to drop the column `user_id` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `user1_id` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user2_id` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_user_id_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "user_id",
ADD COLUMN     "user1_id" TEXT NOT NULL,
ADD COLUMN     "user2_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
