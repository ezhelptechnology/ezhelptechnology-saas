"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessComponent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div style={{ padding: 40 }}>
      <h1>Payment Successful 🎉</h1>
      <p>Your session ID:</p>
      <p style={{ fontWeight: "bold" }}>{sessionId}</p>
      <p>Welcome to EZ Help Technology SaaS.</p>
    </div>
  );
}
