import Link from "next/link";
import HeroBackground from "@/components/home/HeroBackground";
import LeadForm from "@/components/LeadForm";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0f]">
      <HeroBackground />

      <header className="relative z-10 border-b border-white/5 bg-[#0a0a0f]/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-bold text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              LF
            </div>
            <span className="text-lg font-semibold text-white">LeadFlow</span>
          </div>
          <Link
            href="/dashboard"
            className="btn-interactive rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-violet-500/30 hover:bg-white/10 hover:text-white"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-73px)] max-w-2xl flex-col items-center justify-center px-6 py-12">
        <div className="animate-fade-in-up mb-10 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-cyan-400">
            AI-Powered Lead Management
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Turn inquiries into{" "}
            <span className="gradient-text">opportunities</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-zinc-400">
            Tell us about your project. We&apos;ll respond within 24 hours with a
            personalized follow-up.
          </p>
        </div>

        <div className="animate-fade-in-up glass-card w-full p-8 shadow-2xl sm:p-10" style={{ animationDelay: "0.15s" }}>
          <LeadForm />
        </div>
      </div>
    </main>
  );
}
