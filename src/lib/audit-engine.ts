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
  type: "downgrade" | "consolidate" | "switch" | "keep" | "rightsize";
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
  savingsBreakdown: { label: string; amount: number }[];
}

export function runAudit(context: AuditContext): AuditResult {
  const recommendations: Recommendation[] = [];
  const savingsBreakdown: { label: string; amount: number }[] = [];
  let totalCurrentSpend = 0;
  let monthlySavings = 0;

  const toolMap = new Map<AITool, ToolInput>();
  for (const t of context.tools) {
    totalCurrentSpend += t.monthlySpend;
    toolMap.set(t.tool, t);
  }

  // ──────────────────────────────────────────────────────────────
  // RULE 1 — Coding tool overlap: Cursor + GitHub Copilot
  // Cursor covers inline autocomplete AND chat; Copilot is redundant.
  // ──────────────────────────────────────────────────────────────
  const cursor = toolMap.get("Cursor");
  const copilot = toolMap.get("GitHub Copilot");
  if (cursor && copilot && cursor.plan !== "Free") {
    const copilotSpend = copilot.monthlySpend;
    recommendations.push({
      id: "rec-cursor-copilot-overlap",
      tool: "GitHub Copilot",
      type: "consolidate",
      reasoning: `Cursor Pro already includes advanced inline autocomplete, codebase-aware chat, and multi-file editing. GitHub Copilot provides overlapping capability at $${copilotSpend}/mo with no functional advantage for your ${copilot.seats}-engineer team. Cancelling Copilot retains 100% of coding assistance.`,
      monthlySavings: copilotSpend,
      newPlan: "None",
    });
    monthlySavings += copilotSpend;
    savingsBreakdown.push({ label: "Eliminate GitHub Copilot (redundant with Cursor)", amount: copilotSpend });
  }

  // ──────────────────────────────────────────────────────────────
  // RULE 2 — Coding tool overlap: Windsurf + Cursor
  // Both are full IDE AI assistants; keeping one is the correct call.
  // ──────────────────────────────────────────────────────────────
  const windsurf = toolMap.get("Windsurf");
  if (cursor && windsurf && cursor.plan !== "Free" && windsurf.plan !== "Free") {
    // Recommend keeping the cheaper one
    const keepTool = cursor.monthlySpend <= windsurf.monthlySpend ? "Cursor" : "Windsurf";
    const dropTool = keepTool === "Cursor" ? "Windsurf" : "Cursor";
    const dropSpend = toolMap.get(dropTool as AITool)!.monthlySpend;

    recommendations.push({
      id: "rec-cursor-windsurf-overlap",
      tool: dropTool as AITool,
      type: "consolidate",
      reasoning: `Cursor and Windsurf are direct competitors offering identical capabilities (inline completion, agentic coding, codebase chat). Running both at the same time is pure duplication. Consolidate onto ${keepTool} — your engineers will prefer consistency and you'll save $${dropSpend}/mo immediately.`,
      monthlySavings: dropSpend,
      newPlan: "None",
    });
    monthlySavings += dropSpend;
    savingsBreakdown.push({ label: `Eliminate ${dropTool} (redundant with ${keepTool})`, amount: dropSpend });
  }

  // ──────────────────────────────────────────────────────────────
  // RULE 3 — ChatGPT + Claude chat overlap (non-API)
  // If a team is on paid plans for both AND use case is not research/mixed,
  // recommend consolidating onto the cheaper one.
  // ──────────────────────────────────────────────────────────────
  const chatGPT = toolMap.get("ChatGPT");
  const claude = toolMap.get("Claude");
  const isNonResearch = context.primaryUseCase !== "research" && context.primaryUseCase !== "mixed";

  if (
    chatGPT && claude &&
    chatGPT.plan !== "Free" && chatGPT.plan !== "API" &&
    claude.plan !== "Free" && claude.plan !== "API" &&
    isNonResearch
  ) {
    const dropTool = chatGPT.monthlySpend <= claude.monthlySpend ? "Claude" : "ChatGPT";
    const keepTool = dropTool === "Claude" ? "ChatGPT" : "Claude";
    const dropSpend = toolMap.get(dropTool)!.monthlySpend;
    recommendations.push({
      id: "rec-chatgpt-claude-overlap",
      tool: dropTool,
      type: "consolidate",
      reasoning: `For a ${context.primaryUseCase}-focused team, paying for both ChatGPT and Claude as primary chat interfaces is redundant. Both provide comparable output quality for the vast majority of tasks. Standardising on ${keepTool} reduces per-seat overhead and improves workflow consistency. Save $${dropSpend}/mo.`,
      monthlySavings: dropSpend,
      newPlan: "None",
    });
    monthlySavings += dropSpend;
    savingsBreakdown.push({ label: `Consolidate AI chat assistant onto ${keepTool}`, amount: dropSpend });
  }

  // ──────────────────────────────────────────────────────────────
  // RULE 4 — Claude Team: 5-seat minimum trap
  // Anthropic requires minimum 5 seats for Team. Under that, Pro is cheaper.
  // ──────────────────────────────────────────────────────────────
  if (claude && claude.plan === "Team" && claude.seats < 5) {
    const proPlan = TOOL_PRICING["Claude"].find((p) => p.plan === "Individual/Pro");
    if (proPlan) {
      const proSpend = proPlan.pricePerUser * claude.seats;
      if (proSpend < claude.monthlySpend) {
        const savings = claude.monthlySpend - proSpend;
        recommendations.push({
          id: "rec-claude-team-minimum",
          tool: "Claude",
          type: "downgrade",
          reasoning: `Claude Team enforces a 5-seat billing minimum at $30/seat. With only ${claude.seats} active users, you are paying for ${5 - claude.seats} phantom seats. Switching to ${claude.seats}× Claude Pro ($20/seat) reduces your bill from $${claude.monthlySpend} to $${proSpend}/mo — a $${savings}/mo reduction with identical per-user capability.`,
          monthlySavings: savings,
          newPlan: "Individual/Pro",
        });
        monthlySavings += savings;
        savingsBreakdown.push({ label: "Exit Claude Team minimum-seat trap", amount: savings });
      }
    }
  }

  // ──────────────────────────────────────────────────────────────
  // RULE 5 — Enterprise plan with <50 seats (over-provisioned tier)
  // Enterprise pricing is only cost-effective at scale (typically 50+).
  // ──────────────────────────────────────────────────────────────
  for (const input of toolMap.values()) {
    if (input.plan === "Enterprise" && input.seats < 50) {
      // Skip if we already issued a more specific rule for this tool
      const alreadyCovered = recommendations.some(
        (r) => r.tool === input.tool && r.type !== "keep"
      );
      if (alreadyCovered) continue;

      const teamPlan = TOOL_PRICING[input.tool]?.find((p) => p.plan === "Team");
      const proPlan = TOOL_PRICING[input.tool]?.find((p) => p.plan === "Individual/Pro");
      const bestAlt = teamPlan ?? proPlan;

      if (bestAlt) {
        const altSpend = bestAlt.pricePerUser * input.seats;
        if (altSpend < input.monthlySpend) {
          const savings = input.monthlySpend - altSpend;
          recommendations.push({
            id: `rec-enterprise-overkill-${input.tool}`,
            tool: input.tool,
            type: "downgrade",
            reasoning: `${input.tool} Enterprise pricing is designed for 50+ seat deployments with dedicated support SLAs and advanced SSO. Your ${input.seats}-seat team is paying a per-seat premium for features that are either unused or available on ${bestAlt.plan}. Downgrading saves $${savings}/mo ($${savings * 12}/yr) with no functional capability loss at your scale.`,
            monthlySavings: savings,
            newPlan: bestAlt.plan,
          });
          monthlySavings += savings;
          savingsBreakdown.push({
            label: `Downgrade ${input.tool} from Enterprise to ${bestAlt.plan}`,
            amount: savings,
          });
        }
      }
    }
  }

  // ──────────────────────────────────────────────────────────────
  // RULE 6 — API vs. UI plan mismatch
  // If a team uses an API tool AND the equivalent UI tool for the same
  // model family, it's likely UI-plan seats that could be on API pricing.
  // ──────────────────────────────────────────────────────────────
  const anthropicApi = toolMap.get("Anthropic API");
  if (anthropicApi && claude && claude.plan !== "Free" && claude.seats <= 3) {
    recommendations.push({
      id: "rec-anthropic-api-ui-overlap",
      tool: "Claude",
      type: "switch",
      reasoning: `You are already paying for Anthropic API access. For ${claude.seats} light-usage seats, routing Claude consumption through your existing API key (using Open WebUI or a similar self-hosted interface) can eliminate the $${claude.monthlySpend}/mo Claude.ai subscription entirely. At low volumes, API cost-per-use is significantly below a fixed per-seat subscription.`,
      monthlySavings: Math.round(claude.monthlySpend * 0.6), // Conservative 60% savings estimate
      newPlan: "API",
    });
    const apiSavings = Math.round(claude.monthlySpend * 0.6);
    monthlySavings += apiSavings;
    savingsBreakdown.push({ label: "Route Claude usage through existing Anthropic API", amount: apiSavings });
  }

  const openAiApi = toolMap.get("OpenAI API");
  if (openAiApi && chatGPT && chatGPT.plan !== "Free" && chatGPT.seats <= 3) {
    const alreadyCovered = recommendations.some(
      (r) => r.tool === "ChatGPT" && r.type !== "keep"
    );
    if (!alreadyCovered) {
      const apiSavings = Math.round(chatGPT.monthlySpend * 0.6);
      recommendations.push({
        id: "rec-openai-api-ui-overlap",
        tool: "ChatGPT",
        type: "switch",
        reasoning: `You already have an OpenAI API subscription. For ${chatGPT.seats} low-volume users, consolidating ChatGPT usage through your API key (via Open WebUI or a shared GPT-4 wrapper) can reduce or eliminate the $${chatGPT.monthlySpend}/mo ChatGPT subscription cost. Estimated API cost for equivalent usage: ~$${chatGPT.monthlySpend - apiSavings}/mo.`,
        monthlySavings: apiSavings,
        newPlan: "API",
      });
      monthlySavings += apiSavings;
      savingsBreakdown.push({ label: "Route ChatGPT usage through existing OpenAI API", amount: apiSavings });
    }
  }

  // ──────────────────────────────────────────────────────────────
  // RULE 7 — v0 + coding team: low usage signal
  // v0 is a design/prototyping tool. Coding-primary teams rarely justify
  // paid v0 plans unless they have dedicated frontend/design staff.
  // ──────────────────────────────────────────────────────────────
  const v0 = toolMap.get("v0");
  if (v0 && v0.plan !== "Free" && context.primaryUseCase === "coding") {
    const codingSeats = context.teamSize;
    // If v0 seats > 20% of team (likely over-distributed)
    if (v0.seats > Math.ceil(codingSeats * 0.2)) {
      const rightSizedSeats = Math.max(1, Math.ceil(codingSeats * 0.2));
      const planTier = TOOL_PRICING["v0"]?.find((p) => p.plan === "Individual/Pro");
      if (planTier) {
        const rightSizedSpend = planTier.pricePerUser * rightSizedSeats;
        if (rightSizedSpend < v0.monthlySpend) {
          const savings = v0.monthlySpend - rightSizedSpend;
          recommendations.push({
            id: "rec-v0-rightsizing",
            tool: "v0",
            type: "rightsize",
            reasoning: `v0 is a UI prototyping tool best suited for frontend engineers and designers. Distributing ${v0.seats} v0 seats across a primarily backend/coding team of ${codingSeats} is over-provisioned. Right-sizing to ${rightSizedSeats} seat(s) for dedicated frontend staff reduces cost from $${v0.monthlySpend} to ~$${rightSizedSpend}/mo.`,
            monthlySavings: savings,
            newPlan: "Individual/Pro",
          });
          monthlySavings += savings;
          savingsBreakdown.push({ label: "Right-size v0 seats to active frontend users", amount: savings });
        }
      }
    }
  }

  // ──────────────────────────────────────────────────────────────
  // RULE 8 — Per-seat overspend anomaly
  // If actual spend-per-seat is >2× the known market rate for that plan,
  // the team is overpaying — likely via a reseller markup, hidden add-ons,
  // or an incorrectly assigned plan tier.
  // ──────────────────────────────────────────────────────────────
  for (const input of toolMap.values()) {
    if (input.plan === "API") continue; // Usage-based — no fixed seat price

    const alreadyCovered = recommendations.some(
      (r) => r.tool === input.tool && r.type !== "keep"
    );
    if (alreadyCovered) continue;

    const knownTier = TOOL_PRICING[input.tool]?.find((p) => p.plan === input.plan);
    if (!knownTier || knownTier.pricePerUser === 0) continue;

    const actualPerSeat = input.monthlySpend / Math.max(input.seats, 1);
    const marketPerSeat = knownTier.pricePerUser;

    if (actualPerSeat > marketPerSeat * 2) {
      const expectedSpend = marketPerSeat * input.seats;
      const excess = Math.round(input.monthlySpend - expectedSpend);
      recommendations.push({
        id: `rec-overspend-${input.tool}`,
        tool: input.tool,
        type: "downgrade",
        reasoning: `Your reported spend of $${input.monthlySpend.toLocaleString()}/mo for ${input.tool} ${input.plan} works out to $${Math.round(actualPerSeat).toLocaleString()}/seat — more than 2× the published market rate of $${marketPerSeat}/seat. This is a strong signal of a reseller markup, undisclosed add-ons, or incorrect plan assignment. Auditing your invoice against the vendor's direct billing portal could recover $${excess.toLocaleString()}/mo immediately.`,
        monthlySavings: excess,
        newPlan: input.plan,
      });
      monthlySavings += excess;
      savingsBreakdown.push({
        label: `${input.tool} overspend vs. published rate ($${marketPerSeat}/seat)`,
        amount: excess,
      });
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Fallback: fully optimized
  // ──────────────────────────────────────────────────────────────
  if (recommendations.length === 0) {
    recommendations.push({
      id: "rec-optimized",
      tool: "General",
      type: "keep",
      reasoning: `Your AI spend is well-structured for your team size (${context.teamSize} people) and primary use case (${context.primaryUseCase}). You are on appropriate plan tiers with no detectable redundancy or over-provisioning. The next optimization opportunity will come as your team scales beyond current seat thresholds.`,
      monthlySavings: 0,
      newPlan: "None",
    });
  }

  return {
    totalCurrentSpend,
    totalOptimizedSpend: totalCurrentSpend - monthlySavings,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    recommendations,
    savingsBreakdown,
  };
}
