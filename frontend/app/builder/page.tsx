// frontend/app/builder/page.tsx
"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import Link from "next/link";
import JSZip from "jszip";

type StepKey = "welcome" | "chat" | "building" | "preview";
type ChatRole = "user" | "bot";
type PreviewTab = "brand" | "website" | "social" | "saas";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type BusinessData = {
  name: string;
  industry: string;
  style: string;
  colors: string;
  email: string;
};

const QUESTIONS = [
  { key: "name" as const, question: "First, what's your **business name**?" },
  { key: "industry" as const, question: "Great! What **industry** are you in, and who are your target customers?" },
  { key: "style" as const, question: "What **brand style** are you going for? (e.g., modern, luxury, playful, minimal)" },
  { key: "colors" as const, question: "What **primary colors** do you want for your brand? (e.g., black + gold, blue + white)" },
  { key: "email" as const, question: "Last one! What's your **email address** so we can deliver your package?" },
];

export default function BuilderPage() {
  // Core state
  const [step, setStep] = useState<StepKey>("welcome");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [previewTab, setPreviewTab] = useState<PreviewTab>("brand");

  // Business data stored in ref to avoid timing issues
  const answersRef = useRef<BusinessData>({
    name: "",
    industry: "",
    style: "",
    colors: "",
    email: "",
  });
  const [displayData, setDisplayData] = useState<BusinessData>({
    name: "",
    industry: "",
    style: "",
    colors: "",
    email: "",
  });

  // Agent status
  const [agentStatus, setAgentStatus] = useState({
    agent1: "waiting",
    agent2: "waiting",
    agent3: "waiting",
  });

  // Generated assets
  const [generatedAssets, setGeneratedAssets] = useState<any>(null);
  const [orderId, setOrderId] = useState<string>("");

  // Logo & Website generation
  const [logoSvg, setLogoSvg] = useState<string>("");
  const [logoLoading, setLogoLoading] = useState(false);
  const [websiteHtml, setWebsiteHtml] = useState<string>("");
  const [websiteLoading, setWebsiteLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const stepsUi = [
    { id: "welcome" as StepKey, label: "Overview" },
    { id: "chat" as StepKey, label: "FroBot Brief" },
    { id: "building" as StepKey, label: "3× AI Build" },
    { id: "preview" as StepKey, label: "Purchase" },
  ];

  const currentStepIndex = stepsUi.findIndex((s) => s.id === step);

  // ============ CHAT FUNCTIONS ============
  const startBuilder = () => {
    setStep("chat");
    setQuestionIndex(0);
    answersRef.current = { name: "", industry: "", style: "", colors: "", email: "" };
    setDisplayData({ name: "", industry: "", style: "", colors: "", email: "" });
    setMessages([{
      role: "bot",
      content: `👋 Hey! I'm FroBot, your AI design assistant. Let's build your $5,000 SaaS package.\n\n${QUESTIONS[0].question}`,
    }]);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const trimmed = inputValue.trim();
    const currentQuestion = QUESTIONS[questionIndex];

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInputValue("");
    setIsTyping(true);

    answersRef.current = { ...answersRef.current, [currentQuestion.key]: trimmed };
    setDisplayData({ ...answersRef.current });

    await new Promise((resolve) => setTimeout(resolve, 400));

    const nextIndex = questionIndex + 1;

    if (nextIndex < QUESTIONS.length) {
      const nextQuestion = QUESTIONS[nextIndex];
      let ack = "";
      switch (currentQuestion.key) {
        case "name": ack = `**${trimmed}** – love it! `; break;
        case "industry": ack = `Got it – ${trimmed.toLowerCase()}. `; break;
        case "style": ack = `${trimmed} style – nice choice! `; break;
        case "colors": ack = `${trimmed} – solid palette! `; break;
      }
      setMessages((prev) => [...prev, { role: "bot", content: `${ack}${nextQuestion.question}` }]);
      setQuestionIndex(nextIndex);
      setIsTyping(false);
    } else {
      const finalData = answersRef.current;
      setMessages((prev) => [...prev, {
        role: "bot",
        content: `Perfect! I've got everything I need:\n\n• **Business:** ${finalData.name}\n• **Industry:** ${finalData.industry}\n• **Style:** ${finalData.style}\n• **Colors:** ${finalData.colors}\n• **Email:** ${finalData.email}\n\n🚀 Handing you off to our 3-agent AI build system now...`,
      }]);
      setIsTyping(false);
      setTimeout(() => startAgentProcess(finalData), 1500);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ============ AGENT BUILD ============
  const startAgentProcess = async (data: BusinessData) => {
    console.log("=== STARTING AGENT PROCESS ===");
    console.log("Data received:", JSON.stringify(data, null, 2));

    if (!data.name || !data.email) {
      alert("Missing required information. Please try again.");
      setStep("chat");
      return;
    }

    setStep("building");

    const businessInfo = {
      name: data.name,
      industry: data.industry,
      style: data.style,
      colors: data.colors,
    };

    try {
      // Agent 1
      setAgentStatus((prev) => ({ ...prev, agent1: "working" }));
      await new Promise((r) => setTimeout(r, 2000));
      setAgentStatus((prev) => ({ ...prev, agent1: "complete" }));

      // Agent 2
      setAgentStatus((prev) => ({ ...prev, agent2: "working" }));
      await new Promise((r) => setTimeout(r, 2000));
      setAgentStatus((prev) => ({ ...prev, agent2: "complete" }));

      // Agent 3 + API call
      setAgentStatus((prev) => ({ ...prev, agent3: "working" }));

      const res = await fetch("/api/agents/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessInfo, email: data.email }),
      });

      const responseData = await res.json();
      console.log("📥 API Response:", responseData);

      if (res.ok && responseData.success) {
        setAgentStatus((prev) => ({ ...prev, agent3: "complete" }));
        setGeneratedAssets(responseData.assets);
        setOrderId(responseData.orderId || `order_${Date.now()}`);
        await new Promise((r) => setTimeout(r, 1000));
        setStep("preview");
        
        // Auto-generate logo and website
        generateLogo(data);
        generateWebsite(data);
      } else {
        alert("Build failed: " + (responseData.error || "Unknown error"));
        setStep("chat");
      }
    } catch (err: any) {
      console.error("Build error:", err);
      alert("Something went wrong: " + err.message);
      setStep("chat");
    }
  };

  // ============ LOGO GENERATION ============
  const generateLogo = async (data: BusinessData) => {
    setLogoLoading(true);
    try {
      const res = await fetch("/api/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: data.name,
          colors: data.colors,
          slogan: "",
          category: data.style,
          description: `${data.style} logo for ${data.industry} business`,
        }),
      });
      const result = await res.json();
      if (result.svg) {
        setLogoSvg(result.svg);
      }
    } catch (err) {
      console.error("Logo generation error:", err);
    } finally {
      setLogoLoading(false);
    }
  };

  // ============ WEBSITE GENERATION ============
  const generateWebsite = async (data: BusinessData) => {
    setWebsiteLoading(true);
    try {
      const prompt = `Create a complete landing page for:
Business name: ${data.name}
Industry: ${data.industry}
Style: ${data.style}
Colors: ${data.colors}

Include:
- Modern hero section with headline and CTA button
- Features/services section with 3-4 items
- About section
- Contact/CTA section
- Professional footer

Use the specified colors throughout. Make it conversion-focused and mobile-responsive.`;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const result = await res.json();
      if (result.html) {
        setWebsiteHtml(result.html);
      }
    } catch (err) {
      console.error("Website generation error:", err);
    } finally {
      setWebsiteLoading(false);
    }
  };

  // ============ DOWNLOAD FUNCTIONS ============
  const downloadBrandKit = async () => {
    if (!generatedAssets || !displayData.name) return;

    const zip = new JSZip();
    const safeName = displayData.name.replace(/[^a-z0-9]+/gi, "-");

    // Add logo SVG if available
    if (logoSvg) {
      zip.file(`logo-${safeName}.svg`, logoSvg);
    }

    // Add brand guidelines
    const brandMd = `# ${displayData.name} Brand Guidelines

## Colors
- Primary: ${generatedAssets.designAssets?.brandKit?.colors?.primary || "#3B82F6"}
- Secondary: ${generatedAssets.designAssets?.brandKit?.colors?.secondary || "#1E40AF"}
- Accent: ${generatedAssets.designAssets?.brandKit?.colors?.accent || "#F59E0B"}

## Typography
- Heading Font: ${generatedAssets.designAssets?.brandKit?.fonts?.heading || "Montserrat"}
- Body Font: ${generatedAssets.designAssets?.brandKit?.fonts?.body || "Open Sans"}

## Brand Voice
${(generatedAssets.designAssets?.voice || ["professional", "friendly"]).map((v: string) => `- ${v}`).join("\n")}

## Usage Guidelines
${generatedAssets.finalAssets?.brandGuidelines?.colorUsage || "Use primary color for headers, secondary for accents."}

### Do's
${(generatedAssets.finalAssets?.brandGuidelines?.dos || ["Be consistent"]).map((d: string) => `- ${d}`).join("\n")}

### Don'ts
${(generatedAssets.finalAssets?.brandGuidelines?.donts || ["Don't stretch logo"]).map((d: string) => `- ${d}`).join("\n")}

---
Generated by EZ Help Technology AI SaaS Builder
`;
    zip.file("brand-guidelines.md", brandMd);

    // Add social calendar
    const socialMd = `# 30-Day Social Media Calendar for ${displayData.name}

${(generatedAssets.finalAssets?.socialCalendar || []).map((post: any) => 
  `## Day ${post.day} - ${post.platform}
**Best Time:** ${post.bestTime}
**Content:** ${post.post}
`).join("\n")}

---
Generated by EZ Help Technology AI SaaS Builder
`;
    zip.file("social-calendar.md", socialMd);

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeName}-brand-kit.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadWebsite = async () => {
    if (!websiteHtml || !displayData.name) return;

    const zip = new JSZip();
    const safeName = displayData.name.replace(/[^a-z0-9]+/gi, "-");

    zip.file("index.html", websiteHtml);
    zip.file("README.md", `# ${displayData.name} Website

Generated by EZ Help Technology AI SaaS Builder.

## How to Use
1. Open index.html in a browser to preview
2. Deploy to any static hosting (Netlify, Vercel, etc.)
3. Customize as needed

## Business Info
- Industry: ${displayData.industry}
- Style: ${displayData.style}
- Colors: ${displayData.colors}
`);

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeName}-website.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ============ PREVIEW HELPERS ============
  const design = generatedAssets?.designAssets || {};
  const critique = generatedAssets?.critique || {};
  const final = generatedAssets?.finalAssets || {};
  const logoImageUrl = generatedAssets?.logoImageUrl;

  const getColor = (path: string, fallback: string) => {
    const parts = path.split(".");
    let val: any = design;
    for (const p of parts) {
      val = val?.[p];
    }
    return val || fallback;
  };

  // ============ RENDER ============
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-black font-extrabold text-lg shadow-lg shadow-amber-500/40">
              EZ
            </div>
            <div>
              <div className="text-base md:text-lg font-bold">EZ Help Technology</div>
              <div className="text-xs text-slate-400">AI SaaS Builder</div>
            </div>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-slate-400 hover:text-white">Home</Link>
            <Link href="/pricing" className="text-slate-400 hover:text-white">Pricing</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 space-y-6">
        {/* Step Bar */}
        <section className="mb-4">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-xs md:text-sm">
            {stepsUi.map((s, idx) => {
              const isActive = idx === currentStepIndex;
              const isDone = idx < currentStepIndex;
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold ${
                    isActive ? "border-amber-400 bg-amber-400 text-black shadow shadow-amber-500/40"
                      : isDone ? "border-green-400 bg-green-500/10 text-green-300"
                      : "border-slate-700 bg-slate-900 text-slate-400"
                  }`}>
                    {idx + 1}
                  </div>
                  <span className={isActive ? "font-semibold text-amber-300" : isDone ? "text-slate-200" : "text-slate-500"}>
                    {s.label}
                  </span>
                  {idx < stepsUi.length - 1 && <span className="mx-1 h-px w-6 bg-slate-700 hidden sm:inline-block" />}
                </div>
              );
            })}
            <div className="ml-auto hidden md:flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live AI build preview
            </div>
          </div>
        </section>

        {/* WELCOME */}
        {step === "welcome" && (
          <section className="max-w-5xl mx-auto grid gap-8 md:grid-cols-[1.2fr,0.9fr] items-start">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 text-xs font-medium text-amber-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  AI-Powered • 3-Agent Build • Groq + FAL
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                  Build Your <span className="text-amber-400">$5,000</span> SaaS Package with AI.
                </h1>
                <p className="text-base md:text-lg text-slate-300 max-w-xl">
                  FroBot collects your business details, then a 3-agent AI system designs your brand, website, and SaaS blueprint — with real logo and website generation.
                </p>
              </div>
              <div className="rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-900/20 via-slate-900/60 to-slate-950 p-6 md:p-8 space-y-6 shadow-[0_0_60px_rgba(251,191,36,0.12)]">
                <h2 className="text-xl md:text-2xl font-bold">Your $5,000 Package Includes:</h2>
                <div className="grid gap-4 md:grid-cols-2 text-left text-sm">
                  {[
                    { icon: "🎨", title: "Premium Logo Design", desc: "AI-generated SVG + PNG logo files" },
                    { icon: "📋", title: "Complete Brand Kit", desc: "Colors, fonts, usage guidelines" },
                    { icon: "📱", title: "30-Day Social Strategy", desc: "Content calendar + post templates" },
                    { icon: "🌐", title: "Multi-Page Website", desc: "Complete HTML code ready to deploy" },
                    { icon: "👤", title: "Client Portal", desc: "User dashboard specifications" },
                    { icon: "📊", title: "Admin Dashboard", desc: "Analytics and management system" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-xs text-slate-400">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={startBuilder}
                  className="w-full rounded-xl bg-amber-400 px-8 py-4 text-lg font-bold text-black hover:bg-amber-300 transition-all shadow-2xl shadow-amber-500/30 hover:scale-[1.02]"
                >
                  Start Building with FroBot →
                </button>
                <p className="text-[11px] text-slate-400 text-center">No credit card required to preview.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
                <h3 className="text-sm font-semibold text-slate-100">How it works</h3>
                <ol className="space-y-2 text-xs text-slate-400">
                  <li><span className="font-semibold text-slate-200">1. FroBot brief</span> — answer 5 quick questions</li>
                  <li><span className="font-semibold text-slate-200">2. 3-Agent build</span> — AI generates brand, website, SaaS spec</li>
                  <li><span className="font-semibold text-slate-200">3. Live preview</span> — see real logo, website, and assets</li>
                  <li><span className="font-semibold text-slate-200">4. Download</span> — get all files after checkout</li>
                </ol>
              </div>
            </div>
          </section>
        )}

        {/* CHAT */}
        {step === "chat" && (
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr),minmax(0,0.9fr)]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-lg">
              <div className="border-b border-slate-800 p-4 bg-slate-900/80 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 grid place-items-center text-xl">🤖</div>
                <div>
                  <div className="font-bold">FroBot</div>
                  <div className="text-xs text-slate-400">AI Design Assistant • Powered by Groq</div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-slate-400">Online</span>
                </div>
              </div>
              <div className="h-[460px] overflow-y-auto p-6 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user" ? "bg-amber-400 text-black" : "bg-slate-800 text-slate-50"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="border-t border-slate-800 p-4 bg-slate-900/80">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your answer and press Enter…"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-amber-400 text-black px-6 py-3 rounded-xl text-sm font-semibold hover:bg-amber-300 transition disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-slate-500">Question {questionIndex + 1} of {QUESTIONS.length}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3 text-xs">
                <h3 className="font-semibold text-slate-100">Live project brief</h3>
                <div className="space-y-2">
                  <div><div className="text-slate-500">Business name</div><div className="text-slate-100 text-sm">{displayData.name || "—"}</div></div>
                  <div><div className="text-slate-500">Industry</div><div className="text-slate-100 text-sm">{displayData.industry || "—"}</div></div>
                  <div><div className="text-slate-500">Style</div><div className="text-slate-100 text-sm">{displayData.style || "—"}</div></div>
                  <div><div className="text-slate-500">Colors</div><div className="text-slate-100 text-sm">{displayData.colors || "—"}</div></div>
                  <div><div className="text-slate-500">Email</div><div className="text-slate-100 text-sm">{displayData.email || "—"}</div></div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* BUILDING */}
        {step === "building" && (
          <section className="max-w-5xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">🤖 AI Agents Building Your SaaS Package</h2>
              <p className="text-slate-400 text-sm">Our Groq + FAL pipeline is generating your complete business package.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { key: "agent1", name: "Agent 1: Designer", icon: "🎨", desc: "Creating brand identity, logo concepts, and color system" },
                { key: "agent2", name: "Agent 2: Critic", icon: "🎯", desc: "Reviewing for market fit, clarity, and polish" },
                { key: "agent3", name: "Agent 3: Producer", icon: "✨", desc: "Generating final deliverables and assets" },
              ].map((agent) => {
                const status = agentStatus[agent.key as keyof typeof agentStatus];
                return (
                  <div key={agent.key} className={`rounded-2xl border p-6 transition-all ${
                    status === "working" ? "border-amber-400 bg-amber-500/5"
                      : status === "complete" ? "border-emerald-400 bg-emerald-500/5"
                      : "border-slate-800 bg-slate-900/40"
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-3xl">{agent.icon}</div>
                      <div>
                        <div className="font-semibold">{agent.name}</div>
                        <div className="text-[11px] text-slate-400">{agent.desc}</div>
                      </div>
                    </div>
                    {status === "working" && (
                      <div className="mt-3">
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 animate-pulse w-3/4" />
                        </div>
                        <p className="mt-2 text-[11px] text-amber-200">Generating…</p>
                      </div>
                    )}
                    {status === "complete" && <p className="mt-3 text-[12px] text-emerald-300">✓ Complete — results locked in</p>}
                    {status === "waiting" && <p className="mt-3 text-[11px] text-slate-500">Waiting…</p>}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* PREVIEW */}
        {step === "preview" && generatedAssets && (
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-block rounded-full bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 text-sm font-medium text-emerald-300">
                ✓ Package Complete
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">🎉 Your SaaS Package Preview is Ready</h2>
              <p className="text-slate-400 text-sm">Generated by the 3-agent Groq pipeline + FAL logo model.</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { id: "brand" as PreviewTab, label: "🎨 Brand & Logo" },
                { id: "website" as PreviewTab, label: "🌐 Website" },
                { id: "social" as PreviewTab, label: "📱 Social Media" },
                { id: "saas" as PreviewTab, label: "💻 SaaS Blueprint" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setPreviewTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    previewTab === tab.id ? "bg-amber-400 text-black" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr,380px]">
              {/* Tab Content */}
              <div className="space-y-6">
                {/* BRAND TAB */}
                {previewTab === "brand" && (
                  <div className="space-y-4">
                    {/* Logo Section */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Brand & Logo</h3>
                        <button
                          onClick={downloadBrandKit}
                          className="px-3 py-1.5 bg-amber-400 text-black rounded-lg text-xs font-semibold hover:bg-amber-300"
                        >
                          Download Brand Kit
                        </button>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Logo Preview */}
                        <div>
                          <h4 className="text-sm font-semibold text-slate-300 mb-3">Logo Preview</h4>
                          <div className="rounded-xl border border-slate-700 bg-white p-4 min-h-[120px] flex items-center justify-center">
                            {logoLoading ? (
                              <div className="text-slate-400 text-sm">Generating logo...</div>
                            ) : logoSvg ? (
                              <div dangerouslySetInnerHTML={{ __html: logoSvg }} />
                            ) : logoImageUrl ? (
                              <img src={logoImageUrl} alt="Generated logo" className="max-h-24" />
                            ) : (
                              <div className="text-slate-400 text-sm">Logo preview</div>
                            )}
                          </div>
                          <button
                            onClick={() => generateLogo(displayData)}
                            disabled={logoLoading}
                            className="mt-2 text-xs text-amber-400 hover:text-amber-300"
                          >
                            {logoLoading ? "Generating..." : "🔄 Regenerate Logo"}
                          </button>
                        </div>

                        {/* Colors */}
                        <div>
                          <h4 className="text-sm font-semibold text-slate-300 mb-3">Color Palette</h4>
                          <div className="space-y-2">
                            {[
                              { label: "Primary", color: getColor("brandKit.colors.primary", "#3B82F6") },
                              { label: "Secondary", color: getColor("brandKit.colors.secondary", "#1E40AF") },
                              { label: "Accent", color: getColor("brandKit.colors.accent", "#F59E0B") },
                            ].map((c) => (
                              <div key={c.label} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg border border-slate-700" style={{ backgroundColor: c.color }} />
                                <div>
                                  <div className="text-xs text-slate-400">{c.label}</div>
                                  <div className="text-sm text-slate-200">{c.color}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Typography & Voice */}
                      <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-300 mb-2">Typography</h4>
                          <div className="text-sm text-slate-400">
                            <p><span className="text-slate-200">Heading:</span> {design.brandKit?.fonts?.heading || "Montserrat"}</p>
                            <p><span className="text-slate-200">Body:</span> {design.brandKit?.fonts?.body || "Open Sans"}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-300 mb-2">Brand Voice</h4>
                          <div className="flex flex-wrap gap-1">
                            {(design.voice || ["professional", "friendly"]).map((v: string, i: number) => (
                              <span key={i} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">{v}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Critique Score */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                      <h3 className="text-lg font-bold mb-4">Agent 2 Critique Score</h3>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-4xl font-black text-amber-400">{critique.score || 8}</div>
                        <div className="text-sm text-slate-400">/ 10 overall quality</div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="text-emerald-400 font-semibold mb-2">Strengths</h4>
                          <ul className="space-y-1 text-slate-400">
                            {(critique.strengths || []).map((s: string, i: number) => (
                              <li key={i}>• {s}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-amber-400 font-semibold mb-2">Improvements</h4>
                          <ul className="space-y-1 text-slate-400">
                            {(critique.improvements || []).map((s: string, i: number) => (
                              <li key={i}>• {s}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* WEBSITE TAB */}
                {previewTab === "website" && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">Website Preview</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => generateWebsite(displayData)}
                          disabled={websiteLoading}
                          className="px-3 py-1.5 bg-slate-700 text-white rounded-lg text-xs font-semibold hover:bg-slate-600"
                        >
                          {websiteLoading ? "Generating..." : "🔄 Regenerate"}
                        </button>
                        <button
                          onClick={downloadWebsite}
                          disabled={!websiteHtml}
                          className="px-3 py-1.5 bg-amber-400 text-black rounded-lg text-xs font-semibold hover:bg-amber-300 disabled:opacity-50"
                        >
                          Download Website
                        </button>
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-700 overflow-hidden bg-white">
                      {websiteLoading ? (
                        <div className="h-[400px] flex items-center justify-center text-slate-400">
                          Generating website preview...
                        </div>
                      ) : websiteHtml ? (
                        <iframe
                          title="Website Preview"
                          srcDoc={websiteHtml}
                          className="w-full h-[500px]"
                          sandbox="allow-same-origin"
                        />
                      ) : (
                        <div className="h-[400px] flex items-center justify-center text-slate-400">
                          Website preview will appear here
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SOCIAL TAB */}
                {previewTab === "social" && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                    <h3 className="text-lg font-bold mb-4">30-Day Social Calendar</h3>
                    <div className="space-y-3">
                      {(final.socialCalendar || []).slice(0, 7).map((post: any, i: number) => (
                        <div key={i} className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-amber-400 font-semibold">Day {post.day}</span>
                            <span className="text-xs text-slate-400">{post.platform} • {post.bestTime}</span>
                          </div>
                          <p className="text-sm text-slate-300">{post.post}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SAAS TAB */}
                {previewTab === "saas" && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                      <h3 className="text-lg font-bold mb-4">SaaS Feature Blueprint</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-semibold text-sky-400 mb-3">Client Portal Features</h4>
                          <ul className="space-y-2">
                            {(final.clientPortalFeatures || []).map((f: string, i: number) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                <span className="text-sky-400">•</span> {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-violet-400 mb-3">Admin Dashboard Features</h4>
                          <ul className="space-y-2">
                            {(final.adminDashboardFeatures || []).map((f: string, i: number) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                <span className="text-violet-400">•</span> {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                      <h3 className="text-lg font-bold mb-4">Website Copy</h3>
                      <div className="space-y-4 text-sm">
                        <div>
                          <div className="text-xs text-slate-500 uppercase mb-1">Hero Headline</div>
                          <div className="text-xl font-bold text-slate-100">{final.websiteCopy?.home?.headline || `Welcome to ${displayData.name}`}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 uppercase mb-1">Subheadline</div>
                          <div className="text-slate-300">{final.websiteCopy?.home?.subheadline || "Your trusted partner"}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 uppercase mb-1">Call to Action</div>
                          <span className="inline-block px-4 py-2 bg-amber-400 text-black rounded-lg font-semibold">
                            {final.websiteCopy?.home?.cta || "Get Started"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing Sidebar */}
              <div className="space-y-4">
                <div className="rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-900/20 via-slate-900/70 to-slate-950 p-6 space-y-4 sticky top-24">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-bold">Complete SaaS Package</h3>
                    <div className="text-4xl font-black text-amber-400">$5,000</div>
                    <p className="text-xs text-slate-400">One-time • Done-for-you • No subscription</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    {[
                      "Logo files (SVG, PNG, PDF)",
                      "Complete brand guidelines",
                      "Full website code",
                      "30-day social calendar",
                      "SaaS dashboard specs",
                      "Admin panel blueprint",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-300">
                        <span className="text-emerald-400">✓</span> {item}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => window.location.href = "https://buy.stripe.com/dRm9AU1H65DqeAC8FUdIA00"}
                    className="w-full rounded-xl bg-amber-400 px-6 py-4 text-lg font-bold text-black hover:bg-amber-300 transition-all shadow-lg"
                  >
                    Complete Purchase – $5,000 →
                  </button>

                  <p className="text-center text-[10px] text-slate-500">
                    🔒 Secure Stripe checkout • 📁 Assets delivered after payment
                  </p>
                </div>

                {orderId && (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs">
                    <div className="text-slate-500">Order ID</div>
                    <div className="text-slate-300 font-mono text-[11px] break-all">{orderId}</div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
