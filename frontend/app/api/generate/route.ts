import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert web designer. Generate HTML with TailwindCSS only. No explanation.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  const data = await response.json();
  const html = data.choices?.[0]?.message?.content || "";

  return NextResponse.json({ html });
}
