// frontend/lib/fal.ts
// FAL.ai integration for AI image generation

export async function generateLogoImage(prompt: string): Promise<string | null> {
  const falKey = process.env.FAL_KEY || process.env.FAL_API_KEY;
  
  if (!falKey) {
    console.warn("⚠️ FAL_KEY not configured - skipping image generation");
    return null;
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
      console.error("❌ FAL API error:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    
    // FAL returns images in different formats depending on the model
    const imageUrl = data.images?.[0]?.url || data.image?.url || null;
    
    if (imageUrl) {
      console.log("✅ FAL: Logo image generated successfully");
      return imageUrl;
    }
    
    console.warn("⚠️ FAL: No image URL in response");
    return null;
  } catch (error: any) {
    console.error("❌ FAL generation error:", error.message);
    return null;
  }
}

export async function generateWebsiteHeroImage(
  businessName: string,
  industry: string,
  style: string
): Promise<string | null> {
  const falKey = process.env.FAL_KEY || process.env.FAL_API_KEY;
  
  if (!falKey) {
    console.warn("⚠️ FAL_KEY not configured - skipping hero image generation");
    return null;
  }

  try {
    console.log("🖼️ FAL: Generating hero image...");
    
    const model = process.env.FAL_LOGO_MODEL || "fal-ai/flux/schnell";
    
    const prompt = `Professional ${style} hero image for ${businessName}, ${industry} business, clean modern design, suitable for website header, high quality, photorealistic`;

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
      return null;
    }

    const data = await response.json();
    const imageUrl = data.images?.[0]?.url || data.image?.url || null;
    
    if (imageUrl) {
      console.log("✅ FAL: Hero image generated successfully");
      return imageUrl;
    }
    
    return null;
  } catch (error: any) {
    console.error("❌ FAL hero generation error:", error.message);
    return null;
  }
}
