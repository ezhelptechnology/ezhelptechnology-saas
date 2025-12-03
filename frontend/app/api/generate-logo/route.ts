// frontend/app/api/generate-logo/route.ts
import { NextRequest, NextResponse } from "next/server";

// Generate a beautiful fallback SVG logo
function generateFallbackSvg(
  businessName: string,
  primaryColor: string,
  secondaryColor: string,
  style: string
): string {
  const initials = businessName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const isModern = style?.toLowerCase().includes('modern') || style?.toLowerCase().includes('minimal');
  const isLuxury = style?.toLowerCase().includes('luxury') || style?.toLowerCase().includes('elegant');
  const isBold = style?.toLowerCase().includes('bold') || style?.toLowerCase().includes('strong');

  // Different logo styles based on preference
  if (isLuxury) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" width="300" height="100">
  <defs>
    <linearGradient id="luxuryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="10" y="20" width="60" height="60" rx="4" fill="none" stroke="url(#luxuryGrad)" stroke-width="2"/>
  <text x="40" y="60" font-family="Georgia, serif" font-size="24" font-weight="400" fill="${primaryColor}" text-anchor="middle">${initials}</text>
  <text x="90" y="58" font-family="Georgia, serif" font-size="22" font-weight="400" fill="${primaryColor}">${businessName}</text>
  <line x1="90" y1="68" x2="${90 + businessName.length * 10}" y2="68" stroke="${secondaryColor}" stroke-width="1"/>
</svg>`;
  }

  if (isBold) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" width="300" height="100">
  <rect x="5" y="15" width="70" height="70" rx="8" fill="${primaryColor}"/>
  <text x="40" y="62" font-family="Arial Black, sans-serif" font-size="32" font-weight="900" fill="white" text-anchor="middle">${initials}</text>
  <text x="90" y="45" font-family="Arial Black, sans-serif" font-size="20" font-weight="900" fill="${primaryColor}">${businessName.toUpperCase()}</text>
  <rect x="90" y="55" width="${businessName.length * 12}" height="4" fill="${secondaryColor}"/>
</svg>`;
  }

  // Modern/Minimal (default)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" width="300" height="100">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="40" cy="50" r="30" fill="url(#grad1)"/>
  <text x="40" y="58" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">${initials}</text>
  <text x="85" y="45" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="${primaryColor}">${businessName}</text>
  <text x="85" y="65" font-family="Arial, sans-serif" font-size="10" fill="${secondaryColor}" letter-spacing="2">${style?.toUpperCase() || 'PROFESSIONAL'}</text>
</svg>`;
}

// Parse color string to get hex values
function parseColors(colorString: string): { primary: string; secondary: string } {
  const colors = colorString?.toLowerCase() || '';
  
  const colorMap: Record<string, string> = {
    'black': '#0F172A',
    'white': '#FFFFFF',
    'gold': '#F59E0B',
    'orange': '#F97316',
    'blue': '#3B82F6',
    'navy': '#1E3A8A',
    'red': '#EF4444',
    'green': '#22C55E',
    'purple': '#8B5CF6',
    'pink': '#EC4899',
    'teal': '#14B8A6',
    'gray': '#6B7280',
    'silver': '#9CA3AF',
    'yellow': '#EAB308',
  };

  let primary = '#3B82F6';
  let secondary = '#1E40AF';

  for (const [name, hex] of Object.entries(colorMap)) {
    if (colors.includes(name)) {
      if (primary === '#3B82F6') {
        primary = hex;
      } else {
        secondary = hex;
        break;
      }
    }
  }

  return { primary, secondary };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessName, colors, slogan, category, description } = body;

    if (!businessName || typeof businessName !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid businessName' },
        { status: 400 }
      );
    }

    const parsedColors = parseColors(colors || '');
    const styleCategory = category || 'modern';

    // Try Groq first
    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (groqApiKey) {
      try {
        const prompt = `Generate a simple, clean SVG logo for "${businessName}".
Style: ${styleCategory}
Colors: Primary ${parsedColors.primary}, Secondary ${parsedColors.secondary}
${slogan ? `Slogan: ${slogan}` : ''}

Requirements:
- Return ONLY the SVG code, nothing else
- viewBox="0 0 300 100" width="300" height="100"
- Use only basic shapes (rect, circle, text, path)
- Include the business name as text
- Keep it simple and professional
- No external fonts or images`;

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: process.env.AI_MODEL_AGENT || 'llama-3.1-8b-instant',
            messages: [
              {
                role: 'system',
                content: 'You are an SVG logo designer. Output ONLY valid SVG code. No explanations, no markdown, no code blocks. Just the raw SVG starting with <svg and ending with </svg>.',
              },
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 1500,
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          let svg = data.choices?.[0]?.message?.content || '';
          
          // Clean up response
          svg = svg.trim();
          svg = svg.replace(/```(svg|xml|html)?/gi, '').replace(/```/g, '').trim();
          
          // Extract SVG if there's text around it
          const svgMatch = svg.match(/<svg[\s\S]*<\/svg>/i);
          if (svgMatch) {
            svg = svgMatch[0];
            
            // Validate it has basic structure
            if (svg.includes('<svg') && svg.includes('</svg>')) {
              console.log('✅ Groq SVG generated successfully');
              return NextResponse.json({ svg });
            }
          }
        }
        
        console.log('⚠️ Groq SVG invalid, using fallback');
      } catch (groqError: any) {
        console.error('Groq error:', groqError.message);
      }
    }

    // Fallback: Generate a beautiful SVG locally
    console.log('📝 Using fallback SVG generator');
    const fallbackSvg = generateFallbackSvg(
      businessName,
      parsedColors.primary,
      parsedColors.secondary,
      styleCategory
    );

    return NextResponse.json({ svg: fallbackSvg });
    
  } catch (err: any) {
    console.error('generate-logo route error:', err);
    
    // Ultimate fallback
    const simpleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" width="300" height="100">
  <rect x="10" y="20" width="60" height="60" rx="8" fill="#3B82F6"/>
  <text x="40" y="58" font-family="Arial" font-size="24" font-weight="bold" fill="white" text-anchor="middle">EZ</text>
  <text x="85" y="55" font-family="Arial" font-size="24" font-weight="bold" fill="#3B82F6">Your Logo</text>
</svg>`;
    
    return NextResponse.json({ svg: simpleSvg });
  }
}
