export type BusinessType =
  | "saas"
  | "ecommerce"
  | "marketplace"
  | "consumer"
  | "media"
  | "fintech"
  | "other";

export type MetricType = "lagging" | "leading" | "behaviour";

export interface Metric {
  id: string;
  name: string;
  unit: string;
  type: MetricType;
}

export interface Indicator extends Metric {
  /** The user's raw free-text answer to the wizard question */
  userAnswer: string;
  /** Causal explanation (from content library or generic fallback) */
  causalExplanation: string;
  /** ID of the metric this indicator predicts (northStar.id or a level-2 indicator id) */
  parentId: string;
  /** Which of the 2 branches this belongs to */
  branch: 1 | 2;
  /** Depth in the tree: 2 = leading indicator, 3 = upstream behaviour */
  level: 2 | 3;
  /** Whether the user clicked "Help me name this" for this indicator */
  namedByAI: boolean;
}

export interface MetricTree {
  id: string;
  businessType: BusinessType;
  /** Only set when businessType === "other" */
  customBusinessType?: string;
  northStar: Metric;
  /** Ordered by unlock sequence: [branch1-level2, branch1-level3, branch2-level2, branch2-level3] */
  indicators: Indicator[];
  createdAt: string;
}

/* ── Wizard state ── */

export type WizardStepId =
  | "business-type"
  | "north-star"
  | "q1"
  | "q2"
  | "q3"
  | "q4"
  | "reveal";

/** Maps each wizard step to the indicator it produces (null for setup steps) */
export const STEP_SEQUENCE: WizardStepId[] = [
  "business-type",
  "north-star",
  "q1",
  "q2",
  "q3",
  "q4",
  "reveal",
];

export interface WizardState {
  currentStep: WizardStepId;
  businessType: BusinessType | null;
  customBusinessType: string;
  northStar: Metric | null;
  indicators: Indicator[];
  /** Number of Claude API calls made this session (cap = 3) */
  claudeCallsUsed: number;
}

export const INITIAL_WIZARD_STATE: WizardState = {
  currentStep: "business-type",
  businessType: null,
  customBusinessType: "",
  northStar: null,
  indicators: [],
  claudeCallsUsed: 0,
};
