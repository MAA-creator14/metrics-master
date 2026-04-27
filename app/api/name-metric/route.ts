import { anthropic } from "@ai-sdk/anthropic";
import { generateText, Output } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

const MetricNameSchema = z.object({
  metricName: z.string().describe("3–5 word metric name"),
  unit: z.string().describe("unit of measurement, e.g. '% of new signups'"),
});

export async function POST(request: Request) {
  try {
    const { businessType, northStar, userAnswer, level } = await request.json();
    if (!businessType || !northStar || !userAnswer || !level) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const { output } = await generateText({
      model: "claude-haiku-4.5",
      output: Output.object({ schema: MetricNameSchema }),
      system: `You are a product management coach.
Business context: ${businessType} business. North star metric: ${northStar}.
Task: given a user's description of a ${level === "leading" ? "leading indicator" : "upstream behaviour"}, return a concise metric name (3–5 words) and its unit of measurement.`,
      prompt: `User described: "${userAnswer}"`,
    });
    return NextResponse.json(output);
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: "Failed to name metric" }, { status: 500 });
  }
}
