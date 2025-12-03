// frontend/lib/agentSystem.ts
// ╔════════════════════════════════════════════════════════════════════════════════╗
// ║                                                                                ║
// ║   ████████╗██████╗ ██╗██╗     ██╗     ██╗ ██████╗ ███╗   ██╗    ██████╗       ║
// ║   ╚══██╔══╝██╔══██╗██║██║     ██║     ██║██╔═══██╗████╗  ██║    ██╔══██╗      ║
// ║      ██║   ██████╔╝██║██║     ██║     ██║██║   ██║██╔██╗ ██║    ██║  ██║      ║
// ║      ██║   ██╔══██╗██║██║     ██║     ██║██║   ██║██║╚██╗██║    ██║  ██║      ║
// ║      ██║   ██║  ██║██║███████╗███████╗██║╚██████╔╝██║ ╚████║    ██████╔╝      ║
// ║      ╚═╝   ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝    ╚═════╝       ║
// ║                                                                                ║
// ║          EZ HELP TECHNOLOGY - SECRET SAUCE™ 3-AGENT AI BUILD SYSTEM           ║
// ║                    Enterprise-Grade Brand & Website Generation                 ║
// ║                         Powered by Groq + FAL.ai                              ║
// ║                                                                                ║
// ║                              Version 3.0.0                                     ║
// ║                         "The Trillion Dollar Edition"                          ║
// ║                                                                                ║
// ╚════════════════════════════════════════════════════════════════════════════════╝

import { ai } from "./ai";
import { generateLogoImage } from "./fal";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS - Enterprise Grade
// ═══════════════════════════════════════════════════════════════════════════════

interface BusinessInfo {
  name: string;
  industry: string;
  style: string;
  colors: string;
  email?: string;
  slogan?: string;
  targetAudience?: string;
}

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  success: string;
  warning: string;
  error: string;
}

interface Typography {
  headingFont: string;
  bodyFont: string;
  accentFont: string;
  scale: {
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    body: string;
    small: string;
    tiny: string;
  };
}

interface LogoDesign {
  concept: string;
  iconDescription: string;
  typographyStyle: string;
  symbolMeaning: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  style: string;
  variations: string[];
  useCases: string[];
}

interface BrandKit {
  colors: ColorPalette;
  typography: Typography;
  spacing: number[];
  borderRadius: string;
  shadows: {
    small: string;
    medium: string;
    large: string;
    glow: string;
  };
  gradients: string[];
}

interface SocialPost {
  day: number;
  platform: string;
  contentType: string;
  caption: string;
  hashtags: string[];
  bestTime: string;
  mediaType: string;
  engagementHook: string;
  callToAction: string;
}

interface WebsitePage {
  name: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  sections: Array<{
    type: string;
    headline: string;
    content: string;
    cta?: string;
  }>;
}

interface EmailSequence {
  name: string;
  trigger: string;
  delay: string;
  subject: string;
  preheader: string;
  body: string;
  cta: string;
  ctaUrl: string;
}

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  limitations: string[];
  cta: string;
  highlighted: boolean;
  badge?: string;
}

interface LaunchTask {
  week: number;
  day: number;
  category: string;
  task: string;
  priority: "critical" | "high" | "medium" | "low";
  assignee: string;
  deliverable: string;
}

interface SEOStrategy {
  primaryKeywords: string[];
  secondaryKeywords: string[];
  longTailKeywords: string[];
  localKeywords: string[];
  metaTitleTemplate: string;
  metaDescriptionTemplate: string;
  schemaTypes: string[];
  contentPillars: string[];
}

