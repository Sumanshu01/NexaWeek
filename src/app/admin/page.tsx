"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BrutalButton from "@/components/BrutalButton";
import BrutalCard from "@/components/BrutalCard";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Wrong password — you're not getting in, bestie.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center pattern-stripes py-12">
      <div className="max-w-md w-full mx-4">
        <BrutalCard color="bg-white" animate>
          <span className="sticker bg-electric-blue text-white text-xs mb-4 inline-block">
            ADMIN ONLY — NO LURKERS
          </span>
          <h1
            className="text-3xl font-black mb-2"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            NexaSoul Admin
          </h1>
          <p className="text-ink/60 mb-6">Manage Srujana quizzes & peep the analytics.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-black uppercase text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full brutal-border-sm px-4 py-3 font-semibold focus:outline-none focus:ring-4 focus:ring-electric-blue/30"
                placeholder="Enter admin password"
              />
            </div>
            {error && <p className="text-hot-pink font-bold text-sm">{error}</p>}
            <BrutalButton type="submit" className="w-full" disabled={loading}>
              {loading ? "VERIFYING..." : "UNLOCK DASHBOARD →"}
            </BrutalButton>
          </form>
        </BrutalCard>
      </div>
    </div>
  );
}
