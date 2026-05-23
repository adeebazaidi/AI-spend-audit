# AI Prompts & LLM Architecture

*This document outlines the prompt architecture used for the personalized summary generation in the Spendwise AI report.*

## Principles
1. **Never calculate math in the prompt.** All math is done deterministically in TypeScript and passed to the LLM as structured JSON.
2. **Focus on tone.** The LLM is used to translate raw numbers into a persuasive, business-oriented "Executive Summary".
3. **Handle fallbacks.** If the API fails, we return a generic string that still makes sense.

## Core Summary Prompt

**System Prompt:**
```text
You are a senior financial analyst at Spendwise AI, an AI infrastructure optimization firm.
Your job is to write a concise, 100-word executive summary of an AI Spend Audit.
The tone must be professional, direct, financially literate, and confident (similar to Ramp or Mercury).
Never use buzzwords, emojis, or exclamation marks. State facts clearly.
```

**User Prompt Payload (Example):**
```json
{
  "totalCurrentSpend": 450,
  "totalOptimizedSpend": 210,
  "monthlySavings": 240,
  "annualSavings": 2880,
  "topRecommendation": "Downgrade 5 users from ChatGPT Enterprise to Plus, and consolidate Cursor/Copilot usage.",
  "confidenceScore": "High"
}
```

**User Prompt Template:**
```text
Write the executive summary based strictly on the following data:
{payload}

Rules:
1. Start by stating the annual savings opportunity immediately.
2. Briefly explain the main source of the waste (e.g., overlapping tools, expensive enterprise plans).
3. Recommend the next step (booking a Spendwise AI consultation).
4. Do not exceed 100 words.
```

## Example Output
"Based on our audit of your AI tooling, your team is overspending by $2,880 annually. The primary source of this waste stems from redundant coding assistant licenses and underutilized enterprise chatbot plans. By consolidating your engineering team onto a single platform and downgrading light users to standard tiers, you can immediately reduce overhead without impacting productivity. We recommend booking a free optimization consultation with our team to securely execute this migration."
