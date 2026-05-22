# Credex: AI Spend Audit & Optimization Engine

Credex is a B2B SaaS application designed to help startups optimize their AI tooling expenditures. It acts as an automated "AI Spend Audit," identifying redundant subscriptions, mismatched plans, and underutilized enterprise licenses across platforms like Cursor, Claude, ChatGPT, GitHub Copilot, and Gemini.

## The Problem
Startups are structurally overspending on AI tooling. Common pitfalls include:
- Buying enterprise plans prematurely for features they don't use.
- Overlapping capabilities (e.g., paying for both Cursor and GitHub Copilot).
- Defaulting to retail subscriptions instead of utilizing API access for light usage.
- Lacking visibility into true ROI and seat utilization.

## The Solution
Credex provides a fast, deterministic audit engine that calculates precise cost-saving opportunities. 
By offering this as a free, highly shareable report, Credex builds immediate trust and captures high-intent leads for our deeper consulting and bulk-credit brokerage services.

## Architecture Overview
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & shadcn/ui
- **State & Validation**: React Hook Form, Zod
- **Database / Lead Capture**: Supabase
- **Transactional Emails**: Resend
- **AI Summary**: Anthropic API (Claude 3.5 Sonnet)

The core `audit-engine` relies on strict, deterministic financial modeling rather than LLM hallucination, ensuring recommendations are realistic, conservative, and defensible.

## Local Development

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Testing
We use Vitest to ensure the mathematical accuracy of our deterministic audit engine.
```bash
npm run test
```

## Project Structure
- `/src/app`: Next.js App Router (marketing, audit form, report views, api routes).
- `/src/components`: UI components organized by feature (audit, forms, layout, marketing, shared).
- `/src/lib`: Core business logic, including `audit-engine`, `pricing` data, and utilities.
- `/docs`: Extensive documentation on GTM strategy, architecture, and economics.

## Ownership & Roadmap
Built with a focus on immediate value delivery, shareability, and mobile-first UX. This MVP is designed to launch on Product Hunt, driving initial viral acquisition and qualifying leads for the Credex core business.
