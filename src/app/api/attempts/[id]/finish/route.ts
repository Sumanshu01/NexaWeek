import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateAccuracy } from "@/lib/scoring";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: attemptId } = await params;

  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: {
      quiz: { include: { questions: { orderBy: { order: "asc" } } } },
      answers: true,
    },
  });

  if (!attempt) {
    return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  }

  if (attempt.finishedAt) {
    return NextResponse.json({ attemptId, alreadyFinished: true });
  }

  const answeredIds = new Set(attempt.answers.map((a) => a.questionId));
  const unanswered = attempt.quiz.questions.filter((q) => !answeredIds.has(q.id));

  for (const question of unanswered) {
    await prisma.answer.create({
      data: {
        attemptId,
        questionId: question.id,
        selectedOptionIndex: null,
        isCorrect: false,
        timeTakenSeconds: 0,
        basePoints: 0,
        speedBonus: 0,
        totalPoints: 0,
      },
    });
  }

  const allAnswers = await prisma.answer.findMany({ where: { attemptId } });
  const correctCount = allAnswers.filter((a) => a.isCorrect).length;
  const wrongCount = allAnswers.length - correctCount;
  const totalScore = allAnswers.reduce((sum, a) => sum + a.totalPoints, 0);
  const timeTakenSeconds = Math.min(
    Math.floor((Date.now() - attempt.startedAt.getTime()) / 1000),
    attempt.quiz.durationMinutes * 60
  );

  await prisma.attempt.update({
    where: { id: attemptId },
    data: {
      finishedAt: new Date(),
      totalScore,
      correctCount,
      wrongCount,
      timeTakenSeconds,
    },
  });

  return NextResponse.json({
    attemptId,
    totalScore,
    correctCount,
    wrongCount,
    timeTakenSeconds,
    accuracy: calculateAccuracy(correctCount, allAnswers.length),
  });
}
