import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import BrutalCard from "@/components/BrutalCard";
import SrujanaTypewriter from "@/components/SrujanaTypewriter";

async function getActiveQuiz() {
  const quiz = await prisma.quiz.findFirst({
    where: { isActive: true },
    include: { _count: { select: { questions: true } } },
    orderBy: { createdAt: "desc" },
  });

  if (!quiz) return null;

  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    weekNumber: quiz.weekNumber,
    durationMinutes: quiz.durationMinutes,
    questionCount: quiz._count.questions,
  };
}

export default async function HomePage() {
  const activeQuiz = await getActiveQuiz();

  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="pattern-stripes py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <span className="sticker bg-mint text-ink text-sm mb-4 inline-block animate-wiggle">
                IT&apos;S GIVING MAIN CHARACTER ENERGY
              </span>
              <h1
                className="text-5xl md:text-7xl font-black leading-[0.95] mb-6"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Welcome to{" "}
                <SrujanaTypewriter />
              </h1>
              <p className="text-xl md:text-2xl font-semibold mb-4 text-ink/80">
                NexaSoul&apos;s weekly online campaign for Frontend × Full Stack devs who
                actually touch grass… online.
              </p>
              <p className="text-lg mb-8 text-ink/70">
                Week 1 drops a <strong>20-question trivia blitz</strong> — 20 minutes,
                speed bonuses, and absolutely zero timer peeking. Lock in. No cap.
              </p>

              <div className="flex flex-wrap gap-4">
                {activeQuiz ? (
                  <Link
                    href={`/quiz/${activeQuiz.id}`}
                    className="brutal-border-lg bg-hot-pink text-white px-8 py-4 font-black text-lg uppercase tracking-wide brutal-hover animate-pulse-border inline-block"
                  >
                    🔥 Enter the Blitz →
                  </Link>
                ) : (
                  <span className="brutal-border bg-white px-8 py-4 font-bold text-ink/50">
                    No active quiz rn — check back soon!
                  </span>
                )}
                <Link
                  href="/admin"
                  className="brutal-border bg-electric-blue text-white px-8 py-4 font-black uppercase tracking-wide brutal-hover inline-block"
                >
                  Admin Portal
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center animate-float">
              <div className="brutal-border-lg bg-white p-6 rotate-2 max-w-sm w-full">
                <Image
                  src="/Nexasoul-jlogo.png"
                  alt="NexaSoul"
                  width={400}
                  height={400}
                  className="w-full h-auto"
                  priority
                  unoptimized
                />
              </div>
              <span className="absolute -top-4 -right-4 sticker bg-sun-yellow text-ink animate-shake text-lg">
                BUILT DIFFERENT
              </span>
              <span className="absolute -bottom-4 -left-4 sticker bg-coral text-white text-sm">
                SRUJANA WEEK 1
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Scoring Rules */}
      <section className="py-16 bg-paper">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className="text-4xl font-black text-center mb-4"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            How You Stack Points
          </h2>
          <p className="text-center text-ink/60 mb-12 font-medium">
            Fast fingers = fat stacks. Slow vibes = still valid, just fewer points.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <BrutalCard color="bg-sun-yellow" animate className="text-center">
              <p className="text-5xl font-black mb-2">+10</p>
              <p className="font-bold uppercase tracking-wide">Correct Answer</p>
              <p className="text-sm mt-2 text-ink/70">You ate. No notes.</p>
            </BrutalCard>
            <BrutalCard color="bg-mint" animate className="text-center">
              <p className="text-5xl font-black mb-2">+5 / +3</p>
              <p className="font-bold uppercase tracking-wide">Speed Bonus</p>
              <p className="text-sm mt-2 text-ink/70">
                ≤5s = +5 pts • ≤10s = +3 pts • After that? Skill issue (jk)
              </p>
            </BrutalCard>
            <BrutalCard color="bg-coral text-white" animate className="text-center">
              <p className="text-5xl font-black mb-2">0</p>
              <p className="font-bold uppercase tracking-wide">Wrong Answer</p>
              <p className="text-sm mt-2 text-white/80">No penalty. Just no clout.</p>
            </BrutalCard>
          </div>
        </div>
      </section>

      {/* Quiz Info */}
      <section className="py-16 pattern-dots">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <BrutalCard color="bg-white">
              <span className="sticker bg-hot-pink text-white text-xs mb-4 inline-block">
                THE RULES
              </span>
              <ul className="space-y-4 text-lg">
                <li className="flex gap-3">
                  <span className="font-black text-hot-pink">01</span>
                  <span><strong>20 MCQs</strong> — one shot per question, no take-backs</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-black text-electric-blue">02</span>
                  <span><strong>20 minutes</strong> total — timer is hidden, trust the process</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-black text-mint">03</span>
                  <span>Click an option → <strong>instant next question</strong>. No dilly-dallying.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-black text-coral">04</span>
                  <span>Results show score, accuracy, time, and the full breakdown.</span>
                </li>
              </ul>
            </BrutalCard>

            <BrutalCard color="bg-electric-blue text-white">
              <span className="sticker bg-sun-yellow text-ink text-xs mb-4 inline-block">
                {activeQuiz ? "LIVE NOW" : "COMING SOON"}
              </span>
              {activeQuiz ? (
                <>
                  <h3 className="text-2xl font-black mb-2" style={{ fontFamily: "var(--font-fraunces)" }}>
                    {activeQuiz.title}
                  </h3>
                  <p className="mb-4 text-white/80">{activeQuiz.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="brutal-border-sm bg-white/10 p-3 text-center">
                      <p className="text-3xl font-black">{activeQuiz.questionCount}</p>
                      <p className="text-xs uppercase tracking-wide">Questions</p>
                    </div>
                    <div className="brutal-border-sm bg-white/10 p-3 text-center">
                      <p className="text-3xl font-black">{activeQuiz.durationMinutes}</p>
                      <p className="text-xs uppercase tracking-wide">Minutes</p>
                    </div>
                  </div>
                  <Link
                    href={`/quiz/${activeQuiz.id}`}
                    className="brutal-border bg-sun-yellow text-ink px-6 py-3 font-black uppercase brutal-hover inline-block w-full text-center"
                  >
                    Let&apos;s Gooo →
                  </Link>
                </>
              ) : (
                <p className="text-xl font-semibold">
                  Admin hasn&apos;t activated a quiz yet. Slide into our DMs or wait for the drop.
                </p>
              )}
            </BrutalCard>
          </div>
        </div>
      </section>

      {/* About NexaSoul */}
      <section className="py-16 bg-cream border-y-4 border-ink">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2
            className="text-4xl font-black mb-6"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            About NexaSoul
          </h2>
          <p className="text-xl leading-relaxed text-ink/80">
            NexaSoul is a technical club obsessed with <strong>Frontend</strong> and{" "}
            <strong>Full Stack Development</strong>. We run <strong>Srujana</strong> — a weekly
            online-only event series where devs compete, learn, and absolutely send it.
            One day a week. Pure chaos. Pure growth.
          </p>
        </div>
      </section>
    </div>
  );
}
