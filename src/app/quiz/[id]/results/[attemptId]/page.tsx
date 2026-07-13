"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BrutalButton from "@/components/BrutalButton";
import BrutalCard from "@/components/BrutalCard";
import { formatTime } from "@/lib/scoring";
import type { AttemptResult } from "@/types";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string; attemptId: string }>;
}) {
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ attemptId }) => {
      fetch(`/api/attempts/${attemptId}/results`)
        .then((r) => r.json())
        .then((data) => {
          if (!data.error) setResult(data);
        })
        .finally(() => setLoading(false));
    });
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-2xl font-black animate-pulse">Crunching your stats...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <BrutalCard color="bg-coral text-white">
          <p className="text-xl font-black">Results not found</p>
          <Link href="/" className="inline-block mt-4">
            <BrutalButton variant="secondary">Home</BrutalButton>
          </Link>
        </BrutalCard>
      </div>
    );
  }

  const scoreMessage =
    result.accuracy >= 90
      ? "ABSOLUTE MENACE 🔥"
      : result.accuracy >= 70
        ? "SOLID RUN — RESPECT 💪"
        : result.accuracy >= 50
          ? "NOT BAD — RUN IT BACK 📈"
          : "ROOKIE ARC — WE BELIEVE IN YOU 🌱";

  return (
    <div className="py-12 pattern-dots min-h-[70vh]">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10 animate-slide-up">
          <span className="sticker bg-mint text-ink text-sm mb-4 inline-block animate-wiggle">
            {scoreMessage}
          </span>
          <h1
            className="text-4xl md:text-5xl font-black mb-2"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Your Results, {result.participantName}
          </h1>
          <p className="text-ink/60 font-medium">The receipts are in. No cap.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Score" value={result.totalScore.toString()} color="bg-hot-pink text-white" big />
          <StatCard label="Accuracy" value={`${result.accuracy}%`} color="bg-electric-blue text-white" big />
          <StatCard label="Time Taken" value={formatTime(result.timeTakenSeconds)} color="bg-sun-yellow" />
          <StatCard label="Correct" value={result.correctCount.toString()} color="bg-mint" />
          <StatCard label="Wrong" value={result.wrongCount.toString()} color="bg-coral text-white" />
          <StatCard label="Total Qs" value={result.totalQuestions.toString()} color="bg-white" />
        </div>

        <BrutalCard color="bg-white" className="mb-8">
          <h3 className="font-black text-xl mb-4 uppercase tracking-wide">
            Question Breakdown
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {result.answers.map((a, i) => (
              <div
                key={i}
                className={`brutal-border-sm p-4 ${a.isCorrect ? "bg-mint/20" : "bg-coral/10"}`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-sm mb-1">
                      Q{i + 1}: {a.questionText}
                    </p>
                    <p className="text-sm text-ink/70">
                      Your answer:{" "}
                      <strong>{a.selectedOption ?? "Skipped"}</strong>
                    </p>
                    {!a.isCorrect && (
                      <p className="text-sm text-electric-blue">
                        Correct: <strong>{a.correctOption}</strong>
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`sticker text-xs ${a.isCorrect ? "bg-mint" : "bg-coral text-white"}`}
                    >
                      {a.isCorrect ? "✓" : "✗"}
                    </span>
                    <p className="text-xs font-bold mt-1">+{a.totalPoints} pts</p>
                    <p className="text-xs text-ink/50">{a.timeTakenSeconds}s</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BrutalCard>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/">
            <BrutalButton variant="secondary">← Back Home</BrutalButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  big,
}: {
  label: string;
  value: string;
  color: string;
  big?: boolean;
}) {
  return (
    <div className={`brutal-border ${color} p-4 text-center animate-pop-in`}>
      <p className={`font-black ${big ? "text-4xl" : "text-3xl"}`}>{value}</p>
      <p className="text-xs uppercase font-bold tracking-wide mt-1">{label}</p>
    </div>
  );
}
