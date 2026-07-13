"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrutalCard from "@/components/BrutalCard";
import { formatTime } from "@/lib/scoring";
import type { QuizAnalytics } from "@/types";

export default function AdminAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<QuizAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedParticipant, setExpandedParticipant] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ id }) => {
      fetch(`/api/admin/quizzes/${id}/questions`)
        .then((r) => {
          if (r.status === 401) {
            router.push("/admin");
            return null;
          }
          return r.json();
        })
        .then((data) => {
          if (data) setAnalytics(data.analytics);
        })
        .finally(() => setLoading(false));
    });
  }, [params, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-2xl font-black animate-pulse">Crunching analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20">
        <BrutalCard color="bg-coral text-white">
          <p className="font-black text-xl">Analytics not available</p>
        </BrutalCard>
      </div>
    );
  }

  return (
    <div className="py-10 pattern-dots min-h-[70vh]">
      <div className="max-w-6xl mx-auto px-4">
        <Link
          href="/admin/dashboard"
          className="font-bold text-electric-blue mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>

        <span className="sticker bg-hot-pink text-white text-xs mb-2 inline-block">
          THE NUMBERS DON&apos;T LIE
        </span>
        <h1
          className="text-4xl font-black mb-8"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          Quiz Analytics
        </h1>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <BrutalCard color="bg-electric-blue text-white" animate>
            <p className="text-5xl font-black">{analytics.totalParticipants}</p>
            <p className="font-bold uppercase text-sm mt-1">Total Participants</p>
          </BrutalCard>
          <BrutalCard color="bg-sun-yellow" animate>
            <p className="text-5xl font-black">{analytics.averageScore}</p>
            <p className="font-bold uppercase text-sm mt-1">Average Score</p>
          </BrutalCard>
          <BrutalCard color="bg-mint" animate>
            <p className="text-5xl font-black">{analytics.highestScore}</p>
            <p className="font-bold uppercase text-sm mt-1">Highest Score</p>
          </BrutalCard>
        </div>

        <BrutalCard color="bg-white" className="mb-10">
          <h2 className="font-black text-xl mb-4 uppercase">Question-wise Accuracy</h2>
          <div className="space-y-3">
            {analytics.questionStats.map((q) => (
              <div key={q.questionId} className="brutal-border-sm p-4">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <p className="font-bold text-sm flex-1">
                    Q{q.order}: {q.questionText}
                  </p>
                  <span className="sticker bg-hot-pink text-white text-xs shrink-0">
                    {q.accuracy}%
                  </span>
                </div>
                <div className="brutal-border-sm bg-cream h-4 overflow-hidden">
                  <div
                    className="h-full bg-mint transition-all"
                    style={{ width: `${q.accuracy}%` }}
                  />
                </div>
                <p className="text-xs text-ink/50 mt-1">
                  {q.correctCount}/{q.totalAttempts} correct
                </p>
              </div>
            ))}
          </div>
        </BrutalCard>

        <BrutalCard color="bg-cream">
          <h2 className="font-black text-xl mb-4 uppercase">
            Participant Breakdown
          </h2>
          {analytics.participants.length === 0 ? (
            <p className="text-ink/50 font-bold text-center py-8">
              No participants yet — share the quiz link!
            </p>
          ) : (
            <div className="space-y-3">
              {analytics.participants
                .sort((a, b) => b.totalScore - a.totalScore)
                .map((p, rank) => (
                  <div key={p.id} className="brutal-border bg-white">
                    <button
                      className="w-full p-4 text-left flex justify-between items-center gap-4 brutal-hover"
                      onClick={() =>
                        setExpandedParticipant(
                          expandedParticipant === p.id ? null : p.id
                        )
                      }
                    >
                      <div className="flex items-center gap-3">
                        <span className="sticker bg-sun-yellow text-ink text-xs">
                          #{rank + 1}
                        </span>
                        <div>
                          <p className="font-black">{p.name}</p>
                          <p className="text-xs text-ink/50">
                            {p.uid} • {p.department} • {p.mobile}
                          </p>
                          <p className="text-xs text-ink/50">
                            {p.correctCount}✓ {p.wrongCount}✗ •{" "}
                            {formatTime(p.timeTakenSeconds)} • {p.accuracy}%
                          </p>
                        </div>
                      </div>
                      <span className="text-2xl font-black text-hot-pink">
                        {p.totalScore}
                      </span>
                    </button>

                    {expandedParticipant === p.id && (
                      <div className="border-t-3 border-ink p-4 bg-paper animate-slide-up">
                        <div className="grid sm:grid-cols-2 gap-2 mb-4 text-sm">
                          <p><span className="font-black">UID:</span> {p.uid}</p>
                          <p><span className="font-black">Dept:</span> {p.department}</p>
                          <p><span className="font-black">Mobile:</span> {p.mobile}</p>
                          <p><span className="font-black">Email:</span> {p.email}</p>
                        </div>
                        <p className="font-black text-sm uppercase mb-3">
                          Question-wise Accuracy
                        </p>
                        <div className="grid gap-2">
                          {p.questionBreakdown.map((qb, i) => (
                            <div
                              key={qb.questionId}
                              className={`brutal-border-sm p-2 text-sm flex justify-between ${qb.isCorrect ? "bg-mint/20" : "bg-coral/10"}`}
                            >
                              <span className="font-medium">
                                Q{i + 1}: {qb.questionText.slice(0, 60)}
                                {qb.questionText.length > 60 ? "..." : ""}
                              </span>
                              <span className="font-black shrink-0 ml-2">
                                {qb.isCorrect ? "✓" : "✗"} ({qb.timeTakenSeconds}s)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </BrutalCard>
      </div>
    </div>
  );
}
