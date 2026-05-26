# Testing Strategy

## Philosophy

The entire credibility of Spendwise AI rests on one thing: **the math being right**. If we tell a CTO they can save $14,400/year and the number is wrong, the consulting lead evaporates and the company reputation is gone. We don't test UI rendering. We test financial logic obsessively.

This asymmetry is deliberate. Visual bugs get caught in QA. Mathematical errors in financial products result in customer churn, refund demands, and loss of trust that can't be recovered.

---

## Framework

- **Vitest 4.x** — chosen for native TypeScript support and near-instant HMR in watch mode during TDD cycles.
- **No React Testing Library** for audit logic — the audit engine is a pure function. Pure functions should be tested with pure assertions, not rendered components.

---

## Test Suites

### Rule 1: Cursor + GitHub Copilot Overlap
- ✅ Flags redundancy when Cursor Pro is active alongside any Copilot plan
- ✅ Does NOT flag when Cursor is on Free tier (insufficient coverage to replace Copilot)
- ✅ Correctly attributes full Copilot monthly spend as savings

### Rule 2: Cursor + Windsurf Overlap
- ✅ Identifies dual IDE AI assistant subscriptions as pure duplication
- ✅ Recommends dropping the more expensive of the two
- ✅ Savings equals the full monthly spend of the dropped tool

### Rule 3: ChatGPT + Claude Chat Redundancy
- ✅ Flags dual chat subscriptions for `coding`, `writing`, and `data` use cases
- ✅ Does NOT flag for `research` or `mixed` — these teams legitimately use both models for output comparison
- ✅ Recommends consolidating onto the cheaper plan

### Rule 4: Claude Team Minimum-Seat Trap
- ✅ Flags when `seats < 5` on Claude Team (Anthropic enforces 5-seat billing minimum)
- ✅ Calculates exact savings: `(team_seats × $30) − (team_seats × $20)`
- ✅ Does NOT flag when seats ≥ 5 (legitimate Team usage)

### Rule 5: Enterprise Overkill (<50 seats)
- ✅ Flags Enterprise plan for teams below 50 seats across all supported tools
- ✅ Recommends downgrading to the most cost-effective available tier (Team or Pro)
- ✅ Skips tools already covered by a more specific rule

### Rule 6: API vs. UI Plan Overlap
- ✅ Flags Claude.ai subscription when Anthropic API is already paid (small team, <4 seats)
- ✅ Flags ChatGPT Plus when OpenAI API is already paid (small team, <4 seats)
- ✅ Uses conservative 60% savings estimate (accounts for API usage variance)

### Rule 7: v0 Right-Sizing for Engineering Teams
- ✅ Flags when v0 seats exceed 20% of total team size on a coding-primary team
- ✅ Does NOT flag proportional seat allocations (1 seat on 10-person team is valid)
- ✅ Calculates right-sized seat count as `ceil(teamSize × 0.2)`

### Arithmetic Integrity (Cross-cutting)
- ✅ `annualSavings === monthlySavings × 12` — always
- ✅ `totalOptimizedSpend === totalCurrentSpend − monthlySavings` — always
- ✅ `sum(savingsBreakdown[].amount) === monthlySavings` — always
- ✅ Fully-optimized state returns `$0` savings and a `"keep"` recommendation type

---

## Running Tests

```bash
npm run test
```

Expected output:
```
✓ tests/audit-engine.test.ts (16 tests) ~15ms
Test Files  1 passed (1)
    Tests  16 passed (16)
```

---

## What We Don't Test (and Accept That Risk)

| Area | Why Untested |
|---|---|
| UI rendering | Caught manually; visual regressions are acceptable in MVP |
| Supabase DB writes | Integration tested via Supabase dashboard; mocking adds no value at MVP scale |
| Anthropic API call | Tested manually with real key; mocking a non-deterministic API adds noise |
| URL encoding fallback | Manual smoke test on form submission; pure browser behaviour |

We will add integration tests (Playwright) and API mocking (MSW) once the product reaches 10 paying customers and the codebase stabilises.
