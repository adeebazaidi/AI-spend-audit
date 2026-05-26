# Go-To-Market (GTM) Strategy

## Overview

Spendwise AI enters the market as a **free, high-utility audit tool** — not a product that requires a sales cycle to prove value. The GTM playbook is built on one insight from user interviews: CTOs and finance leads will only buy a cost-optimization product if the tool *demonstrates* the savings before asking for anything. We earn trust before we earn money.

---

## Phase 1 — Viral Free Utility (Weeks 1–8)

**Goal:** 500 completed audits. 50 captured leads with >$500/mo identified savings.

### Launch Channels

| Channel | Message | Expected CPL |
|---|---|---|
| Product Hunt | "Free AI Spend Audit for Startups" | $0 |
| Hacker News (Show HN) | "I built a tool to detect if your startup is overpaying for AI tooling" | $0 |
| Twitter/X | "We were paying for Cursor AND Copilot for 8 devs. That's $3,700/yr wasted. Found it in 3 minutes with [link]" | $0 |
| LinkedIn (founder-led) | Post the actual savings number from a real audit | $0 |
| Indie Hackers | Founder story post: building in public | $0 |

### The Viral Hook

The output of every audit is a publicly shareable, PII-stripped URL (e.g., `/report/results?id=abc123`). We engineer shareability into the product:
- **Twitter card preview** shows the headline savings number in the OG image
- The report includes a one-click "Share on Twitter" pre-filled with: _"Our AI tooling was 38% redundant. Found $8,400/yr in waste using Spendwise AI — free audit 👇 [link]"_
- Zero-friction share path: no login required to view a shared report

### Content Distribution (owned channels)

- **Email newsletter**: Weekly "AI Tooling Waste Report" — aggregate anonymised data from audits run that week. Compounds into SEO and trust.
- **SEO content**: Target queries like "Cursor vs GitHub Copilot for teams", "Claude Team pricing worth it", "ChatGPT Enterprise minimum seats"

---

## Phase 2 — Lead Capture & Outbound (Weeks 4–16)

**Goal:** Convert 10% of high-savings audits (>$500/mo) into consulting pipeline.

### Progressive Disclosure Model

1. The **free report** shows the identified savings + top-level recommendations — no gate.
2. The **execution plan** (step-by-step migration guide, procurement email templates) is gated behind an email capture.
3. Users with >$1,000/mo identified savings receive an automatic Calendly-linked email from the founder offering a free 15-minute "savings call."

### Outbound Trigger

When a lead submits their email with $500+/mo identified savings, a Supabase webhook fires to notify the sales team (Slack message + CRM entry). The outreach email is personalised with the specific dollar figure and tool recommendations from their audit.

### Target Persona (ICP)

- **Title**: CTO, VP of Engineering, Head of Finance, or Operations Lead
- **Company**: 10–200 person startup, Series A or B
- **Signal**: AI tooling line item >$2,000/mo on corporate card (Brex/Ramp)
- **Pain**: No centralised visibility into who is using what; organic tool sprawl

---

## Phase 3 — Platform Pivot (Month 4+)

**Unlock condition:** 500+ audits completed, 3+ paid consulting clients.

### The Dashboard Product

Once we have proof of the problem at scale, we launch **Spendwise Continuous** — a persistent monitoring dashboard that:
- Integrates with Brex / Ramp / Mercury spend data via API
- Monitors AI subscription line items automatically
- Sends monthly "Drift Alerts" when new redundancy is detected

**Pricing**: $199/mo per organisation (or 15% of annual savings identified, whichever is higher)

### Credit Brokerage

We negotiate bulk inference credits from Anthropic/OpenAI at volume discounts, resell to mid-market clients at a 20–30% margin via a unified usage control plane. This creates a recurring hardware-margin business layered on top of the SaaS platform fee.

---

## North Star KPI

> **Weekly Audits with >$500 identified savings** — the single number that proxies both product quality (are we finding real waste?) and GTM health (are we reaching the right companies?).
