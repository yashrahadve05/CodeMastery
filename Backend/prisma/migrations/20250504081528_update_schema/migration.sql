/*
  Warnings:

  - You are about to drop the column `tastcases` on the `Problem` table. All the data in the column will be lost.
  - Added the required column `testCases` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "tastcases",
ADD COLUMN     "testCases" JSONB NOT NULL;
