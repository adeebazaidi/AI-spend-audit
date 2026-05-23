# Project Reflection

## Architectural Tradeoffs
1. **Hardcoded Pricing vs DB-Driven Pricing**: For the MVP, hardcoding pricing in TypeScript (`src/lib/pricing.ts`) was chosen over building a CMS or database schema. This maximizes shipping velocity and allows for static type checking across the application, preventing runtime errors. The tradeoff is that an engineer must deploy code when OpenAI changes their pricing. This is an acceptable MVP tradeoff.
2. **Deterministic Rules vs LLM Processing**: The core audit engine does not use an LLM for math. Financial analysis demands predictability. Using Claude to process the final structured output provides the "AI magic" without the risk of hallucination.

## What Didn't Make the Cut
- **Automated API Integrations**: We originally considered asking users to OAuth into their AWS or OpenAI accounts to pull actual spend. This was cut because it creates a massive friction point at the top of the funnel. Self-reporting is less accurate, but converts significantly better for a lead-gen tool.

## Lessons Learned
- Creating a shareable, visually impressive report is the hardest part of the UI but the most critical for acquisition. The Vercel/Linear aesthetic (high contrast, minimal color, excellent typography) immediately signals that this is a professional, trustworthy tool rather than a quick wrapper.
