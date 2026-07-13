import "dotenv/config";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/index.js";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL || "" });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Check current quiz status
  const quizzes = await prisma.quiz.findMany({
    select: { id: true, title: true, isActive: true },
  });
  console.log("Current quizzes:", JSON.stringify(quizzes, null, 2));

  // Activate all quizzes that are currently inactive
  const result = await prisma.quiz.updateMany({
    where: { isActive: false },
    data: { isActive: true },
  });
  console.log(`Activated ${result.count} quiz(zes).`);

  // Verify
  const updated = await prisma.quiz.findMany({
    select: { id: true, title: true, isActive: true },
  });
  console.log("Updated quizzes:", JSON.stringify(updated, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
