import { EXPLANATION_PAIRS, GENERIC_EXPLANATION_TEMPLATE } from "@/content/explanations";

export function matchExplanation(
  indicatorName: string,
  northStarName: string
): string {
  const match = EXPLANATION_PAIRS.find(
    (entry) =>
      entry.indicatorPattern.test(indicatorName) &&
      entry.northStarPattern.test(northStarName)
  );

  if (match) return match.explanation;

  return GENERIC_EXPLANATION_TEMPLATE.replace("[indicator]", indicatorName).replace(
    "[northStar]",
    northStarName
  );
}
