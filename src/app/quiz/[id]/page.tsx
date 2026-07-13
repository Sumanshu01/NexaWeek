"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BrutalButton from "@/components/BrutalButton";
import BrutalCard from "@/components/BrutalCard";

interface QuizInfo {
  id: string;
  title: string;
  description: string | null;
  weekNumber: number;
  durationMinutes: number;
  questions: { id: string }[];
}

export default function QuizStartPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [quizId, setQuizId] = useState<string>("");
  const [quiz, setQuiz] = useState<QuizInfo | null>(null);
  const [name, setName] = useState("");
  const [uid, setUid] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    params.then(({ id }) => {
      setQuizId(id);
      fetch(`/api/quiz/${id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.error) setError(data.error);
          else setQuiz(data.quiz);
        })
        .catch(() => setError("Failed to load quiz"))
        .finally(() => setLoading(false));
    });
  }, [params]);

  const handleStart = async () => {
    if (!name.trim()) {
      setError("Drop your name — we need to know who ate!");
      return;
    }
    if (!uid.trim()) {
      setError("UID is required — no anonymous legends here!");
      return;
    }
    if (!mobile.trim()) {
      setError("Mobile number is required!");
      return;
    }
    if (!email.trim()) {
      setError("Email ID is required!");
      return;
    }
    if (!department.trim()) {
      setError("Department name is required!");
      return;
    }
    setStarting(true);
    setError("");

    const res = await fetch(`/api/quiz/${quizId}/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participantName: name,
        participantUid: uid,
        participantMobile: mobile,
        participantEmail: email,
        participantDepartment: department,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to start");
      setStarting(false);
      return;
    }

    sessionStorage.setItem(
      `quiz_${quizId}`,
      JSON.stringify({
        attemptId: data.attemptId,
        startedAt: data.startedAt,
        durationMinutes: data.durationMinutes,
      })
    );

    router.push(`/quiz/${quizId}/play`);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-2xl font-black animate-pulse">Loading the blitz...</p>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <BrutalCard color="bg-coral text-white">
          <p className="text-2xl font-black mb-4">Oop — {error}</p>
          <BrutalButton variant="secondary" onClick={() => router.push("/")}>
            Back Home
          </BrutalButton>
        </BrutalCard>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20 pattern-dots min-h-[70vh]">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8 animate-slide-up">
          <span className="sticker bg-sun-yellow text-ink mb-4 inline-block">
            SRUJANA WEEK {quiz?.weekNumber}
          </span>
          <h1
            className="text-4xl md:text-5xl font-black mb-4"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            {quiz?.title}
          </h1>
          <p className="text-lg text-ink/70">{quiz?.description}</p>
        </div>

        <BrutalCard color="bg-white" animate className="mb-6">
          <div className="grid grid-cols-3 gap-4 text-center mb-6">
            <div className="brutal-border-sm bg-sun-yellow p-3">
              <p className="text-3xl font-black">{quiz?.questions.length}</p>
              <p className="text-xs uppercase font-bold">Questions</p>
            </div>
            <div className="brutal-border-sm bg-mint p-3">
              <p className="text-3xl font-black">{quiz?.durationMinutes}</p>
              <p className="text-xs uppercase font-bold">Minutes</p>
            </div>
            <div className="brutal-border-sm bg-hot-pink text-white p-3">
              <p className="text-3xl font-black">1×</p>
              <p className="text-xs uppercase font-bold">Try Only</p>
            </div>
          </div>

          <div className="brutal-border-sm bg-cream p-4 mb-6 text-sm">
            <p className="font-black uppercase mb-2">Heads up, legend:</p>
            <ul className="space-y-1 text-ink/80">
              <li>• Timer is HIDDEN — but it&apos;s ticking. Trust.</li>
              <li>• One click per question — no backsies.</li>
              <li>• Speed bonus: ≤5s (+5), ≤10s (+3)</li>
              <li>• Wrong = 0 pts. No negative vibes.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-black uppercase text-sm mb-2 tracking-wide">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should we call the GOAT?"
                className="w-full brutal-border-sm px-4 py-3 font-semibold bg-white focus:outline-none focus:ring-4 focus:ring-hot-pink/30"
              />
            </div>
            <div>
              <label className="block font-black uppercase text-sm mb-2 tracking-wide">
                UID *
              </label>
              <input
                type="text"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                placeholder="Your unique ID / roll number"
                className="w-full brutal-border-sm px-4 py-3 font-semibold bg-white focus:outline-none focus:ring-4 focus:ring-electric-blue/30"
              />
            </div>
            <div>
              <label className="block font-black uppercase text-sm mb-2 tracking-wide">
                Mobile Number *
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full brutal-border-sm px-4 py-3 font-semibold bg-white focus:outline-none focus:ring-4 focus:ring-mint/30"
              />
            </div>
            <div>
              <label className="block font-black uppercase text-sm mb-2 tracking-wide">
                Email ID *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@college.edu"
                className="w-full brutal-border-sm px-4 py-3 font-semibold bg-white focus:outline-none focus:ring-4 focus:ring-electric-blue/30"
              />
            </div>
            <div>
              <label className="block font-black uppercase text-sm mb-2 tracking-wide">
                Department Name *
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science, IT, CSE"
                className="w-full brutal-border-sm px-4 py-3 font-semibold bg-white focus:outline-none focus:ring-4 focus:ring-coral/30"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 text-hot-pink font-bold text-center">{error}</p>
          )}

          <BrutalButton
            size="lg"
            className="w-full mt-6"
            onClick={handleStart}
            disabled={starting}
          >
            {starting ? "LOCKING IN..." : "🔥 START THE BLITZ"}
          </BrutalButton>
        </BrutalCard>
      </div>
    </div>
  );
}
