// frontend/app/pricing/page.tsx
import Link from "next/link";
import CheckOutButton from "../../components/CheckOutButton";

export default function PricingPage() {
  return (
    <div className="space-y-16">
      <Link href="/" className="text-slate-400 hover:text-ezOrange transition">
        ← Back home
      </Link>

      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-extrabold">SaaS App Package</h1>
        <p className="text-slate-300 max-w-2xl mx-auto">
          One premium build. Everything automated.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-10">
        {/* MAIN PACKAGE */}
        <div className="border border-ezOrange bg-slate-900/40 rounded-xl p-8 shadow-lg shadow-ezOrange/10">
          <h2 className="text-2xl font-bold">
            Multi-page website that IS a full SaaS platform
          </h2>

          <p className="mt-3 text-slate-300">
            Built around your services, client flows, lead capture,
            rebooking, upsells, reviews, and analytics — all automated.
          </p>

          <div className="mt-6 text-5xl font-extrabold">
            $5,000
            <span className="ml-2 text-lg text-slate-400 font-medium">
              one-time build
            </span>
          </div>

          <ul className="mt-6 space-y-2 text-slate-200">
            <li>✅ Automated booking → reminder → form → upsell flow</li>
            <li>✅ Custom spa-branded design</li>
            <li>✅ Rebooking & retention automation</li>
            <li>✅ Review + reputation automation</li>
            <li>✅ Client dashboards & VIP tagging</li>
            <li>✅ Analytics built in</li>
          </ul>

          <div className="mt-8">
            <CheckOutButton priceId="price_5K_YOURID_HERE" />
            {/* Replace with your real price ID */}
          </div>

          <p className="mt-3 text-sm text-slate-400">
            Safe checkout. Instant onboarding.
          </p>
        </div>

        {/* CONTINUED SERVICES */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-8">
          <h3 className="text-2xl font-bold">Continued Services (Optional)</h3>

          <p className="mt-3 text-slate-300 leading-relaxed">
            After your SaaS app launches, we can continue growing it —
            only when it increases retention or revenue.
          </p>

          <ul className="mt-6 space-y-2 text-slate-200">
            <li>• Monthly optimization</li>
            <li>• New automations & workflows</li>
            <li>• Membership + recurring billing setup</li>
            <li>• Monthly analytics reviews</li>
            <li>• Email/SMS retention campaigns</li>
            <li>• Priority tech support</li>
          </ul>

          <div className="mt-6 rounded-lg bg-slate-800 p-4 text-sm text-slate-400">
            Continued services are billed based on what you want to expand next.
          </div>

          <Link
            href="/instant"
            className="mt-6 inline-block px-6 py-3 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg hover:bg-slate-700 transition"
          >
            Start a Design →
          </Link>
        </div>
      </section>
    </div>
  );
}
