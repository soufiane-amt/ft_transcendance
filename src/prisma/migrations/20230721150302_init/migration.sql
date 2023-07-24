/*
  Warnings:

  - You are about to drop the column `msg_allowed` on the `Friendships` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RelationStatus" AS ENUM ('PENDING', 'FRIENDS', 'BLOCK');

-- AlterTable
ALTER TABLE "Friendships" DROP COLUMN "msg_allowed",
ADD COLUMN     "relationStatus" "RelationStatus" NOT NULL DEFAULT 'PENDING';
