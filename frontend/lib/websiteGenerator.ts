// frontend/lib/websiteGenerator.ts
// ═══════════════════════════════════════════════════════════════════════════════
// EZ HELP TECHNOLOGY - PREMIUM WEBSITE GENERATOR
// Generates stunning, responsive websites using Groq AI
// ═══════════════════════════════════════════════════════════════════════════════

import { ai } from "./ai";

export interface WebsiteInput {
  businessName: string;
  industry: string;
  style: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  copy?: {
    headline?: string;
    subheadline?: string;
    cta?: string;
  };
  features?: string[];
  testimonials?: Array<{ name: string; quote: string }>;
}

export interface GeneratedWebsite {
  html: string;
  css?: string;
  sections: string[];
}

/**
 * Generate a premium, responsive website using Groq AI
 */
export async function generatePremiumWebsite(input: WebsiteInput): Promise<GeneratedWebsite> {
  const { businessName, industry, style, colors, copy, features, testimonials } = input;
  
  const styleGuide = getStyleGuide(style);
  
  const prompt = `Create a stunning, premium, single-page website for "${businessName}" - a ${industry} business.

DESIGN REQUIREMENTS:
- Style: ${style} (${styleGuide.description})
- Primary Color: ${colors.primary}
- Secondary Color: ${colors.secondary}  
- Accent Color: ${colors.accent}
- Font: ${styleGuide.font}

CONTENT:
- Hero Headline: ${copy?.headline || `Welcome to ${businessName}`}
- Hero Subheadline: ${copy?.subheadline || `Premium ${industry} solutions`}
- CTA Button: ${copy?.cta || 'Get Started'}
${features ? `- Features: ${features.join(', ')}` : ''}

REQUIRED SECTIONS (in order):
1. Navigation (sticky, transparent → solid on scroll)
2. Hero (full viewport, gradient overlay, compelling headline, CTA button)
3. Features/Services (3-4 cards with icons, hover effects)
4. About/Why Us (split layout with image placeholder)
5. Testimonials (carousel or grid)
6. CTA Section (gradient background, centered content)
7. Footer (links, social icons, copyright)

TECHNICAL REQUIREMENTS:
- Include: <script src="https://cdn.tailwindcss.com"></script>
- Mobile-first responsive design
- Smooth scroll behavior
- CSS animations on scroll (use Intersection Observer)
- Hover effects on buttons and cards
- Use CSS Grid and Flexbox
- Include Font Awesome for icons: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
- Include Google Font: ${styleGuide.font}
- Use placeholder images from https://placehold.co/

OUTPUT: Return ONLY the complete HTML document, starting with <!DOCTYPE html>. No explanations.`;

  try {
    const response = await ai.chat(
      [
        {
          role: 'system',
          content: `You are an elite web designer who creates $10,000+ websites. You write clean, semantic HTML with TailwindCSS. Your designs are stunning, modern, and conversion-focused. Return ONLY HTML code, no explanations.`
        },
        { role: 'user', content: prompt }
      ],
      process.env.AI_MODEL_AGENT || 'llama-3.1-8b-instant'
    );

    let html = response.content;
    
    // Clean up response
    html = html.replace(/```html\s*/gi, '').replace(/```\s*/gi, '').trim();
    
    // Ensure it starts with DOCTYPE
    if (!html.toLowerCase().startsWith('<!doctype')) {
      const docStart = html.toLowerCase().indexOf('<!doctype');
      if (docStart !== -1) {
        html = html.substring(docStart);
      }
    }
    
    // Ensure TailwindCSS is included
    if (!html.includes('cdn.tailwindcss.com')) {
      html = html.replace('<head>', '<head>\n<script src="https://cdn.tailwindcss.com"></script>');
    }

    return {
      html,
      sections: ['navigation', 'hero', 'features', 'about', 'testimonials', 'cta', 'footer']
    };
    
  } catch (error: any) {
    console.error('Website generation error:', error.message);
    return {
      html: generateFallbackWebsite(input),
      sections: ['navigation', 'hero', 'features', 'about', 'cta', 'footer']
    };
  }
}

