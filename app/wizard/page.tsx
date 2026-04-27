"use client";

import { useReducer, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { nanoid } from "nanoid";
import type { BusinessType, Indicator, Metric, WizardState, WizardStepId } from "@/types";
import { INITIAL_WIZARD_STATE } from "@/types";
import { encodeTree } from "@/lib/treeState";
import { matchExplanation } from "@/lib/explanationMatcher";
import { BusinessTypeSelector } from "@/components/wizard/BusinessTypeSelector";
import { NorthStarPicker } from "@/components/wizard/NorthStarPicker";
import { UnlockQuestion } from "@/components/wizard/UnlockQuestion";
import { WizardTreePreview } from "@/components/wizard/WizardTreePreview";

// ── Reducer ───────────────────────────────────────────────────────────────────

type Action =
  | { type: "SELECT_BUSINESS_TYPE"; businessType: BusinessType; customBusinessType: string }
  | { type: "SELECT_NORTH_STAR"; metric: Metric }
  | { type: "UNLOCK_INDICATOR"; indicator: Indicator }
  | { type: "CLAUDE_CALL" };

const NEXT_STEP: Record<"q1" | "q2" | "q3" | "q4", WizardStepId> = {
  q1: "q2",
  q2: "q3",
  q3: "q4",
  q4: "reveal",
};

function reducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case "SELECT_BUSINESS_TYPE":
      return {
        ...state,
        businessType: action.businessType,
        customBusinessType: action.customBusinessType,
        currentStep: "north-star",
      };
    case "SELECT_NORTH_STAR":
      return { ...state, northStar: action.metric, currentStep: "q1" };
    case "UNLOCK_INDICATOR": {
      const indicators = [...state.indicators, action.indicator];
      const next = NEXT_STEP[state.currentStep as "q1" | "q2" | "q3" | "q4"];
      return { ...state, indicators, currentStep: next };
    }
    case "CLAUDE_CALL":
      return { ...state, claudeCallsUsed: state.claudeCallsUsed + 1 };
    default:
      return state;
  }
}

// ── Progress bar ──────────────────────────────────────────────────────────────

const STEP_PROGRESS: Record<WizardStepId, number> = {
  "business-type": 0,
  "north-star": 16,
  q1: 33,
  q2: 50,
  q3: 66,
  q4: 83,
  reveal: 100,
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function WizardPage() {
  const [state, dispatch] = useReducer(reducer, INITIAL_WIZARD_STATE);
  const router = useRouter();

  // Redirect to /tree when reveal step is reached
  useEffect(() => {
    if (state.currentStep !== "reveal" || !state.northStar) return;
    const tree = {
      id: nanoid(),
      businessType: state.businessType!,
      customBusinessType: state.customBusinessType || undefined,
      northStar: state.northStar,
      indicators: state.indicators,
      createdAt: new Date().toISOString(),
    };
    router.push(`/tree#state=${encodeTree(tree)}`);
  }, [state.currentStep, state.northStar, state.businessType, state.customBusinessType, state.indicators, router]);

  // Build the Indicator from a raw unlock submission
  function buildIndicator(
    answer: string,
    metricName: string,
    unit: string,
    namedByAI: boolean
  ): Indicator {
    const step = state.currentStep as "q1" | "q2" | "q3" | "q4";
    const isLevel2 = step === "q1" || step === "q3";
    const branch: 1 | 2 = step === "q1" || step === "q2" ? 1 : 2;
    const level: 2 | 3 = isLevel2 ? 2 : 3;

    // parentId: level-2 nodes hang off northStar; level-3 hang off the level-2 in their branch
    const parentId = isLevel2
      ? state.northStar!.id
      : state.indicators.find((i) => i.branch === branch && i.level === 2)!.id;

    const causalExplanation = matchExplanation(metricName, state.northStar!.name);

    return {
      id: nanoid(),
      name: metricName,
      unit,
      type: level === 2 ? "leading" : "behaviour",
      userAnswer: answer,
      causalExplanation,
      parentId,
      branch,
      level,
      namedByAI,
    };
  }

  // Derive what metric name the current question is "predicting"
  function getPredictingMetricName(): string {
    if (!state.northStar) return "";
    const step = state.currentStep as WizardStepId;
    if (step === "q1" || step === "q3") return state.northStar.name;
    // q2 predicts branch-1 level-2; q4 predicts branch-2 level-2
    const branch: 1 | 2 = step === "q2" ? 1 : 2;
    return state.indicators.find((i) => i.branch === branch && i.level === 2)?.name ?? state.northStar.name;
  }

  const isQuestionStep = ["q1", "q2", "q3", "q4"].includes(state.currentStep);
  const progress = STEP_PROGRESS[state.currentStep];

  return (
    <main className="flex flex-1 flex-col min-h-screen">
      {/* Progress bar */}
      <div className="w-full h-1 bg-surface">
        <div
          className="h-1 bg-coral transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Indicator count (visible during question steps) */}
      {isQuestionStep && (
        <div className="px-8 py-3 border-b border-ghost-border flex items-center justify-between">
          <span className="text-text-muted text-sm font-mono">
            {state.indicators.length} of 4 indicators unlocked
          </span>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i < state.indicators.length ? "bg-coral" : "bg-ghost-border"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* ── Left: wizard step ── */}
        <section className="flex flex-1 flex-col justify-center px-6 py-10 lg:max-w-xl lg:px-14 overflow-y-auto">
          <AnimatePresence mode="wait">
            {state.currentStep === "business-type" && (
              <BusinessTypeSelector
                key="business-type"
                onSelect={(type) =>
                  dispatch({ type: "SELECT_BUSINESS_TYPE", businessType: type, customBusinessType: "" })
                }
              />
            )}

            {state.currentStep === "north-star" && state.businessType && (
              <NorthStarPicker
                key="north-star"
                businessType={state.businessType}
                claudeCallsUsed={state.claudeCallsUsed}
                onSelect={(metric) => dispatch({ type: "SELECT_NORTH_STAR", metric })}
                onClaudeCall={() => dispatch({ type: "CLAUDE_CALL" })}
              />
            )}

            {isQuestionStep && state.northStar && state.businessType && (
              <UnlockQuestion
                key={state.currentStep}
                step={state.currentStep as "q1" | "q2" | "q3" | "q4"}
                predictingMetricName={getPredictingMetricName()}
                northStarName={state.northStar.name}
                businessType={state.businessType}
                claudeCallsUsed={state.claudeCallsUsed}
                onSubmit={(answer, metricName, unit, ai) => {
                  const indicator = buildIndicator(answer, metricName, unit, ai);
                  dispatch({ type: "UNLOCK_INDICATOR", indicator });
                }}
                onClaudeCall={() => dispatch({ type: "CLAUDE_CALL" })}
              />
            )}
          </AnimatePresence>
        </section>

        {/* ── Right: live tree preview (desktop only) ── */}
        <section className="hidden lg:flex flex-1 bg-surface border-l border-ghost-border overflow-y-auto">
          <WizardTreePreview
            northStar={state.northStar}
            indicators={state.indicators}
            currentStep={state.currentStep}
          />
        </section>
      </div>
    </main>
  );
}
