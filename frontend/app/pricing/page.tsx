"use client";

const STRIPE_SAAS_LINK = "https://buy.stripe.com/dRm9AU1H65DqeAC8FUdIA00";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">

        {/* Heading */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold">
            💎 CEO SaaS Builder — $5,000
          </h1>
          <p className="mt-3 text-slate-300 text-base md:text-lg">
            Your entire digital business + SaaS platform in one package.
          </p>
        </header>

        {/* Main Offer Card */}
        <section className="rounded-2xl border border-amber-400/40 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 p-6 md:p-10">
          
          <p className="text-slate-200 text-sm md:text-base">
            This package includes ALL THREE LAYERS of a fully operational software company:
          </p>

          {/* Layer 1 */}
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 className="text-lg font-bold text-amber-300">
              🔶 LAYER 1: Your Premium Brand System
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Everything you need to look established on Day 1:
            </p>
            <ul className="mt-3 space-y-1 text-sm text-slate-200">
              <li>• Premium Logo</li>
              <li>• Full Brand Kit (colors, fonts, style system)</li>
              <li>• Business Identity System</li>
              <li>• Social Media Starter Pack</li>
              <li>• Branding applied across all assets</li>
            </ul>
            <p className="mt-3 text-xs text-slate-400">
              You design the direction instantly — we turn it into a polished, professional brand.
            </p>
          </div>

          {/* Layer 2 */}
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 className="text-lg font-bold text-amber-300">
              🔶 LAYER 2: Your Business Website + Funnel
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              You get a fully built, revenue-ready web presence:
            </p>
            <ul className="mt-3 space-y-1 text-sm text-slate-200">
              <li>• Multi-page marketing website</li>
              <li>• Funnel-ready landing page</li>
              <li>• Booking, payment, or lead-capture flows</li>
              <li>• Mobile-first design system</li>
              <li>• Conversion-optimized sections</li>
              <li>• Brand-matched UI</li>
            </ul>
            <p className="mt-3 text-xs text-slate-400">
              This is your official business front door — built to convert.
            </p>
          </div>

          {/* Layer 3 */}
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 className="text-lg font-bold text-amber-300">
              🔶 LAYER 3: Your Full SaaS Platform (Client App + Admin App)
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              This is the part that turns your business into a software company.
            </p>

            <div className="mt-3">
              <p className="font-semibold text-slate-100">Client Web App (User Portal)</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-200">
                <li>• Manage profiles</li>
                <li>• View appointments or purchases</li>
                <li>• Submit forms</li>
                <li>• Access dashboards</li>
                <li>• Use your custom features</li>
              </ul>
            </div>

            <div className="mt-4">
              <p className="font-semibold text-slate-100">SaaS Admin Dashboard (Your Internal System)</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-200">
                <li>• Dashboard & analytics</li>
                <li>• View/manage users</li>
                <li>• Manage submissions</li>
                <li>• Control settings</li>
                <li>• Feature modules</li>
                <li>• Scalable SaaS architecture</li>
              </ul>
            </div>

            <div className="mt-4 rounded-lg border border-slate-700 bg-slate-950/60 p-4 text-sm text-slate-200">
              <p className="font-semibold text-amber-200">All Add-Ons Included</p>
              <ul className="mt-2 space-y-1">
                <li>• Extra templates</li>
                <li>• Extra UI components</li>
                <li>• Brand expansions</li>
                <li>• Additional website versions</li>
                <li>• Social content packs</li>
                <li>• Deployment blueprint</li>
              </ul>
              <p className="mt-2 text-xs text-slate-400">
                Anything we create → you receive.
              </p>
            </div>
          </div>

          {/* Stripe Button */}
          <div className="mt-8 flex flex-col items-center gap-2">
            <a
              href={STRIPE_SAAS_LINK}
              target="_blank"
              rel="noreferrer"
              className="w-full md:w-auto text-center rounded-xl bg-amber-400 px-8 py-3 text-base font-semibold text-black hover:bg-amber-300"
            >
              Pay $5,000 with Stripe
            </a>
            <p className="text-xs text-slate-400">
              Secure checkout powered by Stripe.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-xl font-bold">How It Works — Simple & Fast</h3>
          <ol className="mt-3 space-y-2 text-sm text-slate-200 list-decimal list-inside">
            <li>
              <span className="font-semibold">Choose the CEO SaaS Builder.</span>{" "}
              You design your brand direction instantly (no tech skills required).
            </li>
            <li>
              <span className="font-semibold">Pay securely with Stripe.</span>{" "}
              Your order is confirmed immediately.
            </li>
            <li>
              <span className="font-semibold">We deliver your complete SaaS ecosystem.</span>{" "}
              Brand, website, client portal, and SaaS platform — ready to scale.
            </li>
          </ol>
        </section>

        {/* FAQ */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-xl font-bold">FAQ</h3>

          <div className="mt-4 space-y-4 text-sm text-slate-200">
            <div>
              <p className="font-semibold">Do I get a real SaaS app?</p>
              <p>Yes — a full SaaS admin dashboard + client portal are included.</p>
            </div>

            <div>
              <p className="font-semibold">Does this include my website and branding?</p>
              <p>Yes — everything from logo → brand kit → multi-page website is included.</p>
            </div>

            <div>
              <p className="font-semibold">Is it customizable to my niche?</p>
              <p>Yes — your brand direction guides the entire build.</p>
            </div>

            <div>
              <p className="font-semibold">How fast do I get it?</p>
              <p>
                Branding starts immediately. Your website and SaaS foundation deliver on a
                defined timeline.
              </p>
            </div>

            <div>
              <p className="font-semibold">Can I scale this into a real business?</p>
              <p>Yes — this is your first real version of a software company.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

