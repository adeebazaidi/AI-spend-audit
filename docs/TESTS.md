# Testing Strategy

## Core Philosophy
We do not write tests for standard React UI rendering in the MVP phase. Visual bugs are caught manually.
However, **we heavily unit test the `audit-engine`**. The credibility of the entire company rests on the financial math being 100% accurate and defensible. If we tell a CFO they can save $5,000, the math behind that number must be flawless.

## Framework
- **Vitest**: Chosen for speed and native TypeScript support.

## Test Suites
1. **Redundancy Tests**: Verifying that overlapping tools (e.g., Cursor + Copilot) trigger consolidation recommendations.
2. **Enterprise Overkill Tests**: Ensuring that teams below the threshold for enterprise plans are downgraded to Pro/Team equivalents.
3. **Minimum Seat Checks**: Ensuring tools like Claude Team (minimum 5 seats) are penalized if used by 3 people.
4. **Already Optimized State**: If a team of 3 is using ChatGPT Plus ($20) and nothing else, the engine must return $0 savings and commend them.

## Running Tests
```bash
npm run test
```
