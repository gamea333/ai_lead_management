"use client";

import { useState, type ReactNode } from "react";

interface FloatingInputProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  icon: ReactNode;
  multiline?: boolean;
  rows?: number;
  shake?: boolean;
}

export default function FloatingInput({
  id,
  name,
  label,
  type = "text",
  required,
  value,
  onChange,
  icon,
  multiline,
  rows = 4,
  shake,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  const inputClasses = `w-full rounded-xl border bg-white/[0.04] pl-11 pr-4 text-zinc-100 outline-none transition-all duration-300 ${
    multiline ? "pt-6 pb-3" : "py-4"
  } ${
    focused
      ? "border-violet-500 shadow-[0_0_20px_rgba(124,58,237,0.25)]"
      : "border-white/10 hover:border-white/20"
  } ${shake ? "animate-shake" : ""}`;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-zinc-500 transition-colors duration-300 peer-focus:text-violet-400">
        {icon}
      </div>

      {multiline ? (
        <textarea
          id={id}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          rows={rows}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`peer ${inputClasses} resize-none`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`peer ${inputClasses}`}
        />
      )}

      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-11 transition-all duration-300 ${
          active
            ? multiline
              ? "top-2 text-xs font-medium text-violet-400"
              : "-top-2.5 left-3 bg-[#0a0a0f] px-2 text-xs font-medium text-violet-400"
            : multiline
              ? "top-6 text-sm text-zinc-500"
              : "top-1/2 -translate-y-1/2 text-sm text-zinc-500"
        }`}
      >
        {label}
        {required && <span className="text-red-400"> *</span>}
      </label>
    </div>
  );
}
