import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function QuizRedirectPage() {
  const quiz = await prisma.quiz.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  if (quiz) {
    redirect(`/quiz/${quiz.id}`);
  }

  redirect("/");
}
