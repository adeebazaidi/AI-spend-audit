# North Star Metrics

## The Single Metric That Matters

> **Weekly audits with ≥$500/mo identified savings**

This number proxies everything:
- **Product quality** — the engine is finding real, actionable waste (not noise)
- **ICP accuracy** — we're reaching companies big enough to be wasting money
- **Funnel health** — people are completing the form, not bouncing

Every other metric below is a diagnostic on *why* this number is or isn't moving.

---

## Acquisition Metrics

### 1. Audit Start Rate
- **Definition**: % of landing page visitors who click "Run Free Audit"
- **Target**: >25%
- **Diagnostic**: Low rate = hero copy isn't connecting, or savings stat is not credible. A/B test the headline savings number and social proof placement.

### 2. Audit Completion Rate
- **Definition**: % of visitors who land on `/audit` and submit the form
- **Target**: >60%
- **Diagnostic**: Low rate = form is too complex. Instrument each field for drop-off. The most likely culprit is "Monthly Spend" — users don't know their exact spend. Add helper text with per-seat pricing reference.

---

## Activation Metrics

### 3. Median Identified Savings
- **Definition**: P50 of `monthlySavings` across all submitted audits
- **Target**: >$150/mo ($1,800/yr)
- **Diagnostic**: If median is too low (<$50/mo), we're acquiring freelancers and indie hackers rather than startups. Double down on B2B channels (LinkedIn, HN). If median is too high, consider whether our ICP is wasting at an institutional level — that's a consulting opportunity, not a product one.

### 4. Savings Distribution
- Track P25, P75, P95 of `monthlySavings` weekly
- **Why**: P95 outliers (>$2,000/mo) are high-value consulting leads and should receive a personal Calendly email within 24 hours. P25 <$50/mo users should receive a "99% Optimised" badge to encourage social sharing.

---

## Conversion Metrics

### 5. Lead Capture Rate
- **Definition**: % of users with `annualSavings > $500` who submit their email
- **Target**: >30%
- **Diagnostic**: Low rate = the value proposition of the execution plan is weak. Test copy variants. "Step-by-step migration guide" vs. "Vendor renegotiation script" vs. "CFO-ready savings report PDF".

### 6. Lead-to-Consultation Rate
- **Definition**: % of captured leads who book a 15-min consultation call
- **Target**: >15%
- **Diagnostic**: Low rate = outreach email is too salesy. First outreach must reference the specific tool and exact dollar figure from their audit. Generic emails will fail.

---

## Virality Metrics

### 7. Report Share Rate
- **Definition**: % of completed audits where the report URL is opened from a different IP/device (proxy for "was this shared?")
- **Target**: >10%
- **Diagnostic**: Low rate = report isn't impressive enough to share. Ensure the savings number is the first thing visible. Consider adding a one-click "Share on Twitter" button pre-filled with their savings number.

### 8. k-factor
- **Definition**: `(new users from shared reports) / (total reports shared)` — measured weekly
- **Target**: >0.2
- **Why this matters**: At k>0.2, paid acquisition becomes optional. At k>0.5, growth becomes self-sustaining. Reaching k>1 is the Product Hunt dream. The report URL is our primary vector for achieving this.

---

## Infrastructure Metrics

### 9. Audit Engine Accuracy Disputes
- **Definition**: % of users who contact us claiming our savings estimate is wrong
- **Target**: <2%
- **Diagnostic**: Any dispute rate above 2% means a pricing source is stale or a rule has a bug. Review `PRICING_DATA.md` last-verified dates weekly.

### 10. Report Generation p99 Latency
- **Definition**: p99 time from form submission to report display
- **Target**: <3 seconds (including AI summary generation)
- **Diagnostic**: The deterministic audit itself runs in <5ms. Any latency is attributable to Anthropic API or Supabase writes. If p99 exceeds 3s, implement a streaming AI summary response pattern.

---

## Reporting Cadence

| Metric | Frequency | Owner |
|---|---|---|
| Weekly audits w/ >$500 savings | Daily (during launch) | Founder |
| Lead capture rate | Weekly | Founder |
| Median identified savings | Weekly | Engineering |
| Report share rate | Weekly | Marketing |
| Engine accuracy disputes | Weekly | Engineering |
| p99 report latency | Real-time (Vercel dashboard) | Engineering |
