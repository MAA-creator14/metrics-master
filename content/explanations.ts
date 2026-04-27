export interface ExplanationEntry {
  indicatorPattern: RegExp;
  northStarPattern: RegExp;
  explanation: string;
}

/**
 * Pre-written causal explanation pairs — 32 entries covering all 6 business types.
 * Pattern-matched at render time: first match wins.
 * Patterns are intentionally broad to catch user-typed variants.
 */
export const EXPLANATION_PAIRS: ExplanationEntry[] = [

  // ── SaaS ──────────────────────────────────────────────────────────────────

  {
    indicatorPattern: /onboarding completion/i,
    northStarPattern: /MRR|ARR|revenue/i,
    explanation:
      "Users who complete onboarding convert to paid at significantly higher rates — making this one of the strongest early signals for revenue growth.",
  },
  {
    indicatorPattern: /trial.to.paid|trial.*conver/i,
    northStarPattern: /MRR|ARR|revenue/i,
    explanation:
      "Trial-to-paid conversion is the most direct upstream signal for MRR growth — improving it by even a few percentage points compounds into significant revenue over time.",
  },
  {
    indicatorPattern: /expansion.*MRR|expansion.*revenue|upsell|upgrade/i,
    northStarPattern: /MRR|ARR|revenue/i,
    explanation:
      "Expansion from existing customers costs a fraction of new acquisition. A rising expansion rate signals deepening product value and predicts compounding MRR growth.",
  },
  {
    indicatorPattern: /feature adoption|feature.*use|features.*used/i,
    northStarPattern: /NRR|net revenue retention|retention|churn/i,
    explanation:
      "Customers who adopt 3+ features churn at a fraction of the rate of single-feature users — making breadth of adoption a strong leading signal for revenue retention.",
  },
  {
    indicatorPattern: /support ticket|help.*request|support.*volume/i,
    northStarPattern: /NRR|net revenue retention|churn/i,
    explanation:
      "Unresolved friction is the number one driver of churn. A rising support ticket volume is an early warning that customers are hitting walls — and walls predict cancellations.",
  },
  {
    indicatorPattern: /stickiness|DAU.*WAU|daily.*weekly.*ratio/i,
    northStarPattern: /DAU|daily active|engagement/i,
    explanation:
      "A rising DAU/WAU ratio means users are returning more frequently than their workflow requires. Habitual engagement is the clearest signal that daily active usage is on a growth trajectory.",
  },
  {
    indicatorPattern: /session.*(length|duration|time)/i,
    northStarPattern: /DAU|daily active|engagement/i,
    explanation:
      "Users who spend longer in a session are discovering more value — and users who find value repeatedly are the ones who become daily active users.",
  },
  {
    indicatorPattern: /time.to.value|first.*(action|value|aha)|aha.*moment/i,
    northStarPattern: /retention|DAU|active/i,
    explanation:
      "The faster a user reaches their first meaningful outcome, the more likely they are to return. Time-to-value is consistently one of the best early predictors of long-term retention.",
  },

  // ── E-commerce ────────────────────────────────────────────────────────────

  {
    indicatorPattern: /cart.*(conver|abandon|complete)|checkout.*rate/i,
    northStarPattern: /revenue|GMV|sales/i,
    explanation:
      "Each percentage point improvement in cart conversion translates directly into revenue without additional traffic costs — making it one of the most leveraged leading signals for revenue growth.",
  },
  {
    indicatorPattern: /basket size|items per order|order.*size|units per/i,
    northStarPattern: /revenue|GMV|AOV|average order/i,
    explanation:
      "Customers who add more items per order generate disproportionately higher revenue per session. A rising average basket size predicts revenue growth faster than new customer acquisition alone.",
  },
  {
    indicatorPattern: /return visitor|browse.*return|returning.*shopper/i,
    northStarPattern: /repeat purchase|retention|returning/i,
    explanation:
      "Users who return to browse without a specific intent are developing a shopping habit — and habit formation is the strongest predictor of a second purchase.",
  },
  {
    indicatorPattern: /post.purchase.*email|follow.up.*email|email.*purchase/i,
    northStarPattern: /repeat purchase|LTV|returning/i,
    explanation:
      "Customers who engage with post-purchase communication are still emotionally invested in the brand — making them far more likely to convert on a follow-up offer.",
  },
  {
    indicatorPattern: /wishlist|save.*item|saved.*product/i,
    northStarPattern: /revenue|GMV|conversion/i,
    explanation:
      "Items saved to a wishlist represent deferred purchase intent. A rising save rate predicts future revenue — especially during promotions or seasonal peaks when intent converts.",
  },
  {
    indicatorPattern: /review.*rate|review.*submit|product.*review/i,
    northStarPattern: /repeat purchase|LTV|retention/i,
    explanation:
      "Customers who leave reviews are actively processing their purchase experience. This engagement correlates with stronger emotional investment and a meaningfully higher likelihood of returning.",
  },
  {
    indicatorPattern: /repeat purchase|second order|second.*purchase/i,
    northStarPattern: /revenue|LTV|retention/i,
    explanation:
      "The second purchase is the strongest indicator of long-term customer value. Customers who buy twice are disproportionately likely to become high-LTV loyalists.",
  },

  // ── Marketplace ───────────────────────────────────────────────────────────

  {
    indicatorPattern: /seller.*response|response.*time|reply.*time/i,
    northStarPattern: /GMV|transaction|volume/i,
    explanation:
      "Buyers who receive fast responses are significantly more likely to complete a transaction. Improving seller response time reduces the deals lost to competitor listings or buyer impatience.",
  },
  {
    indicatorPattern: /listing quality|listing.*score|listing.*complete/i,
    northStarPattern: /GMV|transaction|conversion/i,
    explanation:
      "High-quality listings with clear descriptions and images convert at 3–4× the rate of low-quality ones — making listing quality a powerful upstream signal for total transaction volume.",
  },
  {
    indicatorPattern: /buyer.*repeat|repeat.*buyer|returning.*buyer/i,
    northStarPattern: /GMV|transaction|volume/i,
    explanation:
      "Return buyers transact with higher confidence and lower friction. A rising repeat buyer rate compounds GMV growth faster than equivalent investment in new buyer acquisition.",
  },
  {
    indicatorPattern: /first.*transaction|days.*first.*sale|time.*first.*deal/i,
    northStarPattern: /GMV|transaction|seller.*active/i,
    explanation:
      "Sellers who complete their first transaction within 7 days are dramatically more likely to become active, high-volume contributors. Accelerating this milestone is the strongest lever for growing total GMV.",
  },
  {
    indicatorPattern: /invite|referral|viral|share/i,
    northStarPattern: /DAU|growth|users|active/i,
    explanation:
      "Each successful invite is a user vouching for your product with social proof attached. Word-of-mouth acquisition consistently produces the highest-quality, highest-retention new users.",
  },

  // ── Consumer App ──────────────────────────────────────────────────────────

  {
    indicatorPattern: /d[1-3]\s*retention|day.?[1-3]\s*retention|next.day/i,
    northStarPattern: /DAU|MAU|daily active|retention/i,
    explanation:
      "Users who return on day 1 have experienced enough value to form an initial habit signal. Day 1 retention is consistently the strongest single predictor of long-term daily engagement.",
  },
  {
    indicatorPattern: /d[4-9]\s*retention|day.?[4-9]\s*retention|d7|day 7|week.*retention/i,
    northStarPattern: /DAU|MAU|daily active|retention/i,
    explanation:
      "Users who return on day 7 have crossed the habit threshold. This reliably predicts whether daily active usage will grow or plateau over the following months.",
  },
  {
    indicatorPattern: /core action|primary action|key action|main.*action/i,
    northStarPattern: /DAU|MAU|engagement|active/i,
    explanation:
      "Users who complete the core action your product is built around develop habitual usage patterns. Increasing core action completion is the most direct path to a higher DAU/MAU ratio.",
  },
  {
    indicatorPattern: /connection|friend|follow|social.*graph|network.*size/i,
    northStarPattern: /sessions|DAU|engagement|active/i,
    explanation:
      "Users with 3+ connections in a social product have a network that pulls them back. Social graph density is one of the strongest predictors of sustained session frequency.",
  },
  {
    indicatorPattern: /notification.*opt.in|push.*opt.in|notification.*enable/i,
    northStarPattern: /DAU|MAU|retention|active/i,
    explanation:
      "Users who opt into notifications grant the product a re-engagement channel. Opt-in rate is a leading signal for passive re-activation, which directly lifts the DAU/MAU ratio over the following 30 days.",
  },

  // ── Media / Content ───────────────────────────────────────────────────────

  {
    indicatorPattern: /newsletter.*open|email.*open|open.*rate/i,
    northStarPattern: /subscriber|reader|active|monthly/i,
    explanation:
      "Email open rate is the most direct proxy for content resonance. Readers who open newsletters are demonstrating relevance — and they are the same readers who visit repeatedly and eventually pay.",
  },
  {
    indicatorPattern: /content completion|article.*finish|read.*complet|scroll.*depth/i,
    northStarPattern: /reader|active|subscriber|engagement/i,
    explanation:
      "Readers who complete an article found enough value to stay to the end — and they are far more likely to return. Completion rate predicts long-term active readership better than raw pageview counts.",
  },
  {
    indicatorPattern: /social share|share.*article|share.*content|sharing.*rate/i,
    northStarPattern: /reader|active|subscriber|growth/i,
    explanation:
      "Each share is an organic distribution event that brings new readers with built-in social proof. A rising share rate is the strongest low-cost signal for growing monthly active readership.",
  },

  // ── Fintech ───────────────────────────────────────────────────────────────

  {
    indicatorPattern: /account link|bank connect|payment method|card.*add/i,
    northStarPattern: /transaction|volume|activation/i,
    explanation:
      "Linking a payment method is the highest-intent action a fintech user can take — it directly gates the first transaction and is the strongest predictor of all future volume.",
  },
  {
    indicatorPattern: /second transaction|second.*payment|repeat.*transaction/i,
    northStarPattern: /transaction|volume|revenue/i,
    explanation:
      "The second transaction is the watershed moment in fintech engagement. Users who transact twice have moved past novelty into habit — and habit is the most reliable predictor of long-term volume.",
  },
  {
    indicatorPattern: /recurring|standing order|auto.*pay|scheduled.*payment/i,
    northStarPattern: /transaction|volume|revenue/i,
    explanation:
      "Users who set up recurring payments generate compounding transaction volume with zero additional friction. Recurring payment adoption is one of the highest-multiplier behaviours in fintech.",
  },
  {
    indicatorPattern: /KYC|identity.*verif|verification.*complet/i,
    northStarPattern: /activation|transaction|revenue/i,
    explanation:
      "KYC is the critical gate between sign-up and first financial action. Every percentage point improvement in KYC completion directly unlocks proportional revenue from otherwise lost users.",
  },
];

export const GENERIC_EXPLANATION_TEMPLATE =
  "When [indicator] increases, it signals that users are getting more value from your product — which creates the conditions for [northStar] to improve over the following weeks.";
