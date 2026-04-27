"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { readTreeFromHash, buildShareUrl } from "@/lib/treeState";
import type { MetricTree } from "@/types";
import { MetricTreeCanvas } from "@/components/tree/MetricTree";
import Link from "next/link";

export default function TreePage() {
  const [tree, setTree] = useState<MetricTree | null>(null);
  const [copied, setCopied] = useState(false);
  const [showCelebration, setShowCelebration] = useState(true);

  useEffect(() => {
    setTree(readTreeFromHash());
    const t = setTimeout(() => setShowCelebration(false), 3000);
    return () => clearTimeout(t);
  }, []);

  async function handleCopyLink() {
    if (!tree) return;
    await navigator.clipboard.writeText(buildShareUrl(tree));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!tree) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center min-h-screen gap-6">
        <p className="text-text-muted">No tree found. Build one first.</p>
        <Link
          href="/wizard"
          className="text-coral underline underline-offset-4 hover:text-coral/80"
        >
          ← Build my metric tree
        </Link>
      </main>
    );
  }

  const businessLabel: Record<string, string> = {
    saas: "SaaS",
    ecommerce: "E-commerce",
    marketplace: "Marketplace",
    consumer: "Consumer App",
    media: "Media",
    fintech: "Fintech",
    other: tree.customBusinessType || "Other",
  };

  return (
    <main className="flex flex-col h-screen overflow-hidden">
      {/* Celebration banner */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="absolute top-0 left-0 right-0 z-50 flex justify-center pt-20 pointer-events-none"
          >
            <div className="rounded-2xl bg-surface border border-ghost-border px-6 py-4 shadow-2xl text-center">
              <p className="font-display font-bold text-text-primary text-lg mb-0.5">
                Your metric tree is ready
              </p>
              <p className="text-text-muted text-sm">
                {tree.indicators.length} indicators unlocked · hover nodes for explanations
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-ghost-border shrink-0">
        <div>
          <h1 className="font-display font-bold text-base text-text-primary leading-tight">
            {tree.northStar.name}
          </h1>
          <p className="text-text-muted text-xs font-mono mt-0.5">
            {businessLabel[tree.businessType]} · {tree.indicators.length} indicators
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-full border border-ghost-border text-text-muted text-sm
                       hover:border-brand-teal hover:text-brand-teal transition-colors"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
          <Link
            href="/wizard"
            className="px-4 py-2 rounded-full bg-coral text-white text-sm font-semibold
                       hover:bg-coral/90 transition-colors"
          >
            New tree
          </Link>
        </div>
      </header>

      {/* Canvas — flex-1 + min-h-0 so React Flow gets a concrete height */}
      <div className="flex-1 min-h-0 bg-surface">
        <MetricTreeCanvas tree={tree} />
      </div>
    </main>
  );
}
