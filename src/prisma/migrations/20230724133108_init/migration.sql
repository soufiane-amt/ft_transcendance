-- CreateEnum
CREATE TYPE "DmStatus" AS ENUM ('ALLOWED', 'BANNED');

-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "DirectMessaging" (
    "id" TEXT NOT NULL,
    "user1_id" TEXT NOT NULL,
    "user2_id" TEXT NOT NULL,
    "status" "DmStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DirectMessaging_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DirectMessaging_user1_id_key" ON "DirectMessaging"("user1_id");

-- CreateIndex
CREATE UNIQUE INDEX "DirectMessaging_user2_id_key" ON "DirectMessaging"("user2_id");

-- AddForeignKey
ALTER TABLE "DirectMessaging" ADD CONSTRAINT "DirectMessaging_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessaging" ADD CONSTRAINT "DirectMessaging_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
