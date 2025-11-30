// frontend/lib/fal.ts
import { fal } from "@fal-ai/client";

const falKey = process.env.FAL_KEY;

if (!falKey) {
  console.warn("[FAL] FAL_KEY is not set. Logo generation will be skipped.");
}

fal.config({
  credentials: falKey || "missing-fal-key",
});

const LOGO_MODEL =
  process.env.FAL_LOGO_MODEL || "fal-ai/flux/dev"; // default model
const LOGO_SIZE =
  process.env.FAL_LOGO_SIZE || "square_hd"; // quality / resolution tier

export async function generateLogoImage(
  prompt: string
): Promise<string | null> {
  if (!falKey) {
    console.warn("[FAL] Missing FAL_KEY, returning null for logo image.");
    return null;
  }

  try {
    const result: any = await fal.subscribe(LOGO_MODEL, {
      input: {
        prompt,
        image_size: LOGO_SIZE,
      },
      logs: false,
    });

    const image = result?.images?.[0];
    if (!image?.url) {
      console.warn("[FAL] No image URL in response:", result);
      return null;
    }

    return image.url as string;
  } catch (err) {
    console.error("[FAL] Logo generation failed:", err);
    return null;
  }
}
