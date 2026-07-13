import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateAnswerScore } from "@/lib/scoring";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: attemptId } = await params;
  const body = await req.json();
  const { questionId, selectedOptionIndex, timeTakenSeconds } = body;

  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: {
      quiz: true,
      answers: true,
    },
  });

  if (!attempt || attempt.finishedAt) {
    return NextResponse.json({ error: "Invalid attempt" }, { status: 400 });
  }

  const elapsed = Math.floor((Date.now() - attempt.startedAt.getTime()) / 1000);
  const maxDuration = attempt.quiz.durationMinutes * 60;
  if (elapsed >= maxDuration) {
    return NextResponse.json({ error: "Time expired" }, { status: 403 });
  }

  const existing = attempt.answers.find((a) => a.questionId === questionId);
  if (existing) {
    return NextResponse.json({ error: "Already answered" }, { status: 400 });
  }

  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question || question.quizId !== attempt.quizId) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const isCorrect = selectedOptionIndex === question.correctOptionIndex;
  const timeTaken = Math.max(0, Math.min(timeTakenSeconds ?? 0, 300));
  const score = calculateAnswerScore(isCorrect, timeTaken);

  const answer = await prisma.answer.create({
    data: {
      attemptId,
      questionId,
      selectedOptionIndex,
      isCorrect,
      timeTakenSeconds: timeTaken,
      basePoints: score.basePoints,
      speedBonus: score.speedBonus,
      totalPoints: score.totalPoints,
    },
  });

  return NextResponse.json({
    answerId: answer.id,
    isCorrect,
    basePoints: score.basePoints,
    speedBonus: score.speedBonus,
    totalPoints: score.totalPoints,
  });
}
