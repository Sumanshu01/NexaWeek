import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const {
    participantName,
    participantUid,
    participantMobile,
    participantEmail,
    participantDepartment,
  } = body;

  if (!participantName?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!participantUid?.trim()) {
    return NextResponse.json({ error: "UID is required" }, { status: 400 });
  }
  if (!participantMobile?.trim()) {
    return NextResponse.json({ error: "Mobile number is required" }, { status: 400 });
  }
  if (!participantEmail?.trim()) {
    return NextResponse.json({ error: "Email ID is required" }, { status: 400 });
  }
  if (!participantDepartment?.trim()) {
    return NextResponse.json({ error: "Department name is required" }, { status: 400 });
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: { questions: true },
  });

  if (!quiz || !quiz.isActive) {
    return NextResponse.json({ error: "Quiz not available" }, { status: 403 });
  }

  if (quiz.submissionDeadline && new Date() > quiz.submissionDeadline) {
    return NextResponse.json({ error: "Deadline passed" }, { status: 403 });
  }

  const existingAttempt = await prisma.attempt.findFirst({
    where: {
      quizId: id,
      participantEmail: {
        equals: participantEmail.trim(),
        mode: "insensitive",
      },
    },
  });

  if (existingAttempt) {
    return NextResponse.json(
      { error: "This email has already attempted this quiz" },
      { status: 400 }
    );
  }

  const attempt = await prisma.attempt.create({
    data: {
      quizId: id,
      participantName: participantName.trim(),
      participantUid: participantUid.trim(),
      participantMobile: participantMobile.trim(),
      participantEmail: participantEmail.trim(),
      participantDepartment: participantDepartment.trim(),
    },
  });

  return NextResponse.json({
    attemptId: attempt.id,
    startedAt: attempt.startedAt.toISOString(),
    durationMinutes: quiz.durationMinutes,
    totalQuestions: quiz.questions.length,
  });
}
