// frontend/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groqApiKey = process.env.GROQ_API_KEY;

if (!groqApiKey) {
  console.warn("[/api/chat] GROQ_API_KEY is not set. FroBot will not work until it is.");
}

const groq = new Groq({
  apiKey: groqApiKey || "missing-key",
});

const MODEL = process.env.AI_MODEL_FROBOT || "llama-3.1-8b-instant";

const SYSTEM_PROMPT = `You are FroBot, a friendly and professional AI assistant for EZ Help Technology.

Your job is to have a natural conversation to gather business information. You should:
1. Be warm, enthusiastic, and encouraging
2. Ask follow-up questions if answers are vague
3. Acknowledge each answer before moving to the next topic
4. Keep responses concise (2-3 sentences max)

Information to gather:
- Business name
- Industry and target customers
- Brand style preference (modern, minimal, luxury, playful, etc.)
- Primary colors for branding
- Email address for delivery

After gathering all information, summarize what you learned and say you're ready to start building their package.`;

type MessageRole = "system" | "user" | "assistant";

interface ChatMessage {
  role: MessageRole;
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Support BOTH:
    //  - { messages: [...] }
    //  - { message, conversationHistory }
    let messages: ChatMessage[] = [];

    if (Array.isArray(body?.messages)) {
      messages = body.messages.map((m: any): ChatMessage => ({
        role: (m.role === "bot" ? "assistant" : m.role) as MessageRole,
        content: String(m.content ?? ""),
      }));
    } else if (typeof body?.message === "string") {
      const history = Array.isArray(body?.conversationHistory)
        ? body.conversationHistory
        : [];

      messages = history.map((m: any): ChatMessage => ({
        role: (m.role === "bot" ? "assistant" : m.role) as MessageRole,
        content: String(m.content ?? ""),
      }));

      messages.push({
        role: "user",
        content: body.message,
      });
    } else {
      return NextResponse.json(
        { ok: false, error: "Invalid request format" },
        { status: 400 }
      );
    }

    // Filter out junk
    messages = messages.filter(
      (m) =>
        m.content.trim().length > 0 &&
        (m.role === "user" || m.role === "assistant" || m.role === "system")
    );

    if (messages.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No valid messages provided" },
        { status: 400 }
      );
    }

    if (!groqApiKey) {
      return NextResponse.json(
        {
          ok: false,
          error: "Server is missing GROQ_API_KEY env var",
        },
        { status: 500 }
      );
    }

    const chatMessages: ChatMessage[] = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...messages,
    ];

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: chatMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      temperature: 0.7,
      max_tokens: 1024,
    });

    const responseContent =
      completion.choices[0]?.message?.content?.trim() ||
      "I apologize, I'm having trouble responding. Please try again.";

    return NextResponse.json({
      ok: true,
      message: responseContent,
      response: responseContent,
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Failed to process chat request",
      },
      { status: 500 }
    );
  }
}
