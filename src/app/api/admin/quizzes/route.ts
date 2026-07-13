import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const quizzes = await prisma.quiz.findMany({
    include: { _count: { select: { questions: true, attempts: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ quizzes });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, weekNumber, durationMinutes, submissionDeadline } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const quiz = await prisma.quiz.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      weekNumber: weekNumber ?? 1,
      durationMinutes: durationMinutes ?? 20,
      submissionDeadline: submissionDeadline ? new Date(submissionDeadline) : null,
    },
  });

  return NextResponse.json({ quiz }, { status: 201 });
}
