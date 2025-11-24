// frontend/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";

type Preset = {
  id: string;
  label: string;
  prompt: string;
};

const PRESETS: Preset[] = [
  {
    id: "barber",
    label: "Barber (Queen City Cuts)",
    prompt:
      "Generate a modern, mobile-first landing page for a Charlotte, NC barber shop called 'Queen City Cuts'. Include hero, services list, pricing table, testimonials, and a booking CTA.",
  },
  {
    id: "trucker",
    label: "Trucking Dispatch",
    prompt:
      "Generate a bold, mobile-first landing page for a trucking dispatch and route-planning service in North Carolina called 'MyTruckTrip Dispatch'. Include hero, how it works, benefits, pricing tiers, and a lead capture form.",
  },
  {
    id: "realtor",
    label: "Realtor",
    prompt:
      "Generate a clean, mobile-first landing page for a Charlotte, NC real estate agent specializing in first-time homebuyers. Include hero, featured listings section, process steps, testimonials, and contact form.",
  },
  {
    id: "restaurant",
    label: "Restaurant (Precious Pancakes)",
    prompt:
      "Generate a cozy, mobile-first landing page for a breakfast diner called 'Precious Pancakes' in Concord, NC. Include hero, featured menu items, hours & location, customer reviews, and a 'Reserve a Table' CTA.",
  },
  {
    id: "fitness",
    label: "Fitness Coach",
    prompt:
      "Generate a high-energy, mobile-first landing page for an online fitness coach brand called 'FitMentor Pro'. Include hero, program highlights, transformation before/after section, pricing, FAQ, and sign-up CTA.",
  },
  {
    id: "saas",
    label: "SaaS Landing (EZ Help)",
    prompt:
      "Generate a sleek, mobile-first SaaS landing page for 'EZ Help Technology — FroBot Pro', an AI website generator. Include hero, key features, pricing cards, testimonials, and a 'Start Free Trial' CTA.",
  },
];

export default function DashboardPage() {
  // --- simple access-code gate state ---
  const [verified, setVerified] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);

  // --- generator state ---
  const [activePresetId, setActivePresetId] = useState<string>("restaurant");
  const [prompt, setPrompt] = useState<string>(
    PRESETS.find((p) => p.id === "restaurant")?.prompt ||
      "Generate a landing page."
  );
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Check localStorage once on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const flag = window.localStorage.getItem("ezhelp_dashboard_access");
      if (flag === "true") {
        setVerified(true);
      }
    }
  }, []);

  const handleVerifyAccess = async () => {
    try {
      setVerifying(true);
      setAccessError(null);

      const res = await fetch("/api/verify-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: accessCode }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Invalid code");
      }

      setVerified(true);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("ezhelp_dashboard_access", "true");
      }
    } catch (e: any) {
      console.error(e);
      setAccessError(e.message || "Invalid code");
    } finally {
      setVerifying(false);
    }
  };

  const handlePresetClick = (preset: Preset) => {
    setActivePresetId(preset.id);
    setPrompt(preset.prompt);
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      setHtml("");
      setCopied(false);
      setDownloaded(false);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.html) {
        throw new Error(data.error || "Failed to generate site");
      }

      setHtml(data.html as string);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Something went wrong while generating.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyHtml = async () => {
    if (!html) return;
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadHtml = () => {
    if (!html) return;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ezhelp-landing-page.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  // --- If not verified, show access gate first ---
  if (!verified) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h1 className="text-2xl font-bold text-center">
            Enter Access Code
          </h1>
          <p className="text-sm text-slate-300 text-center">
            This area is restricted. Enter your 2FA-style access code to use the
            EZ Help Technology dashboard.
          </p>

          <input
            type="password"
            inputMode="numeric"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            placeholder="Enter your access code"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
          />

          <button
            type="button"
            disabled={verifying || !accessCode.trim()}
            onClick={handleVerifyAccess}
            className={`w-full rounded-lg px-4 py-2 text-sm font-semibold ${
              verifying || !accessCode.trim()
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-amber-400 text-black hover:bg-amber-300"
            }`}
          >
            {verifying ? "Verifying..." : "Unlock Dashboard"}
          </button>

          {accessError && (
            <p className="text-xs text-center text-red-400">
              {accessError}
            </p>
          )}

          <p className="text-[11px] text-center text-slate-500">
            Lost your access code? Contact the EZ Help Technology admin.
          </p>
        </div>
      </main>
    );
  }

  // --- Normal dashboard once verified ---
  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-6 md:px-8">
      {/* Header */}
      <header className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl">
            Generate high-converting websites with AI, then{" "}
            <span className="font-semibold text-amber-300">
              copy, download, or hand off to clients
            </span>{" "}
            in seconds.
          </p>
        </div>
        <div className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-300">
          EZ Help Technology · FroBot Pro
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.15fr)]">
        {/* Left column: controls */}
        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-6">
          <h2 className="text-lg font-semibold">1. Choose a preset or write your own</h2>

          {/* Preset buttons */}
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  activePresetId === preset.id
                    ? "border-amber-400 bg-amber-400/10 text-amber-300"
                    : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <p className="text-sm text-slate-300">
            You can edit the prompt below before generating. The AI will build
            a full HTML + Tailwind landing page.
          </p>

          {/* Prompt textarea */}
          <textarea
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            rows={6}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {/* Generate button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className={`mt-2 inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold ${
              loading || !prompt.trim()
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-amber-400 text-black hover:bg-amber-300"
            }`}
          >
            {loading ? "Generating..." : "Generate AI Website"}
          </button>

          {/* Status message */}
          {error && (
            <p className="text-xs text-red-400 mt-2">
              {error}
            </p>
          )}
          {!error && html && (
            <p className="text-xs text-emerald-400 mt-2">
              ✅ Site generated. Use Copy or Download on the right to export.
            </p>
          )}
        </section>

        {/* Right column: preview + actions */}
        <section className="flex min-h-[420px] flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-3 md:p-4">
          <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">2. Live preview & export</h2>
              <p className="text-xs text-slate-400">
                This is exactly what your client or end user would see.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyHtml}
                disabled={!html}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  html
                    ? "bg-slate-800 text-slate-100 hover:bg-slate-700"
                    : "bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800"
                }`}
              >
                {copied ? "Copied ✅" : "Copy HTML"}
              </button>
              <button
                type="button"
                onClick={handleDownloadHtml}
                disabled={!html}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  html
                    ? "bg-slate-800 text-slate-100 hover:bg-slate-700"
                    : "bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800"
                }`}
              >
                {downloaded ? "Downloaded ✅" : "Download .html"}
              </button>
            </div>
          </div>

          {/* Preview */}
          {!html && !loading && (
            <div className="flex h-full flex-1 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/60 px-4 text-center text-sm text-slate-400">
              Your AI website preview will appear here after you click{" "}
              <span className="font-semibold text-amber-300">
                “Generate AI Website”.
              </span>
            </div>
          )}

          {html && (
            <div className="flex-1 overflow-hidden rounded-xl border border-slate-800 bg-black">
              <iframe
                title="AI Website Preview"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                className="h-[480px] w-full bg-white"
                srcDoc={html}
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