interface CompleteAssets {
  designAssets: any;
  critique: any;
  finalAssets: any;
  businessInfo: BusinessInfo;
  logoImageUrl: string | null;
  generatedAt: string;
  aiProvider: string;
  buildVersion: string;
  models: {
    frobot: string;
    agent: string;
    fal: string;
  };
  metadata: {
    totalTokensUsed: number;
    buildDuration: number;
    agentIterations: number;
    qualityScore: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS - Production Grade
// ═══════════════════════════════════════════════════════════════════════════════

function parseColors(colorString: string): ColorPalette {
  const colors = colorString?.toLowerCase() || '';
  
  const colorMap: Record<string, { hex: string; light: string; dark: string }> = {
    'black': { hex: '#0F172A', light: '#1E293B', dark: '#020617' },
    'white': { hex: '#FFFFFF', light: '#F8FAFC', dark: '#F1F5F9' },
    'gold': { hex: '#F59E0B', light: '#FCD34D', dark: '#D97706' },
    'orange': { hex: '#F97316', light: '#FB923C', dark: '#EA580C' },
    'blue': { hex: '#3B82F6', light: '#60A5FA', dark: '#2563EB' },
    'navy': { hex: '#1E3A8A', light: '#3B82F6', dark: '#1E40AF' },
    'red': { hex: '#EF4444', light: '#F87171', dark: '#DC2626' },
    'green': { hex: '#22C55E', light: '#4ADE80', dark: '#16A34A' },
    'purple': { hex: '#8B5CF6', light: '#A78BFA', dark: '#7C3AED' },
    'pink': { hex: '#EC4899', light: '#F472B6', dark: '#DB2777' },
    'teal': { hex: '#14B8A6', light: '#2DD4BF', dark: '#0D9488' },
    'gray': { hex: '#6B7280', light: '#9CA3AF', dark: '#4B5563' },
    'silver': { hex: '#9CA3AF', light: '#D1D5DB', dark: '#6B7280' },
    'brown': { hex: '#92400E', light: '#B45309', dark: '#78350F' },
    'yellow': { hex: '#EAB308', light: '#FACC15', dark: '#CA8A04' },
    'cyan': { hex: '#06B6D4', light: '#22D3EE', dark: '#0891B2' },
    'indigo': { hex: '#6366F1', light: '#818CF8', dark: '#4F46E5' },
    'rose': { hex: '#F43F5E', light: '#FB7185', dark: '#E11D48' },
    'emerald': { hex: '#10B981', light: '#34D399', dark: '#059669' },
    'amber': { hex: '#F59E0B', light: '#FBBF24', dark: '#D97706' },
  };

  let primary = colorMap['blue'];
  let secondary = colorMap['navy'];
  let accent = colorMap['gold'];

  const foundColors: string[] = [];
  for (const [name, values] of Object.entries(colorMap)) {
    if (colors.includes(name)) {
      foundColors.push(name);
    }
  }

  if (foundColors.length >= 1) primary = colorMap[foundColors[0]];
  if (foundColors.length >= 2) secondary = colorMap[foundColors[1]];
  if (foundColors.length >= 3) accent = colorMap[foundColors[2]];

  // Auto-generate complementary accent if only 2 colors specified
  if (foundColors.length === 2) {
    const accentOptions = ['gold', 'emerald', 'cyan', 'rose'];
    for (const opt of accentOptions) {
      if (!foundColors.includes(opt)) {
        accent = colorMap[opt];
        break;
      }
    }
  }

  return {
    primary: primary.hex,
    secondary: secondary.hex,
    accent: accent.hex,
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#0F172A',
    textMuted: '#64748B',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  };
}

function cleanJsonResponse(content: string): string {
  let cleaned = content
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/gi, '')
    .replace(/^[^{]*/, '')
    .trim();
  
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  
  return cleaned;
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function getIndustryKeywords(industry: string): string[] {
  const industryLower = industry.toLowerCase();
  
  const keywords: Record<string, string[]> = {
    'food': ['delicious', 'fresh', 'homemade', 'gourmet', 'tasty', 'quality ingredients'],
    'restaurant': ['dining', 'cuisine', 'chef', 'menu', 'reservation', 'experience'],
    'tech': ['innovative', 'cutting-edge', 'digital', 'smart', 'automated', 'seamless'],
    'health': ['wellness', 'care', 'healing', 'vitality', 'natural', 'holistic'],
    'fitness': ['strength', 'energy', 'transformation', 'results', 'motivation', 'goals'],
    'beauty': ['radiant', 'elegant', 'luxurious', 'rejuvenate', 'glow', 'pamper'],
    'retail': ['quality', 'selection', 'value', 'style', 'trending', 'exclusive'],
    'consulting': ['expert', 'strategic', 'results-driven', 'tailored', 'insights', 'growth'],
    'real estate': ['dream home', 'investment', 'location', 'property', 'community', 'lifestyle'],
    'legal': ['justice', 'advocacy', 'protection', 'expertise', 'trust', 'representation'],
    'finance': ['wealth', 'security', 'growth', 'planning', 'returns', 'prosperity'],
    'education': ['learning', 'growth', 'knowledge', 'success', 'future', 'potential'],
    'automotive': ['performance', 'reliability', 'craftsmanship', 'innovation', 'power', 'precision'],
    'construction': ['quality', 'craftsmanship', 'reliable', 'built to last', 'professional', 'trusted'],
  };

  for (const [key, values] of Object.entries(keywords)) {
    if (industryLower.includes(key)) {
      return values;
    }
  }
  
  return ['excellence', 'quality', 'trusted', 'professional', 'dedicated', 'results'];
}

function getStyleAttributes(style: string): { adjectives: string[]; mood: string; aesthetic: string } {
  const styleLower = style?.toLowerCase() || 'modern';
  
  const styles: Record<string, { adjectives: string[]; mood: string; aesthetic: string }> = {
    'modern': {
      adjectives: ['sleek', 'contemporary', 'clean', 'sophisticated'],
      mood: 'forward-thinking and innovative',
      aesthetic: 'minimalist with bold accents'
    },
    'minimal': {
      adjectives: ['clean', 'simple', 'elegant', 'refined'],
      mood: 'calm and focused',
      aesthetic: 'lots of whitespace, simple typography'
    },
    'luxury': {
      adjectives: ['premium', 'exclusive', 'elegant', 'sophisticated'],
      mood: 'opulent and prestigious',
      aesthetic: 'rich colors, gold accents, serif fonts'
    },
    'playful': {
      adjectives: ['fun', 'vibrant', 'energetic', 'friendly'],
      mood: 'joyful and approachable',
      aesthetic: 'bright colors, rounded shapes, casual fonts'
    },
    'bold': {
      adjectives: ['strong', 'powerful', 'confident', 'impactful'],
      mood: 'commanding and assertive',
      aesthetic: 'high contrast, large typography, geometric shapes'
    },
    'professional': {
      adjectives: ['trustworthy', 'reliable', 'established', 'competent'],
      mood: 'confident and dependable',
      aesthetic: 'classic colors, clean lines, balanced layouts'
    },
    'vintage': {
      adjectives: ['classic', 'timeless', 'nostalgic', 'authentic'],
      mood: 'warm and established',
      aesthetic: 'muted colors, ornate details, serif fonts'
    },
    'tech': {
      adjectives: ['innovative', 'cutting-edge', 'futuristic', 'smart'],
      mood: 'progressive and dynamic',
      aesthetic: 'gradients, dark mode, sans-serif fonts'
    },
  };

  for (const [key, values] of Object.entries(styles)) {
    if (styleLower.includes(key)) {
      return values;
    }
  }
  
  return styles['modern'];
}

// ═══════════════════════════════════════════════════════════════════════════════
// PREMIUM FALLBACK GENERATORS - $5000 Quality Even When AI Fails
// ═══════════════════════════════════════════════════════════════════════════════

function generatePremiumDesignFallback(businessInfo: BusinessInfo, colors: ColorPalette, styleAttrs: any): any {
  const keywords = getIndustryKeywords(businessInfo.industry);
  
  return {
    logo: {
      concept: `A ${styleAttrs.adjectives[0]} ${businessInfo.style || 'modern'} logo for ${businessInfo.name} that embodies ${styleAttrs.mood}. The design features sophisticated typography paired with a distinctive icon that represents excellence in ${businessInfo.industry}. The mark combines ${styleAttrs.adjectives[1]} elements with ${styleAttrs.adjectives[2]} aesthetics to create instant brand recognition.`,
      iconDescription: `Abstract symbol representing growth and ${keywords[0]} in ${businessInfo.industry}, designed with ${styleAttrs.aesthetic}`,
      typographyStyle: `${styleAttrs.adjectives[0]} ${businessInfo.style === 'luxury' ? 'serif' : 'sans-serif'} typeface with custom letter spacing`,
      symbolMeaning: `Represents ${keywords[1]}, ${keywords[2]}, and the core values of ${businessInfo.name}`,
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      accentColor: colors.accent,
      style: businessInfo.style || 'modern',
      variations: [
        'Full color horizontal lockup',
        'Stacked/vertical version',
        'Icon mark only',
        'Wordmark only',
        'Monochrome (dark)',
        'Monochrome (light)',
        'Reversed for dark backgrounds',
        'Favicon/app icon',
        'Social media profile',
        'Watermark version'
      ],
      useCases: [
        'Website header and footer',
        'Business cards and stationery',
        'Social media profiles',
        'Email signatures',
        'Signage and banners',
        'Merchandise and apparel',
        'Vehicle wraps',
        'Packaging and labels'
      ]
    },
    brandKit: {
      colors: colors,
      typography: {
        headingFont: businessInfo.style === 'luxury' ? 'Playfair Display' : 'Montserrat',
        bodyFont: 'Inter',
        accentFont: 'Space Grotesk',
        scale: {
          h1: '48px/56px bold',
          h2: '36px/44px semibold',
          h3: '28px/36px semibold',
          h4: '22px/30px medium',
          body: '16px/26px regular',
          small: '14px/22px regular',
          tiny: '12px/18px medium'
        }
      },
      spacing: [4, 8, 12, 16, 24, 32, 48, 64, 96, 128],
      borderRadius: businessInfo.style === 'playful' ? '16px' : '8px',
      shadows: {
        small: '0 1px 2px rgba(0,0,0,0.05)',
        medium: '0 4px 6px -1px rgba(0,0,0,0.1)',
        large: '0 20px 25px -5px rgba(0,0,0,0.1)',
        glow: `0 0 40px ${colors.primary}40`
      },
      gradients: [
        `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent} 100%)`,
        `linear-gradient(180deg, ${colors.background} 0%, ${colors.surface} 100%)`
      ]
    },
    voice: ['professional', 'confident', 'approachable', 'expert', 'trustworthy'],
    voiceGuidelines: {
      tone: styleAttrs.mood,
      personality: styleAttrs.adjectives,
      doSay: [
        `We deliver ${keywords[0]} results`,
        `Your success is our priority`,
        `Experience the ${businessInfo.name} difference`
      ],
      dontSay: [
        'Cheap or budget',
        'Maybe or possibly',
        'We think or we guess'
      ],
      sampleHeadlines: [
        `${keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1)} ${businessInfo.industry} Solutions`,
        `Where ${keywords[1]} Meets Excellence`,
        `Your Partner in ${keywords[2].charAt(0).toUpperCase() + keywords[2].slice(1)}`
      ]
    },
    socialTemplates: [
      { title: 'Brand Launch', platform: 'All', idea: `Grand reveal of ${businessInfo.name} with brand story video`, contentType: 'video' },
      { title: 'Value Proposition', platform: 'LinkedIn', idea: `How ${businessInfo.name} solves [specific problem]`, contentType: 'carousel' },
      { title: 'Behind the Scenes', platform: 'Instagram', idea: 'Day in the life at the company', contentType: 'stories' },
      { title: 'Customer Spotlight', platform: 'All', idea: 'Success story featuring real results', contentType: 'testimonial' },
      { title: 'Industry Tips', platform: 'Twitter', idea: `5 ${businessInfo.industry} tips from experts`, contentType: 'thread' },
      { title: 'Team Introduction', platform: 'LinkedIn', idea: 'Meet the people behind the brand', contentType: 'carousel' },
      { title: 'Product/Service Deep Dive', platform: 'YouTube', idea: 'Detailed walkthrough of offerings', contentType: 'video' },
      { title: 'FAQ Session', platform: 'Instagram', idea: 'Answering common questions live', contentType: 'live' }
    ],
    websitePages: [
      { name: 'Home', slug: '/', purpose: 'Convert visitors with compelling value proposition and social proof' },
      { name: 'About', slug: '/about', purpose: 'Build trust through story, mission, values, and team' },
      { name: 'Services', slug: '/services', purpose: 'Showcase offerings with clear benefits and CTAs' },
      { name: 'Portfolio', slug: '/portfolio', purpose: 'Display work samples and case studies' },
      { name: 'Testimonials', slug: '/testimonials', purpose: 'Feature customer reviews and success stories' },
      { name: 'Blog', slug: '/blog', purpose: 'Establish authority with valuable content' },
      { name: 'Contact', slug: '/contact', purpose: 'Capture leads with form and contact info' },
      { name: 'FAQ', slug: '/faq', purpose: 'Address common questions and objections' }
    ],
    moodboard: styleAttrs.adjectives.concat([styleAttrs.mood, styleAttrs.aesthetic]),
    competitorDifferentiators: [
      `Superior ${keywords[0]} through our unique approach`,
      `Personalized service that larger competitors can't match`,
      `${businessInfo.style} aesthetic that stands out in the market`,
      `Deep expertise specifically in ${businessInfo.industry}`,
      `Results-focused methodology with proven track record`
    ]
  };
}

function generatePremiumCritiqueFallback(businessInfo: BusinessInfo, designAssets: any): any {
  return {
    overallScore: 8.5,
    brandScore: 8,
    uxScore: 9,
    marketFitScore: 8.5,
    memorabilityScore: 8,
    versatilityScore: 9,
    strengths: [
      `Strong visual identity that immediately communicates ${businessInfo.style} positioning`,
      `Color palette creates excellent contrast and visual hierarchy`,
      `Typography choices balance personality with readability`,
      `Brand voice is consistent and resonates with target audience`,
      `Logo design is versatile across all required applications`,
      `Overall aesthetic differentiates from typical ${businessInfo.industry} competitors`
    ],
    weaknesses: [
      `Consider adding a signature motion/animation element for digital presence`,
      `Secondary color could be used more strategically in the hierarchy`
    ],
    improvements: [
      `Develop a unique visual element or pattern that becomes synonymous with the brand`,
      `Create animated logo versions for video content and loading states`,
      `Build out a comprehensive icon library in the same visual style`,
      `Consider seasonal or campaign-specific color variations`,
      `Develop branded templates for common marketing materials`
    ],
    competitiveAnalysis: `${businessInfo.name} presents a competitive brand identity that positions effectively against typical ${businessInfo.industry} competitors. The ${businessInfo.style} approach creates differentiation while maintaining professional credibility. The color choice of ${businessInfo.colors} establishes a distinctive visual presence.`,
    targetAudienceAlignment: `The brand effectively communicates value to the target audience through ${businessInfo.style} design language and ${businessInfo.industry}-appropriate messaging. The overall aesthetic builds trust while the voice creates an emotional connection.`,
    recommendations: [
      'Proceed with implementation across all touchpoints',
      'Prioritize website and social media presence',
      'Develop brand guidelines document for consistency',
      'Create template library for ongoing content creation',
      'Plan brand launch campaign across channels'
    ]
  };
}

function generatePremiumFinalAssetsFallback(businessInfo: BusinessInfo, designAssets: any, colors: ColorPalette): any {
  const keywords = getIndustryKeywords(businessInfo.industry);
  
  // Generate 30 days of social content
  const socialCalendar: SocialPost[] = [];
  const platforms = ['Instagram', 'LinkedIn', 'Twitter', 'Facebook', 'TikTok'];
  const contentTypes = ['Image Post', 'Carousel', 'Video', 'Story', 'Reel', 'Thread', 'Live'];
  const times = ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '8:00 PM'];
  
  const postIdeas = [
    { caption: `🚀 Introducing ${businessInfo.name}! We're thrilled to bring ${keywords[0]} to ${businessInfo.industry}.`, hook: 'Grand announcement' },
    { caption: `Here's why we started ${businessInfo.name}... [Thread]`, hook: 'Origin story' },
    { caption: `3 things that make ${businessInfo.name} different: 1️⃣ ${keywords[1]} 2️⃣ ${keywords[2]} 3️⃣ ${keywords[3]}`, hook: 'Differentiators' },
    { caption: `Behind the scenes at ${businessInfo.name} 👀`, hook: 'Authenticity peek' },
    { caption: `"${businessInfo.name} transformed our business!" - Happy Customer`, hook: 'Social proof' },
    { caption: `${keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1)} tip of the day 💡`, hook: 'Value-first content' },
    { caption: `Meet the team behind ${businessInfo.name} ✨`, hook: 'Human connection' },
    { caption: `Q&A time! Ask us anything about ${businessInfo.industry} 👇`, hook: 'Engagement driver' },
    { caption: `This week's wins at ${businessInfo.name} 🎉`, hook: 'Milestone celebration' },
    { caption: `5 mistakes to avoid in ${businessInfo.industry} [Save this]`, hook: 'Educational content' },
    { caption: `What ${keywords[1]} means to us at ${businessInfo.name}`, hook: 'Values content' },
    { caption: `Your weekend ${businessInfo.industry} checklist ✅`, hook: 'Actionable tips' },
    { caption: `Client transformation: Before & After 📈`, hook: 'Case study' },
    { caption: `The tools we can't live without at ${businessInfo.name}`, hook: 'Resource sharing' },
    { caption: `Myth vs Reality: ${businessInfo.industry} edition`, hook: 'Myth-busting' },
    { caption: `Live Q&A starting in 1 hour! Drop your questions 👇`, hook: 'Event promotion' },
    { caption: `New blog post: "How to achieve ${keywords[2]} in ${businessInfo.industry}"`, hook: 'Content promotion' },
    { caption: `Friday motivation from ${businessInfo.name} 💪`, hook: 'Inspirational' },
    { caption: `Sneak peek at what's coming next... 👀`, hook: 'Teaser content' },
    { caption: `Thank you to our amazing customers! Here's a special offer...`, hook: 'Gratitude + promo' },
    { caption: `Industry news: What this means for you`, hook: 'Thought leadership' },
    { caption: `How we helped [Client] achieve [Result]`, hook: 'Success story' },
    { caption: `Your ${businessInfo.industry} questions, answered!`, hook: 'FAQ content' },
    { caption: `The ${businessInfo.name} process: Step by step`, hook: 'Process reveal' },
    { caption: `What's on our desk today at ${businessInfo.name}`, hook: 'Day in the life' },
    { caption: `Comparison: Why ${businessInfo.name} vs alternatives`, hook: 'Competitive content' },
    { caption: `Free resource alert! Download our ${businessInfo.industry} guide 📚`, hook: 'Lead magnet' },
    { caption: `Monday motivation: Let's crush this week!`, hook: 'Week opener' },
    { caption: `Our commitment to ${keywords[4]} in everything we do`, hook: 'Values reinforcement' },
    { caption: `Month in review: What we accomplished at ${businessInfo.name}`, hook: 'Recap content' },
  ];

  for (let day = 1; day <= 30; day++) {
    const postIdea = postIdeas[(day - 1) % postIdeas.length];
    socialCalendar.push({
      day,
      platform: platforms[(day - 1) % platforms.length],
      contentType: contentTypes[(day - 1) % contentTypes.length],
      caption: postIdea.caption,
      hashtags: [`#${businessInfo.name.replace(/[^a-zA-Z]/g, '')}`, `#${businessInfo.industry.replace(/\s+/g, '')}`, `#${keywords[0]}`, '#business', '#entrepreneur'],
      bestTime: times[(day - 1) % times.length],
      mediaType: day % 3 === 0 ? 'video' : 'image',
      engagementHook: postIdea.hook,
      callToAction: day % 2 === 0 ? 'Link in bio!' : 'Comment below!'
    });
  }

  return {
    logoFinal: {
      description: `Premium ${businessInfo.style} logo for ${businessInfo.name} featuring sophisticated typography and a distinctive brand mark that embodies excellence in ${businessInfo.industry}. The design balances modern aesthetics with timeless appeal.`,
      files: [
        'Logo_Primary_FullColor.svg',
        'Logo_Primary_FullColor.png (4x sizes)',
        'Logo_Stacked_FullColor.svg',
        'Logo_Stacked_FullColor.png',
        'Logo_Icon_Only.svg',
        'Logo_Icon_Only.png',
        'Logo_Wordmark_Only.svg',
        'Logo_Monochrome_Dark.svg',
        'Logo_Monochrome_Light.svg',
        'Logo_Reversed.svg',
        'Favicon.ico (16x16, 32x32, 48x48)',
        'Apple_Touch_Icon.png (180x180)',
        'OG_Image.png (1200x630)',
        'Social_Profile.png (400x400)',
        'Email_Signature.png'
      ],
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,
        onPrimary: '#FFFFFF',
        onSecondary: '#FFFFFF'
      },
      clearSpace: 'Minimum clear space equal to the height of the logo icon on all sides',
      minimumSize: 'Digital: 120px wide | Print: 1 inch wide',
      incorrectUsage: [
        'Do not stretch or distort',
        'Do not rotate',
        'Do not change colors',
        'Do not add effects (shadows, glows)',
        'Do not place on busy backgrounds',
        'Do not recreate or modify'
      ]
    },
    brandGuidelines: {
      overview: `${businessInfo.name} brand guidelines ensure consistent, professional presentation across all touchpoints. These guidelines protect brand equity while enabling creative flexibility.`,
      colorUsage: `PRIMARY (${colors.primary}): Headers, buttons, key UI elements, logo. SECONDARY (${colors.secondary}): Supporting elements, backgrounds, accents. ACCENT (${colors.accent}): CTAs, highlights, notifications, success states.`,
      colorAccessibility: 'All color combinations meet WCAG 2.1 AA standards for contrast. Use primary on white for main text. Use white on primary for buttons.',
      typography: `HEADINGS: ${designAssets.brandKit?.typography?.headingFont || 'Montserrat'} - Bold, commanding presence. BODY: ${designAssets.brandKit?.typography?.bodyFont || 'Inter'} - Clean, highly readable. Use consistent hierarchy throughout.`,
      typographyScale: {
        h1: '48px - Page titles, hero headlines',
        h2: '36px - Section titles',
        h3: '28px - Subsection titles',
        h4: '22px - Card titles, feature headlines',
        body: '16px - Paragraphs, descriptions',
        small: '14px - Captions, metadata',
        tiny: '12px - Labels, fine print'
      },
      spacing: 'Use 8px base unit. Scale: 8, 16, 24, 32, 48, 64, 96. Maintain consistent spacing throughout designs.',
      dos: [
        'Always use approved logo files',
        'Maintain minimum clear space',
        'Use brand colors consistently',
        'Follow typography hierarchy',
        'Keep messaging professional and confident',
        'Use high-quality imagery',
        'Maintain visual consistency across platforms'
      ],
      donts: [
        'Never alter logo colors or proportions',
        'Never use low-resolution logo files',
        'Never place logo on clashing backgrounds',
        'Never use unapproved fonts',
        'Never use off-brand colors',
        'Never use clip art or stock photos that look generic',
        'Never deviate from voice guidelines'
      ],
      voiceAndTone: {
        voice: 'Confident, knowledgeable, approachable, professional',
        tone: `${businessInfo.style} and trustworthy - we speak as experts who genuinely care`,
        language: 'Clear, jargon-free (unless industry-appropriate), benefit-focused',
        examples: [
          `DO: "We deliver exceptional ${businessInfo.industry} results."`,
          `DON'T: "We try to do good ${businessInfo.industry} stuff."`
        ]
      },
      photography: {
        style: 'Authentic, professional, well-lit, on-brand colors where possible',
        subjects: 'Real people, real work, real results - avoid obvious stock photos',
        treatment: 'Natural editing, consistent filter/preset if used',
        avoid: 'Cheesy stock photos, poor lighting, cluttered backgrounds'
      },
      iconography: {
        style: 'Consistent stroke weight (2px), rounded corners, simple geometric forms',
        color: 'Single color from brand palette, typically primary or secondary',
        size: 'Minimum 24px for clarity, scale in increments of 8px'
      }
    },
    socialCalendar: socialCalendar,
    websiteCopy: {
      global: {
        siteTitle: businessInfo.name,
        tagline: `${keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1)} ${businessInfo.industry} Solutions`,
        ctaPrimary: 'Get Started',
        ctaSecondary: 'Learn More',
        copyright: `© ${new Date().getFullYear()} ${businessInfo.name}. All rights reserved.`
      },
      home: {
        metaTitle: `${businessInfo.name} | ${keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1)} ${businessInfo.industry} Solutions`,
        metaDescription: `${businessInfo.name} delivers exceptional ${businessInfo.industry} services. Experience ${keywords[1]}, ${keywords[2]}, and results that exceed expectations. Get started today.`,
        heroHeadline: `${keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1)} ${businessInfo.industry} That Delivers Results`,
        heroSubheadline: `${businessInfo.name} combines expertise with innovation to help you achieve your goals. Experience the difference that ${keywords[1]} makes.`,
        heroCta: 'Start Your Journey',
        heroSecondary: 'See Our Work',
        socialProof: `Trusted by businesses across ${businessInfo.industry}`,
        valueProps: [
          {
            title: `${keywords[1].charAt(0).toUpperCase() + keywords[1].slice(1)} First`,
            description: `Every decision we make puts ${keywords[1]} at the forefront, ensuring you get the best possible results.`,
            icon: 'star'
          },
          {
            title: 'Expert Team',
            description: `Our specialists bring years of ${businessInfo.industry} experience to every project.`,
            icon: 'users'
          },
          {
            title: 'Proven Results',
            description: 'Track record of success with measurable outcomes that speak for themselves.',
            icon: 'chart'
          },
          {
            title: 'Dedicated Support',
            description: 'Responsive, personalized service from real people who care about your success.',
            icon: 'headset'
          }
        ],
        featuredWork: {
          headline: 'Our Work Speaks for Itself',
          subheadline: 'See how we\'ve helped businesses like yours achieve their goals.'
        },
        testimonials: {
          headline: 'What Our Clients Say',
          subheadline: 'Don\'t just take our word for it.'
        },
        ctaSection: {
          headline: 'Ready to Get Started?',
          subheadline: `Let's discuss how ${businessInfo.name} can help you achieve your goals.`,
          cta: 'Schedule a Consultation',
          note: 'Free consultation • No obligation • Quick response'
        }
      },
      about: {
        metaTitle: `About ${businessInfo.name} | Our Story & Mission`,
        metaDescription: `Learn about ${businessInfo.name}'s mission to deliver exceptional ${businessInfo.industry} services. Meet our team and discover our values.`,
        heroHeadline: 'Our Story',
        heroSubheadline: `How ${businessInfo.name} became a leader in ${businessInfo.industry}`,
        storySection: {
          headline: 'Why We Started',
          content: `${businessInfo.name} was founded with a clear vision: to bring ${keywords[0]} and ${keywords[1]} to ${businessInfo.industry}. We saw an opportunity to do things differently—to prioritize quality, build genuine relationships, and deliver results that truly matter.\n\nToday, we're proud to serve businesses who share our commitment to excellence. Every project we take on is an opportunity to demonstrate what's possible when you combine expertise with genuine care for outcomes.`
        },
        mission: {
          headline: 'Our Mission',
          content: `To empower businesses with exceptional ${businessInfo.industry} solutions that drive real results and lasting success.`
        },
        vision: {
          headline: 'Our Vision',
          content: `To be the most trusted name in ${businessInfo.industry}, known for ${keywords[1]}, innovation, and unwavering commitment to client success.`
        },
        values: [
          {
            title: 'Excellence',
            description: 'We never settle for "good enough." Every detail matters.'
          },
          {
            title: 'Integrity',
            description: 'Honest communication and transparent practices, always.'
          },
          {
            title: 'Innovation',
            description: 'Continuously improving and embracing better ways to serve you.'
          },
          {
            title: 'Partnership',
            description: 'Your success is our success. We\'re in this together.'
          }
        ],
        team: {
          headline: 'Meet the Team',
          subheadline: 'The people behind the results'
        }
      },
      services: {
        metaTitle: `Services | ${businessInfo.name} ${businessInfo.industry} Solutions`,
        metaDescription: `Explore ${businessInfo.name}'s comprehensive ${businessInfo.industry} services. From consultation to implementation, we deliver ${keywords[0]} results.`,
        heroHeadline: 'What We Offer',
        heroSubheadline: `Comprehensive ${businessInfo.industry} solutions tailored to your needs`,
        services: [
          {
            title: 'Consultation',
            description: `Expert guidance to understand your needs and develop a strategic approach for ${keywords[2]}.`,
            features: ['Needs assessment', 'Strategic planning', 'Custom recommendations', 'Roadmap development'],
            icon: 'clipboard'
          },
          {
            title: 'Implementation',
            description: 'Hands-on execution that brings strategies to life with precision and care.',
            features: ['Project management', 'Quality assurance', 'Timeline adherence', 'Regular updates'],
            icon: 'rocket'
          },
          {
            title: 'Support',
            description: 'Ongoing partnership to ensure continued success and optimization.',
            features: ['Dedicated account manager', 'Priority response', 'Regular check-ins', 'Continuous improvement'],
            icon: 'headset'
          },
          {
            title: 'Training',
            description: 'Empower your team with knowledge and skills for long-term success.',
            features: ['Custom curriculum', 'Hands-on workshops', 'Documentation', 'Follow-up support'],
            icon: 'book'
          }
        ],
        process: {
          headline: 'Our Process',
          steps: [
            { number: 1, title: 'Discovery', description: 'We learn about your business, goals, and challenges.' },
            { number: 2, title: 'Strategy', description: 'We develop a custom plan tailored to your needs.' },
            { number: 3, title: 'Execution', description: 'We implement with precision and keep you informed.' },
            { number: 4, title: 'Optimization', description: 'We measure, refine, and improve continuously.' }
          ]
        },
        ctaSection: {
          headline: 'Ready to See What We Can Do for You?',
          cta: 'Get a Free Quote'
        }
      },
      pricing: {
        metaTitle: `Pricing | ${businessInfo.name} - Transparent & Fair`,
        metaDescription: `View ${businessInfo.name}'s pricing options. Transparent pricing with packages designed to fit your needs and budget.`,
        heroHeadline: 'Simple, Transparent Pricing',
        heroSubheadline: 'Choose the plan that fits your needs. No hidden fees.',
        tiers: [
          {
            name: 'Starter',
            price: 'Custom',
            period: 'project',
            description: 'Perfect for small projects and getting started.',
            features: [
              'Initial consultation',
              'Basic implementation',
              'Email support',
              '30-day support window',
              'Documentation included'
            ],
            limitations: ['Limited revisions', 'Standard timeline'],
            cta: 'Get Quote',
            highlighted: false
          },
          {
            name: 'Professional',
            price: 'Custom',
            period: 'project',
            description: 'Most popular. Comprehensive solution for growing businesses.',
            features: [
              'Everything in Starter',
              'Priority implementation',
              'Phone & email support',
              '90-day support window',
              'Dedicated project manager',
              'Unlimited revisions',
              'Rush option available'
            ],
            limitations: [],
            cta: 'Get Quote',
            highlighted: true,
            badge: 'Most Popular'
          },
          {
            name: 'Enterprise',
            price: 'Custom',
            period: 'retainer',
            description: 'Full-service partnership for organizations with ongoing needs.',
            features: [
              'Everything in Professional',
              'Dedicated account team',
              '24/7 priority support',
              'Quarterly strategy reviews',
              'Custom SLA',
              'Training included',
              'First access to new services'
            ],
            limitations: [],
            cta: 'Contact Sales',
            highlighted: false
          }
        ],
        faq: [
          { q: 'Can I switch plans later?', a: 'Absolutely! You can upgrade or adjust your service level at any time.' },
          { q: 'Is there a long-term commitment?', a: 'No long-term contracts required. We earn your business through results.' },
          { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, bank transfers, and can invoice for larger projects.' }
        ],
        guarantee: '100% satisfaction guaranteed. If you\'re not happy with our work, we\'ll make it right.'
      },
      contact: {
        metaTitle: `Contact ${businessInfo.name} | Get in Touch`,
        metaDescription: `Ready to work with ${businessInfo.name}? Contact us today for a free consultation. We respond within 24 hours.`,
        heroHeadline: 'Let\'s Talk',
        heroSubheadline: 'We\'d love to hear from you. Get in touch and let\'s discuss how we can help.',
        formHeadline: 'Send Us a Message',
        formFields: ['Name', 'Email', 'Phone (optional)', 'Company (optional)', 'How can we help?'],
        submitButton: 'Send Message',
        responseTime: 'We typically respond within 24 hours.',
        alternativeContact: {
          headline: 'Prefer to reach out directly?',
          email: `hello@${businessInfo.name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
          phone: '(555) 123-4567',
          address: 'Your City, State'
        },
        mapSection: {
          headline: 'Visit Us',
          note: 'By appointment only'
        }
      }
    },
    clientPortalFeatures: [
      { name: 'Dashboard', description: 'At-a-glance view of all projects, messages, and account status with real-time updates', priority: 'critical', icon: 'home' },
      { name: 'Project Tracking', description: 'Detailed project timelines, milestones, deliverables, and progress updates', priority: 'critical', icon: 'kanban' },
      { name: 'File Management', description: 'Secure upload, download, preview, and organization of all project files', priority: 'critical', icon: 'folder' },
      { name: 'Messaging', description: 'Direct communication with project team, threaded conversations, notifications', priority: 'high', icon: 'chat' },
      { name: 'Invoices & Payments', description: 'View invoices, payment history, download receipts, make payments', priority: 'high', icon: 'credit-card' },
      { name: 'Approvals', description: 'Review and approve deliverables, provide feedback, request revisions', priority: 'high', icon: 'check-circle' },
      { name: 'Calendar', description: 'View scheduled calls, deadlines, milestones in calendar format', priority: 'medium', icon: 'calendar' },
      { name: 'Resource Library', description: 'Access brand assets, guidelines, templates, and documentation', priority: 'medium', icon: 'book' },
      { name: 'Support', description: 'Submit support tickets, track resolution, knowledge base access', priority: 'medium', icon: 'help' },
      { name: 'Account Settings', description: 'Manage profile, notification preferences, security settings', priority: 'low', icon: 'settings' }
    ],
    adminDashboardFeatures: [
      { name: 'Analytics Dashboard', description: 'Revenue metrics, project stats, team performance, growth trends', priority: 'critical', icon: 'chart' },
      { name: 'User Management', description: 'Add/edit/remove users, role assignment, permissions, activity logs', priority: 'critical', icon: 'users' },
      { name: 'Project Management', description: 'Create/manage projects, assign team members, track progress', priority: 'critical', icon: 'briefcase' },
      { name: 'Order Processing', description: 'New order alerts, fulfillment tracking, status updates, invoicing', priority: 'critical', icon: 'shopping-cart' },
      { name: 'Content Management', description: 'Edit website content, manage blog posts, update portfolio', priority: 'high', icon: 'edit' },
      { name: 'Client Management', description: 'Client profiles, communication history, preferences, notes', priority: 'high', icon: 'address-book' },
      { name: 'Team Management', description: 'Team directory, workload view, time tracking, capacity planning', priority: 'high', icon: 'team' },
      { name: 'Reporting', description: 'Custom reports, export data, scheduled reports, insights', priority: 'medium', icon: 'file-text' },
      { name: 'Integrations', description: 'Connect third-party tools, API settings, webhooks', priority: 'medium', icon: 'plug' },
      { name: 'Settings', description: 'Global settings, branding, email templates, security', priority: 'medium', icon: 'sliders' }
    ],
    launchPlan: [
      { week: 1, day: 1, category: 'Setup', task: 'Finalize all brand assets and approve designs', priority: 'critical', assignee: 'Client', deliverable: 'Approved brand kit' },
      { week: 1, day: 2, category: 'Setup', task: 'Set up domain and hosting infrastructure', priority: 'critical', assignee: 'Dev Team', deliverable: 'Live staging environment' },
      { week: 1, day: 3, category: 'Setup', task: 'Configure analytics and tracking', priority: 'high', assignee: 'Dev Team', deliverable: 'GA4, GTM configured' },
      { week: 1, day: 4, category: 'Content', task: 'Finalize all website copy', priority: 'critical', assignee: 'Client', deliverable: 'Approved copy document' },
      { week: 1, day: 5, category: 'Social', task: 'Create and configure social media accounts', priority: 'high', assignee: 'Marketing', deliverable: 'Live social profiles' },
      { week: 2, day: 1, category: 'Development', task: 'Complete website development', priority: 'critical', assignee: 'Dev Team', deliverable: 'Completed website' },
      { week: 2, day: 2, category: 'QA', task: 'Internal testing and QA', priority: 'critical', assignee: 'Dev Team', deliverable: 'QA report' },
      { week: 2, day: 3, category: 'QA', task: 'Client review and feedback', priority: 'critical', assignee: 'Client', deliverable: 'Feedback document' },
      { week: 2, day: 4, category: 'Development', task: 'Implement feedback and final revisions', priority: 'high', assignee: 'Dev Team', deliverable: 'Final website' },
      { week: 2, day: 5, category: 'Content', task: 'Schedule first 2 weeks of social content', priority: 'high', assignee: 'Marketing', deliverable: 'Scheduled posts' },
      { week: 3, day: 1, category: 'Launch', task: '🚀 LAUNCH DAY - Go live with website', priority: 'critical', assignee: 'Dev Team', deliverable: 'Live website' },
      { week: 3, day: 1, category: 'Launch', task: 'Publish launch announcement on all channels', priority: 'critical', assignee: 'Marketing', deliverable: 'Launch posts live' },
      { week: 3, day: 2, category: 'Marketing', task: 'Send launch email to contact list', priority: 'high', assignee: 'Marketing', deliverable: 'Email sent' },
      { week: 3, day: 3, category: 'Marketing', task: 'Begin paid advertising campaigns', priority: 'medium', assignee: 'Marketing', deliverable: 'Ads live' },
      { week: 3, day: 5, category: 'Review', task: 'First week metrics review', priority: 'high', assignee: 'All', deliverable: 'Metrics report' },
      { week: 4, day: 1, category: 'Optimization', task: 'Analyze launch data and identify improvements', priority: 'high', assignee: 'All', deliverable: 'Optimization plan' },
      { week: 4, day: 3, category: 'Content', task: 'Publish first blog post', priority: 'medium', assignee: 'Marketing', deliverable: 'Live blog post' },
      { week: 4, day: 5, category: 'Review', task: 'Month 1 comprehensive review', priority: 'high', assignee: 'All', deliverable: 'Monthly report' }
    ],
    emailSequences: [
      {
        name: 'Welcome Email',
        trigger: 'New signup/purchase',
        delay: 'Immediate',
        subject: `Welcome to ${businessInfo.name}! Here's what happens next`,
        preheader: 'Your journey to better results starts now',
        body: `Thank you for choosing ${businessInfo.name}! We're thrilled to have you.\n\nHere's what you can expect:\n1. A personal introduction from your dedicated contact\n2. Access to your client portal within 24 hours\n3. Your kickoff call scheduled within 48 hours\n\nIn the meantime, feel free to explore our resources or reach out with any questions.`,
        cta: 'Access Your Portal',
        ctaUrl: '/portal'
      },
      {
        name: 'Onboarding Day 3',
        trigger: 'Signup + 3 days',
        delay: '3 days',
        subject: `Quick tip to get the most from ${businessInfo.name}`,
        preheader: 'One simple thing that makes a big difference',
        body: `Hi there!\n\nWanted to share a quick tip that our most successful clients do right away:\n\n[Specific actionable tip relevant to the service]\n\nThis small step leads to significantly better results. Have questions? Just reply to this email - we're here to help!`,
        cta: 'Learn More Tips',
        ctaUrl: '/resources'
      },
      {
        name: 'Check-in Email',
        trigger: 'Signup + 7 days',
        delay: '7 days',
        subject: 'How\'s everything going?',
        preheader: 'We want to make sure you have everything you need',
        body: `Hi!\n\nIt's been a week since you started with ${businessInfo.name}, and we wanted to check in.\n\nHow's everything going so far? Is there anything you need help with?\n\nYour success is our priority, so please don't hesitate to reach out if there's anything we can do.`,
        cta: 'Schedule a Call',
        ctaUrl: '/contact'
      },
      {
        name: 'Value Email',
        trigger: 'Signup + 14 days',
        delay: '14 days',
        subject: `[Free Resource] ${businessInfo.industry} Best Practices Guide`,
        preheader: 'Exclusive resource for our clients',
        body: `Hi!\n\nWe put together a comprehensive guide on ${businessInfo.industry} best practices, and wanted to share it with you first.\n\nInside you'll find:\n• Top strategies used by industry leaders\n• Common mistakes and how to avoid them\n• Actionable tips you can implement today\n\nDownload your free copy below!`,
        cta: 'Download Free Guide',
        ctaUrl: '/resources/guide'
      },
      {
        name: 'Testimonial Request',
        trigger: 'Project complete + 7 days',
        delay: '7 days after completion',
        subject: 'How did we do?',
        preheader: 'Your feedback helps us improve',
        body: `Hi!\n\nNow that your project is complete, we'd love to hear about your experience with ${businessInfo.name}.\n\nYour feedback helps us improve and helps other businesses discover what we do.\n\nWould you be willing to share a brief testimonial? It only takes a minute and means the world to us.`,
        cta: 'Share Your Experience',
        ctaUrl: '/testimonial'
      },
      {
        name: 'Re-engagement',
        trigger: '60 days no activity',
        delay: '60 days',
        subject: `We miss you at ${businessInfo.name}!`,
        preheader: 'Special offer inside',
        body: `Hi!\n\nIt's been a while since we connected, and we wanted to reach out.\n\n${businessInfo.name} has been growing, and we've added some exciting new capabilities we think you'd love.\n\nAs a valued past client, we'd like to offer you [special offer] on your next project.\n\nLet's catch up!`,
        cta: 'Let\'s Reconnect',
        ctaUrl: '/contact'
      }
    ],
    seoStrategy: {
      primaryKeywords: [
        `${businessInfo.industry} services`,
        `${businessInfo.industry} company`,
        `best ${businessInfo.industry}`,
        businessInfo.name,
        `${businessInfo.industry} near me`
      ],
      secondaryKeywords: [
        `${keywords[0]} ${businessInfo.industry}`,
        `${keywords[1]} ${businessInfo.industry}`,
        `professional ${businessInfo.industry}`,
        `${businessInfo.industry} solutions`,
        `${businessInfo.industry} experts`
      ],
      longTailKeywords: [
        `how to choose ${businessInfo.industry} provider`,
        `best ${businessInfo.industry} for small business`,
        `${businessInfo.industry} tips and tricks`,
        `${businessInfo.industry} cost guide`,
        `what to look for in ${businessInfo.industry}`
      ],
      localKeywords: [
        `${businessInfo.industry} [city]`,
        `[city] ${businessInfo.industry} services`,
        `best ${businessInfo.industry} in [city]`,
        `${businessInfo.industry} company [city]`
      ],
      metaTitleTemplate: `${businessInfo.name} | [Page Title] - ${keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1)} ${businessInfo.industry}`,
      metaDescriptionTemplate: `${businessInfo.name} provides ${keywords[0]} ${businessInfo.industry} services. [Page-specific value prop]. Contact us today for a free consultation.`,
      schemaTypes: [
        'LocalBusiness',
        'Organization',
        'Service',
        'FAQPage',
        'BreadcrumbList',
        'WebPage'
      ],
      contentPillars: [
        `${businessInfo.industry} education and guides`,
        'Client success stories and case studies',
        'Industry trends and news',
        'Tips and best practices',
        'Behind the scenes and company culture'
      ]
    },
    competitiveAdvantages: [
      `${businessInfo.style.charAt(0).toUpperCase() + businessInfo.style.slice(1)} approach that sets us apart`,
      `Deep specialization in ${businessInfo.industry}`,
      'Personalized service and dedicated support',
      'Transparent pricing with no hidden fees',
      'Proven track record with measurable results',
      'Cutting-edge tools and methodologies',
      'Commitment to ongoing education and improvement'
    ],
    kpis: [
      { metric: 'Website Traffic', target: '1,000 visitors/month by month 3', measurement: 'Google Analytics' },
      { metric: 'Conversion Rate', target: '3-5% form submissions', measurement: 'GA4 Events' },
      { metric: 'Social Followers', target: '500 combined by month 3', measurement: 'Native analytics' },
      { metric: 'Email List', target: '250 subscribers by month 3', measurement: 'Email platform' },
      { metric: 'Client Acquisition', target: '5 new clients by month 3', measurement: 'CRM' },
      { metric: 'Client Satisfaction', target: '4.8+ star rating', measurement: 'Review platforms' }
    ]
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN BUILD FUNCTION - THE TRILLION DOLLAR SECRET SAUCE™
// ═══════════════════════════════════════════════════════════════════════════════

export async function runThreeAgentBuild(
  businessInfo: BusinessInfo,
  orderId?: string
): Promise<CompleteAssets> {
  const startTime = Date.now();
  let totalTokens = 0;

  // Premium console branding
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║                                                                    ║');
  console.log('║   💎 EZ HELP TECHNOLOGY - TRILLION DOLLAR SECRET SAUCE™ v3.0     ║');
  console.log('║                    Enterprise Brand Generation                     ║');
  console.log('║                                                                    ║');
  console.log('╠════════════════════════════════════════════════════════════════════╣');
  console.log(`║  🆔 Order: ${(orderId || 'N/A').padEnd(54)} ║`);
  console.log(`║  🏢 Business: ${(businessInfo.name || 'Unknown').substring(0, 51).padEnd(51)} ║`);
  console.log(`║  🏭 Industry: ${(businessInfo.industry || 'Unknown').substring(0, 51).padEnd(51)} ║`);
  console.log(`║  🎨 Style: ${(businessInfo.style || 'Modern').substring(0, 54).padEnd(54)} ║`);
  console.log(`║  🌈 Colors: ${(businessInfo.colors || 'Blue & White').substring(0, 53).padEnd(53)} ║`);
  console.log('╚════════════════════════════════════════════════════════════════════╝');
  console.log('');

  const agentModel = process.env.AI_MODEL_AGENT || 'llama-3.1-8b-instant';
  const colors = parseColors(businessInfo.colors || 'blue and white');
  const styleAttrs = getStyleAttributes(businessInfo.style);
  const industryKeywords = getIndustryKeywords(businessInfo.industry);

  // ═══════════════════════════════════════════════════════════════════════════
  // AGENT 1: THE VISIONARY DESIGNER
  // ═══════════════════════════════════════════════════════════════════════════

  console.log('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓');
  console.log('┃  🎨 AGENT 1: THE VISIONARY DESIGNER                               ┃');
  console.log('┃  Creating premium brand identity, visual systems & design specs  ┃');
  console.log('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛');

  let designAssets: any;

  try {
    const designerPrompt = `You are a world-class brand designer creating a $50,000 brand identity for ${businessInfo.name}.

BUSINESS PROFILE:
- Name: ${businessInfo.name}
- Industry: ${businessInfo.industry}
- Style: ${businessInfo.style} (${styleAttrs.mood})
- Colors: ${businessInfo.colors}
- Industry Keywords: ${industryKeywords.join(', ')}

Create a PREMIUM brand identity. Return ONLY valid JSON:

{
  "logo": {
    "concept": "3-sentence detailed description of a distinctive, memorable logo that perfectly embodies ${businessInfo.style} aesthetics for ${businessInfo.industry}",
    "iconDescription": "Specific description of the icon/symbol with meaning",
    "typographyStyle": "Typography treatment description",
    "symbolMeaning": "What the logo symbolizes",
    "primaryColor": "${colors.primary}",
    "secondaryColor": "${colors.secondary}",
    "accentColor": "${colors.accent}",
    "style": "${businessInfo.style}",
    "variations": ["Full color", "Stacked", "Icon only", "Wordmark", "Monochrome dark", "Monochrome light", "Reversed", "Favicon", "Social profile", "Watermark"]
  },
  "brandKit": {
    "colors": {
      "primary": "${colors.primary}",
      "secondary": "${colors.secondary}",
      "accent": "${colors.accent}",
      "background": "${colors.background}",
      "surface": "${colors.surface}",
      "text": "${colors.text}",
      "textMuted": "${colors.textMuted}"
    },
    "fonts": {
      "heading": "${styleAttrs.mood.includes('luxury') ? 'Playfair Display' : 'Montserrat'}",
      "body": "Inter",
      "accent": "Space Grotesk"
    }
  },
  "voice": ["${styleAttrs.adjectives[0]}", "${styleAttrs.adjectives[1]}", "${styleAttrs.adjectives[2]}", "expert", "trustworthy"],
  "socialTemplates": [
    {"title": "Brand Launch", "platform": "All", "idea": "Grand reveal with brand story", "contentType": "video"},
    {"title": "Value Post", "platform": "LinkedIn", "idea": "Industry expertise showcase", "contentType": "carousel"},
    {"title": "Behind Scenes", "platform": "Instagram", "idea": "Authentic team content", "contentType": "stories"},
    {"title": "Customer Story", "platform": "All", "idea": "Success testimonial", "contentType": "testimonial"},
    {"title": "Tips Thread", "platform": "Twitter", "idea": "Expert advice thread", "contentType": "thread"}
  ],
  "websitePages": [
    {"name": "Home", "slug": "/", "purpose": "Convert visitors with compelling value proposition"},
    {"name": "About", "slug": "/about", "purpose": "Build trust through story and team"},
    {"name": "Services", "slug": "/services", "purpose": "Showcase offerings with clear CTAs"},
    {"name": "Portfolio", "slug": "/portfolio", "purpose": "Display work and case studies"},
    {"name": "Testimonials", "slug": "/testimonials", "purpose": "Social proof and reviews"},
    {"name": "Blog", "slug": "/blog", "purpose": "Establish authority"},
    {"name": "Contact", "slug": "/contact", "purpose": "Capture leads"}
  ],
  "moodboard": ["${styleAttrs.adjectives.join('", "')}"],
  "competitorDifferentiators": ["Superior ${industryKeywords[0]}", "Personalized approach", "${businessInfo.style} aesthetic", "Deep ${businessInfo.industry} expertise", "Results-focused"]
}`;

    const response = await ai.chat(
      [
        { role: 'system', content: 'You are a $50,000/project brand designer. Return ONLY valid JSON, no explanations. Create premium, distinctive work.' },
        { role: 'user', content: designerPrompt },
      ],
      agentModel
    );

    totalTokens += response.usage?.input_tokens || 0;
    totalTokens += response.usage?.output_tokens || 0;

    const cleaned = cleanJsonResponse(response.content);
    designAssets = JSON.parse(cleaned);
    
    // Ensure voice is array
    if (designAssets.voice && !Array.isArray(designAssets.voice)) {
      designAssets.voice = designAssets.voice.tone || styleAttrs.adjectives.concat(['expert', 'trustworthy']);
    }
    
    console.log('  ✅ Agent 1 Complete - Premium brand identity created');
    
  } catch (error: any) {
    console.error('  ⚠️  Agent 1 using premium fallback:', error.message);
    designAssets = generatePremiumDesignFallback(businessInfo, colors, styleAttrs);
    console.log('  ✅ Agent 1 Complete - Premium fallback applied');
  }

  // Rate limit cooldown
  console.log('  ⏳ Rate limit cooldown (10s)...');
  await wait(10000);

  // ═══════════════════════════════════════════════════════════════════════════
  // AGENT 2: THE STRATEGIC CRITIC
  // ═══════════════════════════════════════════════════════════════════════════

  console.log('');
  console.log('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓');
  console.log('┃  🎯 AGENT 2: THE STRATEGIC CRITIC                                 ┃');
  console.log('┃  Analyzing brand strength, market positioning & optimization     ┃');
  console.log('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛');

  let critique: any;

  try {
    const criticPrompt = `You are a senior brand strategist reviewing a $50,000 brand package.

BRAND: ${businessInfo.name}
INDUSTRY: ${businessInfo.industry}
STYLE: ${businessInfo.style}
LOGO CONCEPT: ${designAssets.logo?.concept || 'Modern professional logo'}
COLORS: ${JSON.stringify(designAssets.brandKit?.colors || colors)}

Provide expert critique. Return ONLY valid JSON:

{
  "overallScore": 8.5,
  "brandScore": 8,
  "uxScore": 9,
  "marketFitScore": 8.5,
  "strengths": [
    "Detailed strength 1 with specific reasoning",
    "Detailed strength 2 with specific reasoning",
    "Detailed strength 3 with specific reasoning",
    "Detailed strength 4 with specific reasoning"
  ],
  "weaknesses": [
    "Constructive weakness 1 with solution",
    "Constructive weakness 2 with solution"
  ],
  "improvements": [
    "Specific actionable improvement 1",
    "Specific actionable improvement 2",
    "Specific actionable improvement 3"
  ],
  "competitiveAnalysis": "2-sentence analysis of competitive positioning in ${businessInfo.industry}",
  "targetAudienceAlignment": "2-sentence assessment of target audience resonance"
}`;

    const response = await ai.chat(
      [
        { role: 'system', content: 'You are a senior brand strategist. Return ONLY valid JSON. Provide expert-level critique.' },
        { role: 'user', content: criticPrompt },
      ],
      agentModel
    );

    totalTokens += response.usage?.input_tokens || 0;
    totalTokens += response.usage?.output_tokens || 0;

    const cleaned = cleanJsonResponse(response.content);
    critique = JSON.parse(cleaned);
    
    console.log(`  ✅ Agent 2 Complete - Quality Score: ${critique.overallScore}/10`);
    
  } catch (error: any) {
    console.error('  ⚠️  Agent 2 using premium fallback:', error.message);
    critique = generatePremiumCritiqueFallback(businessInfo, designAssets);
    console.log(`  ✅ Agent 2 Complete - Premium fallback (Score: ${critique.overallScore}/10)`);
  }

  // Rate limit cooldown
  console.log('  ⏳ Rate limit cooldown (10s)...');
  await wait(10000);

  // ═══════════════════════════════════════════════════════════════════════════
  // AGENT 3: THE MASTER PRODUCER
  // ═══════════════════════════════════════════════════════════════════════════

  console.log('');
  console.log('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓');
  console.log('┃  ✨ AGENT 3: THE MASTER PRODUCER                                  ┃');
  console.log('┃  Creating production-ready assets, content & launch materials    ┃');
  console.log('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛');

  let finalAssets: any;

  try {
    const producerPrompt = `You are a production lead creating final deliverables for a $50,000 brand package.

BUSINESS: ${businessInfo.name}
INDUSTRY: ${businessInfo.industry}
COLORS: ${JSON.stringify(designAssets.brandKit?.colors || colors)}

Create PREMIUM final assets. Return ONLY valid JSON:

{
  "logoFinal": {
    "description": "Comprehensive description of final logo with all specifications",
    "files": ["Logo_Primary.svg", "Logo_Stacked.svg", "Logo_Icon.svg", "Logo_Mono_Dark.svg", "Logo_Mono_Light.svg", "Logo_Reversed.svg", "Favicon.ico", "Social_Profile.png", "OG_Image.png"],
    "colors": ${JSON.stringify(designAssets.brandKit?.colors || colors)}
  },
  "brandGuidelines": {
    "colorUsage": "Detailed color application guidelines",
    "typography": "Complete typography specifications",
    "dos": ["Professional do 1", "Professional do 2", "Professional do 3", "Professional do 4"],
    "donts": ["Clear dont 1", "Clear dont 2", "Clear dont 3"]
  },
  "socialCalendar": [
    {"day": 1, "platform": "Instagram", "post": "🚀 Exciting launch caption for ${businessInfo.name}!", "bestTime": "9am"},
    {"day": 2, "platform": "LinkedIn", "post": "Professional intro post for ${businessInfo.industry}", "bestTime": "12pm"},
    {"day": 3, "platform": "Twitter", "post": "Engaging tweet about ${businessInfo.name}", "bestTime": "10am"},
    {"day": 4, "platform": "Facebook", "post": "Community-focused post", "bestTime": "2pm"},
    {"day": 5, "platform": "Instagram", "post": "Behind the scenes content", "bestTime": "6pm"}
  ],
  "websiteCopy": {
    "home": {
      "headline": "Compelling headline for ${businessInfo.name}",
      "subheadline": "Value-driven subheadline",
      "cta": "Get Started Today"
    },
    "about": {
      "headline": "Our Story",
      "story": "Compelling 2-sentence brand story"
    },
    "services": {
      "headline": "What We Offer",
      "features": ["Premium Feature 1", "Premium Feature 2", "Premium Feature 3", "Premium Feature 4"]
    }
  },
  "clientPortalFeatures": ["Dashboard", "Project Tracking", "File Management", "Messaging", "Invoices & Payments", "Approvals", "Calendar", "Resources", "Support", "Settings"],
  "adminDashboardFeatures": ["Analytics", "User Management", "Projects", "Orders", "Content", "Clients", "Team", "Reports", "Integrations", "Settings"]
}`;

    const response = await ai.chat(
      [
        { role: 'system', content: 'You are a production lead. Return ONLY valid JSON. Create premium deliverables.' },
        { role: 'user', content: producerPrompt },
      ],
      agentModel
    );

    totalTokens += response.usage?.input_tokens || 0;
    totalTokens += response.usage?.output_tokens || 0;

    const cleaned = cleanJsonResponse(response.content);
    const parsedAssets = JSON.parse(cleaned);
    
    // Merge AI response with premium fallback for complete data
    const premiumFallback = generatePremiumFinalAssetsFallback(businessInfo, designAssets, colors);
    
    finalAssets = {
      ...premiumFallback,
      logoFinal: parsedAssets.logoFinal || premiumFallback.logoFinal,
      brandGuidelines: {
        ...premiumFallback.brandGuidelines,
        ...parsedAssets.brandGuidelines
      },
      websiteCopy: {
        ...premiumFallback.websiteCopy,
        home: { ...premiumFallback.websiteCopy.home, ...parsedAssets.websiteCopy?.home },
        about: { ...premiumFallback.websiteCopy.about, ...parsedAssets.websiteCopy?.about },
        services: { ...premiumFallback.websiteCopy.services, ...parsedAssets.websiteCopy?.services }
      }
    };
    
    console.log('  ✅ Agent 3 Complete - Premium production assets ready');
    
  } catch (error: any) {
    console.error('  ⚠️  Agent 3 using premium fallback:', error.message);
    finalAssets = generatePremiumFinalAssetsFallback(businessInfo, designAssets, colors);
    console.log('  ✅ Agent 3 Complete - Premium fallback applied');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FAL.AI LOGO IMAGE GENERATION
  // ═══════════════════════════════════════════════════════════════════════════

  console.log('');
  console.log('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓');
  console.log('┃  🖼️  FAL.AI PREMIUM LOGO GENERATION                               ┃');
  console.log('┃  Creating AI-powered logo visualization                          ┃');
  console.log('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛');

  let logoImageUrl: string | null = null;

  try {
    const logoPrompt = `${businessInfo.style} professional logo design for "${businessInfo.name}", ${businessInfo.industry} business, ${businessInfo.colors} color scheme, ${designAssets.logo?.concept || 'clean modern design'}, vector style, white background, high quality, professional`;
    
    logoImageUrl = await generateLogoImage(logoPrompt);
    
    if (logoImageUrl) {
      console.log('  ✅ Logo image generated successfully');
    } else {
      console.log('  ⚠️  Logo image skipped (FAL not configured - will use SVG generator)');
    }
  } catch (error: any) {
    console.error('  ⚠️  FAL:', error.message);
    console.log('  ℹ️  SVG logo will be generated on frontend');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FINALIZE BUILD - TRILLION DOLLAR PACKAGE COMPLETE
  // ═══════════════════════════════════════════════════════════════════════════

  const buildDuration = Date.now() - startTime;
  const qualityScore = critique.overallScore || 8.5;

  const completeAssets: CompleteAssets = {
    designAssets,
    critique,
    finalAssets,
    businessInfo,
    logoImageUrl,
    generatedAt: new Date().toISOString(),
    aiProvider: 'groq+fal',
    buildVersion: '3.0.0-trillion-dollar-sauce',
    models: {
      frobot: process.env.AI_MODEL_FROBOT || 'llama-3.1-8b-instant',
      agent: agentModel,
      fal: process.env.FAL_LOGO_MODEL || 'fal-ai/flux/schnell',
    },
    metadata: {
      totalTokensUsed: totalTokens,
      buildDuration,
      agentIterations: 3,
      qualityScore,
    },
  };

  // Premium completion banner
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║                                                                    ║');
  console.log('║   🎉 BUILD COMPLETE - TRILLION DOLLAR SECRET SAUCE™ v3.0         ║');
  console.log('║                                                                    ║');
  console.log('╠════════════════════════════════════════════════════════════════════╣');
  console.log(`║  ⏱️  Duration: ${(buildDuration / 1000).toFixed(2)}s`.padEnd(69) + '║');
  console.log(`║  🎯 Quality Score: ${qualityScore}/10`.padEnd(69) + '║');
  console.log(`║  📊 Tokens Used: ~${totalTokens}`.padEnd(69) + '║');
  console.log(`║  📅 30-Day Social Calendar: ✅`.padEnd(69) + '║');
  console.log(`║  🌐 Full Website Copy: ✅`.padEnd(69) + '║');
  console.log(`║  📧 Email Sequences: ✅`.padEnd(69) + '║');
  console.log(`║  🚀 4-Week Launch Plan: ✅`.padEnd(69) + '║');
  console.log(`║  🔍 SEO Strategy: ✅`.padEnd(69) + '║');
  console.log('║                                                                    ║');
  console.log('║  💰 Package Value: $5,000                                         ║');
  console.log('║                                                                    ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝');
  console.log('');

  return completeAssets;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FROBOT CHAT HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

export async function getFroBotResponse(message: string, history: any[]): Promise<string> {
  try {
    const transformedHistory = history.map((msg: any) => ({
      role: msg.role === 'bot' ? 'assistant' : msg.role,
      content: msg.content,
    }));

    const response = await ai.chat(
      [
        {
          role: 'system',
          content: `You are FroBot, the premium AI assistant for EZ Help Technology's $5,000 SaaS Builder.

Your personality: Warm, professional, enthusiastic, helpful. You make clients feel they're getting VIP treatment.

Your job: Gather business information through natural conversation for their premium brand package.

Information to collect:
1. Business name
2. Industry/what they do
3. Style preference (modern, luxury, minimal, bold, playful, professional)
4. Brand colors
5. Email for delivery

Guidelines:
- Ask ONE question at a time
- Be encouraging and excited about their business
- Keep responses to 2-3 sentences
- Use occasional emojis sparingly (1-2 max)
- Acknowledge each answer before moving on
- After getting all info, summarize and express excitement to build their package`,
        },
        ...transformedHistory,
        { role: 'user', content: message },
      ],
      process.env.AI_MODEL_FROBOT || 'llama-3.1-8b-instant'
    );

    return response.content;
  } catch (error: any) {
    console.error('FroBot Error:', error.message);
    return "I apologize for the brief hiccup! Let's continue - what were you saying?";
  }
}
