import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateAccuracy } from "@/lib/scoring";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: attemptId } = await params;

  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: {
      quiz: { include: { questions: { orderBy: { order: "asc" } } } },
      answers: { include: { question: true } },
    },
  });

  if (!attempt || !attempt.finishedAt) {
    return NextResponse.json({ error: "Results not available" }, { status: 404 });
  }

  const totalQuestions = attempt.quiz.questions.length;

  return NextResponse.json({
    id: attempt.id,
    participantName: attempt.participantName,
    totalScore: attempt.totalScore,
    correctCount: attempt.correctCount,
    wrongCount: attempt.wrongCount,
    timeTakenSeconds: attempt.timeTakenSeconds,
    accuracy: calculateAccuracy(attempt.correctCount, totalQuestions),
    totalQuestions,
    answers: attempt.quiz.questions.map((q) => {
      const answer = attempt.answers.find((a) => a.questionId === q.id);
      const options = JSON.parse(q.options) as string[];
      return {
        questionText: q.text,
        selectedOption:
          answer?.selectedOptionIndex != null
            ? options[answer.selectedOptionIndex]
            : null,
        correctOption: options[q.correctOptionIndex],
        isCorrect: answer?.isCorrect ?? false,
        timeTakenSeconds: answer?.timeTakenSeconds ?? 0,
        totalPoints: answer?.totalPoints ?? 0,
      };
    }),
  });
}
