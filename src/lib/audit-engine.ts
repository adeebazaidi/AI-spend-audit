import { AITool, PlanType, TOOL_PRICING } from "./pricing";

export type UseCase = "coding" | "writing" | "research" | "data" | "mixed";

export interface ToolInput {
  tool: AITool;
  plan: PlanType;
  monthlySpend: number;
  seats: number;
}

export interface AuditContext {
  teamSize: number;
  primaryUseCase: UseCase;
  tools: ToolInput[];
}

export interface Recommendation {
  id: string;
  tool: AITool | "General";
  type: "downgrade" | "consolidate" | "switch" | "keep";
  reasoning: string;
  monthlySavings: number;
  newPlan?: PlanType | "None";
}

export interface AuditResult {
  totalCurrentSpend: number;
  totalOptimizedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  recommendations: Recommendation[];
}

export function runAudit(context: AuditContext): AuditResult {
  let recommendations: Recommendation[] = [];
  let totalCurrentSpend = 0;
  let monthlySavings = 0;

  const toolMap = new Map<AITool, ToolInput>();
  for (const t of context.tools) {
    totalCurrentSpend += t.monthlySpend;
    toolMap.set(t.tool, t);
  }

  // 1. Evaluate Coding Redundancy
  const hasCursor = toolMap.has("Cursor");
  const hasCopilot = toolMap.has("GitHub Copilot");
  if (hasCursor && hasCopilot) {
    const copilotSpend = toolMap.get("GitHub Copilot")!.monthlySpend;
    recommendations.push({
      id: "rec-coding-overlap",
      tool: "GitHub Copilot",
      type: "consolidate",
      reasoning: "Paying for both Cursor and GitHub Copilot is redundant for most developers. Cursor includes advanced autocomplete and codebase chatting.",
      monthlySavings: copilotSpend,
      newPlan: "None"
    });
    monthlySavings += copilotSpend;
  }

  // 2. Evaluate Enterprise Overkill
  for (const input of toolMap.values()) {
    if (input.plan === "Enterprise" && input.seats < 50) {
      const proPlan = TOOL_PRICING[input.tool]?.find(p => p.plan === "Individual/Pro" || p.plan === "Team");
      if (proPlan) {
        const potentialSpend = proPlan.pricePerUser * input.seats;
        if (potentialSpend < input.monthlySpend) {
           const savings = input.monthlySpend - potentialSpend;
           recommendations.push({
            id: `rec-ent-overkill-${input.tool}`,
            tool: input.tool,
            type: "downgrade",
            reasoning: `Enterprise plans for ${input.tool} typically require massive scale to justify. Downgrading your ${input.seats} seats to ${proPlan.plan} retains core functionality.`,
            monthlySavings: savings,
            newPlan: proPlan.plan
          });
          monthlySavings += savings;
        }
      }
    }
  }

  // 3. Check for under-the-minimum team limits (e.g. Claude Team min 5 seats)
  const claude = toolMap.get("Claude");
  if (claude && claude.plan === "Team" && claude.seats < 5) {
      const proPlan = TOOL_PRICING["Claude"].find(p => p.plan === "Individual/Pro");
      if (proPlan) {
          const proSpend = proPlan.pricePerUser * claude.seats;
          if (proSpend < claude.monthlySpend) {
            const savings = claude.monthlySpend - proSpend;
            recommendations.push({
              id: "rec-claude-team",
              tool: "Claude",
              type: "downgrade",
              reasoning: `Claude Team requires paying for a minimum of 5 seats. Since you only have ${claude.seats} users, individual Pro plans are cheaper.`,
              monthlySavings: savings,
              newPlan: "Individual/Pro"
            });
            monthlySavings += savings;
          }
      }
  }

  if (recommendations.length === 0) {
      recommendations.push({
          id: "rec-optimized",
          tool: "General",
          type: "keep",
          reasoning: "Your AI spend is highly optimized. You are on the right plans for your team size and use case.",
          monthlySavings: 0,
          newPlan: "None"
      });
  }

  return {
    totalCurrentSpend,
    totalOptimizedSpend: totalCurrentSpend - monthlySavings,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    recommendations,
  };
}
