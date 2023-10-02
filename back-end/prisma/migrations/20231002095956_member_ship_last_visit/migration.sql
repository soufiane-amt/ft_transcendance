/*
  Warnings:

  - The values [PENDING] on the enum `RelationStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `last_visit` to the `ChannelMembership` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RelationStatus_new" AS ENUM ('FRIENDS', 'BLOCK');
ALTER TABLE "Friendships" ALTER COLUMN "relationStatus" DROP DEFAULT;
ALTER TABLE "Friendships" ALTER COLUMN "relationStatus" TYPE "RelationStatus_new" USING ("relationStatus"::text::"RelationStatus_new");
ALTER TYPE "RelationStatus" RENAME TO "RelationStatus_old";
ALTER TYPE "RelationStatus_new" RENAME TO "RelationStatus";
DROP TYPE "RelationStatus_old";
ALTER TABLE "Friendships" ALTER COLUMN "relationStatus" SET DEFAULT 'FRIENDS';
COMMIT;

-- AlterTable
ALTER TABLE "ChannelMembership" ADD COLUMN     "last_visit" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "is_banned" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Friendships" ALTER COLUMN "relationStatus" SET DEFAULT 'FRIENDS';
