"use server";

import { AuditResult } from "@/lib/audit-engine";

export async function generateAiSummary(result: AuditResult): Promise<string> {
  // In a real app, this would call Anthropic API
  // e.g. const response = await anthropic.messages.create({ ... })

  if (result.monthlySavings === 0) {
    return "Based on our deterministic analysis, your AI spending is currently optimal. You have successfully aligned your tooling with your team's size and primary use cases, avoiding the common pitfalls of redundant licenses and oversized enterprise plans.";
  }

  const primaryRec = result.recommendations[0];
  const toolName = primaryRec.tool !== "General" ? primaryRec.tool : "your AI tools";

  return `Our analysis indicates you can reduce your annual AI infrastructure spend by $${result.annualSavings.toLocaleString()} without sacrificing capabilities. The primary source of this waste stems from ${primaryRec.type === "consolidate" ? "overlapping" : "unoptimized"} licenses for ${toolName}. By streamlining your platform strategy and adjusting your seating allocation, you can immediately capture these savings. We recommend executing this migration promptly to prevent further compounding costs.`;
}
