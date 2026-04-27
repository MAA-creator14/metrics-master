/**
 * Keywords that suggest a user's answer describes a lagging metric rather than
 * a leading behaviour. Used for the soft nudge in the wizard.
 */
export const LAGGING_KEYWORDS: string[] = [
  "revenue",
  "mrr",
  "arr",
  "churn",
  "nps",
  "dau",
  "mau",
  "profit",
  "sales",
  "gmv",
  "arpu",
  "ltv",
  "cac",
  "growth rate",
  "market share",
];

export function looksLikeLaggingMetric(answer: string): boolean {
  const lower = answer.toLowerCase();
  return LAGGING_KEYWORDS.some((kw) => lower.includes(kw));
}
