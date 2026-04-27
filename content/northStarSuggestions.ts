import type { BusinessType, Metric } from "@/types";
import { nanoid } from "nanoid";

const m = (name: string, unit: string): Metric => ({
  id: nanoid(),
  name,
  unit,
  type: "lagging",
});

export const northStarByBusinessType: Record<BusinessType, Metric[]> = {
  saas: [
    m("Monthly Recurring Revenue", "£/$ per month"),
    m("Daily Active Users", "unique users/day"),
    m("Net Revenue Retention", "%"),
  ],
  ecommerce: [
    m("Total Revenue", "£/$ per month"),
    m("Repeat Purchase Rate", "% of customers buying again"),
    m("Average Order Value", "£/$ per order"),
  ],
  marketplace: [
    m("Gross Merchandise Value", "£/$ transacted per month"),
    m("Buyer-to-Seller Ratio", "ratio"),
    m("Take Rate", "% of GMV retained as revenue"),
  ],
  consumer: [
    m("DAU/MAU Ratio", "% — daily vs monthly active users"),
    m("D7 Retention", "% of users active 7 days after sign-up"),
    m("Sessions per User", "sessions/user/week"),
  ],
  media: [
    m("Monthly Active Readers", "unique readers/month"),
    m("Content Completion Rate", "% of content items fully consumed"),
    m("Subscriber Growth", "net new subscribers/month"),
  ],
  fintech: [
    m("Assets Under Management", "£/$ total"),
    m("Transaction Volume", "£/$ processed per month"),
    m("Activation Rate", "% of sign-ups completing first transaction"),
  ],
  // "other" is handled dynamically via Claude API
  other: [],
};

export function getNorthStarSuggestions(type: BusinessType): Metric[] {
  return northStarByBusinessType[type] ?? [];
}
