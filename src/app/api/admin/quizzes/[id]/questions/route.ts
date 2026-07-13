import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { calculateAccuracy } from "@/lib/scoring";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: quizId } = await params;
  const body = await req.json();
  const { text, options, correctOptionIndex } = body;

  if (!text?.trim() || !options?.length || correctOptionIndex == null) {
    return NextResponse.json({ error: "Invalid question data" }, { status: 400 });
  }

  const maxOrder = await prisma.question.aggregate({
    where: { quizId },
    _max: { order: true },
  });

  const question = await prisma.question.create({
    data: {
      quizId,
      text: text.trim(),
      options: JSON.stringify(options),
      correctOptionIndex,
      order: (maxOrder._max.order ?? 0) + 1,
    },
  });

  return NextResponse.json({
    question: { ...question, options: JSON.parse(question.options) },
  });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: quizId } = await params;

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: { orderBy: { order: "asc" } },
      attempts: {
        where: { finishedAt: { not: null } },
        include: {
          answers: { include: { question: true } },
        },
      },
    },
  });

  if (!quiz) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const finishedAttempts = quiz.attempts;
  const totalParticipants = finishedAttempts.length;
  const averageScore =
    totalParticipants > 0
      ? Math.round(
          finishedAttempts.reduce((s, a) => s + a.totalScore, 0) / totalParticipants
        )
      : 0;
  const highestScore =
    totalParticipants > 0
      ? Math.max(...finishedAttempts.map((a) => a.totalScore))
      : 0;

  const questionStats = quiz.questions.map((q) => {
    let correctCount = 0;
    let totalAttempts = 0;
    for (const attempt of finishedAttempts) {
      const answer = attempt.answers.find((a) => a.questionId === q.id);
      if (answer) {
        totalAttempts++;
        if (answer.isCorrect) correctCount++;
      }
    }
    return {
      questionId: q.id,
      questionText: q.text,
      order: q.order,
      totalAttempts,
      correctCount,
      accuracy: calculateAccuracy(correctCount, totalAttempts),
    };
  });

  const participants = finishedAttempts.map((attempt) => ({
    id: attempt.id,
    name: attempt.participantName,
    uid: attempt.participantUid,
    mobile: attempt.participantMobile,
    email: attempt.participantEmail,
    department: attempt.participantDepartment,
    totalScore: attempt.totalScore,
    correctCount: attempt.correctCount,
    wrongCount: attempt.wrongCount,
    accuracy: calculateAccuracy(attempt.correctCount, quiz.questions.length),
    timeTakenSeconds: attempt.timeTakenSeconds,
    questionBreakdown: quiz.questions.map((q) => {
      const answer = attempt.answers.find((a) => a.questionId === q.id);
      return {
        questionId: q.id,
        questionText: q.text,
        isCorrect: answer?.isCorrect ?? false,
        timeTakenSeconds: answer?.timeTakenSeconds ?? 0,
      };
    }),
  }));

  return NextResponse.json({
    analytics: {
      totalParticipants,
      averageScore,
      highestScore,
      questionStats,
      participants,
    },
  });
}
