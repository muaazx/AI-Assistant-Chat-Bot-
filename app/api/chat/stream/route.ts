import { promises as fs } from "fs";
import path from "path";

/**
 * Streaming Chat API Route
 *
 * This endpoint handles chat messages with streaming responses:
 * 1. Reading knowledge from content folder
 * 2. Sending the context + user message to OpenRouter AI
 * 3. Streaming the AI-generated response as it comes in
 */

// Read all knowledge files from the content directory


export async function POST(req: Request) {
  try {
    const {
      message,
      model,
      temperature,
      customSystemPrompt,
      messages: conversationHistory,
    } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Use provided model or fallback to default
    const selectedModel = model || "gpt-4o-mini";

    // Use provided temperature or fallback to default
    const selectedTemperature =
      typeof temperature === "number" ? temperature : 0.7;

    // Build custom prompt addition if provided
    const customPromptSection =
      customSystemPrompt && customSystemPrompt.trim()
        ? `\n\nADDITIONAL INSTRUCTIONS FROM USER:\n${customSystemPrompt.trim()}`
        : "";

    // Create the system prompt
    const systemPrompt = `You are a premium, highly capable AI assistant. 

INSTRUCTIONS:
- Provide comprehensive, highly detailed, and impressive answers.
- When analyzing images or complex topics, provide deep insights, structural breakdowns, and thorough explanations.
- Be friendly, professional, and authoritative in your tone.
- Use rich markdown formatting (headings, bullet points, bold text) to make your responses beautiful and easy to read.
- You have access to the conversation history - use it to maintain deep context.${customPromptSection}`;

    const isGoogle = selectedModel.startsWith("gemini");
    const apiKey = isGoogle 
      ? process.env.GOOGLE_API_KEY
      : process.env.OPENAI_API_KEY;

    const endpoint = isGoogle 
      ? "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
      
    const actualModel = selectedModel;

    // Build messages array with conversation history
    const apiMessages: Array<{ role: string; content: any }> = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history if provided (limit to last 20 messages for token efficiency)
    if (conversationHistory && Array.isArray(conversationHistory)) {
      const recentHistory = conversationHistory.slice(-20);
      for (const msg of recentHistory) {
        if (msg.role === "user" || msg.role === "assistant") {
          let contentData: any = msg.content;
          if (msg.imageUrl) {
            contentData = [
              { type: "text", text: msg.content },
              { type: "image_url", image_url: { url: msg.imageUrl } }
            ];
          }
          apiMessages.push({
            role: msg.role,
            content: contentData,
          });
        }
      }
    }

    // Call API with streaming enabled
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
          messages: apiMessages,
          max_tokens: 4096,
          temperature: selectedTemperature,
          stream: true, // Enable streaming
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error:", response.status, errorText);
      return new Response(
        JSON.stringify({
          error: "Failed to get AI response",
          details: errorText,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Create a TransformStream to process the SSE data
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = decoder.decode(chunk, { stream: true });
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") {
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              return;
            }
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                // Forward the content as SSE
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ content })}\n\n`),
                );
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      },
    });

    // Pipe the response through the transform
    const readable = response.body?.pipeThrough(transformStream);

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
