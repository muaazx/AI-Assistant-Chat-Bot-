import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

/**
 * Chat API Route
 *
 * This endpoint handles chat messages by:
 * 1. Reading knowledge from content/knowledge.md
 * 2. Sending the context + user message to OpenRouter AI
 * 3. Returning the AI-generated response
 */



export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Create the system prompt
    const systemPrompt = `You are a premium, highly capable AI assistant. 

INSTRUCTIONS:
- Provide comprehensive, highly detailed, and impressive answers.
- When analyzing images or complex topics, provide deep insights, structural breakdowns, and thorough explanations.
- Be friendly, professional, and authoritative in your tone.
- Use rich markdown formatting (headings, bullet points, bold text) to make your responses beautiful and easy to read.`;

    const apiKey = process.env.OPENAI_API_KEY;
    const endpoint = "https://api.openai.com/v1/chat/completions";
    const actualModel = "gpt-4o-mini";

    // Call API
    const response = await fetch(
      endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: actualModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to get AI response", details: errorText },
        { status: response.status },
      );
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content;

    if (!generatedText?.trim()) {
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 500 },
      );
    }

    return NextResponse.json({ response: generatedText.trim() });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
