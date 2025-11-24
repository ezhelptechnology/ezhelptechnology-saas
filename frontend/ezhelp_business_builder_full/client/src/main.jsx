import React, { useState } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [step, setStep] = useState("welcome");
  const [input, setInput] = useState("");
  const [log, setLog] = useState([
    { from: "frobot", text: "Hey! I’m FroBot — your Personal AI Business Builder. It’s EZ Help Technology." }
  ]);

  async function send() {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setLog((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");

    try {
      const res = await fetch("http://localhost:4000/api/frobot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step, payload: { message: userMessage } })
      });
      const data = await res.json();
      setStep(data.step || step);
      setLog((prev) => [...prev, { from: "frobot", text: data.reply }]);
    } catch (err) {
      setLog((prev) => [...prev, { from: "frobot", text: "Connection error to API." }]);
    }
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>EZ Help Business Builder</h1>
      <p style={{ color: "#f97316", fontWeight: "bold" }}>It’s EZ Help Technology.</p>
      <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "12px", minHeight: "300px" }}>
        {log.map((m, i) => (
          <div key={i} style={{ marginBottom: "8px", textAlign: m.from === "user" ? "right" : "left" }}>
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "999px",
                background: m.from === "user" ? "#2563eb" : "#f3f4f6",
                color: m.from === "user" ? "#fff" : "#111827",
                fontSize: "14px"
              }}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
        <input
          style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ddd" }}
          placeholder="Type to FroBot..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          onClick={send}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            background: "#f97316",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);