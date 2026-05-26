import { describe, it, expect } from "vitest";
import { runAudit, AuditContext } from "../src/lib/audit-engine";

// ─────────────────────────────────────────────
// RULE 1 — Cursor + GitHub Copilot overlap
// ─────────────────────────────────────────────
describe("Rule 1: Cursor + GitHub Copilot overlap", () => {
  it("should recommend eliminating Copilot when Cursor Pro is present", () => {
    const ctx: AuditContext = {
      teamSize: 5,
      primaryUseCase: "coding",
      tools: [
        { tool: "Cursor", plan: "Individual/Pro", monthlySpend: 100, seats: 5 },
        { tool: "GitHub Copilot", plan: "Team", monthlySpend: 95, seats: 5 },
      ],
    };
    const result = runAudit(ctx);
    expect(result.monthlySavings).toBe(95);
    const rec = result.recommendations.find((r) => r.id === "rec-cursor-copilot-overlap");
    expect(rec).toBeDefined();
    expect(rec?.type).toBe("consolidate");
    expect(rec?.tool).toBe("GitHub Copilot");
    expect(rec?.newPlan).toBe("None");
  });

  it("should NOT flag Copilot if Cursor is on Free plan (may not fully replace)", () => {
    const ctx: AuditContext = {
      teamSize: 3,
      primaryUseCase: "coding",
      tools: [
        { tool: "Cursor", plan: "Free", monthlySpend: 0, seats: 3 },
        { tool: "GitHub Copilot", plan: "Individual/Pro", monthlySpend: 30, seats: 3 },
      ],
    };
    const result = runAudit(ctx);
    const rec = result.recommendations.find((r) => r.id === "rec-cursor-copilot-overlap");
    expect(rec).toBeUndefined();
  });

  it("should return 0 savings when only Cursor is present (no redundancy)", () => {
    const ctx: AuditContext = {
      teamSize: 3,
      primaryUseCase: "coding",
      tools: [
        { tool: "Cursor", plan: "Individual/Pro", monthlySpend: 60, seats: 3 },
      ],
    };
    const result = runAudit(ctx);
    expect(result.monthlySavings).toBe(0);
    expect(result.recommendations[0].type).toBe("keep");
  });
});

// ─────────────────────────────────────────────
// RULE 2 — Cursor + Windsurf overlap
// ─────────────────────────────────────────────
describe("Rule 2: Cursor + Windsurf overlap", () => {
  it("should recommend dropping the more expensive of the two", () => {
    const ctx: AuditContext = {
      teamSize: 4,
      primaryUseCase: "coding",
      tools: [
        { tool: "Cursor", plan: "Individual/Pro", monthlySpend: 80, seats: 4 },
        { tool: "Windsurf", plan: "Team", monthlySpend: 100, seats: 4 },
      ],
    };
    const result = runAudit(ctx);
    const rec = result.recommendations.find((r) => r.id === "rec-cursor-windsurf-overlap");
    expect(rec).toBeDefined();
    expect(rec?.type).toBe("consolidate");
    // Windsurf is more expensive, so it should be dropped
    expect(rec?.tool).toBe("Windsurf");
    expect(rec?.monthlySavings).toBe(100);
  });
});

// ─────────────────────────────────────────────
// RULE 3 — ChatGPT + Claude redundancy
// ─────────────────────────────────────────────
describe("Rule 3: ChatGPT + Claude redundancy (non-research)", () => {
  it("should consolidate for coding use case", () => {
    const ctx: AuditContext = {
      teamSize: 5,
      primaryUseCase: "coding",
      tools: [
        { tool: "ChatGPT", plan: "Individual/Pro", monthlySpend: 100, seats: 5 },
        { tool: "Claude", plan: "Individual/Pro", monthlySpend: 100, seats: 5 },
      ],
    };
    const result = runAudit(ctx);
    const rec = result.recommendations.find((r) => r.id === "rec-chatgpt-claude-overlap");
    expect(rec).toBeDefined();
    expect(rec?.type).toBe("consolidate");
    expect(rec?.monthlySavings).toBe(100); // Both same price; drop one
  });

  it("should NOT flag overlap for research teams — they need both", () => {
    const ctx: AuditContext = {
      teamSize: 5,
      primaryUseCase: "research",
      tools: [
        { tool: "ChatGPT", plan: "Individual/Pro", monthlySpend: 100, seats: 5 },
        { tool: "Claude", plan: "Individual/Pro", monthlySpend: 100, seats: 5 },
      ],
    };
    const result = runAudit(ctx);
    const rec = result.recommendations.find((r) => r.id === "rec-chatgpt-claude-overlap");
    expect(rec).toBeUndefined();
  });
});

