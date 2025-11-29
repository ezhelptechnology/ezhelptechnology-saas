// frontend/app/builder/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type StepKey = "welcome" | "chat" | "building" | "preview";
type ChatRole = "user" | "bot";

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
  const [step, setStep] = useState<StepKey>("welcome");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  
  // Store answers in a ref to avoid React state timing issues
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

  const [agentStatus, setAgentStatus] = useState({
    agent1: "waiting",
    agent2: "waiting",
    agent3: "waiting",
  });
  const [generatedAssets, setGeneratedAssets] = useState<any>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const stepsUi: { id: StepKey; label: string }[] = [
    { id: "welcome", label: "Overview" },
    { id: "chat", label: "FroBot Brief" },
    { id: "building", label: "3× AI Build" },
    { id: "preview", label: "Purchase" },
  ];

  const currentStepIndex = stepsUi.findIndex((s) => s.id === step);

  const startBuilder = () => {
    setStep("chat");
    setQuestionIndex(0);
    answersRef.current = { name: "", industry: "", style: "", colors: "", email: "" };
    setDisplayData({ name: "", industry: "", style: "", colors: "", email: "" });
    setMessages([
      {
        role: "bot",
        content: `👋 Hey! I'm FroBot, your AI design assistant. Let's build your $5,000 SaaS package.\n\n${QUESTIONS[0].question}`,
      },
    ]);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const trimmed = inputValue.trim();
    const currentQuestion = QUESTIONS[questionIndex];

    // Add user message
    const userMessage: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Save answer to ref (immediate, no state timing issues)
    answersRef.current = {
      ...answersRef.current,
      [currentQuestion.key]: trimmed,
    };
    
    // Also update display state for the sidebar
    setDisplayData({ ...answersRef.current });

    console.log(`✅ Saved ${currentQuestion.key}:`, trimmed);
    console.log("📋 Current answers:", answersRef.current);

    // Small delay for natural feel
    await new Promise((resolve) => setTimeout(resolve, 500));

    const nextIndex = questionIndex + 1;

    if (nextIndex < QUESTIONS.length) {
      // Ask next question
      const nextQuestion = QUESTIONS[nextIndex];
      
      let acknowledgment = "";
      switch (currentQuestion.key) {
        case "name":
          acknowledgment = `**${trimmed}** – love it! `;
          break;
        case "industry":
          acknowledgment = `Got it – ${trimmed.toLowerCase()}. `;
          break;
        case "style":
          acknowledgment = `${trimmed} style – nice choice! `;
          break;
        case "colors":
          acknowledgment = `${trimmed} – solid palette! `;
          break;
      }

      const botMessage: ChatMessage = {
        role: "bot",
        content: `${acknowledgment}${nextQuestion.question}`,
      };
      setMessages((prev) => [...prev, botMessage]);
      setQuestionIndex(nextIndex);
      setIsTyping(false);
    } else {
      // All questions answered - show summary and start build
      const finalData = answersRef.current;
      
      console.log("🎯 All questions answered!");
      console.log("📋 Final data:", finalData);

      const botMessage: ChatMessage = {
        role: "bot",
        content: `Perfect! I've got everything I need:\n\n• **Business:** ${finalData.name}\n• **Industry:** ${finalData.industry}\n• **Style:** ${finalData.style}\n• **Colors:** ${finalData.colors}\n• **Email:** ${finalData.email}\n\n🚀 Handing you off to our 3-agent AI build system now...`,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);

      // Start the agent process after a short delay
      setTimeout(() => {
        startAgentProcess(finalData);
      }, 2000);
    }
  };

  const startAgentProcess = async (data: BusinessData) => {
    console.log("=== STARTING AGENT PROCESS ===");
    console.log("Data received:", JSON.stringify(data, null, 2));

    // Validate
    if (!data.name) {
      alert("Missing business name. Please try again.");
      setStep("chat");
      return;
    }
    if (!data.email) {
      alert("Missing email. Please try again.");
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

    const requestBody = {
      businessInfo,
      email: data.email,
    };

    console.log("📤 Request body:", JSON.stringify(requestBody, null, 2));

    try {
      // Agent 1 animation
      setAgentStatus((prev) => ({ ...prev, agent1: "working" }));
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setAgentStatus((prev) => ({ ...prev, agent1: "complete" }));

      // Agent 2 animation
      setAgentStatus((prev) => ({ ...prev, agent2: "working" }));
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setAgentStatus((prev) => ({ ...prev, agent2: "complete" }));

      // Agent 3 - actual API call
      setAgentStatus((prev) => ({ ...prev, agent3: "working" }));

      const res = await fetch("/api/agents/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const responseData = await res.json();
      console.log("📥 API Response:", responseData);

      if (res.ok && responseData.success) {
        setAgentStatus((prev) => ({ ...prev, agent3: "complete" }));
        setGeneratedAssets(responseData.assets);
        setStep("preview");
      } else {
        console.error("Build failed:", responseData);
        alert("Build failed: " + (responseData.error || JSON.stringify(responseData)));
        setAgentStatus({ agent1: "waiting", agent2: "waiting", agent3: "waiting" });
        setStep("chat");
      }
    } catch (err: any) {
      console.error("Build error:", err);
      alert("Something went wrong: " + err.message);
      setStep("chat");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
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
        {/* Step bar */}
        <section className="mb-4">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-xs md:text-sm">
            {stepsUi.map((s, idx) => {
              const isActive = idx === currentStepIndex;
              const isDone = idx < currentStepIndex;
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <div className={[
                    "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold",
                    isActive ? "border-amber-400 bg-amber-400 text-black shadow shadow-amber-500/40"
                      : isDone ? "border-green-400 bg-green-500/10 text-green-300"
                      : "border-slate-700 bg-slate-900 text-slate-400",
                  ].join(" ")}>
                    {idx + 1}
                  </div>
                  <span className={isActive ? "font-semibold text-amber-300" : isDone ? "text-slate-200" : "text-slate-500"}>
                    {s.label}
                  </span>
                  {idx < stepsUi.length - 1 && (
                    <span className="mx-1 h-px w-6 bg-slate-700 hidden sm:inline-block" />
                  )}
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
                  AI-Powered • 3-Agent Build • Groq
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                  Build Your <span className="text-amber-400">$5,000</span> SaaS Package with AI.
                </h1>
                <p className="text-base md:text-lg text-slate-300 max-w-xl">
                  FroBot collects your business details, then a 3-agent AI system designs your brand, website, and SaaS blueprint.
                </p>
              </div>
              <div className="rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-900/20 via-slate-900/60 to-slate-950 p-6 md:p-8 space-y-6 shadow-[0_0_60px_rgba(251,191,36,0.12)]">
                <h2 className="text-xl md:text-2xl font-bold">Your $5,000 Package Includes:</h2>
                <div className="grid gap-4 md:grid-cols-2 text-left text-sm">
                  {[
                    { icon: "🎨", title: "Premium Logo Design", desc: "Distinct, professional identity." },
                    { icon: "📋", title: "Complete Brand Kit", desc: "Colors, fonts, usage rules." },
                    { icon: "📱", title: "30-Day Social Strategy", desc: "Content calendar + templates." },
                    { icon: "🌐", title: "Multi-Page Website", desc: "Conversion-focused pages." },
                    { icon: "👤", title: "Client Portal", desc: "User dashboard & flows." },
                    { icon: "📊", title: "Admin Dashboard", desc: "Analytics and control center." },
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
                <p className="text-[11px] text-slate-400 text-center">
                  No credit card required to preview.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
                <h3 className="text-sm font-semibold text-slate-100">How it works</h3>
                <ol className="space-y-2 text-xs text-slate-400">
                  <li><span className="font-semibold text-slate-200">1. FroBot brief</span> — answer 5 questions.</li>
                  <li><span className="font-semibold text-slate-200">2. 3-Agent build</span> — AI generates your package.</li>
                  <li><span className="font-semibold text-slate-200">3. Preview</span> — review everything.</li>
                  <li><span className="font-semibold text-slate-200">4. Checkout</span> — pay $5,000 to unlock.</li>
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
                <p className="mt-2 text-[11px] text-slate-500">
                  Question {questionIndex + 1} of {QUESTIONS.length}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3 text-xs">
                <h3 className="font-semibold text-slate-100">Live project brief</h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-slate-500">Business name</div>
                    <div className="text-slate-100 text-sm">{displayData.name || "—"}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Industry</div>
                    <div className="text-slate-100 text-sm">{displayData.industry || "—"}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Style</div>
                    <div className="text-slate-100 text-sm">{displayData.style || "—"}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Colors</div>
                    <div className="text-slate-100 text-sm">{displayData.colors || "—"}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Email</div>
                    <div className="text-slate-100 text-sm">{displayData.email || "—"}</div>
                  </div>
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
              <p className="text-slate-400">Our 3-agent Groq pipeline is turning your brief into a full brand system.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { key: "agent1", name: "Agent 1: Designer", icon: "🎨", desc: "Brand, logo, color system." },
                { key: "agent2", name: "Agent 2: Critic", icon: "🎯", desc: "Reviews for clarity and polish." },
                { key: "agent3", name: "Agent 3: Producer", icon: "✨", desc: "Final package production." },
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
                        <p className="mt-2 text-[11px] text-amber-200">Generating...</p>
                      </div>
                    )}
                    {status === "complete" && <p className="mt-3 text-[12px] text-emerald-300">✓ Complete</p>}
                    {status === "waiting" && <p className="mt-3 text-[11px] text-slate-500">Waiting...</p>}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* PREVIEW */}
        {step === "preview" && generatedAssets && (
          <section className="max-w-6xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-block rounded-full bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 text-sm font-medium text-emerald-300">
                ✓ Package Complete
              </div>
              <h2 className="text-4xl font-bold">🎉 Your SaaS Package is Ready!</h2>
            </div>
            <div className="rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-900/20 via-slate-900/70 to-slate-950 p-8 space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Complete SaaS Package</h3>
                <div className="text-4xl md:text-5xl font-black text-amber-400">$5,000</div>
              </div>
              <button
                onClick={() => window.location.href = "https://buy.stripe.com/dRm9AU1H65DqeAC8FUdIA00"}
                className="w-full rounded-xl bg-amber-400 px-8 py-5 text-lg font-bold text-black hover:bg-amber-300"
              >
                Complete Purchase – $5,000 →
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}