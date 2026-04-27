const SESSION_CAP = 3;
let callsUsed = 0;

export function canCallClaude(): boolean {
  return callsUsed < SESSION_CAP;
}

export function getRemainingCalls(): number {
  return Math.max(0, SESSION_CAP - callsUsed);
}

export async function callNameMetric(
  businessType: string,
  northStar: string,
  userAnswer: string,
  level: "leading" | "behaviour"
): Promise<{ metricName: string; unit: string } | null> {
  if (!canCallClaude()) return null;
  callsUsed++;

  const res = await fetch("/api/name-metric", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ businessType, northStar, userAnswer, level }),
  });

  if (!res.ok) {
    callsUsed--; // refund if the request failed
    return null;
  }

  return res.json();
}

export async function callSuggestNorthStar(
  customBusinessType: string
): Promise<Array<{ name: string; unit: string; whyLagging: string }> | null> {
  if (!canCallClaude()) return null;
  callsUsed++;

  const res = await fetch("/api/suggest-north-star", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customBusinessType }),
  });

  if (!res.ok) {
    callsUsed--;
    return null;
  }

  return res.json();
}
