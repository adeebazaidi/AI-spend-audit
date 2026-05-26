"use server";

import { AuditResult } from "@/lib/audit-engine";

export async function generateAiSummary(result: AuditResult): Promise<string> {
  const fallbackSummary = () => {
    if (result.monthlySavings === 0) {
      return "Based on our deterministic analysis, your AI spending is currently optimal. You have successfully aligned your tooling with your team's size and primary use cases, avoiding the common pitfalls of redundant licenses and oversized enterprise plans.";
    }

    const primaryRec = result.recommendations[0];
    const toolName = primaryRec.tool !== "General" ? primaryRec.tool : "your AI tools";

    return `Our analysis indicates you can reduce your annual AI infrastructure spend by $${result.annualSavings.toLocaleString()} without sacrificing capabilities. The primary source of this waste stems from ${primaryRec.type === "consolidate" ? "overlapping" : "unoptimized"} licenses for ${toolName}. By streamlining your platform strategy and adjusting your seating allocation, you can immediately capture these savings. We recommend executing this migration promptly to prevent further compounding costs.`;
  };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return fallbackSummary();
  }

  try {
    const prompt = `You are a strict, highly analytical SaaS CFO. Review this AI Spend Audit result for a startup and write a 2-3 sentence executive summary of the findings. Do not hallucinate numbers. Do not give generic advice. Be punchy and focus on the immediate ROI.\n\nData: ${JSON.stringify(result)}`;
    
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 150,
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) {
      return fallbackSummary();
    }

    const data = await response.json();
    if (data.content && data.content.length > 0) {
      return data.content[0].text;
    }
  } catch (error) {
    console.error("AI Summary generation failed, using fallback:", error);
  }
  
  return fallbackSummary();
}
