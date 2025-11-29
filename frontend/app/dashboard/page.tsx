"use client";

const STRIPE_SAAS_PAYMENT_LINK =
  "https://buy.stripe.com/dRm9AU1H65DqeAC8FUdIA00";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-amber-400 text-black font-extrabold">
              EZ
            </div>
            <span className="text-sm md:text-base font-semibold tracking-tight">
              EZ Help Technology Lite
            </span>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#offer" className="hover:text-white">Offer</a>
            <a href="#how" className="hover:text-white">How It Works</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </nav>

          <a
            href={STRIPE_SAAS_PAYMENT_LINK}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300 transition"
          >
            Pay $5,000 with Stripe
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Launch your digital business{" "}
              <span className="text-amber-400">with a real SaaS platform.</span>
            </h1>

            <p className="mt-5 text-lg text-slate-200 max-w-2xl">
              One package gets you your branding, multi-page website, and full SaaS foundation
              (client portal + admin dashboard) — delivered professionally and ready to scale.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#offer"
                className="rounded-xl bg-slate-800 px-6 py-3 text-center text-sm font-semibold hover:bg-slate-700 transition"
              >
                See What’s Included
              </a>
              <a
                href={STRIPE_SAAS_PAYMENT_LINK}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-amber-400 px-6 py-3 text-center text-sm font-semibold text-black hover:bg-amber-300 transition"
              >
                Pay $5,000 with Stripe
              </a>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              No tech skills required. You bring the direction — we build the system.
            </p>
          </div>

          {/* SUMMARY CARD */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-7">
            <h2 className="text-lg md:text-xl font-bold">
              💎 CEO SaaS Builder — $5,000
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Your entire digital business + SaaS platform in one package.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li>• Premium Logo + Brand Kit</li>
              <li>• Multi-Page Website + Funnel</li>
              <li>• Client Portal (User Web App)</li>
              <li>• Admin Dashboard (Your Control Center)</li>
              <li>• Add-Ons, Templates, UI, Deployment Blueprint</li>
            </ul>

            <a
              href={STRIPE_SAAS_PAYMENT_LINK}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-300 transition"
            >
              Pay $5,000 with Stripe
            </a>
          </div>
        </div>
      </section>

      {/* OFFER */}
      <section id="offer" className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <h2 className="text-2xl font-bold">What you get</h2>
        <p className="mt-2 max-w-3xl text-slate-200">
          This package includes all three layers of a fully operational software company.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {/* Layer 1 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h3 className="font-semibold text-amber-300">
              🔶 Layer 1: Premium Brand System
            </h3>
            <ul className="mt-3 space-y-1 text-sm text-slate-200">
              <li>• Premium Logo</li>
              <li>• Full Brand Kit (colors, fonts, style system)</li>
              <li>• Business Identity System</li>
              <li>• Social Media Starter Pack</li>
              <li>• Branding applied across all assets</li>
            </ul>
          </div>

          {/* Layer 2 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h3 className="font-semibold text-amber-300">
              🔶 Layer 2: Business Website + Funnel
            </h3>
            <ul className="mt-3 space-y-1 text-sm text-slate-200">
              <li>• Multi-page marketing website</li>
              <li>• Funnel-ready landing page</li>
              <li>• Booking / payment / lead-capture flow</li>
              <li>• Mobile-first design system</li>
              <li>• Conversion-optimized sections</li>
            </ul>
          </div>

          {/* Layer 3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h3 className="font-semibold text-amber-300">
              🔶 Layer 3: Full SaaS Platform
            </h3>
            <ul className="mt-3 space-y-1 text-sm text-slate-200">
              <li>• Client Web App (User Portal)</li>
              <li>• SaaS Admin Dashboard</li>
              <li>• Auth + user management</li>
              <li>• Feature modules + scalable architecture</li>
              <li>• Deployment blueprint + all add-ons</li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <a
            href={STRIPE_SAAS_PAYMENT_LINK}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-7 py-3 text-sm font-semibold text-black hover:bg-amber-300 transition"
          >
            Pay $5,000 with Stripe
          </a>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <h2 className="text-2xl font-bold">How it works — simple & fast</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              n: "1",
              t: "Choose the CEO SaaS Builder",
              d: "Share your brand direction and niche. No tech skills required.",
            },
            {
              n: "2",
              t: "Pay securely with Stripe",
              d: "Your order is confirmed immediately.",
            },
            {
              n: "3",
              t: "We deliver your SaaS ecosystem",
              d: "Brand, website, client portal, admin dashboard — built professionally.",
            },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
            >
              <div className="text-3xl font-black text-amber-400">{s.n}</div>
              <div className="mt-2 font-semibold">{s.t}</div>
              <p className="mt-1 text-sm text-slate-200">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-7">
          <a
            href={STRIPE_SAAS_PAYMENT_LINK}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-7 py-3 text-sm font-semibold text-black hover:bg-amber-300 transition"
          >
            Pay $5,000 with Stripe
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <h2 className="text-2xl font-bold">FAQ</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            {
              q: "Do I get a real SaaS app?",
              a: "Yes — a full SaaS admin dashboard + client portal are included.",
            },
            {
              q: "Does this include my website and branding?",
              a: "Yes — everything from logo → brand kit → multi-page website is included.",
            },
            {
              q: "Is it customizable to my niche?",
              a: "Yes — your brand direction guides the entire build.",
            },
            {
              q: "How fast do I get it?",
              a: "Branding starts immediately. Website + SaaS foundation deliver on a defined timeline.",
            },
            {
              q: "Can I scale this into a real business?",
              a: "Yes — this is your first real version of a software company, ready to grow.",
            },
          ].map((f) => (
            <div
              key={f.q}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
            >
              <div className="font-semibold">{f.q}</div>
              <p className="mt-1 text-sm text-slate-200">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/60 py-8 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} EZ Help Technology Lite · CEO SaaS Builder
      </footer>
    </main>
  );
}
