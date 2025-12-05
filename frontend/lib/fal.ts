// frontend/lib/fal.ts
// FAL.ai integration for AI image generation
// + Pollinations.ai (Free Fallback)

export async function generateLogoImage(prompt: string): Promise<string | null> {
  const falKey = process.env.FAL_KEY || process.env.FAL_API_KEY;

  if (!falKey) {
    console.warn("⚠️ FAL_KEY missing. Using Pollinations.ai (FREE) for logo...");
    const enhancedPrompt = `vector logo design, ${prompt}, minimal, white background, high quality, no text`;
    return generatePollinationsUrl(enhancedPrompt, 1024, 1024);
  }

  try {
    console.log("🖼️ FAL: Generating logo image...");

    const model = process.env.FAL_LOGO_MODEL || "fal-ai/flux/schnell";

    // Enhanced prompt for logo generation
    const enhancedPrompt = `Professional business logo design, ${prompt}, clean vector style, minimal background, high contrast, suitable for branding, modern design, white or transparent background`;

    const response = await fetch(`https://fal.run/${model}`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        image_size: "square",
        num_inference_steps: 4,
        num_images: 1,
        enable_safety_checker: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ FAL API error (TRIGGERING POLLINATIONS FALLBACK):", response.status, errorText);
      return generatePollinationsUrl(prompt, 1024, 1024);
    }

    const data = await response.json();
    const imageUrl = data.images?.[0]?.url || data.image?.url || null;

    if (imageUrl) {
      console.log("✅ FAL: Logo image generated successfully");
      return imageUrl;
    }

    console.warn("⚠️ FAL: No image URL in response");
    return generatePollinationsUrl(prompt, 1024, 1024);
  } catch (error: any) {
    console.error("❌ FAL generation error:", error.message);
    return generatePollinationsUrl(prompt, 1024, 1024);
  }
}

export async function generateWebsiteHeroImage(
  businessName: string,
  industry: string,
  style: string
): Promise<string | null> {
  const falKey = process.env.FAL_KEY || process.env.FAL_API_KEY;

  const prompt = `Professional ${style} hero image for ${businessName}, ${industry} business, clean modern design, suitable for website header, high quality, photorealistic`;

  if (!falKey) {
    console.warn("⚠️ FAL_KEY missing. Using Pollinations.ai (FREE) for hero...");
    return generatePollinationsUrl(prompt, 1920, 1080);
  }

  try {
    console.log("🖼️ FAL: Generating hero image...");

    const model = process.env.FAL_LOGO_MODEL || "fal-ai/flux/schnell";

    const response = await fetch(`https://fal.run/${model}`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        image_size: "landscape_16_9",
        num_inference_steps: 4,
        num_images: 1,
        enable_safety_checker: true,
      }),
    });

    if (!response.ok) {
      console.error("❌ FAL hero image error:", response.status);
      return generatePollinationsUrl(prompt, 1920, 1080);
    }

    const data = await response.json();
    const imageUrl = data.images?.[0]?.url || data.image?.url || null;

    if (imageUrl) {
      console.log("✅ FAL: Hero image generated successfully");
      return imageUrl;
    }

    return generatePollinationsUrl(prompt, 1920, 1080);
  } catch (error: any) {
    console.error("❌ FAL hero generation error:", error.message);
    return generatePollinationsUrl(prompt, 1920, 1080);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// POLLINATIONS.AI (FREE FALLBACK)
// ═══════════════════════════════════════════════════════════════════════════════

function generatePollinationsUrl(prompt: string, width: number, height: number): string {
  const encodedPrompt = encodeURIComponent(prompt);
  // Enhance quality with seed and nologo
  const seed = Math.floor(Math.random() * 1000000);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
}
