"use client";

import { useEffect, useState } from "react";

const WORDS = ["Srujana", "सृजन"];
const TYPE_MS = 95;
const DELETE_MS = 50;
const PAUSE_MS = 2400;
const GAP_MS = 400;

type Phase = "typing" | "deleting" | "gap";

export default function SrujanaTypewriter() {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");

  const currentWord = WORDS[wordIndex];
  const displayText = currentWord.slice(0, charIndex);

  useEffect(() => {
    let delay = TYPE_MS;

    if (phase === "typing") {
      if (charIndex < currentWord.length) {
        delay = TYPE_MS;
        const timer = setTimeout(() => setCharIndex((c) => c + 1), delay);
        return () => clearTimeout(timer);
      }
      delay = PAUSE_MS;
      const timer = setTimeout(() => setPhase("deleting"), delay);
      return () => clearTimeout(timer);
    }

    if (phase === "deleting") {
      if (charIndex > 0) {
        const timer = setTimeout(() => setCharIndex((c) => c - 1), DELETE_MS);
        return () => clearTimeout(timer);
      }
      const timer = setTimeout(() => {
        setPhase("gap");
      }, 0);
      return () => clearTimeout(timer);
    }

    if (phase === "gap") {
      const timer = setTimeout(() => {
        setWordIndex((i) => (i + 1) % WORDS.length);
        setCharIndex(0);
        setPhase("typing");
      }, GAP_MS);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [phase, charIndex, currentWord, wordIndex]);

  return (
    <span
      className="inline-block align-bottom text-left leading-[1.15] pr-2"
      style={{ minWidth: "7em", minHeight: "1.1em" }}
      aria-label={`Srujana, also known as ${WORDS[1]} in Hindi`}
    >
      <span className="gradient-text whitespace-nowrap inline-block">{displayText || "\u00A0"}</span>
      <span className="typewriter-cursor text-hot-pink not-italic font-black">|</span>
    </span>
  );
}
