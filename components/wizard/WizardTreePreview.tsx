"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Indicator, Metric, WizardStepId } from "@/types";

interface Props {
  northStar: Metric | null;
  indicators: Indicator[];
  currentStep: WizardStepId;
}

const GHOST_PROMPTS: Partial<Record<WizardStepId, string>> = {
  "north-star": "Choose your north star to begin",
  q1: "Answer Q1 to unlock",
  q2: "Answer Q2 to unlock",
  q3: "Answer Q3 to unlock",
  q4: "Answer Q4 to unlock",
};

function NorthStarNode({ name, unit }: { name: string; unit: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-2xl border-2 border-coral bg-coral/10 px-4 py-3 inline-block max-w-[240px]"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">🎯</span>
        <span className="text-coral text-xs font-mono uppercase tracking-wide">North Star</span>
      </div>
      <p className="font-display font-semibold text-text-primary text-sm leading-snug">{name}</p>
      {unit && <p className="text-text-muted text-xs mt-0.5">{unit}</p>}
    </motion.div>
  );
}

function IndicatorNode({ name, unit, level }: { name: string; unit: string; level: 2 | 3 }) {
  const color = level === 2 ? "brand-teal" : "brand-amber";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`rounded-xl border border-${color}/40 bg-${color}/10 px-3 py-2.5 inline-block max-w-[200px]`}
    >
      <p className={`font-display font-semibold text-${color} text-xs leading-snug`}>{name}</p>
      {unit && <p className="text-text-muted text-xs mt-0.5">{unit}</p>}
    </motion.div>
  );
}

function GhostNode({ prompt }: { prompt: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl border border-dashed border-ghost-border px-3 py-2.5 inline-block max-w-[200px]"
    >
      <div className="flex items-center gap-1.5">
        <span className="text-sm">🔒</span>
        <p className="text-text-muted text-xs">{prompt}</p>
      </div>
    </motion.div>
  );
}

function Connector() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-px h-5 bg-ghost-border" />
    </div>
  );
}

export function WizardTreePreview({ northStar, indicators, currentStep }: Props) {
  const b1l2 = indicators.find((i) => i.branch === 1 && i.level === 2);
  const b1l3 = indicators.find((i) => i.branch === 1 && i.level === 3);
  const b2l2 = indicators.find((i) => i.branch === 2 && i.level === 2);
  const b2l3 = indicators.find((i) => i.branch === 2 && i.level === 3);

  const showQ1Ghost = currentStep === "q1";
  const showQ2Ghost = currentStep === "q2" && !!b1l2;
  const showQ3Ghost = currentStep === "q3";
  const showQ4Ghost = currentStep === "q4" && !!b2l2;

  if (!northStar) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="rounded-2xl border-2 border-dashed border-ghost-border px-6 py-5 text-center">
          <span className="text-3xl mb-2 block">🎯</span>
          <p className="text-text-muted text-sm">Your metric tree will grow here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-8 pb-4 px-6 gap-0 overflow-auto">
      {/* North Star */}
      <NorthStarNode name={northStar.name} unit={northStar.unit} />

      {/* Branches row */}
      <AnimatePresence>
        {(b1l2 || showQ1Ghost || b2l2 || showQ3Ghost) && (
          <div className="flex gap-8 items-start">
            {/* Branch 1 */}
            <div className="flex flex-col items-center">
              <Connector />
              {b1l2 ? (
                <>
                  <IndicatorNode name={b1l2.name} unit={b1l2.unit} level={2} />
                  {(b1l3 || showQ2Ghost) && (
                    <>
                      <Connector />
                      {b1l3 ? (
                        <IndicatorNode name={b1l3.name} unit={b1l3.unit} level={3} />
                      ) : (
                        <GhostNode prompt={GHOST_PROMPTS.q2 ?? "unlock"} />
                      )}
                    </>
                  )}
                </>
              ) : showQ1Ghost ? (
                <GhostNode prompt={GHOST_PROMPTS.q1 ?? "unlock"} />
              ) : null}
            </div>

            {/* Branch 2 */}
            {(b2l2 || showQ3Ghost) && (
              <div className="flex flex-col items-center">
                <Connector />
                {b2l2 ? (
                  <>
                    <IndicatorNode name={b2l2.name} unit={b2l2.unit} level={2} />
                    {(b2l3 || showQ4Ghost) && (
                      <>
                        <Connector />
                        {b2l3 ? (
                          <IndicatorNode name={b2l3.name} unit={b2l3.unit} level={3} />
                        ) : (
                          <GhostNode prompt={GHOST_PROMPTS.q4 ?? "unlock"} />
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <GhostNode prompt={GHOST_PROMPTS.q3 ?? "unlock"} />
                )}
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
