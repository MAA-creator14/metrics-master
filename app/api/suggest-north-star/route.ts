import { anthropic } from "@ai-sdk/anthropic";
import { generateText, Output } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

const SuggestionsSchema = z.object({
  suggestions: z
    .array(
      z.object({
        name: z.string(),
        unit: z.string(),
        whyLagging: z
          .string()
          .describe("One sentence explaining why this is a lagging metric"),
      })
    )
    .length(3),
});

export async function POST(request: Request) {
  try {
    const { customBusinessType } = await request.json();

    if (!customBusinessType) {
      return NextResponse.json({ error: "Missing customBusinessType" }, { status: 400 });
    }

    const { output } = await generateText({
      model: anthropic("claude-haiku-4.5"),
      output: Output.object({ schema: SuggestionsSchema }),
      system: `You are a product management coach. Suggest specific, measurable north star metrics.
Each must be a lagging metric — measured after the fact, not a behaviour that predicts it.`,
      prompt: `Business type: "${customBusinessType}". Return exactly 3 north star suggestions.`,
    });

    return NextResponse.json(output.suggestions);
  } catch {
    return NextResponse.json({ error: "Failed to suggest metrics" }, { status: 500 });
  }
}
