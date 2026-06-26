export default function HeroBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Animated grid */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124, 58, 237, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 58, 237, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          animation: "grid-move 20s linear infinite",
        }}
      />

      {/* Gradient blobs */}
      <div className="animate-blob absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[100px]" />
      <div className="animate-blob-delayed absolute -right-32 top-1/3 h-[400px] w-[400px] rounded-full bg-indigo-600/20 blur-[100px]" />
      <div className="animate-blob-slow absolute bottom-0 left-1/3 h-[450px] w-[450px] rounded-full bg-cyan-600/15 blur-[100px]" />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0a0f_70%)]" />
    </div>
  );
}
