# Spendwise AI Economics

## The Business Model

Spendwise AI is a B2B SaaS tool and lead-generation mechanism. We do not charge users for the "AI Spend Audit."
Instead, our revenue comes from two primary channels after we prove value via the free audit:

### 1. Consulting & Optimization Services
- **Target**: Startups with >$1,000/mo in AI spend.
- **Offering**: A white-glove service to renegotiate enterprise contracts, configure SSO, and migrate users from inefficient retail plans to aggregated enterprise/team plans.
- **Pricing**: 20% of the first year's realized savings, or a flat $2,000 retainer.

### 2. Credit Brokerage & Reselling (Future Phase)
- **Target**: Mid-market companies with >$5,000/mo spend.
- **Offering**: We purchase bulk inference (e.g., from Anthropic/OpenAI) and resell it alongside a unified control plane.
- **Pricing**: Standard SaaS margin on usage + flat platform fee.

## Unit Economics of the MVP
The "Cost of Goods Sold" (COGS) for generating one Audit Report:
- **Compute**: Vercel Serverless Function execution (~$0.0001 per run).
- **Database**: Supabase write for Lead Capture (Negligible).
- **AI Summary**: 1 API call to Claude 3.5 Sonnet (~100 output tokens, ~500 input tokens) = ~$0.0025 per report.
- **Transactional Email**: Resend API call (~$0.001 per email).

**Total COGS per Audit**: ~$0.003 - $0.004

Given a Customer Acquisition Cost (CAC) of $0 through viral/organic sharing of the report URLs, and an exceptionally low COGS, Spendwise AI can afford to process 10,000 audits ($40) to acquire a single high-ticket consulting lead ($2,000+ LTV), making the unit economics immensely profitable.

## Value Capture Strategy
1. Provide a massive "Aha!" moment instantly (the deterministic savings number).
2. Gate the deepest insights or the "Action Plan" behind an email capture.
3. Funnel users with >$500/mo savings directly to a Calendly link for a consultation.
4. Encourage users with low savings to share their "99% Optimized" badge on Twitter/LinkedIn, driving top-of-funnel awareness.
