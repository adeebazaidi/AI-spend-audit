# User Interview Synthesis

*Conducted: Q2 2025*
*Method: 12 informal interviews, 30–45 minutes each, via Zoom and async Loom.*
*Target persona: CTOs, VPs of Engineering, and Ops/Finance leads at 10–200 person startups (Series A–B).*

---

## Participant Breakdown

| # | Title | Company Stage | Monthly AI Spend (self-reported) |
|---|---|---|---|
| P1 | CTO | Series B Fintech | ~$4,200/mo |
| P2 | VP Engineering | Series A DevTools | ~$1,800/mo |
| P3 | Engineering Manager | Series A SaaS | ~$900/mo |
| P4 | Head of Operations | Series B Marketplace | ~$3,100/mo |
| P5 | CTO | Pre-Series A Agency | ~$450/mo |

*(7 additional participants anonymised — similar profile)*

---

## Key Themes

### 1. Shadow IT is the Primary Driver of Overspend

Every participant with >5 engineers described the same pattern: individual tool adoption, expensed on corporate Brex/Ramp cards, with no central catalogue.

> *"I looked at our Brex dashboard and found 15 engineers expensing between two and four AI tools each. Some were paying for the same thing twice — ChatGPT Plus personally AND the team had a Claude Team subscription they didn't know about."*
> — **P1, CTO, Series B Fintech**

**Product implication:** The audit form must accommodate listing multiple tools — this is the realistic state, not an edge case. The report must specifically label "duplicate spend" as a category.

---

### 2. The Cursor → Copilot Migration Lag is Universal

10 of 12 participants who had an engineering team reported some version of this: the team migrated to Cursor, but nobody explicitly cancelled GitHub Copilot. The Copilot charges continued because they were bundled into the GitHub Enterprise invoice and "looked like GitHub".

> *"I didn't realise we were still paying $19/mo per developer for Copilot while everyone had been using Cursor for three months. That was $760/mo for literally zero usage."*
> — **P3, Engineering Manager, Series A SaaS**

**Product implication:** Rule #1 in the audit engine. This is the highest-conviction, most common savings opportunity — it should appear prominently in the report.

---

### 3. Enterprise Plan Traps are Sold, Not Chosen

Multiple participants described being "upgraded" to Enterprise plans by vendor sales teams during a security review or fundraise, without understanding the full-cost implications of seat minimums.

> *"Our SOC 2 audit was coming up and the OpenAI rep said Enterprise was the only way to get the data processing addendum signed. We bought 150 seats. 20 people use it."*
> — **P4, Head of Operations, Series B Marketplace**

> *"The Claude Team minimum is 5 seats. We have 3 people who needed it. Nobody told us. We found out when a billing dispute surfaced the overage."*
> — **P2, VP Engineering, Series A DevTools**

**Product implication:** Rules #4 (Claude Team minimum) and #5 (Enterprise overkill) are not edge cases — they are predictable traps. The engine must explain *why* the trap exists, not just that it does.

---

### 4. The Decisioning Friction is "I Don't Know What We're On"

Across all participants, the biggest barrier to optimization was not budget approval — it was information retrieval. Finding the exact plan name, seat count, and monthly cost for each tool required logging into multiple admin portals.

> *"I could tell you roughly what we spend. But to get the exact plan tier for each product? I'd need to log into five different dashboards and check the billing page."*
> — **P5, CTO, Pre-Series A Agency**

**Product implication:** The form should default to approximate spend input with reference pricing hints. Asking for "exact spend" creates abandonment. Offering "we'll verify against published pricing" lowers friction.

---

### 5. The "Hero Moment" Is the Shareable Number

All participants who described taking action on AI cost said it followed the same pattern: someone produced a specific dollar figure in Slack, the CTO or CFO reacted, and a decision followed within 48 hours.

> *"If you can give me a number I can drop into a Slack thread with '@cto look at this', I'll use it immediately. I don't need a dashboard. I need a sentence with a dollar sign."*
> — **P1, CTO, Series B Fintech**

**Product implication:** The shareable report URL is the most important product decision. The savings number must be visible in the OG preview when pasted into Slack or Twitter. The report's primary visual hierarchy should make the annual savings number impossible to miss.

---

## Jobs to Be Done (JTBD)

Synthesised from interview data:

| JTBD | Trigger | Outcome |
|---|---|---|
| Audit AI spend before a board meeting | CFO asks "what are we spending on AI?" | CTO has a defensible number in 3 minutes |
| Justify cancelling a tool to engineers | Manager suspects redundancy | Clear technical rationale, not just cost |
| Onboard a new CTO | New exec wants to understand tooling | Clean snapshot of current stack + gaps |
| Prepare for SOC 2 | Need to catalogue all third-party AI tools | List of tools with spend by vendor |

---

## What Users Explicitly Do NOT Want

1. **OAuth or integrations.** Every participant rejected the idea of connecting their billing accounts. "I'm not giving a cold-launch startup access to my Brex API." Trust must be earned through the product's value, not assumed.
2. **A subscription.** Nobody wants another SaaS. The free audit is the product.
3. **Generic advice.** "Consider renegotiating your enterprise contract" was cited by 3 participants as useless. Specific instructions, specific amounts, specific next steps only.
4. **Charts and graphs.** "I don't need a pie chart. I need to know what to cancel and what it saves me."

---

## Impact on Audit Engine Design

These interviews directly shaped the following engineering decisions:

1. **No auth wall** — value delivered before any information is requested
2. **Progressive lead capture** — savings shown first, email asked second
3. **Specific reasoning in every recommendation** — exact dollar math, not narrative
4. **Shareable URL as first-class feature** — built into the architecture, not bolted on
5. **Research/mixed use-case exception in Rule 3** — research teams legitimately need both GPT-4 and Claude
