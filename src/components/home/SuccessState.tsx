"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

interface SuccessStateProps {
  aiCategory: string | null;
  aiPriority: string | null;
  onReset: () => void;
}

export default function SuccessState({
  aiCategory,
  aiPriority,
  onReset,
}: SuccessStateProps) {
  useEffect(() => {
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#7c3aed", "#4f46e5", "#06b6d4"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#7c3aed", "#4f46e5", "#06b6d4"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <div className="animate-fade-in py-8 text-center">
      <div className="animate-scale-in mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 shadow-[0_0_40px_rgba(124,58,237,0.4)]">
        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
          <path className="animate-check" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="animate-fade-in-up text-2xl font-bold text-white" style={{ animationDelay: "0.2s" }}>
        You&apos;re all set!
      </h2>
      <p className="animate-fade-in-up mt-2 text-zinc-400" style={{ animationDelay: "0.3s" }}>
        We&apos;ve received your inquiry and sent a confirmation email.
      </p>

      {(aiCategory || aiPriority) && (
        <div className="animate-fade-in-up mt-6 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "0.4s" }}>
          {aiCategory && (
            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300">
              {aiCategory}
            </span>
          )}
          {aiPriority && (
            <span
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                aiPriority === "High"
                  ? "border border-red-500/30 bg-red-500/10 text-red-300"
                  : aiPriority === "Medium"
                    ? "border border-amber-500/30 bg-amber-500/10 text-amber-300"
                    : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              }`}
            >
              {aiPriority} Priority
            </span>
          )}
        </div>
      )}

      <button
        onClick={onReset}
        className="btn-interactive animate-fade-in-up mt-8 text-sm font-medium text-violet-400 transition-colors hover:text-violet-300"
        style={{ animationDelay: "0.5s" }}
      >
        Submit another inquiry →
      </button>
    </div>
  );
}
