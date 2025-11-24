"use client";

import { useState } from "react";

type Props = {
  label?: string;
  priceId?: string; // optional override
  className?: string;
};

export default function CheckoutButton({
  label = "Subscribe",
  priceId,
  className = "",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout");
      }

      window.location.href = data.url;
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`px-4 py-2 rounded-lg font-semibold bg-black text-white ${
          loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
        } ${className}`}
      >
        {loading ? "Redirecting..." : label}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
