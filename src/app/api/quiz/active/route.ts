import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const quiz = await prisma.quiz.findFirst({
    where: { isActive: true },
    include: {
      questions: { orderBy: { order: "asc" } },
      _count: { select: { questions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!quiz) {
    return NextResponse.json({ quiz: null });
  }

  return NextResponse.json({
    quiz: {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      weekNumber: quiz.weekNumber,
      durationMinutes: quiz.durationMinutes,
      isActive: quiz.isActive,
      submissionDeadline: quiz.submissionDeadline?.toISOString() ?? null,
      questionCount: quiz._count.questions,
    },
  });
}
