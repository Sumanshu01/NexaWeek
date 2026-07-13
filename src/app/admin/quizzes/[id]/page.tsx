"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrutalButton from "@/components/BrutalButton";
import BrutalCard from "@/components/BrutalCard";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  order: number;
}

interface QuizDetail {
  id: string;
  title: string;
  description: string | null;
  weekNumber: number;
  durationMinutes: number;
  isActive: boolean;
  submissionDeadline: string | null;
  questions: Question[];
}

const emptyQuestion = {
  text: "",
  options: ["", "", "", ""],
  correctOptionIndex: 0,
};

export default function AdminQuizEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [quizId, setQuizId] = useState("");
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newQ, setNewQ] = useState(emptyQuestion);
  const [saving, setSaving] = useState(false);

  const loadQuiz = (id: string) => {
    fetch(`/api/admin/quizzes/${id}`)
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setQuiz(data.quiz);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    params.then(({ id }) => {
      setQuizId(id);
      loadQuiz(id);
    });
  }, [params, router]);

  const saveQuizSettings = async () => {
    if (!quiz) return;
    setSaving(true);
    await fetch(`/api/admin/quizzes/${quizId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: quiz.title,
        description: quiz.description,
        weekNumber: quiz.weekNumber,
        durationMinutes: quiz.durationMinutes,
        isActive: quiz.isActive,
        submissionDeadline: quiz.submissionDeadline,
      }),
    });
    setSaving(false);
  };

  const addQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQ.text.trim() || newQ.options.some((o) => !o.trim())) return;

    const res = await fetch(`/api/admin/quizzes/${quizId}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQ),
    });

    if (res.ok) {
      setNewQ(emptyQuestion);
      loadQuiz(quizId);
    }
  };

  const deleteQuestion = async (qId: string) => {
    if (!confirm("Delete this question?")) return;
    await fetch(`/api/admin/questions/${qId}`, { method: "DELETE" });
    loadQuiz(quizId);
  };

  if (loading || !quiz) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-2xl font-black animate-pulse">Loading quiz...</p>
      </div>
    );
  }

  return (
    <div className="py-10 min-h-[70vh]">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          href="/admin/dashboard"
          className="font-bold text-electric-blue mb-4 inline-block brutal-hover"
        >
          ← Back to Dashboard
        </Link>

        <BrutalCard color="bg-sun-yellow" className="mb-8">
          <h1 className="text-3xl font-black mb-4" style={{ fontFamily: "var(--font-fraunces)" }}>
            Edit Quiz
          </h1>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              value={quiz.title}
              onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
              className="brutal-border-sm px-4 py-2 font-semibold bg-white"
              placeholder="Title"
            />
            <input
              type="number"
              value={quiz.weekNumber}
              onChange={(e) => setQuiz({ ...quiz, weekNumber: +e.target.value })}
              className="brutal-border-sm px-4 py-2 font-semibold bg-white"
            />
            <input
              type="number"
              value={quiz.durationMinutes}
              onChange={(e) => setQuiz({ ...quiz, durationMinutes: +e.target.value })}
              className="brutal-border-sm px-4 py-2 font-semibold bg-white"
              placeholder="Duration (min)"
            />
            <input
              type="datetime-local"
              value={
                quiz.submissionDeadline
                  ? new Date(quiz.submissionDeadline).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                setQuiz({
                  ...quiz,
                  submissionDeadline: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : null,
                })
              }
              className="brutal-border-sm px-4 py-2 font-semibold bg-white"
            />
            <textarea
              value={quiz.description ?? ""}
              onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
              className="brutal-border-sm px-4 py-2 font-semibold bg-white md:col-span-2"
              placeholder="Description"
              rows={2}
            />
            <label className="flex items-center gap-2 font-bold md:col-span-2">
              <input
                type="checkbox"
                checked={quiz.isActive}
                onChange={(e) => setQuiz({ ...quiz, isActive: e.target.checked })}
                className="w-5 h-5"
              />
              Active (visible to participants)
            </label>
          </div>
          <BrutalButton className="mt-4" onClick={saveQuizSettings} disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </BrutalButton>
        </BrutalCard>

        <h2 className="text-2xl font-black mb-4">
          Questions ({quiz.questions.length})
        </h2>

        <div className="space-y-4 mb-8">
          {quiz.questions.map((q) => (
            <BrutalCard key={q.id} color="bg-white">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="sticker bg-electric-blue text-white text-xs mb-2 inline-block">
                    Q{q.order}
                  </span>
                  <p className="font-bold">{q.text}</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {q.options.map((opt, i) => (
                      <li
                        key={i}
                        className={i === q.correctOptionIndex ? "text-mint font-black" : "text-ink/60"}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                        {i === q.correctOptionIndex && " ✓"}
                      </li>
                    ))}
                  </ul>
                </div>
                <BrutalButton size="sm" variant="danger" onClick={() => deleteQuestion(q.id)}>
                  Delete
                </BrutalButton>
              </div>
            </BrutalCard>
          ))}
        </div>

        <BrutalCard color="bg-mint">
          <h3 className="font-black text-xl mb-4">Add Question</h3>
          <form onSubmit={addQuestion} className="space-y-4">
            <textarea
              value={newQ.text}
              onChange={(e) => setNewQ({ ...newQ, text: e.target.value })}
              placeholder="Question text"
              className="w-full brutal-border-sm px-4 py-2 font-semibold bg-white"
              rows={2}
              required
            />
            {newQ.options.map((opt, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="radio"
                  name="correct"
                  checked={newQ.correctOptionIndex === i}
                  onChange={() => setNewQ({ ...newQ, correctOptionIndex: i })}
                />
                <input
                  value={opt}
                  onChange={(e) => {
                    const opts = [...newQ.options];
                    opts[i] = e.target.value;
                    setNewQ({ ...newQ, options: opts });
                  }}
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  className="flex-1 brutal-border-sm px-4 py-2 font-semibold bg-white"
                  required
                />
              </div>
            ))}
            <p className="text-xs font-bold text-ink/50">
              Select the radio button for the correct answer
            </p>
            <BrutalButton type="submit">Add Question</BrutalButton>
          </form>
        </BrutalCard>
      </div>
    </div>
  );
}
