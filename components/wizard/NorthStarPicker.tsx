"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { nanoid } from "nanoid";
import type { BusinessType, Metric } from "@/types";
import { getNorthStarSuggestions } from "@/content/northStarSuggestions";
import { callSuggestNorthStar } from "@/lib/claudeClient";

const BUSINESS_LABELS: Record<BusinessType, string> = {
  saas: "SaaS",
  ecommerce: "E-commerce",
  marketplace: "Marketplace",
  consumer: "Consumer App",
  media: "Media",
  fintech: "Fintech",
  other: "your business",
};

interface Props {
  businessType: BusinessType;
  claudeCallsUsed: number;
  onSelect: (metric: Metric) => void;
  onClaudeCall: () => void;
}

export function NorthStarPicker({
  businessType,
  claudeCallsUsed,
  onSelect,
  onClaudeCall,
}: Props) {
  const [customDesc, setCustomDesc] = useState("");
  const [customName, setCustomName] = useState("");
  const [customUnit, setCustomUnit] = useState("");
  const [suggestions, setSuggestions] = useState<Metric[]>(
    businessType !== "other" ? getNorthStarSuggestions(businessType) : []
  );
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selected, setSelected] = useState<Metric | null>(null);
  const [useCustom, setUseCustom] = useState(false);

  const canCallClaude = claudeCallsUsed < 3;

  async function fetchOtherSuggestions() {
    if (!customDesc.trim() || !canCallClaude) return;
    setLoadingSuggestions(true);
    onClaudeCall();
    const results = await callSuggestNorthStar(customDesc);
    if (results) {
      setSuggestions(
        results.map((r) => ({ id: nanoid(), name: r.name, unit: r.unit, type: "lagging" as const }))
      );
    }
    setLoadingSuggestions(false);
  }

  function handlePillSelect(metric: Metric) {
    setSelected(metric);
    setUseCustom(false);
  }

  function handleConfirm() {
    if (useCustom) {
      if (!customName.trim()) return;
      onSelect({ id: nanoid(), name: customName.trim(), unit: customUnit.trim() || "units", type: "lagging" });
    } else if (selected) {
      onSelect(selected);
    }
  }

  const confirmed = useCustom ? customName.trim().length > 0 : selected !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
    >
      <p className="text-text-muted text-sm font-mono mb-2 uppercase tracking-widest">
        Step 2 of 6
      </p>
      <h2 className="font-display text-3xl font-bold text-text-primary mb-2">
        What&apos;s your north star metric?
      </h2>
      <p className="text-text-muted mb-8">
        The ONE number your {BUSINESS_LABELS[businessType]} company most cares about growing.
      </p>

      {/* 'Other' business type: describe first, then get suggestions */}
      {businessType === "other" && suggestions.length === 0 && (
        <div className="mb-6">
          <label className="block text-text-muted text-sm mb-2">
            Describe your business in a sentence
          </label>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl bg-surface border border-ghost-border px-4 py-3
                         text-text-primary placeholder:text-text-muted focus:outline-none
                         focus:border-brand-teal"
              placeholder="e.g. B2B marketplace for legal services"
              value={customDesc}
              onChange={(e) => setCustomDesc(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchOtherSuggestions()}
            />
            <button
              onClick={fetchOtherSuggestions}
              disabled={!customDesc.trim() || !canCallClaude || loadingSuggestions}
              className="px-4 py-3 rounded-xl bg-coral text-white font-semibold text-sm
                         disabled:opacity-40 hover:bg-coral/90 transition-colors"
            >
              {loadingSuggestions ? "…" : "Go →"}
            </button>
          </div>
          {!canCallClaude && (
            <p className="text-text-muted text-xs mt-2">
              AI cap reached — type your north star below instead.
            </p>
          )}
        </div>
      )}

      {/* Suggestion pills */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {suggestions.map((m) => (
            <button
              key={m.id}
              onClick={() => handlePillSelect(m)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors
                ${selected?.id === m.id && !useCustom
                  ? "border-coral bg-coral/10 text-coral"
                  : "border-ghost-border text-text-muted hover:border-brand-teal hover:text-brand-teal"
                }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      )}

      {/* Custom input */}
      <div
        className={`mb-6 transition-opacity ${suggestions.length > 0 ? "opacity-100" : "opacity-100"}`}
      >
        <button
          className="text-text-muted text-sm underline underline-offset-2 mb-3 block hover:text-text-primary"
          onClick={() => { setUseCustom(true); setSelected(null); }}
        >
          Or type your own →
        </button>
        {useCustom && (
          <div className="flex flex-col gap-2">
            <input
              autoFocus
              className="rounded-xl bg-surface border border-brand-teal px-4 py-3
                         text-text-primary placeholder:text-text-muted focus:outline-none"
              placeholder="e.g. Monthly Recurring Revenue"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
            <input
              className="rounded-xl bg-surface border border-ghost-border px-4 py-3
                         text-text-primary placeholder:text-text-muted focus:outline-none
                         focus:border-brand-teal text-sm"
              placeholder="Unit of measurement (e.g. £ per month)"
              value={customUnit}
              onChange={(e) => setCustomUnit(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Lagging callout */}
      {confirmed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-xl bg-brand-teal/10 border border-brand-teal/30 p-4 mb-6"
        >
          <p className="text-brand-teal text-sm">
            <span className="font-semibold">This is a lagging metric</span> — you only know it
            after the fact. That&apos;s the point. Now let&apos;s find what predicts it.
          </p>
        </motion.div>
      )}

      <button
        disabled={!confirmed}
        onClick={handleConfirm}
        className="w-full py-4 rounded-full bg-coral text-white font-display font-semibold text-lg
                   disabled:opacity-30 hover:bg-coral/90 transition-colors"
      >
        Set this as my north star →
      </button>
    </motion.div>
  );
}
