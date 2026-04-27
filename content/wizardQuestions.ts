export interface QuestionTemplate {
  /** Which wizard step this question appears on */
  step: "q1" | "q2" | "q3" | "q4";
  /** Level in the tree this answer will produce */
  level: 2 | 3;
  /** Branch in the tree (1 = first causal chain, 2 = second) */
  branch: 1 | 2;
  /** Raw template — use interpolateQuestion() to fill in [metric] */
  template: string;
}

export const QUESTION_TEMPLATES: QuestionTemplate[] = [
  {
    step: "q1",
    level: 2,
    branch: 1,
    template:
      "What behaviour, if it increased this week, would predict [metric] going up next month?",
  },
  {
    step: "q2",
    level: 3,
    branch: 1,
    template:
      "Good. Now one level up — what behaviour, if it increased this week, would predict [metric] going up?",
  },
  {
    step: "q3",
    level: 2,
    branch: 2,
    template:
      "What ELSE, if it increased this week, would predict [metric] going up next month?",
  },
  {
    step: "q4",
    level: 3,
    branch: 2,
    template:
      "And for that one — what behaviour, if it increased this week, would predict [metric] going up?",
  },
];

export function interpolateQuestion(template: string, metricName: string): string {
  return template.replace(/\[metric\]/g, metricName);
}

export function getQuestion(step: "q1" | "q2" | "q3" | "q4"): QuestionTemplate {
  const q = QUESTION_TEMPLATES.find((t) => t.step === step);
  if (!q) throw new Error(`No question template for step ${step}`);
  return q;
}

/** Example answers shown in the collapsed accordion, keyed by step and business type */
export const EXAMPLE_ANSWERS: Record<string, Record<string, string[]>> = {
  q1: {
    saas: [
      "More new users complete onboarding and connect their first integration",
      "More trial users see value within their first session",
    ],
    ecommerce: [
      "More customers add a second item to their basket before checkout",
      "More returning visitors use a saved wishlist",
    ],
    marketplace: [
      "More buyers send a message to a seller within 24 hours of browsing",
      "More new sellers list their first item",
    ],
    consumer: [
      "More users complete the core action (post, watch, connect) in their first session",
      "More users receive a notification that brings them back",
    ],
    media: [
      "More readers click through from a headline to a full article",
      "More subscribers open the weekly newsletter",
    ],
    fintech: [
      "More users link their bank account after sign-up",
      "More users make a second transaction within 30 days of their first",
    ],
    other: [
      "More users complete the core action your product is designed for",
      "More users return within 7 days of their first session",
    ],
  },
  q2: {
    saas: [
      "Our customer success team sends a personal check-in email in the first 48 hours",
      "Users see a contextual in-app prompt at the right moment",
    ],
    ecommerce: ["Related product recommendations are shown at the right moment", "The upsell prompt appears before the user reaches checkout"],
    marketplace: ["Sellers respond to buyer enquiries within 2 hours", "The platform sends a personalised match notification"],
    consumer: ["A friend or contact is already on the platform", "The onboarding flow shows them value immediately"],
    media: ["The recommended content matches their reading history", "A personalised digest is sent at their peak reading time"],
    fintech: ["The account linking flow has fewer steps", "Users receive a clear explanation of what happens after they connect"],
    other: ["The product reduces friction at the critical first step", "Users receive a timely reminder or prompt"],
  },
  q3: {
    saas: [
      "Customers who are already paying expand their usage to more seats or features",
      "Churned customers reduce — more customers stay past month 3",
    ],
    ecommerce: ["More customers leave a review after purchase", "More customers use a discount code on their second order"],
    marketplace: ["More transactions are completed without a dispute", "More repeat buyers make a purchase in the same category"],
    consumer: ["More users share the app with someone in their network", "More users complete a social action (follow, like, comment)"],
    media: ["More readers share an article", "More subscribers upgrade to a paid tier"],
    fintech: ["More users set up a recurring transaction or savings plan", "More users refer a friend"],
    other: ["More users complete a second meaningful action", "More users invite someone else"],
  },
  q4: {
    saas: ["The in-app upgrade prompt appears at the right moment in the user journey", "A usage-based nudge is sent before the trial expires"],
    ecommerce: ["Post-purchase email arrives within 24 hours with a personalised follow-up offer", "The review prompt is timed to appear after delivery confirmation"],
    marketplace: ["The platform sends a re-engagement email after 14 days of inactivity", "Buyers see a 'complete your purchase' reminder"],
    consumer: ["The share mechanic is built into the core product flow, not hidden in settings", "Users receive a notification when a contact joins"],
    media: ["The paywall appears after a reader has consumed 3+ articles", "Subscribers receive an exclusive preview of premium content"],
    fintech: ["The referral prompt appears after the user's first successful transaction", "The recurring payment setup is offered as part of onboarding"],
    other: ["The follow-up prompt appears at the highest-engagement moment", "The referral mechanic is frictionless and rewarding"],
  },
};
