import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: { orderBy: { order: "asc" } },
      _count: { select: { attempts: true } },
    },
  });

  if (!quiz) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    quiz: {
      ...quiz,
      questions: quiz.questions.map((q) => ({
        ...q,
        options: JSON.parse(q.options) as string[],
      })),
    },
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const updateData: Record<string, unknown> = {};
  if (body.title !== undefined) updateData.title = body.title.trim();
  if (body.description !== undefined) updateData.description = body.description?.trim() ?? null;
  if (body.weekNumber !== undefined) updateData.weekNumber = body.weekNumber;
  if (body.durationMinutes !== undefined) updateData.durationMinutes = body.durationMinutes;
  if (body.isActive !== undefined) updateData.isActive = body.isActive;
  if (body.submissionDeadline !== undefined) {
    updateData.submissionDeadline = body.submissionDeadline
      ? new Date(body.submissionDeadline)
      : null;
  }

  const quiz = await prisma.quiz.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ quiz });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.quiz.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
