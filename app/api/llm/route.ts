import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

/**
 * API route for generating content using OpenAI.
 */
export async function POST(req: Request): Promise<Response> {
  try {
    /**
     * Get the prompt from the request body.
     */
    const data = await req.json();
    const prompt = data.text || "Explain how AI works";

    /**
     * Use OpenAI to generate content from the prompt.
     */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    /**
     * Return the generated content as a JSON response.
     */
    return NextResponse.json({
      summary: completion.choices[0]?.message?.content || "",
    });
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}

