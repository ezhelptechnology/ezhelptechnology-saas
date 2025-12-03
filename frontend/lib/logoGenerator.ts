// frontend/lib/logoGenerator.ts
// ═══════════════════════════════════════════════════════════════════════════════
// EZ HELP TECHNOLOGY - PREMIUM LOGO GENERATOR
// Generates stunning SVG logos using Groq AI + FAL.ai images
// ═══════════════════════════════════════════════════════════════════════════════

import { ai } from "./ai";

export interface LogoPromptInput {
  businessName: string;
  concept?: string;
  style?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  industry?: string;
}

export interface GeneratedLogo {
  svg: string;
  style: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN LOGO GENERATION FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate a premium SVG logo using Groq AI
 */
export async function generatePremiumLogo(input: LogoPromptInput): Promise<GeneratedLogo> {
  const {
    businessName,
    style = 'modern',
    primaryColor = '#3B82F6',
    secondaryColor = '#1E40AF',
    accentColor = '#F59E0B',
    industry = 'business',
    concept
  } = input;

  const styleGuide = getLogoStyleGuide(style);
  const initials = getInitials(businessName);

  const prompt = `Create a professional SVG logo for "${businessName}" (${industry}).

DESIGN STYLE: ${style} - ${styleGuide.description}
${concept ? `CONCEPT: ${concept}` : ''}

COLORS:
- Primary: ${primaryColor}
- Secondary: ${secondaryColor}
- Accent: ${accentColor}

REQUIREMENTS:
1. viewBox="0 0 400 120" width="400" height="120"
2. Include a distinctive icon/symbol on the left
3. Business name text on the right using ${styleGuide.fontStyle} styling
4. Use ONLY basic SVG elements: rect, circle, ellipse, path, text, polygon, line, g, defs, linearGradient, stop
5. The icon should be memorable and represent ${industry}
6. Include a subtle gradient or shadow for depth
7. Clean, professional, scalable design
8. NO external fonts - use font-family="Arial, sans-serif" or similar system fonts
9. Text should be readable and properly positioned

OUTPUT: Return ONLY the raw SVG code starting with <svg and ending with </svg>. No explanations, no markdown.`;

  try {
    const response = await ai.chat(
      [
        {
          role: 'system',
          content: 'You are a professional logo designer. Create clean, memorable SVG logos. Return ONLY valid SVG code, nothing else. No markdown, no explanations.'
        },
        { role: 'user', content: prompt }
      ],
      process.env.AI_MODEL_AGENT || 'llama-3.1-8b-instant'
    );

    let svg = cleanSvgResponse(response.content);
    
    // Validate SVG
    if (!svg.includes('<svg') || !svg.includes('</svg>')) {
      console.warn('Invalid SVG from AI, using premium fallback');
      svg = generatePremiumFallbackLogo(input);
    }

    return {
      svg,
      style,
      colors: { primary: primaryColor, secondary: secondaryColor, accent: accentColor }
    };

  } catch (error: any) {
    console.error('Logo generation error:', error.message);
    return {
      svg: generatePremiumFallbackLogo(input),
      style,
      colors: { primary: primaryColor, secondary: secondaryColor, accent: accentColor }
    };
  }
}

/**
 * Generate multiple logo variations
 */
export async function generateLogoVariations(input: LogoPromptInput, count: number = 3): Promise<GeneratedLogo[]> {
  const styles = ['modern', 'minimal', 'bold', 'elegant', 'geometric'];
  const results: GeneratedLogo[] = [];

  for (let i = 0; i < Math.min(count, styles.length); i++) {
    try {
      const logo = await generatePremiumLogo({ ...input, style: styles[i] });
      results.push(logo);
    } catch (error) {
      results.push({
        svg: generatePremiumFallbackLogo({ ...input, style: styles[i] }),
        style: styles[i],
        colors: {
          primary: input.primaryColor || '#3B82F6',
          secondary: input.secondaryColor || '#1E40AF',
          accent: input.accentColor || '#F59E0B'
        }
      });
    }
  }

  return results;
}

/**
 * Legacy function for backwards compatibility with FAL
 */
export async function generateLogoWithFal(input: LogoPromptInput): Promise<string[]> {
  const apiKey = process.env.FAL_API_KEY || process.env.FAL_KEY;
  if (!apiKey) {
    console.warn('[logoGenerator] FAL_API_KEY not set – returning SVG fallback');
    const svg = generatePremiumFallbackLogo(input);
    return [svg];
  }

  const FAL_ENDPOINT = process.env.FAL_LOGO_ENDPOINT || 'https://fal.run/fal-ai/flux/schnell';

  const prompt = `Professional logo design for "${input.businessName || 'Business'}".
Concept: ${input.concept || 'Modern, clean, professional'}
Style: ${input.style || 'modern, minimal'}
Primary color: ${input.primaryColor || '#3B82F6'}
Secondary color: ${input.secondaryColor || '#1E40AF'}
Clean vector style, white background, high quality, professional logo design.`;

  try {
    const res = await fetch(FAL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        num_images: 1,
        image_size: 'square',
      }),
    });

    if (!res.ok) {
      console.error('[logoGenerator] FAL returned:', res.status);
      return [generatePremiumFallbackLogo(input)];
    }

    const json = await res.json();

    if (Array.isArray(json.images)) {
      return json.images.map((img: any) => img.url || img.image_url).filter(Boolean);
    }

    return [generatePremiumFallbackLogo(input)];
  } catch (err) {
    console.error('[logoGenerator] FAL error:', err);
    return [generatePremiumFallbackLogo(input)];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function cleanSvgResponse(content: string): string {
  let svg = content.trim();
  
  // Remove markdown code blocks
  svg = svg.replace(/```(svg|xml|html)?\s*/gi, '').replace(/```/g, '').trim();
  
  // Extract SVG if there's text around it
  const svgMatch = svg.match(/<svg[\s\S]*<\/svg>/i);
  if (svgMatch) {
    svg = svgMatch[0];
  }
  
  return svg;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

function getLogoStyleGuide(style: string): { description: string; fontStyle: string } {
  const guides: Record<string, { description: string; fontStyle: string }> = {
    modern: {
      description: 'Clean lines, geometric shapes, sans-serif typography',
      fontStyle: 'bold sans-serif'
    },
    minimal: {
      description: 'Simple, lots of whitespace, thin lines, understated',
      fontStyle: 'light sans-serif'
    },
    bold: {
      description: 'Strong shapes, thick lines, impactful, high contrast',
      fontStyle: 'extra bold sans-serif'
    },
    elegant: {
      description: 'Refined, sophisticated, serif accents, luxurious feel',
      fontStyle: 'elegant serif or thin sans-serif'
    },
    geometric: {
      description: 'Based on circles, squares, triangles, mathematical precision',
      fontStyle: 'geometric sans-serif'
    },
    playful: {
      description: 'Rounded corners, friendly, approachable, vibrant',
      fontStyle: 'rounded sans-serif'
    },
    tech: {
      description: 'Futuristic, digital, gradients, sharp edges',
      fontStyle: 'modern sans-serif with tech feel'
    },
    vintage: {
      description: 'Classic, timeless, ornate details, heritage feel',
      fontStyle: 'classic serif or script'
    },
    luxury: {
      description: 'Premium, exclusive, gold accents, sophisticated',
      fontStyle: 'elegant serif with wide spacing'
    }
  };

  const styleLower = style?.toLowerCase() || 'modern';
  for (const [key, value] of Object.entries(guides)) {
    if (styleLower.includes(key)) return value;
  }
  return guides.modern;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PREMIUM FALLBACK LOGOS
// ═══════════════════════════════════════════════════════════════════════════════

function generatePremiumFallbackLogo(input: LogoPromptInput): string {
  const {
    businessName = 'Business',
    style = 'modern',
    primaryColor = '#3B82F6',
    secondaryColor = '#1E40AF',
    accentColor = '#F59E0B'
  } = input;

  const initials = getInitials(businessName);
  const styleLower = style?.toLowerCase() || 'modern';

  // Luxury style
  if (styleLower.includes('luxury') || styleLower.includes('elegant')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <defs>
    <linearGradient id="luxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="10" y="20" width="80" height="80" rx="4" fill="none" stroke="url(#luxGrad)" stroke-width="3"/>
  <rect x="18" y="28" width="64" height="64" rx="2" fill="none" stroke="${accentColor}" stroke-width="1"/>
  <text x="50" y="72" font-family="Georgia, serif" font-size="32" font-weight="400" fill="${primaryColor}" text-anchor="middle">${initials}</text>
  <text x="110" y="55" font-family="Georgia, serif" font-size="28" font-weight="400" fill="${primaryColor}">${businessName}</text>
  <line x1="110" y1="70" x2="${110 + businessName.length * 12}" y2="70" stroke="${accentColor}" stroke-width="2"/>
  <text x="110" y="90" font-family="Georgia, serif" font-size="10" fill="${secondaryColor}" letter-spacing="3">PREMIUM QUALITY</text>
</svg>`;
  }

  // Bold style
  if (styleLower.includes('bold') || styleLower.includes('strong')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <rect x="5" y="10" width="100" height="100" rx="12" fill="${primaryColor}"/>
  <text x="55" y="75" font-family="Arial Black, sans-serif" font-size="42" font-weight="900" fill="white" text-anchor="middle">${initials}</text>
  <text x="120" y="55" font-family="Arial Black, sans-serif" font-size="28" font-weight="900" fill="${primaryColor}">${businessName.toUpperCase()}</text>
  <rect x="120" y="65" width="${Math.min(businessName.length * 16, 250)}" height="6" rx="3" fill="${accentColor}"/>
  <text x="120" y="95" font-family="Arial, sans-serif" font-size="12" fill="${secondaryColor}" font-weight="600">POWERFUL SOLUTIONS</text>
</svg>`;
  }

  // Minimal style
  if (styleLower.includes('minimal') || styleLower.includes('simple')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <circle cx="50" cy="60" r="35" fill="none" stroke="${primaryColor}" stroke-width="2"/>
  <text x="50" y="68" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="300" fill="${primaryColor}" text-anchor="middle">${initials}</text>
  <text x="100" y="65" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="300" fill="${primaryColor}">${businessName}</text>
</svg>`;
  }

  // Geometric style
  if (styleLower.includes('geometric') || styleLower.includes('tech')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <defs>
    <linearGradient id="techGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
    </linearGradient>
  </defs>
  <polygon points="50,15 90,40 90,85 50,110 10,85 10,40" fill="url(#techGrad)"/>
  <polygon points="50,25 80,45 80,80 50,100 20,80 20,45" fill="none" stroke="white" stroke-width="1" opacity="0.5"/>
  <text x="50" y="70" font-family="Consolas, monospace" font-size="22" font-weight="bold" fill="white" text-anchor="middle">${initials}</text>
  <text x="105" y="55" font-family="Arial, sans-serif" font-size="26" font-weight="600" fill="${primaryColor}">${businessName}</text>
  <text x="105" y="80" font-family="Consolas, monospace" font-size="10" fill="${secondaryColor}" letter-spacing="2">INNOVATION DRIVEN</text>
</svg>`;
  }

  // Playful style
  if (styleLower.includes('playful') || styleLower.includes('fun')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <circle cx="50" cy="60" r="45" fill="${primaryColor}"/>
  <circle cx="35" cy="50" r="8" fill="white"/>
  <circle cx="65" cy="50" r="8" fill="white"/>
  <path d="M 30 75 Q 50 95 70 75" stroke="white" stroke-width="4" fill="none" stroke-linecap="round"/>
  <text x="110" y="55" font-family="Comic Sans MS, cursive, sans-serif" font-size="28" font-weight="bold" fill="${primaryColor}">${businessName}</text>
  <text x="110" y="80" font-family="Arial, sans-serif" font-size="12" fill="${accentColor}">Fun • Friendly • Fantastic</text>
</svg>`;
  }

  // Default Modern style
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.2"/>
    </filter>
  </defs>
  <rect x="10" y="20" width="80" height="80" rx="16" fill="url(#grad1)" filter="url(#shadow)"/>
  <text x="50" y="72" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">${initials}</text>
  <text x="105" y="50" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="${primaryColor}">${businessName}</text>
  <text x="105" y="75" font-family="Arial, sans-serif" font-size="12" fill="${secondaryColor}">Professional Solutions</text>
  <rect x="105" y="85" width="60" height="3" rx="1.5" fill="${accentColor}"/>
</svg>`;
}

// Export for backwards compatibility
export { generatePremiumFallbackLogo as generateFallbackLogo };
