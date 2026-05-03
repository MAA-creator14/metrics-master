"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { nanoid } from "nanoid";
import type { BusinessType, WizardStepId } from "@/types";
import { getQuestion, interpolateQuestion, EXAMPLE_ANSWERS } from "@/content/wizardQuestions";
import { looksLikeLaggingMetric } from "@/content/laggingKeywords";
import { callNameMetric } from "@/lib/claudeClient";

interface Props {
  step: "q1" | "q2" | "q3" | "q4";
  /** Name of the metric this question is predicting (north star or a level-2 indicator) */
  predictingMetricName: string;
  northStarName: string;
  businessType: BusinessType;
  claudeCallsUsed: number;
  onSubmit: (answer: string, metricName: string, unit: string, namedByAI: boolean) => void;
  onClaudeCall: () => void;
}

export function UnlockQuestion({
  step,
  predictingMetricName,
  northStarName,
  businessType,
  claudeCallsUsed,
  onSubmit,
  onClaudeCall,
}: Props) {
  const [answer, setAnswer] = useState("");
  const [metricName, setMetricName] = useState("");
  const [metricUnit, setMetricUnit] = useState("");
  const [namedByAI, setNamedByAI] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const template = getQuestion(step);
  const question = interpolateQuestion(template.template, predictingMetricName);
  const examples = EXAMPLE_ANSWERS[step]?.[businessType] ?? EXAMPLE_ANSWERS[step]?.other ?? [];
  const canCallClaude = claudeCallsUsed < 3;

  function handleAnswerBlur() {
    if (answer.trim() && looksLikeLaggingMetric(answer) && !nudgeDismissed) {
      setShowNudge(true);
    }
  }

  async function handleAINaming() {
    if (!answer.trim() || !canCallClaude) return;
    setAiLoading(true);
    onClaudeCall();
    const level = template.level === 2 ? "leading" : "behaviour";
    const result = await callNameMetric(businessType, northStarName, answer, level);
    if (result) {
      setMetricName(result.metricName);
      setMetricUnit(result.unit);
      setNamedByAI(true);
    }
    setAiLoading(false);
  }

  function handleSubmit() {
    if (!answer.trim() || !metricName.trim()) return;
    onSubmit(answer.trim(), metricName.trim(), metricUnit.trim() || "units", namedByAI);
    // reset local state for next question
    setAnswer("");
    setMetricName("");
    setMetricUnit("");
    setNamedByAI(false);
    setShowNudge(false);
    setNudgeDismissed(false);
    setShowExamples(false);
  }

  const stepNum = { q1: 3, q2: 4, q3: 5, q4: 6 }[step];
  const canSubmit = answer.trim().length > 0 && metricName.trim().length > 0;

  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
    >
      <p className="text-text-muted text-sm font-mono mb-2 uppercase tracking-widest">
        Step {stepNum} of 6 · Indicator {stepNum - 2} of 4
      </p>
      <div className="w-full h-[3px] bg-surface rounded-full mb-5 overflow-hidden">
        <div
          className="h-full bg-brand-purple rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(stepNum / 6) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="rounded-2xl bg-surface border border-ghost-border p-5 mb-6">
        <p className="font-display text-xl font-semibold text-text-primary leading-snug">
          {question}
        </p>
      </div>

      {/* Examples accordion */}
      <button
        onClick={() => setShowExamples(!showExamples)}
        className="text-text-muted text-sm mb-4 flex items-center gap-1 hover:text-text-primary transition-colors"
      >
        <span>{showExamples ? "▾" : "▸"}</span>
        Not sure? See examples
      </button>
      <AnimatePresence>
        {showExamples && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <ul className="space-y-2">
              {examples.map((ex, i) => (
                <li
                  key={i}
                  onClick={() => { setAnswer(ex); setShowExamples(false); }}
                  className="rounded-xl bg-surface border border-ghost-border px-4 py-3 text-text-muted
                             text-sm cursor-pointer hover:border-brand-teal hover:text-text-primary
                             transition-colors"
                >
                  &ldquo;{ex}&rdquo;
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer textarea */}
      <textarea
        rows={3}
        className="w-full rounded-xl bg-surface border border-ghost-border px-4 py-3
                   text-text-primary placeholder:text-text-muted focus:outline-none
                   focus:border-brand-teal resize-none mb-1 transition-colors"
        placeholder="Describe the behaviour in your own words…"
        value={answer}
        onChange={(e) => { setAnswer(e.target.value); setShowNudge(false); }}
        onBlur={handleAnswerBlur}
      />

      {/* Soft nudge */}
      <AnimatePresence>
        {showNudge && !nudgeDismissed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="rounded-xl border border-brand-amber/40 bg-brand-amber/10 p-3 mt-2">
              <p className="text-brand-amber text-xs mb-2">
                ⚠️ Heads up — this sounds like it might be a lagging metric. Try thinking: what
                does a user need to <em>do</em> for {predictingMetricName} to go up?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setNudgeDismissed(true); setShowNudge(false); }}
                  className="text-xs text-text-muted underline hover:text-text-primary"
                >
                  Got it, keep my answer
                </button>
                <button
                  onClick={() => { setAnswer(""); setShowNudge(false); }}
                  className="text-xs text-brand-amber underline hover:text-brand-amber/80"
                >
                  Let me rethink this
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metric naming */}
      <div className="mt-4">
        <label className="block text-text-muted text-sm mb-2">
          What would you call this as a metric?
        </label>
        <div className="flex gap-2 mb-2">
          <input
            className="flex-1 rounded-xl bg-surface border border-ghost-border px-4 py-3
                       text-text-primary placeholder:text-text-muted focus:outline-none
                       focus:border-brand-teal transition-colors"
            placeholder="e.g. Onboarding Completion Rate"
            value={metricName}
            onChange={(e) => { setMetricName(e.target.value); setNamedByAI(false); }}
          />
          {canCallClaude && (
            <button
              onClick={handleAINaming}
              disabled={!answer.trim() || aiLoading}
              className="px-3 py-3 rounded-xl border border-brand-purple/40 bg-brand-purple/10
                         text-brand-purple text-sm font-medium disabled:opacity-40
                         hover:bg-brand-purple/20 transition-colors whitespace-nowrap"
            >
              {aiLoading ? "…" : "✨ Name it"}
            </button>
          )}
        </div>
        {namedByAI && (
          <p className="text-text-muted text-xs">AI-named · edit freely</p>
        )}
        <input
          className="w-full rounded-xl bg-surface border border-ghost-border px-4 py-2.5
                     text-text-primary placeholder:text-text-muted focus:outline-none
                     focus:border-brand-teal transition-colors text-sm"
          placeholder="Unit (e.g. % of new signups)"
          value={metricUnit}
          onChange={(e) => setMetricUnit(e.target.value)}
        />
      </div>

      <button
        disabled={!canSubmit}
        onClick={handleSubmit}
        className="mt-6 w-full py-4 rounded-full bg-coral text-white font-display font-semibold
                   text-lg disabled:opacity-30 hover:bg-coral/90 transition-colors"
      >
        Unlock this indicator →
      </button>
    </motion.div>
  );
}