// ─────────────────────────────────────────────
// RULE 4 — Claude Team minimum-seat trap
// ─────────────────────────────────────────────
describe("Rule 4: Claude Team 5-seat minimum trap", () => {
  it("should recommend downgrade to Pro when seats < 5", () => {
    const ctx: AuditContext = {
      teamSize: 3,
      primaryUseCase: "writing",
      tools: [
        { tool: "Claude", plan: "Team", monthlySpend: 150, seats: 3 }, // 5 × $30 = $150
      ],
    };
    const result = runAudit(ctx);
    // 3 × $20 (Pro) = $60. Savings = $90.
    expect(result.monthlySavings).toBe(90);
    expect(result.annualSavings).toBe(1080);
    const rec = result.recommendations.find((r) => r.id === "rec-claude-team-minimum");
    expect(rec).toBeDefined();
    expect(rec?.type).toBe("downgrade");
    expect(rec?.newPlan).toBe("Individual/Pro");
  });

  it("should NOT flag Claude Team with 5+ seats (legitimate)", () => {
    const ctx: AuditContext = {
      teamSize: 6,
      primaryUseCase: "writing",
      tools: [
        { tool: "Claude", plan: "Team", monthlySpend: 180, seats: 6 }, // 6 × $30 = $180
      ],
    };
    const result = runAudit(ctx);
    const rec = result.recommendations.find((r) => r.id === "rec-claude-team-minimum");
    expect(rec).toBeUndefined();
  });
});

// ─────────────────────────────────────────────
// RULE 5 — Enterprise overkill (<50 seats)
// ─────────────────────────────────────────────
describe("Rule 5: Enterprise plan overkill", () => {
  it("should recommend downgrading Cursor Enterprise for small teams", () => {
    const ctx: AuditContext = {
      teamSize: 8,
      primaryUseCase: "coding",
      tools: [
        // Enterprise: $40/seat × 8 = $320
        // Pro: $20/seat × 8 = $160. Savings = $160.
        { tool: "Cursor", plan: "Enterprise", monthlySpend: 320, seats: 8 },
      ],
    };
    const result = runAudit(ctx);
    const rec = result.recommendations.find((r) => r.id === "rec-enterprise-overkill-Cursor");
    expect(rec).toBeDefined();
    expect(rec?.type).toBe("downgrade");
    expect(rec?.monthlySavings).toBe(160);
  });
});

// ─────────────────────────────────────────────
// RULE 6 — API vs. UI overlap
// ─────────────────────────────────────────────
describe("Rule 6: Anthropic API + Claude UI overlap", () => {
  it("should recommend routing to API for small teams already paying for API", () => {
    const ctx: AuditContext = {
      teamSize: 3,
      primaryUseCase: "coding",
      tools: [
        { tool: "Anthropic API", plan: "API", monthlySpend: 80, seats: 1 },
        { tool: "Claude", plan: "Individual/Pro", monthlySpend: 60, seats: 3 },
      ],
    };
    const result = runAudit(ctx);
    const rec = result.recommendations.find((r) => r.id === "rec-anthropic-api-ui-overlap");
    expect(rec).toBeDefined();
    expect(rec?.type).toBe("switch");
    expect(rec?.monthlySavings).toBe(36); // 60% of $60
  });
});

// ─────────────────────────────────────────────
// RULE 7 — v0 right-sizing for coding teams
// ─────────────────────────────────────────────
describe("Rule 7: v0 right-sizing for engineering teams", () => {
  it("should flag over-distributed v0 seats on a coding team", () => {
    const ctx: AuditContext = {
      teamSize: 10,
      primaryUseCase: "coding",
      tools: [
        // 10 seats for a coding team — only ~2 frontend devs should have it
        { tool: "v0", plan: "Individual/Pro", monthlySpend: 200, seats: 10 },
      ],
    };
    const result = runAudit(ctx);
    const rec = result.recommendations.find((r) => r.id === "rec-v0-rightsizing");
    expect(rec).toBeDefined();
    expect(rec?.type).toBe("rightsize");
    expect(rec?.monthlySavings).toBeGreaterThan(0);
  });

  it("should NOT flag v0 when seat count is proportional to team", () => {
    const ctx: AuditContext = {
      teamSize: 10,
      primaryUseCase: "coding",
      tools: [
        { tool: "v0", plan: "Individual/Pro", monthlySpend: 20, seats: 1 },
      ],
    };
    const result = runAudit(ctx);
    const rec = result.recommendations.find((r) => r.id === "rec-v0-rightsizing");
    expect(rec).toBeUndefined();
  });
});

