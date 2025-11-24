import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load FroBot flow definition
const flowPath = path.resolve(__dirname, "../../../frobot/flow.json");
let flowConfig = null;
try {
  const raw = fs.readFileSync(flowPath, "utf8");
  flowConfig = JSON.parse(raw);
} catch (e) {
  console.error("Failed to load FroBot flow.json", e.message);
}

function getStepConfig(id) {
  if (!flowConfig || !flowConfig.flow) return null;
  return flowConfig.flow.find((s) => s.id === id) || null;
}

router.post("/", (req, res) => {
  const { step, payload } = req.body || {};
  const current = getStepConfig(step || "welcome") || getStepConfig("welcome");

  // In a real build, you would incorporate payload into dynamic AI prompts.
  // Here we just echo back the next step + the static prompt.
  const nextStepId = current.next || "done";
  const nextStep = getStepConfig(nextStepId);

  res.json({
    step: nextStepId,
    reply: nextStep ? nextStep.prompt : "We’re done. It’s EZ Help Technology."
  });
});

export default router;