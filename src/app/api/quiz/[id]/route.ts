import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { order: "asc" },
        select: { id: true, text: true, options: true, order: true },
      },
    },
  });

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  if (!quiz.isActive) {
    return NextResponse.json({ error: "Quiz is not active" }, { status: 403 });
  }

  if (quiz.submissionDeadline && new Date() > quiz.submissionDeadline) {
    return NextResponse.json({ error: "Submission deadline has passed" }, { status: 403 });
  }

  return NextResponse.json({
    quiz: {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      weekNumber: quiz.weekNumber,
      durationMinutes: quiz.durationMinutes,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: JSON.parse(q.options) as string[],
        order: q.order,
      })),
    },
  });
}
