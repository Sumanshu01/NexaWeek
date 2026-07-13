import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

const FRONTEND_QUESTIONS = [
  {
    text: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Markup Language",
      "Home Tool Markup Language",
    ],
    correctOptionIndex: 0,
  },
  {
    text: "Which CSS property controls text size?",
    options: ["font-style", "text-size", "font-size", "text-style"],
    correctOptionIndex: 2,
  },
  {
    text: "What is the virtual DOM in React?",
    options: [
      "A browser API",
      "A lightweight copy of the real DOM",
      "A CSS framework",
      "A database layer",
    ],
    correctOptionIndex: 1,
  },
  {
    text: "Which hook is used for side effects in React?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    correctOptionIndex: 1,
  },
  {
    text: "What does API stand for?",
    options: [
      "Application Programming Interface",
      "Advanced Program Integration",
      "Automated Processing Interface",
      "Application Process Integration",
    ],
    correctOptionIndex: 0,
  },
  {
    text: "Which HTTP method is used to create a resource?",
    options: ["GET", "PUT", "POST", "DELETE"],
    correctOptionIndex: 2,
  },
  {
    text: "What is TypeScript?",
    options: [
      "A CSS preprocessor",
      "A typed superset of JavaScript",
      "A database language",
      "A testing framework",
    ],
    correctOptionIndex: 1,
  },
  {
    text: "Which tag is used for the largest heading in HTML?",
    options: ["<h6>", "<head>", "<h1>", "<header>"],
    correctOptionIndex: 2,
  },
  {
    text: "What does CSS Flexbox primarily help with?",
    options: [
      "Database queries",
      "Layout and alignment",
      "Server routing",
      "Image compression",
    ],
    correctOptionIndex: 1,
  },
  {
    text: "Which symbol is used for destructuring in JavaScript?",
    options: ["{}", "[]", "()", "<>"],
    correctOptionIndex: 0,
  },
  {
    text: "What is Next.js built on top of?",
    options: ["Vue.js", "Angular", "React", "Svelte"],
    correctOptionIndex: 2,
  },
  {
    text: "Which Git command creates a new branch?",
    options: [
      "git branch <name>",
      "git new <name>",
      "git create <name>",
      "git fork <name>",
    ],
    correctOptionIndex: 0,
  },
  {
    text: "What does npm stand for?",
    options: [
      "Node Package Manager",
      "New Project Module",
      "Network Protocol Manager",
      "Node Process Manager",
    ],
    correctOptionIndex: 0,
  },
  {
    text: "Which CSS unit is relative to the root element font size?",
    options: ["em", "px", "rem", "vh"],
    correctOptionIndex: 2,
  },
  {
    text: "What is the purpose of async/await in JavaScript?",
    options: [
      "Style elements",
      "Handle asynchronous operations",
      "Create loops",
      "Define classes",
    ],
    correctOptionIndex: 1,
  },
  {
    text: "Which database is commonly used with Node.js?",
    options: ["Photoshop", "MongoDB", "Figma", "Webpack"],
    correctOptionIndex: 1,
  },
  {
    text: "What does REST stand for in REST API?",
    options: [
      "Representational State Transfer",
      "Remote Execution State Tool",
      "Resource Endpoint Service Transfer",
      "Runtime Execution Service Tool",
    ],
    correctOptionIndex: 0,
  },
  {
    text: "Which HTML attribute makes an input field required?",
    options: ["mandatory", "required", "needed", "validate"],
    correctOptionIndex: 1,
  },
  {
    text: "What is Tailwind CSS?",
    options: [
      "A utility-first CSS framework",
      "A JavaScript runtime",
      "A backend framework",
      "A version control tool",
    ],
    correctOptionIndex: 0,
  },
  {
    text: "Which method converts JSON string to JavaScript object?",
    options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.toObject()"],
    correctOptionIndex: 0,
  },
];

async function main() {
  await prisma.answer.deleteMany();
  await prisma.attempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();

  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 7);

  const quiz = await prisma.quiz.create({
    data: {
      title: "Srujana Week 1 — Frontend X Full Stack Trivia Blitz",
      description:
        "20 MCQs. 20 minutes. Zero chill. Show NexaSoul you actually know your hooks from your hoaxes.",
      weekNumber: 1,
      durationMinutes: 20,
      isActive: true,
      submissionDeadline: deadline,
      questions: {
        create: FRONTEND_QUESTIONS.map((q, i) => ({
          text: q.text,
          options: JSON.stringify(q.options),
          correctOptionIndex: q.correctOptionIndex,
          order: i + 1,
        })),
      },
    },
  });

  console.log(`Seeded quiz: ${quiz.title} (${quiz.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
