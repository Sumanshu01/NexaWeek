-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "weekNumber" INTEGER NOT NULL DEFAULT 1,
    "durationMinutes" INTEGER NOT NULL DEFAULT 20,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "submissionDeadline" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quizId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "correctOptionIndex" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quizId" TEXT NOT NULL,
    "participantName" TEXT NOT NULL,
    "participantEmail" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "wrongCount" INTEGER NOT NULL DEFAULT 0,
    "timeTakenSeconds" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Attempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedOptionIndex" INTEGER,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "timeTakenSeconds" INTEGER NOT NULL DEFAULT 0,
    "basePoints" INTEGER NOT NULL DEFAULT 0,
    "speedBonus" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "answeredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Answer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "Attempt" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Question_quizId_idx" ON "Question"("quizId");

-- CreateIndex
CREATE INDEX "Attempt_quizId_idx" ON "Attempt"("quizId");

-- CreateIndex
CREATE INDEX "Answer_attemptId_idx" ON "Answer"("attemptId");

-- CreateIndex
CREATE INDEX "Answer_questionId_idx" ON "Answer"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_attemptId_questionId_key" ON "Answer"("attemptId", "questionId");
