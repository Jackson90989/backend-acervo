/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `Game` table. All the data in the column will be lost.
  - Added the required column `filePath` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filePath` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "fileUrl",
ADD COLUMN     "filePath" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "fileUrl",
ADD COLUMN     "filePath" TEXT NOT NULL;
