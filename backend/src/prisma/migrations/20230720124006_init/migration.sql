/*
  Warnings:

  - Added the required column `player_2_id` to the `match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "match" ADD COLUMN     "player_2_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_player_2_id_fkey" FOREIGN KEY ("player_2_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
