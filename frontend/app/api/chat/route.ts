// frontend/app/api/chat/route.ts
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groqApiKey = process.env.GROQ_API_KEY;

if (!groqApiKey) {
  console.warn(
    "[/api/chat] GROQ_API_KEY is not set in environment. FroBot will not work until it is."
  );
}

const groq = new Groq({
  apiKey: groqApiKey || "missing-key",
});

const MODEL =
  process.env.AI_MODEL_FROBOT ||
  process.env.GROQ_MODEL ||
  "llama-3.1-8b-instant";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    /**
     * We support BOTH:
     *  - { message, history }  (what BuilderPage sends)
     *  - { messages: [...] }   (older shape, just in case)
     */

    // 1) Get latest user message
    let message: string = "";

    if (typeof body?.message === "string") {
      message = body.message.trim();
    }

    // Fallback: infer from body.messages (array of {role, content})
    const rawMessages = Array.isArray(body?.messages) ? body.messages : [];
    if (!message && rawMessages.length > 0) {
      const lastUser = [...rawMessages]
        .reverse()
        .find((m: any) => m.role === "user" && m.content);
      if (lastUser) {
        message = String(lastUser.content).trim();
      }
    }

    if (!message) {
      return NextResponse.json(
        { ok: false, error: "Message is required" },
        { status: 400 }
      );
    }

    // 2) Normalize history coming from BuilderPage (history) OR older messages shape
    const historySource =
      body?.history || body?.conversationHistory || body?.messages || [];

    const cleanedHistory = (Array.isArray(historySource) ? historySource : [])
      .filter((msg: any) => msg && msg.content)
      .map((msg: any) => ({
        // map "bot" → "assistant" for Groq
        role: msg.role === "user" ? "user" : "assistant",
        content: String(msg.content),
      }));

    if (!groqApiKey) {
      return NextResponse.json(
        {
          ok: false,
          error: "Server is missing GROQ_API_KEY env var",
        },
        { status: 500 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are FroBot, the AI design assistant for EZ Help Technology. " +
            "Your job is to collect 5 key pieces of info, ONE question at a time:\n" +
            "1) Business name\n2) Industry & target customers\n3) Brand style (modern, luxury, playful, etc.)\n" +
            "4) Primary brand colors\n5) Email address for delivery\n\n" +
            "Keep responses short (2–3 sentences), friendly, and always ask a follow-up until you have all 5.",
        },
        ...cleanedHistory,
        // ensure the latest user message is included explicitly
        { role: "user", content: message },
      ],
      max_tokens: 512,
      temperature: 0.7,
    });

    const answer = completion.choices?.[0]?.message?.content?.trim() || "";

    if (!answer) {
      throw new Error("Empty response from Groq");
    }

    // 🔥 This shape matches what BuilderPage expects: { response }
    return NextResponse.json({ ok: true, response: answer });
  } catch (err: any) {
    console.error("Groq /api/chat error:", err?.response?.data || err);

    return NextResponse.json(
      {
        ok: false,
        error: "Groq chat failed",
        response:
          "I’m having trouble reaching the AI engine right now. Please try again in a moment.",
      },
      { status: 500 }
    );
  }
}
