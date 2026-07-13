import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const question = await prisma.question.update({
    where: { id },
    data: {
      text: body.text?.trim(),
      options: body.options ? JSON.stringify(body.options) : undefined,
      correctOptionIndex: body.correctOptionIndex,
      order: body.order,
    },
  });

  return NextResponse.json({
    question: { ...question, options: JSON.parse(question.options) },
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.question.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
