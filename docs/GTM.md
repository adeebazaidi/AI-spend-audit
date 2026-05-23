# Go-To-Market (GTM) Strategy

## Phase 1: The "Free Utility" Play
The MVP is designed to be a highly viral free utility: **The AI Spend Audit**.
- **Launch Venue**: Product Hunt, Hacker News, Twitter.
- **Hook**: "Startups are wasting 40% of their AI budget. Run a free audit to see your overlap."
- **Mechanism**: The output of the audit is a beautiful, redacted report URL (`/report/xyz`). We encourage users to share this on social media ("I just cut $12k in ARR using Spendwise AI").

## Phase 2: Lead Gen & Outbound
The Free Audit is a Trojan Horse for our core business.
- **Trigger**: When a company completes an audit and >$1,000 in monthly savings is identified.
- **Action**: We gate the detailed execution plan behind an email capture.
- **Outbound**: Our sales team receives the lead (via Supabase webhooks) and reaches out offering to handle the migration/renegotiation for a fee.

## Phase 3: The Dashboard Pivot
Once we have 500+ startups using the audit, we pivot to offering a persistent dashboard.
- Integrate with Ramp/Brex APIs to monitor AI spend automatically.
- Upsell our bulk-purchased API credits at a margin.
