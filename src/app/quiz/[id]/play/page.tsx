"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BrutalButton from "@/components/BrutalButton";
import BrutalCard from "@/components/BrutalCard";

interface Question {
  id: string;
  text: string;
  options: string[];
  order: number;
}

interface QuizSession {
  attemptId: string;
  startedAt: string;
  durationMinutes: number;
}

const OPTION_COLORS = [
  "bg-sun-yellow hover:bg-yellow-300",
  "bg-mint hover:bg-emerald-300",
  "bg-coral hover:bg-orange-400 text-white hover:text-white",
  "bg-electric-blue hover:bg-blue-600 text-white hover:text-white",
];

export default function QuizPlayPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [quizId, setQuizId] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ points: number; bonus: number } | null>(null);
  const questionStartRef = useRef<number>(Date.now());
  const sessionStartRef = useRef<number>(0);
  const durationMsRef = useRef<number>(0);
  const finishingRef = useRef(false);
  const [switchCount, setSwitchCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const lastSwitchTimeRef = useRef<number>(0);

  const finishQuiz = useCallback(async () => {
    if (finishingRef.current || !session) return;
    finishingRef.current = true;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/attempts/${session.attemptId}/finish`, {
        method: "POST",
      });
      const data = await res.json();
      sessionStorage.removeItem(`quiz_${quizId}`);
      router.push(`/quiz/${quizId}/results/${data.attemptId}`);
    } catch {
      finishingRef.current = false;
      setSubmitting(false);
    }
  }, [session, quizId, router]);

  useEffect(() => {
    params.then(({ id }) => {
      setQuizId(id);

      const stored = sessionStorage.getItem(`quiz_${id}`);
      if (!stored) {
        router.push(`/quiz/${id}`);
        return;
      }

      const sess: QuizSession = JSON.parse(stored);
      setSession(sess);
      sessionStartRef.current = new Date(sess.startedAt).getTime();
      durationMsRef.current = sess.durationMinutes * 60 * 1000;

      const storedSwitchCount = parseInt(sessionStorage.getItem(`switchCount_${sess.attemptId}`) || "0", 10);
      setSwitchCount(storedSwitchCount);

      if (storedSwitchCount >= 2) {
        fetch(`/api/attempts/${sess.attemptId}/finish`, { method: "POST" })
          .then((r) => r.json())
          .then((data) => {
            sessionStorage.removeItem(`quiz_${id}`);
            router.push(`/quiz/${id}/results/${data.attemptId}`);
          });
        return;
      }

      fetch(`/api/quiz/${id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.error) {
            router.push(`/quiz/${id}`);
            return;
          }
          setQuestions(data.quiz.questions);
          questionStartRef.current = Date.now();
        })
        .finally(() => setLoading(false));
    });
  }, [params, router]);

  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - sessionStartRef.current;
      if (elapsed >= durationMsRef.current) {
        clearInterval(interval);
        finishQuiz();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session, finishQuiz]);

  useEffect(() => {
    if (!session || loading || submitting || finishingRef.current) return;

    const handleSwitch = () => {
      const now = Date.now();
      if (lastSwitchTimeRef.current && now - lastSwitchTimeRef.current < 1500) {
        return;
      }
      lastSwitchTimeRef.current = now;

      const currentAttemptId = session.attemptId;
      const storedCountKey = `switchCount_${currentAttemptId}`;
      const currentCount = parseInt(sessionStorage.getItem(storedCountKey) || "0", 10) + 1;
      sessionStorage.setItem(storedCountKey, currentCount.toString());
      setSwitchCount(currentCount);

      if (currentCount === 1) {
        setShowWarning(true);
      } else if (currentCount >= 2) {
        finishQuiz();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleSwitch();
      }
    };

    const handleBlur = () => {
      handleSwitch();
    };

    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [session, loading, submitting, finishQuiz]);

  const handleAnswer = async (optionIndex: number) => {
    if (submitting || !session || feedback) return;

    const timeTaken = Math.floor((Date.now() - questionStartRef.current) / 1000);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/attempts/${session.attemptId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: questions[currentIndex].id,
          selectedOptionIndex: optionIndex,
          timeTakenSeconds: timeTaken,
        }),
      });

      const data = await res.json();

      if (res.status === 403) {
        await finishQuiz();
        return;
      }

      setFeedback({
        points: data.totalPoints ?? 0,
        bonus: data.speedBonus ?? 0,
      });

      setTimeout(async () => {
        setFeedback(null);
        if (currentIndex + 1 >= questions.length) {
          await finishQuiz();
        } else {
          setCurrentIndex((i) => i + 1);
          questionStartRef.current = Date.now();
          setSubmitting(false);
        }
      }, 600);
    } catch {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-2xl font-black animate-pulse">Warming up the questions...</p>
      </div>
    );
  }

  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="py-8 md:py-12 min-h-[70vh] bg-paper">
      <div className="max-w-3xl mx-auto px-4">
        {/* Progress — NO timer shown */}
        <div className="mb-8 animate-slide-up">
          <div className="flex justify-between items-center mb-2">
            <span className="sticker bg-hot-pink text-white text-xs">
              Q {currentIndex + 1} / {questions.length}
            </span>
            <span className="font-black text-sm uppercase tracking-wide text-ink/50">
              Keep it moving ⚡
            </span>
          </div>
          <div className="brutal-border-sm bg-white h-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-hot-pink via-electric-blue to-mint transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div
          key={question.id}
          className="brutal-border-lg bg-white p-8 md:p-10 animate-pop-in relative"
        >
          {feedback && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10 animate-pop-in">
              <div className="text-center">
                <p className="text-5xl font-black gradient-text">
                  {feedback.points > 0 ? "YOU ATE! 🍽️" : "MISS — NEXT! 💨"}
                </p>
                {feedback.points > 0 && (
                  <p className="text-2xl font-black mt-2">
                    +{feedback.points} pts
                    {feedback.bonus > 0 && (
                      <span className="text-hot-pink"> (speed +{feedback.bonus}!)</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          )}

          <p className="text-sm font-black uppercase tracking-[0.3em] text-electric-blue mb-4">
            Question {question.order}
          </p>
          <h2
            className="text-2xl md:text-3xl font-black leading-snug mb-8"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            {question.text}
          </h2>

          <div className="grid gap-4">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={submitting}
                className={`brutal-border brutal-hover text-left px-6 py-4 font-bold text-lg transition-colors disabled:opacity-60 ${OPTION_COLORS[idx % OPTION_COLORS.length]}`}
              >
                <span className="inline-block w-8 h-8 brutal-border-sm bg-white/30 text-center leading-8 mr-3 font-black text-sm">
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center mt-6 text-ink/40 font-bold uppercase text-xs tracking-widest">
          One tap. One chance. Send it. 🚀
        </p>
      </div>

      {showWarning && (
        <div className="fixed inset-0 bg-ink/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <BrutalCard color="bg-coral text-white" className="max-w-md w-full text-center relative border-4 border-ink animate-pop-in">
            <div className="text-6xl mb-4 animate-bounce">🚨</div>
            <h3 className="text-3xl font-black mb-4 uppercase tracking-wide">
              Tab Switch Detected!
            </h3>
            <p className="text-lg font-semibold mb-6 text-white/90 leading-relaxed">
              Hey! Switching tabs or windows is strictly prohibited during the quiz. 
            </p>
            <div className="bg-ink/20 p-4 brutal-border-sm mb-6 text-left">
              <p className="font-black text-sm uppercase mb-1">Warning Details:</p>
              <ul className="list-disc list-inside text-sm space-y-1 text-white/90">
                <li>This is your first and ONLY warning.</li>
                <li>If you switch windows or tabs again, your quiz will be terminated and submitted immediately.</li>
              </ul>
            </div>
            <BrutalButton
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => setShowWarning(false)}
            >
              I understand, resume quiz
            </BrutalButton>
          </BrutalCard>
        </div>
      )}
    </div>
  );
}
