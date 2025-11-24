// frontend/app/success/page.tsx

import Link from "next/link";

type SuccessPageProps = {
  searchParams?: {
    session_id?: string;
  };
};

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const sessionId = searchParams?.session_id;

  return (
    <div className="space-y-10">
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-10">
        <h1 className="text-4xl font-bold text-ezOrange">
          Payment Successful 🎉
        </h1>

        <p className="mt-4 text-slate-300 text-lg">
          Thank you for purchasing the EZ Help Technology SaaS App Package.
        </p>

        <div className="mt-6">
          <p className="text-slate-400 text-sm">Stripe Session ID:</p>
          <p className="text-slate-200 font-mono mt-1">
            {sessionId ? sessionId : "No session ID provided"}
          </p>
        </div>

        <p className="mt-6 text-slate-400">
          You will receive an onboarding email shortly with next steps.
        </p>

        <Link
          href="/"
          className="inline-block mt-10 px-6 py-3 bg-ezOrange text-black font-semibold rounded-lg hover:bg-orange-400 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