/**
 * Generate a specific page/section
 */
export async function generateWebsiteSection(
  sectionType: 'hero' | 'features' | 'about' | 'testimonials' | 'cta' | 'footer',
  input: WebsiteInput
): Promise<string> {
  const prompts: Record<string, string> = {
    hero: `Create a stunning hero section for "${input.businessName}". Full viewport, gradient overlay on image, centered content with headline, subheadline, and CTA button. Use colors: ${input.colors.primary}, ${input.colors.secondary}. Style: ${input.style}. TailwindCSS only.`,
    features: `Create a features/services section with 4 cards. Each card has an icon, title, and description. Use grid layout, hover effects, shadows. Colors: ${input.colors.primary}, ${input.colors.accent}. Style: ${input.style}. TailwindCSS only.`,
    about: `Create an about section with split layout - text on left, image placeholder on right. Include mission statement and value props. Colors: ${input.colors.primary}, ${input.colors.secondary}. Style: ${input.style}. TailwindCSS only.`,
    testimonials: `Create a testimonials section with 3 testimonial cards. Include quote, name, role, and avatar placeholder. Clean design with subtle shadows. Colors: ${input.colors.secondary}. Style: ${input.style}. TailwindCSS only.`,
    cta: `Create a call-to-action section with gradient background, centered headline, subtext, and prominent button. Colors: ${input.colors.primary} to ${input.colors.secondary} gradient, button in ${input.colors.accent}. TailwindCSS only.`,
    footer: `Create a footer with logo, navigation links, social icons, and copyright. Dark background. Clean grid layout. Colors: dark slate, accent ${input.colors.accent}. TailwindCSS only.`
  };

  try {
    const response = await ai.chat(
      [
        { role: 'system', content: 'You are a web designer. Return ONLY HTML code with TailwindCSS classes. No explanations.' },
        { role: 'user', content: prompts[sectionType] }
      ],
      process.env.AI_MODEL_AGENT || 'llama-3.1-8b-instant'
    );

    return response.content.replace(/```html\s*/gi, '').replace(/```\s*/gi, '').trim();
  } catch (error) {
    return `<section class="py-20"><div class="container mx-auto text-center"><p>Section: ${sectionType}</p></div></section>`;
  }
}

// Style guides for different brand styles
function getStyleGuide(style: string): { description: string; font: string } {
  const guides: Record<string, { description: string; font: string }> = {
    modern: {
      description: 'Clean lines, bold typography, generous whitespace, subtle shadows',
      font: 'Inter'
    },
    luxury: {
      description: 'Elegant serif fonts, gold accents, rich imagery, sophisticated animations',
      font: 'Playfair Display'
    },
    minimal: {
      description: 'Maximum whitespace, simple typography, monochromatic, subtle interactions',
      font: 'Space Grotesk'
    },
    bold: {
      description: 'Large typography, high contrast, strong colors, impactful imagery',
      font: 'Montserrat'
    },
    playful: {
      description: 'Rounded corners, vibrant colors, fun animations, friendly typography',
      font: 'Nunito'
    },
    professional: {
      description: 'Classic layout, trustworthy colors, balanced design, clean typography',
      font: 'Source Sans Pro'
    },
    tech: {
      description: 'Dark mode, gradients, futuristic elements, code-like accents',
      font: 'JetBrains Mono'
    }
  };

  const styleLower = style?.toLowerCase() || 'modern';
  for (const [key, value] of Object.entries(guides)) {
    if (styleLower.includes(key)) return value;
  }
  return guides.modern;
}

// Premium fallback website
function generateFallbackWebsite(input: WebsiteInput): string {
  const { businessName, industry, style, colors, copy } = input;
  const styleGuide = getStyleGuide(style);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessName} | Premium ${industry}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=${styleGuide.font.replace(' ', '+')}:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '${colors.primary}',
            secondary: '${colors.secondary}',
            accent: '${colors.accent}',
          },
          fontFamily: {
            sans: ['${styleGuide.font}', 'sans-serif'],
          },
        }
      }
    }
  </script>
  <style>
    html { scroll-behavior: smooth; }
    .gradient-hero { background: linear-gradient(135deg, ${colors.primary}ee 0%, ${colors.secondary}ee 100%); }
    .gradient-cta { background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%); }
  </style>
