// lib/agentSystem.ts
import { ai } from './ai';

export async function runThreeAgentBuild(
  businessInfo: any,
  orderId?: string
) {
  console.log(`🤖 Starting 3-Agent Build${orderId ? ` for: ${orderId}` : ''}`);
  console.log(`📋 Business Info:`, businessInfo);

  // Use default model if not set
  const agentModel = process.env.AI_MODEL_AGENT || 'llama-3.1-8b-instant';
  console.log(`🧠 Using model: ${agentModel}`);

  try {
    // AGENT 1: Designer
    console.log(`🎨 Agent 1 (Designer) starting...`);
    
    let designAssets;
    try {
      const agent1Response = await ai.chat([
        {
          role: 'system',
          content: 'You are Agent 1 - The Designer for EZ Help Technology. Create design concepts. Respond ONLY with valid JSON, no markdown, no code blocks, no explanation.'
        },
        {
          role: 'user',
          content: `Business Info: ${JSON.stringify(businessInfo)}

Create initial design concepts and return ONLY this JSON structure (no markdown, no backticks):
{
  "logo": {
    "concept": "detailed description of logo design",
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
    {"title": "Welcome Post", "idea": "..."},
    {"title": "Value Post", "idea": "..."},
    {"title": "Testimonial Post", "idea": "..."}
  ],
  "websitePages": [
    {"name": "Home", "purpose": "..."},
    {"name": "About", "purpose": "..."},
    {"name": "Services", "purpose": "..."}
  ]
}`
        }
      ], agentModel);

      // Clean and parse the response
      const cleanedContent = agent1Response.content
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .trim();
      
      designAssets = JSON.parse(cleanedContent);
      console.log(`✅ Agent 1 complete`);
    } catch (e: any) {
      console.error('❌ Agent 1 failed:', e.message);
      // Provide fallback design assets
      designAssets = {
        logo: {
          concept: `A modern logo for ${businessInfo.name || 'the business'}`,
          primaryColor: "#3B82F6",
          secondaryColor: "#1E40AF",
          style: businessInfo.style || "modern"
        },
        brandKit: {
          colors: { primary: "#3B82F6", secondary: "#1E40AF", accent: "#F59E0B" },
          fonts: { heading: "Inter", body: "Open Sans" }
        },
        voice: ["professional", "friendly", "innovative"],
        socialTemplates: [
          { title: "Welcome Post", idea: "Introduce your brand" },
          { title: "Value Post", idea: "Share your expertise" },
          { title: "Testimonial Post", idea: "Customer success story" }
        ],
        websitePages: [
          { name: "Home", purpose: "Main landing page" },
          { name: "About", purpose: "Company story" },
          { name: "Services", purpose: "What you offer" }
        ],
        parseError: true,
        fallback: true
      };
    }

    // AGENT 2: Critic
    console.log(`🎯 Agent 2 (Critic) starting...`);
    
    let critique;
    try {
      const agent2Response = await ai.chat([
        {
          role: 'system',
          content: 'You are Agent 2 - The Critic. Review designs and provide critique. Respond ONLY with valid JSON, no markdown, no explanation.'
        },
        {
          role: 'user',
          content: `Review these designs: ${JSON.stringify(designAssets)}

Return ONLY this JSON (no markdown, no backticks):
{
  "score": 8,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "improvements": ["specific improvement 1", "improvement 2"]
}`
        }
      ], agentModel);

      const cleanedContent = agent2Response.content
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .trim();
      
      critique = JSON.parse(cleanedContent);
      console.log(`✅ Agent 2 complete - Score: ${critique.score}/10`);
    } catch (e: any) {
      console.error('❌ Agent 2 failed:', e.message);
      critique = {
        score: 8,
        strengths: ["Strong brand identity", "Good color choices", "Clear messaging"],
        weaknesses: ["Could be more unique", "Consider accessibility"],
        improvements: ["Add more contrast", "Expand social templates"],
        parseError: true,
        fallback: true
      };
    }

    // AGENT 3: Producer
    console.log(`✨ Agent 3 (Producer) starting...`);
    
    let finalAssets;
    try {
      const agent3Response = await ai.chat([
        {
          role: 'system',
          content: 'You are Agent 3 - The Producer. Create final production-ready deliverables. Respond ONLY with valid JSON, no markdown, no explanation.'
        },
        {
          role: 'user',
          content: `Original Designs: ${JSON.stringify(designAssets)}
Critique: ${JSON.stringify(critique)}
Business: ${JSON.stringify(businessInfo)}

Create final deliverables. Return ONLY valid JSON (no markdown):
{
  "logoFinal": {
    "description": "final logo specifications",
    "files": ["SVG", "PNG", "PDF"],
    "colors": {"primary": "#hex", "secondary": "#hex"}
  },
  "brandGuidelines": {
    "colorUsage": "...",
    "typography": "...",
    "dos": ["...", "..."],
    "donts": ["...", "..."]
  },
  "socialCalendar": [
    {"day": 1, "platform": "Instagram", "post": "caption idea", "bestTime": "9am"},
    {"day": 2, "platform": "LinkedIn", "post": "caption idea", "bestTime": "12pm"},
    {"day": 3, "platform": "Twitter", "post": "caption idea", "bestTime": "10am"}
  ],
  "websiteCopy": {
    "home": {"headline": "...", "subheadline": "...", "cta": "..."},
    "about": {"headline": "...", "story": "..."},
    "services": {"headline": "...", "features": ["feature1", "feature2", "feature3"]}
  },
  "clientPortalFeatures": ["feature 1", "feature 2", "feature 3"],
  "adminDashboardFeatures": ["feature 1", "feature 2", "feature 3"]
}`
        }
      ], agentModel);

      const cleanedContent = agent3Response.content
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .trim();
      
      finalAssets = JSON.parse(cleanedContent);
      console.log(`✅ Agent 3 complete`);
    } catch (e: any) {
      console.error('❌ Agent 3 failed:', e.message);
      finalAssets = {
        logoFinal: {
          description: `Professional logo for ${businessInfo.name}`,
          files: ["SVG", "PNG", "PDF"],
          colors: designAssets.brandKit?.colors || { primary: "#3B82F6", secondary: "#1E40AF" }
        },
        brandGuidelines: {
          colorUsage: "Use primary color for headers, secondary for accents",
          typography: "Use heading font for titles, body font for paragraphs",
          dos: ["Be consistent", "Use brand colors", "Keep it professional"],
          donts: ["Don't stretch logo", "Don't change colors", "Don't use low-res images"]
        },
        socialCalendar: [
          { day: 1, platform: "Instagram", post: "Welcome to our page!", bestTime: "9am" },
          { day: 2, platform: "LinkedIn", post: "Excited to share our services", bestTime: "12pm" },
          { day: 3, platform: "Twitter", post: "Follow us for updates", bestTime: "10am" }
        ],
        websiteCopy: {
          home: { headline: `Welcome to ${businessInfo.name}`, subheadline: "Your trusted partner", cta: "Get Started" },
          about: { headline: "Our Story", story: "We're passionate about helping businesses succeed" },
          services: { headline: "What We Offer", features: ["Service 1", "Service 2", "Service 3"] }
        },
        clientPortalFeatures: ["Dashboard", "Project tracking", "Messaging"],
        adminDashboardFeatures: ["User management", "Analytics", "Settings"],
        parseError: true,
        fallback: true
      };
    }

    // Combine everything
    const completeAssets = {
      designAssets,
      critique,
      finalAssets,
      businessInfo,
      generatedAt: new Date().toISOString(),
      aiProvider: 'groq',
      models: {
        frobot: process.env.AI_MODEL_FROBOT || 'llama-3.1-8b-instant',
        agent: agentModel
      }
    };

    console.log(`🎉 3-Agent Build Complete!`);
    return completeAssets;

  } catch (error: any) {
    console.error('❌ Agent Build Failed:', error.message);
    throw error;
  }
}

// FroBot Chat Handler (kept for reference, not used in current flow)
export async function getFroBotResponse(message: string, history: any[]) {
  try {
    console.log('🤖 FroBot called with message:', message);

    const transformedHistory = history.map((msg: any) => ({
      role: msg.role === 'bot' ? 'assistant' : msg.role === 'user' ? 'user' : 'system',
      content: msg.content
    }));

    const response = await ai.chat([
      {
        role: 'system',
        content: `You are FroBot, a friendly AI assistant for EZ Help Technology.

Your job: Gather business information through conversation.
Ask about:
1. Business name
2. Industry and target customers
3. Brand style preference (modern, professional, creative, etc.)
4. Primary color preference
5. Email address

Rules:
- Ask ONE question at a time
- Keep responses brief and conversational (2-3 sentences max)
- Be enthusiastic but professional
- After getting all 5 pieces of info, say you're ready to start building`
      },
      ...transformedHistory,
      { role: 'user', content: message }
    ], process.env.AI_MODEL_FROBOT || 'llama-3.1-8b-instant');

    return response.content;

  } catch (error: any) {
    console.error('❌ FroBot error:', error.message);
    return "I apologize, I'm having trouble right now. Please try again in a moment.";
  }
}