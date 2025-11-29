"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          {/* top brand row */}
          <div className="mb-10 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold">
              EZ
            </div>
            <div className="text-lg font-semibold tracking-tight">
              EZ Help Technology
            </div>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Build a real software business.
            <br />
            <span className="text-amber-400">Fast. Clean. Ready to scale.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            We create your entire digital business in one premium SaaS package —
            branding, marketing website, client portal, and admin dashboard.
            Everything is built to look professional on Day 1 and scale into a
            full software company.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black hover:bg-amber-300"
            >
              View SaaS Package
            </Link>

            <Link
              href="/instant"
              className="rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3 font-semibold text-white hover:bg-slate-900"
            >
              Start a Design
            </Link>
          </div>
        </div>

        {/* subtle gradient glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_circle_at_20%_-20%,rgba(251,191,36,0.15),transparent_60%),radial-gradient(800px_circle_at_80%_0%,rgba(59,130,246,0.12),transparent_55%)]" />
      </section>

      {/* WHAT YOU GET */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-xl font-bold">Layer 1: Brand System</h3>
            <p className="mt-2 text-sm text-slate-300">
              Premium logo, brand kit, business identity, social starter pack,
              and consistent visuals across everything.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-xl font-bold">Layer 2: Website + Funnel</h3>
            <p className="mt-2 text-sm text-slate-300">
              A multi-page marketing site and landing funnel designed to convert
              visitors into paying clients.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-xl font-bold">Layer 3: Full SaaS Platform</h3>
            <p className="mt-2 text-sm text-slate-300">
              A client web app + admin dashboard so your business runs like a
              real software company.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-8 text-xs text-slate-500">
          © {new Date().getFullYear()} EZ Help Technology — All rights reserved.
        </div>
      </footer>
    </main>
  );
}
