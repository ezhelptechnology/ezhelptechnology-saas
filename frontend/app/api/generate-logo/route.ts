import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { businessName, colors, slogan, templateId, category, description } =
      await req.json();

    if (!businessName || typeof businessName !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid businessName" },
        { status: 400 }
      );
    }

    const palette =
      typeof colors === "string" && colors.trim().length > 0
        ? colors
        : "orange, black, white";

    const styleCategory = category || "Modern minimal";
    const styleDescription =
      description ||
      "Clean, professional logo suitable for digital and print use.";

    const prompt = `
You are a senior brand and logo designer.
Generate an SVG logo for the following business.

Business name: ${businessName}
Optional slogan: ${slogan || "none"}
Style family: ${styleCategory}
Template description: ${styleDescription}
Color palette: ${palette}
Use a simple, bold composition that works at small sizes and on both light and dark backgrounds.

Requirements:
- Respond with ONLY a single <svg>...</svg> element.
- No backticks, no markdown, no explanation.
- Use vector shapes and text; do not embed external images.
- Make sure the SVG has a viewBox, width, and height.
`.trim();

    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
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
                "You output production-ready SVG logos for brands. You only return the raw <svg>...</svg> markup with no explanations.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
      }
    );

    if (!openaiRes.ok) {
      const errJson = await openaiRes.json().catch(() => ({}));
      console.error("OpenAI logo error:", errJson);
      return NextResponse.json(
        { error: "OpenAI request failed for logo generation." },
        { status: 500 }
      );
    }

    const data = await openaiRes.json();
    let svg = data.choices?.[0]?.message?.content || "";

    // Basic safety: strip markdown if model wraps it
    svg = svg.trim();
    if (svg.startsWith("```")) {
      svg = svg.replace(/```(svg|xml)?/g, "").trim();
    }

    // Ensure it contains an <svg> tag
    if (!svg.includes("<svg")) {
      return NextResponse.json(
        { error: "Model response did not contain SVG markup." },
        { status: 500 }
      );
    }

    return NextResponse.json({ svg });
  } catch (err: any) {
    console.error("generate-logo route error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate logo." },
      { status: 500 }
    );
  }
}
