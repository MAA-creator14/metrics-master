import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-screen px-6 text-center">
      {/* Causal chain animation placeholder */}
      <div className="flex items-center gap-3 mb-10 text-sm font-mono">
        <span className="px-3 py-1.5 rounded-full bg-brand-amber/20 text-brand-amber border border-brand-amber/30">
          behaviour
        </span>
        <span className="text-text-muted">→</span>
        <span className="px-3 py-1.5 rounded-full bg-brand-teal/20 text-brand-teal border border-brand-teal/30">
          leading indicator
        </span>
        <span className="text-text-muted">→</span>
        <span className="px-3 py-1.5 rounded-full bg-coral/20 text-coral border border-coral/30">
          north star
        </span>
      </div>

      <h1 className="font-display text-5xl font-bold tracking-tight text-text-primary mb-4 max-w-xl leading-tight">
        What drives your north star?
      </h1>
      <p className="text-text-muted text-lg mb-10 max-w-md">
        Answer 4 questions. Unlock your metric tree. Understand what to move
        before the number moves.
      </p>

      <Link
        href="/wizard"
        className="inline-flex items-center gap-2 bg-coral text-white font-display font-semibold text-lg px-8 py-4 rounded-full hover:bg-coral/90 transition-colors"
      >
        Build my metric tree →
      </Link>

      <p className="mt-6 text-text-muted text-sm">
        Takes ~7 minutes · No sign-up required
      </p>
    </main>
  );
}
