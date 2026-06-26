"use client";

import { useState } from "react";
import FloatingInput from "@/components/ui/FloatingInput";
import SuccessState from "@/components/home/SuccessState";
import { useToast } from "@/components/ui/ToastProvider";

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  requirement: string;
}

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  requirement: "",
};

const icons = {
  user: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  mail: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ),
  phone: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  ),
  building: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
  ),
  message: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  ),
};

export default function LeadForm() {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState<{
    ai_category: string | null;
    ai_priority: string | null;
  } | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        triggerShake();
        toast(data.error || "Something went wrong", "error");
        return;
      }

      setSuccess({
        ai_category: data.lead?.ai_category ?? null,
        ai_priority: data.lead?.ai_priority ?? null,
      });
      setForm(initialForm);
      toast("Inquiry submitted successfully!", "success");
    } catch {
      triggerShake();
      toast("Submission failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <SuccessState
        aiCategory={success.ai_category}
        aiPriority={success.ai_priority}
        onReset={() => setSuccess(null)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className={`grid gap-5 sm:grid-cols-2 ${shake ? "animate-shake" : ""}`}>
        <FloatingInput
          id="name"
          name="name"
          label="Full Name"
          required
          value={form.name}
          onChange={handleChange}
          icon={icons.user}
          shake={shake}
        />
        <FloatingInput
          id="email"
          name="email"
          label="Email Address"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          icon={icons.mail}
          shake={shake}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FloatingInput
          id="phone"
          name="phone"
          label="Phone Number"
          type="tel"
          required
          value={form.phone}
          onChange={handleChange}
          icon={icons.phone}
        />
        <FloatingInput
          id="company"
          name="company"
          label="Company Name"
          value={form.company}
          onChange={handleChange}
          icon={icons.building}
        />
      </div>

      <FloatingInput
        id="requirement"
        name="requirement"
        label="Requirement / Message"
        required
        value={form.requirement}
        onChange={handleChange}
        icon={icons.message}
        multiline
        rows={4}
      />

      <button
        type="submit"
        disabled={loading}
        className="btn-shimmer btn-interactive relative flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting...
          </>
        ) : (
          "Submit Inquiry"
        )}
      </button>
    </form>
  );
}
