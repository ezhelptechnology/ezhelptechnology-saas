// frontend/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-20">
      {/* HERO */}
      <section className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Your spa is premium.{" "}
          <span className="text-ezOrange block">
            Your technology should feel the same.
          </span>
        </h1>

        <p className="text-lg text-slate-300 max-w-2xl">
          We build you a multi-page website that{" "}
          <span className="font-semibold text-ezOrange">IS a full SaaS app</span>,
          automating your booking flow, reminders, pre-appointment forms,
          upsells, reviews, and rebooking — without changing how you already run
          your business.
        </p>

        <div className="flex gap-4 mt-4">
          <Link
            href="/pricing"
            className="px-6 py-3 bg-ezOrange text-black font-semibold rounded-lg hover:bg-orange-400 transition"
          >
            View SaaS Package
          </Link>

          <Link
            href="/instant"
            className="px-6 py-3 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg hover:bg-slate-700 transition"
          >
            Start a Design
          </Link>
        </div>
      </section>

      {/* AUTOMATION CARD */}
      <section className="grid md:grid-cols-2 gap-10">
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
          <h2 className="text-2xl font-semibold">Your entire client journey, automated</h2>

          <ul className="mt-4 space-y-2 text-slate-300">
            <li>✅ Booking confirmations & reminders</li>
            <li>✅ Pre-appointment intake forms</li>
            <li>✅ Thank-you follow-ups</li>
            <li>✅ Upsells that feel natural (consult → facial)</li>
            <li>✅ Review requests at the perfect time</li>
            <li>✅ Client tagging + VIP tracking</li>
            <li>✅ Analytics that show what’s working</li>
          </ul>
        </div>

        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
          <h2 className="text-2xl font-semibold">Example automation flow</h2>

          <p className="text-slate-300 mt-3 leading-relaxed">
            A client books your $100 consultation → they instantly receive a reminder,
            a pre-appointment form, a thank-you message, and a natural upsell to your
            $160 Signature Facial or monthly plan. 
          </p>

          <p className="text-slate-300 mt-3">
            All automated. You don’t lift a finger.
          </p>
        </div>
      </section>

      {/* CTA BLOCK */}
      <section className="border border-slate-800 bg-slate-900/40 rounded-xl p-10 text-center">
        <h2 className="text-3xl font-bold">Ready to see your spa run on autopilot?</h2>

        <p className="mt-3 text-slate-300">
          We'll map a real service into a fully automated client journey in under
          10 minutes.
        </p>

        <Link
          href="/pricing"
          className="mt-6 inline-block px-8 py-3 bg-ezOrange text-black font-semibold rounded-lg hover:bg-orange-400 transition"
        >
          View SaaS Package
        </Link>

        <p className="mt-4 text-sm text-slate-400">— Stephen, EZ Help Technology</p>
      </section>
    </div>
  );
}
