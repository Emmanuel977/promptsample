// A minimal example of the feature this repo is "shipping": a support
// agent that replies to a customer message and decides whether to escalate.
//
// This file is here to make promptsample look like a real product repo —
// the thing promptcheck is actually testing is the prompt template in
// prompts/support-agent.txt, via the suite configured on the promptcheck
// dashboard (not this script directly). Wire up a real ANTHROPIC_API_KEY
// or OPENAI_API_KEY to make this runnable end-to-end.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadPromptTemplate() {
  return readFileSync(join(__dirname, "..", "prompts", "support-agent.txt"), "utf8");
}

function buildPrompt(customerMessage) {
  return loadPromptTemplate().replace("{{message}}", customerMessage);
}

async function replyToCustomer(customerMessage) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Set ANTHROPIC_API_KEY to actually run this against Claude. " +
        "(The CI regression check doesn't need this — it calls your promptcheck " +
        "suite directly, which uses the provider configured there.)"
    );
  }

  const prompt = buildPrompt(customerMessage);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Anthropic API error (${res.status}): ${await res.text()}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text ?? "";
  return JSON.parse(text);
}

// Demo run when invoked directly: `npm start`
if (import.meta.url === `file://${process.argv[1]}`) {
  const sampleMessage = process.argv[2] ?? "This is the third time my order hasn't arrived. I want a refund.";
  console.log("Customer message:", sampleMessage);
  const result = await replyToCustomer(sampleMessage);
  console.log("Agent response:", result);
}

export { buildPrompt, replyToCustomer };
