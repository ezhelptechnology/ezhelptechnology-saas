export default function CancelPage() {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Payment cancelled</h1>
          <p className="text-slate-300">
            Your card was not charged. You can try again anytime.
          </p>
          <a
            href="/pricing"
            className="inline-flex mt-4 px-4 py-2 rounded-lg bg-white text-black font-semibold"
          >
            Back to pricing
          </a>
        </div>
      </main>
    );
  }
  