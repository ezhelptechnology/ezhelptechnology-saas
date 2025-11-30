// frontend/app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, businessInfo } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid prompt" },
        { status: 400 }
      );
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY not configured" },
        { status: 500 }
      );
    }

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL_AGENT || "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `You are an expert web designer. Generate complete, valid HTML with TailwindCSS (via CDN).

Rules:
- Return ONLY the HTML code, no markdown, no explanations, no code blocks
- Include the TailwindCSS CDN: <script src="https://cdn.tailwindcss.com"></script>
- Create a complete HTML document with <!DOCTYPE html>, <html>, <head>, and <body>
- Make the design mobile-responsive using Tailwind classes
- Use modern, professional styling with gradients and shadows
- Include: hero section, features/services, about, CTA, and footer
- Use the brand colors provided in the prompt
- Add smooth hover effects and transitions
- Include placeholder images using https://placehold.co/`,
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 4096,
        }),
      }
    );

    if (!groqRes.ok) {
      const errJson = await groqRes.json().catch(() => ({}));
      console.error("Groq website error:", errJson);
      return NextResponse.json(
        { error: "Groq request failed for website generation." },
        { status: 500 }
      );
    }

    const data = await groqRes.json();
    let html = data.choices?.[0]?.message?.content || "";

    // Clean up the response
    html = html.trim();

    // Strip markdown code blocks if present
    if (html.startsWith("```")) {
      html = html.replace(/```(html)?/gi, "").trim();
    }
    if (html.endsWith("```")) {
      html = html.slice(0, -3).trim();
    }

    // Find the start of HTML
    const doctypeIndex = html.indexOf("<!DOCTYPE");
    const htmlIndex = html.indexOf("<html");
    const startIndex = doctypeIndex !== -1 ? doctypeIndex : htmlIndex;
    
    if (startIndex > 0) {
      html = html.substring(startIndex);
    }

    // If no proper HTML structure, wrap it
    if (!html.includes("<!DOCTYPE") && !html.includes("<html")) {
      html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>Generated Website</title>
</head>
<body class="bg-gray-50">
${html}
</body>
</html>`;
    }

    // Ensure TailwindCSS CDN is included
    if (!html.includes("tailwindcss.com")) {
      html = html.replace(
        "</head>",
        '  <script src="https://cdn.tailwindcss.com"></script>\n</head>'
      );
    }

    return NextResponse.json({ html });
  } catch (err: any) {
    console.error("generate route error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate website." },
      { status: 500 }
    );
  }
}
