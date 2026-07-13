"use client";

const PHRASES = [
  "🔥 NO CAP — SRUJANA IS LIVE",
  "⚡ FRONTEND X FULL STACK ENERGY",
  "💥 NEXASOUL — WE BUILD DIFFERENT",
  "🚀 WEEKLY BLITZ — PURE ONLINE VIBES",
  "🎯 20 Qs • 20 MIN • ZERO MERCY",
  "✨ SRUJANA — CREATE. COMPETE. CONQUER.",
];

export default function MarqueeBanner() {
  const text = PHRASES.join("   ★   ");

  return (
    <div className="bg-sun-yellow border-b-4 border-ink overflow-hidden py-2">
      <div className="animate-marquee whitespace-nowrap flex">
        <span className="text-sm font-black tracking-widest uppercase px-4">{text}</span>
        <span className="text-sm font-black tracking-widest uppercase px-4">{text}</span>
      </div>
    </div>
  );
}
