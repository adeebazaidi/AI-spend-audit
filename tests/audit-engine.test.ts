import { describe, it, expect } from "vitest";
import { runAudit, AuditContext } from "../src/lib/audit-engine";

describe("Audit Engine", () => {
  it("should return 0 savings if already optimized", () => {
    const context: AuditContext = {
      teamSize: 3,
      primaryUseCase: "coding",
      tools: [
        { tool: "Cursor", plan: "Individual/Pro", monthlySpend: 60, seats: 3 }
      ]
    };

    const result = runAudit(context);
    expect(result.monthlySavings).toBe(0);
    expect(result.recommendations.length).toBe(1);
    expect(result.recommendations[0].type).toBe("keep");
  });

  it("should recommend consolidating GitHub Copilot if Cursor is present", () => {
    const context: AuditContext = {
      teamSize: 5,
      primaryUseCase: "coding",
      tools: [
        { tool: "Cursor", plan: "Individual/Pro", monthlySpend: 100, seats: 5 },
        { tool: "GitHub Copilot", plan: "Team", monthlySpend: 95, seats: 5 }
      ]
    };

    const result = runAudit(context);
    expect(result.monthlySavings).toBe(95);
    expect(result.recommendations[0].type).toBe("consolidate");
    expect(result.recommendations[0].tool).toBe("GitHub Copilot");
  });

  it("should recommend downgrading Claude Team if seats < 5", () => {
    const context: AuditContext = {
      teamSize: 3,
      primaryUseCase: "writing",
      tools: [
        { tool: "Claude", plan: "Team", monthlySpend: 150, seats: 3 } // 5 seat min * $30 = $150
      ]
    };

    const result = runAudit(context);
    // 3 seats on Pro ($20) = $60. Savings = $150 - $60 = $90
    expect(result.monthlySavings).toBe(90);
    expect(result.recommendations[0].type).toBe("downgrade");
    expect(result.recommendations[0].newPlan).toBe("Individual/Pro");
  });
});
