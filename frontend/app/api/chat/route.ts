// frontend/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
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
    
    // Handle both formats: { message, conversationHistory } or { messages }
    let messages: ChatMessage[] = [];
    
    if (body.messages && Array.isArray(body.messages)) {
      // New format: array of messages
      messages = body.messages.map((m: any) => ({
        role: (m.role === "bot" ? "assistant" : m.role) as MessageRole,
        content: String(m.content || ""),
      }));
    } else if (body.message) {
      // Old format: single message with history
      const history = body.conversationHistory || [];
      messages = history.map((m: any) => ({
        role: (m.role === "bot" ? "assistant" : m.role) as MessageRole,
        content: String(m.content || ""),
      }));
      messages.push({
        role: "user" as MessageRole,
        content: String(body.message),
      });
    } else {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    // Filter out any invalid messages
    messages = messages.filter(
      (m) => m.content && ["user", "assistant", "system"].includes(m.role)
    );

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "No valid messages provided" },
        { status: 400 }
      );
    }

    // Build the messages array with proper typing
    const chatMessages: Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }> = [
      {
        role: "system" as const,
        content: SYSTEM_PROMPT,
      },
      ...messages.map((m) => ({
        role: m.role as "system" | "user" | "assistant",
        content: m.content,
      })),
    ];

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    const responseContent =
      completion.choices[0]?.message?.content ||
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
        error: error.message || "Failed to process chat request",
      },
      { status: 500 }
    );
  }
}