import "dotenv/config";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn("DATABASE_URL is not set in environment variables. Database client might fail to connect.");
}
const adapter = new PrismaNeon({ connectionString: connectionString || "" });
const prisma = new PrismaClient({ adapter });

const FRONTEND_QUESTIONS = [
  {
    text: "Which statement most accurately represents NexaSoul?",
    options: [
      "A community that encourages technical growth through learning, building, and collaboration",
      "A student-driven initiative focused on technology exposure and networking",
      "A platform dedicated to promoting emerging digital skills",
      "A collaborative ecosystem for innovation-focused student engagement",
    ],
    correctOptionIndex: 0,
  },
  {
    text: "Frontend Development currently serves as:",
    options: [
      "The specialization around which NexaSoul's present activities are primarily organized",
      "The first technology domain introduced within NexaSoul",
      "The most demanded skill among NexaSoul members",
      "The area contributing most to industry placements",
    ],
    correctOptionIndex: 0,
  },
  {
    text: "Which outcome best aligns with NexaSoul's mission?",
    options: [
      "Increasing awareness of technological trends",
      "Helping students acquire practical technical experience and growth opportunities",
      "Building industry-ready portfolios through competitive events",
      "Encouraging participation in technical communities",
    ],
    correctOptionIndex: 1,
  },
  {
    text: "Which event would most strongly reflect NexaSoul's current direction?",
    options: [
      "Responsive Design Masterclass",
      "Frontend Development Workshop",
      "Modern Web Technologies Seminar",
      "UI Engineering Bootcamp",
    ],
    correctOptionIndex: 1,
  },
  {
    text: "Which future roadmap best matches NexaSoul's planned expansion?",
    options: [
      "Full Stack Development and Cybersecurity",
      "Full Stack Development and DevOps",
      "Cybersecurity and Cloud Computing",
      "Artificial Intelligence and Cybersecurity",
    ],
    correctOptionIndex: 0,
  },
  {
    text: "Which technology provides the foundational structure upon which web content is organized?",
    options: [
      "HTML",
      "DOM",
      "XML",
      "JSX",
    ],
    correctOptionIndex: 0,
  },
  {
    text: "Which technology is directly responsible for defining how HTML elements are visually presented?",
    options: [
      "CSS",
      "Tailwind CSS",
      "Bootstrap",
      "SCSS",
    ],
    correctOptionIndex: 0,
  },
  {
    text: "Which technology enables a webpage to respond dynamically to user actions?",
    options: [
      "JavaScript",
      "TypeScript",
      "jQuery",
      "ECMAScript",
    ],
    correctOptionIndex: 0,
  },
  {
    text: "Which layout system is specifically optimized for arranging content along one primary axis?",
    options: [
      "CSS Grid",
      "Flexbox",
      "Multi-column Layout",
      "Block Layout",
    ],
    correctOptionIndex: 1,
  },
  {
    text: "Which statement about display: none is MOST accurate?",
    options: [
      "The element remains in the document flow but is not visible.",
      "The element becomes transparent but interactive.",
      "The element is removed from visual rendering and layout calculations.",
      "The element remains rendered but inaccessible.",
    ],
    correctOptionIndex: 2,
  },
  {
    text: "Which semantic element most clearly communicates navigational intent to browsers and assistive technologies?",
    options: [
      "<header>",
      "<section>",
      "<menu>",
      "<nav>",
    ],
    correctOptionIndex: 3,
  },
  {
    text: "Which selector specifically targets every element assigned the class \"card\"?",
    options: [
      "#card",
      ".card",
      "card",
      "[card]",
    ],
    correctOptionIndex: 1,
  },
  {
    text: "Media queries are primarily used to:",
    options: [
      "Adapt styles based on characteristics of the viewing environment",
      "Optimize stylesheet execution speed",
      "Detect browser compatibility issues",
      "Apply conditional JavaScript execution",
    ],
    correctOptionIndex: 0,
  },
  {
    text: "Which method retrieves an element by matching its unique ID value?",
    options: [
      "querySelector()",
      "getElementById()",
      "querySelectorAll()",
      "getElementsByTagName()",
    ],
    correctOptionIndex: 1,
  },
  {
    text: "Which option is best classified as a JavaScript library rather than a framework?",
    options: [
      "Angular",
      "Vue",
      "React",
      "Next.js",
    ],
    correctOptionIndex: 2,
  },
  {
    text: "What is Git's primary role within a software development workflow?",
    options: [
      "Managing application deployment",
      "Tracking changes and coordinating collaborative development",
      "Managing project dependencies",
      "Hosting source code repositories",
    ],
    correctOptionIndex: 1,
  },
  {
    text: "Which property contributes directly to the space between an element's content and its border?",
    options: [
      "Margin",
      "Padding",
      "Gap",
      "Spacing",
    ],
    correctOptionIndex: 1,
  },
  {
    text: "The alt attribute serves which primary purpose?",
    options: [
      "Improving image indexing and accessibility",
      "Specifying fallback image formats",
      "Controlling image responsiveness",
      "Improving image compression",
    ],
    correctOptionIndex: 0,
  },
  {
    text: "Which description best explains the role of an API in frontend development?",
    options: [
      "A mechanism for rendering dynamic content",
      "A standardized interface for data exchange between systems",
      "A protocol used to style web applications",
      "A service responsible for storing user data",
    ],
    correctOptionIndex: 1,
  },
  {
    text: "Responsive design is primarily concerned with:",
    options: [
      "Improving performance across networks",
      "Maintaining usability across varying screen sizes and devices",
      "Reducing code duplication",
      "Eliminating device-specific layouts",
    ],
    correctOptionIndex: 1,
  },
  {
    text: "Which of the following is NOT a responsibility of HTML?",
    options: [
      "Defining document structure",
      "Providing semantic meaning",
      "Handling user interaction logic",
      "Organizing content",
    ],
    correctOptionIndex: 2,
  },
  {
    text: "Which statement is FALSE?",
    options: [
      "Flexbox can align items along a main axis.",
      "Grid is useful for two-dimensional layouts.",
      "JavaScript is commonly used for interactivity.",
      "CSS directly communicates with databases.",
    ],
    correctOptionIndex: 3,
  },
  {
    text: "Which technology is LEAST associated with styling?",
    options: [
      "CSS",
      "SCSS",
      "Bootstrap",
      "React",
    ],
    correctOptionIndex: 3,
  },
  {
    text: "Which statement about Git is MOST inaccurate?",
    options: [
      "Git tracks file changes.",
      "Git supports collaboration.",
      "Git is a version control system.",
      "Git replaces databases in web applications.",
    ],
    correctOptionIndex: 3,
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
