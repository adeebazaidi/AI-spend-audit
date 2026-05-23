# AI Tooling Pricing Data (Q2 2024)

*This file acts as the source of truth for the deterministic audit engine. Any changes to vendor pricing must be reflected here and in the corresponding `src/lib/pricing/index.ts` file.*

## 1. Coding Assistants

### Cursor
- **Pro**: $20/user/month
- **Enterprise**: $40/user/month (requires 10+ seats)
- *Heuristic*: Teams < 10 using Enterprise are overpaying or on a legacy plan. Teams paying for both Cursor Pro and GitHub Copilot are redundantly spending $10-$20/mo.

### GitHub Copilot
- **Individual**: $10/user/month
- **Business**: $19/user/month
- **Enterprise**: $39/user/month
- *Heuristic*: If primary use case is `coding` and they are using ChatGPT Enterprise + GitHub Copilot, they could likely consolidate to just Cursor for $20/mo and save significantly.

## 2. General LLM Chat

### ChatGPT (OpenAI)
- **Plus**: $20/user/month
- **Team**: $25/user/month (billed annually, min 2 seats), or $30/user/month billed monthly.
- **Enterprise**: Custom pricing (assume ~$60/user/month with minimums).
- *Heuristic*: Small teams (< 5) on Enterprise are drastically overspending. Individual users on Team are impossible without paying for 2 seats ($50-60/mo), so they should downgrade to Plus.

### Claude (Anthropic)
- **Pro**: $20/user/month
- **Team**: $30/user/month (min 5 seats).
- *Heuristic*: If a team of 3 is using Claude Team, they are paying for 5 seats ($150/mo) but only using 3. Downgrading to Pro saves $90/mo.

### Gemini (Google)
- **Advanced**: $20/user/month (includes Google One 2TB)
- **Enterprise**: $30/user/month (requires Workspace).

## 3. API & Infrastructure

### OpenAI API
- Heavy text generation vs UI use.
- *Heuristic*: If a single user is spending > $100/mo on ChatGPT Plus and API for "writing", they should probably use just the API and a bring-your-own-key frontend (like TypingMind) to save 50%.

## Overlap Penalties
- **The LLM Tax**: Paying for ChatGPT Plus ($20) + Claude Pro ($20) + Gemini Advanced ($20). Suggesting consolidation to a platform like Poe ($20) or picking one primary tool saves $40/mo per user.
