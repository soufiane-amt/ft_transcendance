-- CreateTable
CREATE TABLE "match" (
    "id" TEXT NOT NULL,
    "player_1_id" TEXT NOT NULL,
    "result" TEXT NOT NULL,

    CONSTRAINT "match_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_player_1_id_fkey" FOREIGN KEY ("player_1_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
