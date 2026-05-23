# Development Log

## Initialization
- **Framework Choice**: Opted for Next.js 15 App Router. The ecosystem maturity, Server Actions for form handling, and built-in optimization make it the perfect choice for a fast MVP.
- **Styling**: Tailwind + `shadcn/ui`. Selected a minimal, high-contrast theme resembling Vercel to signal technical competence and financial trust.
- **Database**: Supabase. It allows us to ship a full backend without the overhead of maintaining an ORM and migration scripts for a simple MVP lead-capture table.

## Architecture Decisions
- **Deterministic Audit Engine**: Explicitly avoided using LLMs for the financial calculations. The risk of hallucinating savings is too high and would destroy trust instantly. All calculations (e.g., "Cursor Pro vs ChatGPT Enterprise") are hardcoded heuristics mapped to specific personas and team sizes.
- **AI Summary**: Used Anthropic (Claude) purely for the *qualitative* summary of the deterministic data. It provides the "magic" personalization without compromising the integrity of the math.

## Iteration 1 (MVP Scope)
1. **Landing Page**: Built for immediate value delivery. No signup wall.
2. **Audit Flow**: A clean, accessible form leveraging Zod for robust validation.
3. **Report Generation**: The viral hook. Visually striking, shareable via URL, obscuring PII.
4. **Lead Capture**: Progressive disclosure. If savings are massive, we gate the deepest insights or push hard for a consultation.

## Future Considerations
- Migrate hardcoded pricing into a headless CMS or Supabase table once pricing models become too volatile.
- Add OAuth (Google/GitHub) if we pivot from an open lead-gen tool to a persistent dashboard for continuous monitoring.
