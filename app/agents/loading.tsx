export default function AgentsLoading() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#E8E8E8] px-4 sm:px-6 py-12 sm:py-16 max-w-3xl mx-auto">
      {/* Back link skeleton */}
      <div className="w-24 h-3 bg-[#1A1A1A] animate-pulse mb-10" />

      {/* Header skeleton */}
      <div className="mb-10 space-y-3">
        <div className="w-12 h-2 bg-[#1A1A1A] animate-pulse" />
        <div className="w-48 h-8 bg-[#1A1A1A] animate-pulse" />
        <div className="w-full max-w-sm h-4 bg-[#1A1A1A] animate-pulse" />
        <div className="w-4/5 max-w-xs h-4 bg-[#1A1A1A] animate-pulse" />
      </div>

      {/* Form skeleton */}
      <div className="space-y-5">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="w-32 h-2 bg-[#1A1A1A] animate-pulse mb-2" />
            <div className="w-full h-12 bg-[#111111] border border-[#1A1A1A] animate-pulse" />
          </div>
        ))}
        <div className="w-full h-12 bg-[#1A1A1A] animate-pulse" />
      </div>
    </main>
  );
}