</head>
<body class="font-sans antialiased">
  <!-- Navigation -->
  <nav class="fixed w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-md shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <span class="text-2xl font-bold text-primary">${businessName}</span>
        </div>
        <div class="hidden md:flex items-center space-x-8">
          <a href="#features" class="text-gray-700 hover:text-primary transition">Features</a>
          <a href="#about" class="text-gray-700 hover:text-primary transition">About</a>
          <a href="#testimonials" class="text-gray-700 hover:text-primary transition">Reviews</a>
          <a href="#contact" class="px-6 py-2 bg-primary text-white rounded-full hover:bg-secondary transition shadow-lg hover:shadow-xl">${copy?.cta || 'Get Started'}</a>
        </div>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="relative min-h-screen flex items-center gradient-hero">
    <div class="absolute inset-0 bg-black/20"></div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-32">
      <h1 class="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
        ${copy?.headline || `Welcome to ${businessName}`}
      </h1>
      <p class="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto">
        ${copy?.subheadline || `Premium ${industry} solutions designed for success`}
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="#contact" class="px-8 py-4 bg-white text-primary font-semibold rounded-full hover:bg-accent hover:text-white transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
          ${copy?.cta || 'Get Started'} <i class="fas fa-arrow-right ml-2"></i>
        </a>
        <a href="#features" class="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-primary transition-all">
          Learn More
        </a>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="py-24 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">Discover what makes ${businessName} the preferred choice for ${industry}</p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
          <div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
            <i class="fas fa-star text-2xl text-primary"></i>
          </div>
          <h3 class="text-xl font-semibold mb-3">Premium Quality</h3>
          <p class="text-gray-600">Uncompromising standards in everything we deliver.</p>
        </div>
        <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
          <div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
            <i class="fas fa-users text-2xl text-primary"></i>
          </div>
          <h3 class="text-xl font-semibold mb-3">Expert Team</h3>
          <p class="text-gray-600">Dedicated professionals committed to your success.</p>
        </div>
        <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
          <div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
            <i class="fas fa-chart-line text-2xl text-primary"></i>
          </div>
          <h3 class="text-xl font-semibold mb-3">Proven Results</h3>
          <p class="text-gray-600">Track record of success with measurable outcomes.</p>
        </div>
        <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
          <div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
            <i class="fas fa-headset text-2xl text-primary"></i>
          </div>
          <h3 class="text-xl font-semibold mb-3">24/7 Support</h3>
          <p class="text-gray-600">Always here when you need us, no exceptions.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section id="about" class="py-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 class="text-4xl font-bold text-gray-900 mb-6">About ${businessName}</h2>
          <p class="text-lg text-gray-600 mb-6">
            We're passionate about delivering exceptional ${industry} solutions that make a real difference. 
            Our commitment to quality and customer satisfaction sets us apart.
          </p>
          <p class="text-lg text-gray-600 mb-8">
            With years of experience and a dedicated team, we've helped countless clients achieve their goals 
            and exceed their expectations.
          </p>
          <div class="grid grid-cols-3 gap-8">
            <div class="text-center">
              <div class="text-4xl font-bold text-primary">500+</div>
              <div class="text-gray-600">Happy Clients</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-primary">98%</div>
              <div class="text-gray-600">Satisfaction</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-primary">10+</div>
              <div class="text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>
        <div class="relative">
          <div class="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center">
            <img src="https://placehold.co/600x600/${colors.primary.replace('#', '')}/${colors.secondary.replace('#', '')}?text=${encodeURIComponent(businessName)}" alt="${businessName}" class="rounded-2xl shadow-2xl">
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials Section -->
  <section id="testimonials" class="py-24 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
        <p class="text-xl text-gray-600">Don't just take our word for it</p>
      </div>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white p-8 rounded-2xl shadow-lg">
          <div class="flex items-center mb-4">
            <div class="text-accent">
              <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
            </div>
          </div>
          <p class="text-gray-600 mb-6">"${businessName} exceeded all expectations. Their attention to detail and commitment to quality is unmatched."</p>
          <div class="flex items-center">
            <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
              <span class="text-primary font-semibold">JD</span>
            </div>
            <div>
              <div class="font-semibold">John Doe</div>
              <div class="text-gray-500 text-sm">CEO, TechCorp</div>
            </div>
          </div>
        </div>
        <div class="bg-white p-8 rounded-2xl shadow-lg">
          <div class="flex items-center mb-4">
            <div class="text-accent">
              <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
            </div>
          </div>
          <p class="text-gray-600 mb-6">"Working with ${businessName} was a game-changer for our business. Highly recommend!"</p>
          <div class="flex items-center">
            <div class="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mr-4">
              <span class="text-secondary font-semibold">SJ</span>
            </div>
            <div>
              <div class="font-semibold">Sarah Johnson</div>
              <div class="text-gray-500 text-sm">Founder, StartupXYZ</div>
            </div>
          </div>
        </div>
        <div class="bg-white p-8 rounded-2xl shadow-lg">
          <div class="flex items-center mb-4">
            <div class="text-accent">
              <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
            </div>
          </div>
          <p class="text-gray-600 mb-6">"Professional, responsive, and delivered results beyond what we imagined. Thank you!"</p>
          <div class="flex items-center">
            <div class="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mr-4">
              <span class="text-accent font-semibold">MB</span>
            </div>
            <div>
              <div class="font-semibold">Mike Brown</div>
              <div class="text-gray-500 text-sm">Director, Enterprise Inc</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section id="contact" class="py-24 gradient-cta">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
      <h2 class="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
      <p class="text-xl opacity-90 mb-10">Join hundreds of satisfied clients who chose ${businessName}</p>
      <a href="mailto:hello@${businessName.toLowerCase().replace(/[^a-z]/g, '')}.com" class="inline-block px-10 py-4 bg-white text-primary font-semibold rounded-full hover:bg-accent hover:text-white transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg">
        Contact Us Today <i class="fas fa-arrow-right ml-2"></i>
      </a>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-900 text-gray-400 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-4 gap-12">
        <div class="col-span-2 md:col-span-1">
          <div class="text-2xl font-bold text-white mb-4">${businessName}</div>
          <p class="mb-6">Premium ${industry} solutions for businesses that demand excellence.</p>
          <div class="flex space-x-4">
            <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition">
              <i class="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4">Quick Links</h4>
          <ul class="space-y-2">
            <li><a href="#features" class="hover:text-white transition">Features</a></li>
            <li><a href="#about" class="hover:text-white transition">About Us</a></li>
            <li><a href="#testimonials" class="hover:text-white transition">Testimonials</a></li>
            <li><a href="#contact" class="hover:text-white transition">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4">Services</h4>
          <ul class="space-y-2">
            <li><a href="#" class="hover:text-white transition">Consultation</a></li>
            <li><a href="#" class="hover:text-white transition">Implementation</a></li>
            <li><a href="#" class="hover:text-white transition">Support</a></li>
            <li><a href="#" class="hover:text-white transition">Training</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4">Contact</h4>
          <ul class="space-y-2">
            <li><i class="fas fa-envelope mr-2"></i> hello@${businessName.toLowerCase().replace(/[^a-z]/g, '')}.com</li>
            <li><i class="fas fa-phone mr-2"></i> (555) 123-4567</li>
            <li><i class="fas fa-map-marker-alt mr-2"></i> Your City, State</li>
          </ul>
        </div>
      </div>
      <div class="border-t border-gray-800 mt-12 pt-8 text-center">
        <p>&copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.</p>
      </div>
    </div>
  </footer>
</body>
</html>`;
}
