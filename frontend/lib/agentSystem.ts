// frontend/lib/agentSystem.ts
import { ai } from "./ai";
import { generateLogoImage } from "./fal";

export async function runThreeAgentBuild(
  businessInfo: any,
  orderId?: string
) {
  console.log(`🤖 Starting 3-Agent Build${orderId ? ` for: ${orderId}` : ""}`);
  console.log(`📋 Business Info:`, businessInfo);

  const agentModel = process.env.AI_MODEL_AGENT || "llama-3.1-8b-instant";
  console.log(`🧠 Using model: ${agentModel}`);

  try {
    // ========== AGENT 1: DESIGNER ==========
    console.log(`🎨 Agent 1 (Designer) starting...`);

    let designAssets: any;
    try {
      const agent1Response = await ai.chat(
        [
          {
            role: "system",
            content:
              "You are Agent 1 - The Designer for EZ Help Technology. Create design concepts. Respond ONLY with valid JSON, no markdown, no code blocks, no explanation.",
          },
          {
            role: "user",
            content: `Business Info: ${JSON.stringify(businessInfo)}

Create initial design concepts and return ONLY this JSON structure (no markdown, no backticks):
{
  "logo": {
    "concept": "detailed description of logo design including shapes, layout, and visual elements",
    "primaryColor": "#hexcode",
    "secondaryColor": "#hexcode",
    "style": "modern/minimal/bold/etc"
  },
  "brandKit": {
    "colors": {
      "primary": "#hexcode",
      "secondary": "#hexcode",
      "accent": "#hexcode"
    },
    "fonts": {
      "heading": "Google Font Name",
      "body": "Google Font Name"
    }
  },
  "voice": ["professional", "friendly", "innovative"],
  "socialTemplates": [
    { "title": "Welcome Post", "idea": "specific post idea" },
    { "title": "Value Post", "idea": "specific post idea" },
    { "title": "Testimonial Post", "idea": "specific post idea" }
  ],
  "websitePages": [
    { "name": "Home", "purpose": "main landing with hero section" },
    { "name": "About", "purpose": "company story and team" },
    { "name": "Services", "purpose": "detailed service offerings" },
    { "name": "Contact", "purpose": "contact form and info" }
  ]
}`,
          },
        ],
        agentModel
      );

      const cleanedContent = agent1Response.content
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/gi, "")
        .trim();

      designAssets = JSON.parse(cleanedContent);
      console.log(`✅ Agent 1 complete`);
    } catch (e: any) {
      console.error("❌ Agent 1 failed:", e.message);
      const userColors = businessInfo.colors || "blue and white";
      const isPrimaryDark = userColors.toLowerCase().includes("black") || 
                           userColors.toLowerCase().includes("dark") ||
                           userColors.toLowerCase().includes("navy");
      
      designAssets = {
        logo: {
          concept: `A ${businessInfo.style || "modern"} logo for ${businessInfo.name || "the business"} featuring clean typography and a distinctive icon that represents ${businessInfo.industry || "the industry"}. The design uses ${userColors} as the primary color scheme.`,
          primaryColor: isPrimaryDark ? "#1E293B" : "#3B82F6",
          secondaryColor: isPrimaryDark ? "#F59E0B" : "#1E40AF",
          style: businessInfo.style || "modern",
        },
        brandKit: {
          colors: {
            primary: isPrimaryDark ? "#1E293B" : "#3B82F6",
            secondary: isPrimaryDark ? "#F59E0B" : "#1E40AF",
            accent: "#22C55E",
          },
          fonts: { heading: "Montserrat", body: "Open Sans" },
        },
        voice: ["professional", "friendly", "innovative"],
        socialTemplates: [
          { title: "Welcome Post", idea: `Introducing ${businessInfo.name} - your trusted partner for ${businessInfo.industry}` },
          { title: "Value Post", idea: "Share expert tips and insights from your industry" },
          { title: "Testimonial Post", idea: "Feature a satisfied customer's success story" },
        ],
        websitePages: [
          { name: "Home", purpose: "Main landing page with hero and key offerings" },
          { name: "About", purpose: "Company story, mission, and team" },
          { name: "Services", purpose: "Detailed breakdown of services offered" },
          { name: "Contact", purpose: "Contact form and location information" },
        ],
        fallback: true,
      };
    }

    // ========== AGENT 2: CRITIC ==========
    console.log(`🎯 Agent 2 (Critic) starting...`);

    let critique: any;
    try {
      const agent2Response = await ai.chat(
        [
          {
            role: "system",
            content:
              "You are Agent 2 - The Critic. Review designs and provide constructive critique. Respond ONLY with valid JSON, no markdown, no explanation.",
          },
          {
            role: "user",
            content: `Review these designs for ${businessInfo.name} in the ${businessInfo.industry} industry: ${JSON.stringify(designAssets)}

Return ONLY this JSON (no markdown, no backticks):
{
  "score": 8,
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "weaknesses": ["specific weakness 1", "specific weakness 2"],
  "improvements": ["actionable improvement 1", "actionable improvement 2", "actionable improvement 3"]
}`,
          },
        ],
        agentModel
      );

      const cleanedContent = agent2Response.content
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/gi, "")
        .trim();

      critique = JSON.parse(cleanedContent);
      console.log(`✅ Agent 2 complete - Score: ${critique.score}/10`);
    } catch (e: any) {
      console.error("❌ Agent 2 failed:", e.message);
      critique = {
        score: 8,
        strengths: [
          "Strong brand identity that aligns with industry standards",
          "Color palette creates good visual hierarchy",
          "Clear and consistent messaging tone",
        ],
        weaknesses: [
          "Could incorporate more unique visual elements",
          "Consider adding more accessibility features",
        ],
        improvements: [
          "Add subtle gradients or textures for depth",
          "Include more specific CTAs in website copy",
          "Expand social media content variety",
        ],
        fallback: true,
      };
    }

    // ========== AGENT 3: PRODUCER ==========
    console.log(`✨ Agent 3 (Producer) starting...`);

    let finalAssets: any;
    try {
      const agent3Response = await ai.chat(
        [
          {
            role: "system",
            content:
              "You are Agent 3 - The Producer. Create final production-ready deliverables based on designs and critique. Respond ONLY with valid JSON, no markdown, no explanation.",
          },
          {
            role: "user",
            content: `Original Designs: ${JSON.stringify(designAssets)}
Critique: ${JSON.stringify(critique)}
Business: ${JSON.stringify(businessInfo)}

Create final deliverables. Return ONLY valid JSON (no markdown):
{
  "logoFinal": {
    "description": "detailed final logo description with specific visual elements",
    "files": ["SVG", "PNG", "PDF", "Favicon"],
    "colors": {"primary": "#hex", "secondary": "#hex", "accent": "#hex"}
  },
  "brandGuidelines": {
    "colorUsage": "specific guidance on when to use each color",
    "typography": "font pairing rules and sizes",
    "dos": ["do 1", "do 2", "do 3"],
    "donts": ["dont 1", "dont 2", "dont 3"]
  },
  "socialCalendar": [
    {"day": 1, "platform": "Instagram", "post": "specific post caption", "bestTime": "9am"},
    {"day": 2, "platform": "LinkedIn", "post": "specific post caption", "bestTime": "12pm"},
    {"day": 3, "platform": "Twitter", "post": "specific post caption", "bestTime": "10am"},
    {"day": 4, "platform": "Facebook", "post": "specific post caption", "bestTime": "2pm"},
    {"day": 5, "platform": "Instagram", "post": "specific post caption", "bestTime": "6pm"}
  ],
  "websiteCopy": {
    "home": {"headline": "compelling headline", "subheadline": "supporting text", "cta": "action button text"},
    "about": {"headline": "about headline", "story": "2-3 sentence company story"},
    "services": {"headline": "services headline", "features": ["feature 1", "feature 2", "feature 3", "feature 4"]}
  },
  "clientPortalFeatures": ["Dashboard overview", "Project tracking", "File sharing", "Messaging", "Invoice history"],
  "adminDashboardFeatures": ["User management", "Analytics dashboard", "Content management", "Order processing", "Settings"]
}`,
          },
        ],
        agentModel
      );

      const cleanedContent = agent3Response.content
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/gi, "")
        .trim();

      finalAssets = JSON.parse(cleanedContent);
      console.log(`✅ Agent 3 complete`);
    } catch (e: any) {
      console.error("❌ Agent 3 failed:", e.message);
      const colors = designAssets.brandKit?.colors || {
        primary: "#3B82F6",
        secondary: "#1E40AF",
        accent: "#F59E0B",
      };
      
      finalAssets = {
        logoFinal: {
          description: `Professional ${businessInfo.style || "modern"} logo for ${businessInfo.name} featuring clean typography and a distinctive brand mark that represents excellence in ${businessInfo.industry || "the industry"}.`,
          files: ["SVG", "PNG", "PDF", "Favicon"],
          colors: colors,
        },
        brandGuidelines: {
          colorUsage: `Use ${colors.primary} for primary elements and headers. Use ${colors.secondary} for secondary elements and backgrounds. Use ${colors.accent} for CTAs and highlights.`,
          typography: "Use Montserrat for headings (Bold, 24-48px). Use Open Sans for body text (Regular, 14-18px). Maintain consistent line height of 1.5.",
          dos: [
            "Maintain consistent spacing around logo",
            "Use approved color combinations",
            "Keep messaging professional and friendly",
          ],
          donts: [
            "Don't stretch or distort the logo",
            "Don't use unapproved color variations",
            "Don't place logo on busy backgrounds",
          ],
        },
        socialCalendar: [
          { day: 1, platform: "Instagram", post: `🚀 Welcome to ${businessInfo.name}! We're excited to connect with you.`, bestTime: "9am" },
          { day: 2, platform: "LinkedIn", post: `Proud to introduce ${businessInfo.name}. We're dedicated to excellence in ${businessInfo.industry}.`, bestTime: "12pm" },
          { day: 3, platform: "Twitter", post: `New here! ${businessInfo.name} is ready to serve you. Stay tuned!`, bestTime: "10am" },
          { day: 4, platform: "Facebook", post: `At ${businessInfo.name}, your success is our priority. Share this post!`, bestTime: "2pm" },
          { day: 5, platform: "Instagram", post: `Behind the scenes at ${businessInfo.name}! 💼✨`, bestTime: "6pm" },
        ],
        websiteCopy: {
          home: {
            headline: `Welcome to ${businessInfo.name}`,
            subheadline: `Your trusted partner for ${businessInfo.industry || "professional services"}.`,
            cta: "Get Started Today",
          },
          about: {
            headline: "Our Story",
            story: `${businessInfo.name} was founded to provide outstanding ${businessInfo.industry || "services"} that exceed expectations.`,
          },
          services: {
            headline: "What We Offer",
            features: ["Professional consultation", "Custom solutions", "Dedicated support", "Results-driven approach"],
          },
        },
        clientPortalFeatures: ["Dashboard overview", "Project tracking", "File sharing", "Messaging", "Invoice history"],
        adminDashboardFeatures: ["User management", "Analytics dashboard", "Content management", "Order processing", "Settings"],
        fallback: true,
      };
    }

    // ========== FAL: LOGO IMAGE GENERATION ==========
    console.log("🖼️ Generating logo image with FAL...");
    
    const logoPrompt = `${businessInfo.style || "modern"} ${businessInfo.industry || "business"} logo for "${businessInfo.name}", ${businessInfo.colors || "professional colors"}, ${designAssets?.logo?.concept || "clean minimal design"}`;
    
    let logoImageUrl: string | null = null;
    try {
      logoImageUrl = await generateLogoImage(logoPrompt);
      if (logoImageUrl) {
        console.log("✅ Logo image generated:", logoImageUrl);
      } else {
        console.warn("⚠️ Logo image URL is null (FAL may not be configured)");
      }
    } catch (falError: any) {
      console.error("❌ FAL logo generation failed:", falError.message);
    }

    // ========== COMBINE EVERYTHING ==========
    const completeAssets = {
      designAssets,
      critique,
      finalAssets,
      businessInfo,
      logoImageUrl,
      generatedAt: new Date().toISOString(),
      aiProvider: "groq+fal",
      models: {
        frobot: process.env.AI_MODEL_FROBOT || "llama-3.1-8b-instant",
        agent: agentModel,
        fal: process.env.FAL_LOGO_MODEL || "fal-ai/flux/schnell",
      },
    };

    console.log(`🎉 3-Agent Build Complete!`);
    return completeAssets;
  } catch (error: any) {
    console.error("❌ Agent Build Failed:", error.message);
    throw error;
  }
}

export async function getFroBotResponse(message: string, history: any[]) {
  try {
    const transformedHistory = history.map((msg: any) => ({
      role: msg.role === "bot" ? "assistant" : msg.role === "user" ? "user" : "system",
      content: msg.content,
    }));

    const response = await ai.chat(
      [
        {
          role: "system",
          content: `You are FroBot, a friendly AI assistant for EZ Help Technology. Gather business information through conversation. Ask ONE question at a time. Be brief and professional.`,
        },
        ...transformedHistory,
        { role: "user", content: message },
      ],
      process.env.AI_MODEL_FROBOT || "llama-3.1-8b-instant"
    );

    return response.content;
  } catch (error: any) {
    console.error("❌ FroBot error:", error.message);
    return "I apologize, I'm having trouble right now. Please try again in a moment.";
  }
}
