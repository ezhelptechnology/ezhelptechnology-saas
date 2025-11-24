import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple health route
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "EZ Help Business Builder API" });
});

// Stub FroBot route
app.post("/api/frobot", (req, res) => {
  const { step, payload } = req.body || {};
  let reply = "Hey, I'm FroBot. It's EZ Help Technology.";
  if (step === "welcome") {
    reply = "Hey! I’m FroBot — your Personal AI Business Builder. Let’s build your business in a few simple steps.";
  } else if (step === "business_name") {
    reply = "Great name! Now tell me in one simple sentence what your business does.";
  } else if (step === "business_description") {
    reply = "Got it. Which industry does that fit best? For example: Beauty, Fitness, Real Estate, Trucking, Retail, Services, Parenting, Finance, or Other.";
  }
  res.json({ reply, step });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});