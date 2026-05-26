# Project Reflection

## What I Was Trying to Prove

This project had one hypothesis at its core: **the audit moment is the product**. Not a dashboard, not integrations, not a long onboarding — just the instant a CTO sees "you are wasting $14,400/year" is the moment they'll trust you. Everything in this codebase was built in service of that moment.

The assignment asked for an MVP, but I built it as if it were a Product Hunt launch. The aesthetic, the shareable URL, the lead capture — these aren't polish on top of a working product. They *are* the product.

---

## Architectural Tradeoffs

### 1. Hardcoded Pricing vs. CMS-driven Pricing

I chose to hardcode pricing in `src/lib/pricing.ts` rather than pull from a CMS or database. This was a deliberate, time-bounded decision:

- **Upside**: Full static type safety. The TypeScript compiler prevents the audit engine from referencing a tool that doesn't have pricing data. Runtime errors in a financial product are unacceptable.
- **Upside**: Zero latency on report generation. No async data fetching in the critical audit path.
- **Downside**: Requires a code deploy when vendors change pricing. This happened with OpenAI's GPT-4o pricing restructure (mid-2024) — a real-world example of the tradeoff.
- **Mitigation**: `PRICING_DATA.md` documents every source with a last-verified date, making updates a 5-minute task for any engineer.

**When to change this**: Once we have 10+ pricing sources to track, migrating to a Supabase table with an admin UI becomes worth the complexity.

### 2. Deterministic Engine vs. LLM-Driven Recommendations

The most important architectural decision in the codebase. Every recommendation in `audit-engine.ts` is a hardcoded heuristic, not an LLM call.

- **Why**: Financial recommendations that change between page loads destroy trust. A CFO who gets a $12,000 savings estimate one day and $8,000 the next from the same data will never hire you for consulting.
- **The tradeoff**: We miss edge cases that a more flexible LLM approach would catch. A team using ChatGPT for fine-tuned models (API) alongside Claude for chat is a nuanced situation our rules can't perfectly handle.
- **The right balance**: LLM is used *only* for the qualitative executive summary — applying language to numbers we've already calculated. The math is never delegated to a model.

### 3. URL-Encoded State vs. Database-Backed Reports

The MVP fallback passes audit context as a base64 string in the URL query parameter. This was Week 1 architecture — it's now been replaced with Supabase-backed report storage with UUID-based URLs. The reasons for keeping the fallback:

- Supabase being misconfigured (missing env vars) should not break the product entirely
- The URL-encoded path lets us validate the full user journey in local dev without a database
- It's a useful escape hatch for demo/sharing purposes without needing a live DB

### 4. Progressive Lead Capture vs. Hard Gate

We show the full savings number before asking for an email. This was debated.

- **Hard gate argument**: Every lead capture optimization playbook says to gate value behind email. Forces conversion.
- **Our argument**: Our ICP (CTO, VP Eng) will immediately close a tab that feels like a bait-and-switch. They've seen enough landing pages. Showing the full number upfront builds the trust that *earns* the email — and the consulting contract downstream.
- **Data point from interviews**: "I don't mind giving my email if I've already seen the tool is legit." — Engineering Manager, Series A

---

## What Didn't Make the Cut (and Why)

### Automated Spend Integrations (Brex/Ramp API)
Pulling actual spend data directly would eliminate self-reporting bias. Cut because:
- OAuth flows and spend API access require procurement approval at target companies
- Adds 3+ weeks of integration work
- Kills top-of-funnel conversion (self-reporting takes 3 minutes; OAuth takes 3 days of approvals)

**Phase 3 item.**

### PDF Report Export
A downloadable PDF would make the report more shareable in Slack and board decks. Cut because:
- React PDF libraries add significant bundle weight
- The shareable URL accomplishes 80% of the same goal
- We can add PDF on demand if users request it (which they will)

### Team-Based Onboarding (Auth)
Adding OAuth (Google/GitHub) would enable persistent dashboards and multi-user accounts. Cut because:
- Any friction before the "aha moment" reduces conversion
- The lead gen model doesn't require persistent auth — an email is sufficient
- Auth complexity would triple the codebase for zero MVP benefit

---

## Lessons Learned

**The hardest engineering problem was the easiest-looking one**: making the recommendations feel *specific*, not generic. "Consider downgrading" is useless. "You are paying $150/mo for Claude Team with 3 users. The minimum is 5. Switch to Claude Pro × 3 = $60/mo. That's $90/mo you're currently burning." is a product.

The gap between those two sentences is where the real audit engine work lives — in understanding the pricing mechanics well enough to write rules that would survive a CFO's scrutiny.