// ─────────────────────────────────────────────
// GENERAL — savings arithmetic integrity
// ─────────────────────────────────────────────
describe("Savings arithmetic integrity", () => {
  it("monthlySavings × 12 always equals annualSavings", () => {
    const ctx: AuditContext = {
      teamSize: 10,
      primaryUseCase: "coding",
      tools: [
        { tool: "Cursor", plan: "Individual/Pro", monthlySpend: 200, seats: 10 },
        { tool: "GitHub Copilot", plan: "Team", monthlySpend: 190, seats: 10 },
      ],
    };
    const result = runAudit(ctx);
    expect(result.annualSavings).toBe(result.monthlySavings * 12);
  });

  it("totalOptimizedSpend = totalCurrentSpend - monthlySavings", () => {
    const ctx: AuditContext = {
      teamSize: 3,
      primaryUseCase: "writing",
      tools: [
        { tool: "Claude", plan: "Team", monthlySpend: 150, seats: 3 },
      ],
    };
    const result = runAudit(ctx);
    expect(result.totalOptimizedSpend).toBe(result.totalCurrentSpend - result.monthlySavings);
  });

  it("savingsBreakdown totals match monthlySavings", () => {
    const ctx: AuditContext = {
      teamSize: 10,
      primaryUseCase: "coding",
      tools: [
        { tool: "Cursor", plan: "Individual/Pro", monthlySpend: 200, seats: 10 },
        { tool: "GitHub Copilot", plan: "Team", monthlySpend: 190, seats: 10 },
        { tool: "Claude", plan: "Team", monthlySpend: 150, seats: 3 },
      ],
    };
    const result = runAudit(ctx);
    const breakdownTotal = result.savingsBreakdown.reduce((sum, s) => sum + s.amount, 0);
    expect(breakdownTotal).toBe(result.monthlySavings);
  });

  it("fully optimized team should produce zero savings and a 'keep' recommendation", () => {
    const ctx: AuditContext = {
      teamSize: 3,
      primaryUseCase: "coding",
      tools: [
        { tool: "Cursor", plan: "Individual/Pro", monthlySpend: 60, seats: 3 },
      ],
    };
    const result = runAudit(ctx);
    expect(result.monthlySavings).toBe(0);
    expect(result.annualSavings).toBe(0);
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].type).toBe("keep");
  });
});

// ─────────────────────────────────────────────
// RULE 8 — Per-seat overspend anomaly
// ─────────────────────────────────────────────
describe("Rule 8: Per-seat overspend anomaly", () => {
  it("should flag ChatGPT when spend-per-seat is >2× market rate", () => {
    // ChatGPT Individual/Pro = $20/seat published. $10,000/1 seat = $10,000/seat — way over.
    const ctx: AuditContext = {
      teamSize: 1,
      primaryUseCase: "coding",
      tools: [
        { tool: "ChatGPT", plan: "Individual/Pro", monthlySpend: 10000, seats: 1 },
      ],
    };
    const result = runAudit(ctx);
    const rec = result.recommendations.find((r) => r.id === "rec-overspend-ChatGPT");
    expect(rec).toBeDefined();
    expect(rec!.type).toBe("downgrade");
    // Excess = 10000 - (20 * 1) = 9980
    expect(result.monthlySavings).toBe(9980);
    expect(result.annualSavings).toBe(9980 * 12);
  });

  it("should NOT flag normal spend at or below 2× market rate", () => {
    // ChatGPT Individual/Pro = $20/seat. $35/seat is under 2× ($40 threshold).
    const ctx: AuditContext = {
      teamSize: 1,
      primaryUseCase: "coding",
      tools: [
        { tool: "ChatGPT", plan: "Individual/Pro", monthlySpend: 35, seats: 1 },
      ],
    };
    const result = runAudit(ctx);
    const rec = result.recommendations.find((r) => r.id === "rec-overspend-ChatGPT");
    expect(rec).toBeUndefined();
    expect(result.monthlySavings).toBe(0);
  });
});
