"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { BusinessType } from "@/types";

const TYPES: {
  id: BusinessType;
  label: string;
  icon: string;
  description: string;
}[] = [
  { id: "saas", label: "SaaS", icon: "💻", description: "Software subscriptions" },
  { id: "ecommerce", label: "E-commerce", icon: "🛒", description: "Online retail & DTC" },
  { id: "marketplace", label: "Marketplace", icon: "🤝", description: "Buyers meet sellers" },
  { id: "consumer", label: "Consumer App", icon: "📱", description: "Mobile & social products" },
  { id: "media", label: "Media", icon: "📰", description: "Content & subscriptions" },
  { id: "fintech", label: "Fintech", icon: "💳", description: "Finance & payments" },
  { id: "other", label: "Other", icon: "✨", description: "Something else entirely" },
];

interface Props {
  onSelect: (type: BusinessType) => void;
}

export function BusinessTypeSelector({ onSelect }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center justify-between mb-2">
        <Link href="/" className="text-text-muted text-sm font-mono no-underline hover:text-text-primary transition-colors">
          ← Start over
        </Link>
        <p className="text-text-muted text-sm font-mono uppercase tracking-widest">
          Step 1 of 6
        </p>
      </div>
      <h2 className="font-display text-3xl font-bold text-text-primary mb-2">
        What kind of business are you working on?
      </h2>
      <p className="text-text-muted mb-8">
        This helps us suggest relevant metrics for your north star.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {TYPES.map((t) => (
          <motion.button
            key={t.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(t.id)}
            className="relative flex flex-col items-start gap-2 rounded-2xl border border-ghost-border bg-surface p-4 text-left
                       transition-colors hover:border-brand-teal hover:bg-brand-teal/5 focus:outline-none
                       focus-visible:ring-2 focus-visible:ring-brand-teal"
          >
            {t.id === "saas" && (
              <span className="absolute top-2 right-2 rounded-full bg-brand-purple/20 px-2 py-0.5 text-[10px] font-semibold text-brand-purple leading-none">
                most popular
              </span>
            )}
            <span className="text-2xl">{t.icon}</span>
            <span className="font-display font-semibold text-text-primary text-sm">
              {t.label}
            </span>
            <span className="text-text-muted text-xs leading-snug">{t.description}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
