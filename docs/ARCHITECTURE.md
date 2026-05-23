# Architecture

## Philosophy
The Spendwise AI Spend Audit MVP is designed for maximum velocity, trustworthiness, and maintainability. We eschew over-engineered microservices and complex state management in favor of boring, reliable, and scalable patterns.

## Tech Stack
- **Framework**: Next.js 15 App Router
  - *Why*: Built-in server actions simplify form handling and API integrations, removing the need for a separate backend. Excellent SEO out of the box.
- **Language**: TypeScript
  - *Why*: Strict typing for the financial audit engine is non-negotiable. It prevents runtime errors during complex tier evaluations.
- **Styling**: Tailwind CSS + shadcn/ui
  - *Why*: Allows rapid construction of highly polished, accessible, B2B-ready components without fighting a heavy component library.
- **State Management**: React Hook Form + Zod
  - *Why*: Complex, multi-step localized state for the audit form requires a robust, schema-driven approach.
- **Database**: Supabase
  - *Why*: Postgres under the hood, instant API, and minimal ops overhead. Ideal for an MVP capturing leads and storing report states.
- **Testing**: Vitest
  - *Why*: Fast, native TypeScript support for heavily unit-testing the deterministic audit engine.

## Component Boundaries
Our `src/components` directory is strictly partitioned:
- `/audit`: Components specific to the input forms and report rendering.
- `/forms`: Generic, reusable form elements (inputs, selects, wrappers).
- `/layout`: Navigation, footers, containers.
- `/marketing`: Landing page sections (hero, features, social proof).
- `/shared`: Cross-cutting atoms (buttons, badges, icons).

## The Audit Engine
The core value driver of Spendwise AI is the `audit-engine` (`src/lib/audit-engine.ts`).
- **Input**: A normalized array of current tools, spending, and seats.
- **Rules**: Hardcoded, deterministically evaluated heuristics (e.g., "If `useCase === 'coding'` and `seats < 5` and `tool === 'ChatGPT Enterprise'`, recommend downgrading to `ChatGPT Plus` or `Cursor`").
- **Output**: A structured report object detailing overspend, recommendations, and localized reasoning.
- *Tradeoff*: Hardcoded pricing requires manual updates when OpenAI/Anthropic change pricing. This is an acceptable MVP tradeoff compared to building a complex headless CMS for pricing tiers.

## AI Summary Pipeline
We use Anthropic (Claude 3.5 Sonnet) to add a layer of personalization.
- **Pattern**: Server Action triggers the API call.
- **Resilience**: The system gracefully falls back to a deterministic string if the API fails, times out, or rate-limits. We do not block the core financial audit on an LLM call.

## Security & Lead Capture
- Value is shown *progressively*.
- The shareable URL (`/report/[id]`) strips PII (Personal Identifiable Information) like email or company name, showing only the aggregated metrics and recommendations.
- Rate limiting is applied to the report generation endpoint to prevent abuse and API exhaustion.
