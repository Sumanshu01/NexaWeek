"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrutalButton from "@/components/BrutalButton";
import BrutalCard from "@/components/BrutalCard";

interface QuizSummary {
  id: string;
  title: string;
  weekNumber: number;
  durationMinutes: number;
  isActive: boolean;
  submissionDeadline: string | null;
  _count: { questions: number; attempts: number };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    weekNumber: 1,
    durationMinutes: 20,
    submissionDeadline: "",
  });

  useEffect(() => {
    fetch("/api/admin/quizzes")
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setQuizzes(data.quizzes);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const { quiz } = await res.json();
      router.push(`/admin/quizzes/${quiz.id}`);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/quizzes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    setQuizzes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isActive: !isActive } : q))
    );
  };

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-2xl font-black animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="py-10 pattern-dots min-h-[70vh]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <span className="sticker bg-hot-pink text-white text-xs mb-2 inline-block">
              COMMAND CENTER
            </span>
            <h1
              className="text-4xl font-black"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Admin Dashboard
            </h1>
          </div>
          <div className="flex gap-2">
            <BrutalButton variant="success" onClick={() => setShowCreate(!showCreate)}>
              {showCreate ? "Cancel" : "+ Create Quiz"}
            </BrutalButton>
            <BrutalButton variant="secondary" onClick={handleLogout}>
              Logout
            </BrutalButton>
          </div>
        </div>

        {showCreate && (
          <BrutalCard color="bg-sun-yellow" className="mb-8 animate-pop-in">
            <h2 className="font-black text-xl mb-4">New Quiz — Let&apos;s Cook</h2>
            <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Quiz Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="brutal-border-sm px-4 py-2 font-semibold bg-white"
                required
              />
              <input
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="brutal-border-sm px-4 py-2 font-semibold bg-white"
              />
              <input
                type="number"
                placeholder="Week Number"
                value={form.weekNumber}
                onChange={(e) => setForm({ ...form, weekNumber: +e.target.value })}
                className="brutal-border-sm px-4 py-2 font-semibold bg-white"
              />
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: +e.target.value })}
                className="brutal-border-sm px-4 py-2 font-semibold bg-white"
              />
              <input
                type="datetime-local"
                value={form.submissionDeadline}
                onChange={(e) => setForm({ ...form, submissionDeadline: e.target.value })}
                className="brutal-border-sm px-4 py-2 font-semibold bg-white md:col-span-2"
              />
              <BrutalButton type="submit" className="md:col-span-2">
                Create Quiz →
              </BrutalButton>
            </form>
          </BrutalCard>
        )}

        <div className="space-y-4">
          {quizzes.length === 0 ? (
            <BrutalCard color="bg-white">
              <p className="text-center font-bold text-ink/50">
                No quizzes yet — hit that Create button!
              </p>
            </BrutalCard>
          ) : (
            quizzes.map((quiz) => (
              <BrutalCard key={quiz.id} color="bg-white">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="sticker bg-mint text-ink text-xs">
                        Week {quiz.weekNumber}
                      </span>
                      <span
                        className={`sticker text-xs ${quiz.isActive ? "bg-hot-pink text-white" : "bg-ink/10"}`}
                      >
                        {quiz.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>
                    <h3 className="font-black text-xl">{quiz.title}</h3>
                    <p className="text-sm text-ink/60 mt-1">
                      {quiz._count.questions} questions • {quiz.durationMinutes} min •{" "}
                      {quiz._count.attempts} attempts
                    </p>
                    {quiz.submissionDeadline && (
                      <p className="text-xs text-ink/40 mt-1">
                        Deadline: {new Date(quiz.submissionDeadline).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/quizzes/${quiz.id}`}>
                      <BrutalButton size="sm" variant="secondary">
                        Edit
                      </BrutalButton>
                    </Link>
                    <Link href={`/admin/quizzes/${quiz.id}/analytics`}>
                      <BrutalButton size="sm" variant="primary">
                        Analytics
                      </BrutalButton>
                    </Link>
                    <BrutalButton
                      size="sm"
                      variant={quiz.isActive ? "danger" : "success"}
                      onClick={() => toggleActive(quiz.id, quiz.isActive)}
                    >
                      {quiz.isActive ? "Deactivate" : "Activate"}
                    </BrutalButton>
                  </div>
                </div>
              </BrutalCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
