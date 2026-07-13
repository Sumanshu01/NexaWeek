/*
  Warnings:

  - Added the required column `participantDepartment` to the `Attempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participantMobile` to the `Attempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participantUid` to the `Attempt` table without a default value. This is not possible if the table is not empty.
  - Made the column `participantEmail` on table `Attempt` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quizId" TEXT NOT NULL,
    "participantName" TEXT NOT NULL,
    "participantUid" TEXT NOT NULL,
    "participantMobile" TEXT NOT NULL,
    "participantEmail" TEXT NOT NULL,
    "participantDepartment" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "wrongCount" INTEGER NOT NULL DEFAULT 0,
    "timeTakenSeconds" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Attempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Attempt" ("correctCount", "finishedAt", "id", "participantEmail", "participantName", "quizId", "startedAt", "timeTakenSeconds", "totalScore", "wrongCount") SELECT "correctCount", "finishedAt", "id", "participantEmail", "participantName", "quizId", "startedAt", "timeTakenSeconds", "totalScore", "wrongCount" FROM "Attempt";
DROP TABLE "Attempt";
ALTER TABLE "new_Attempt" RENAME TO "Attempt";
CREATE INDEX "Attempt_quizId_idx" ON "Attempt"("quizId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
