export type AITool =
  | "Cursor"
  | "GitHub Copilot"
  | "Claude"
  | "ChatGPT"
  | "Anthropic API"
  | "OpenAI API"
  | "Gemini"
  | "Windsurf"
  | "v0";

export type PlanType = "Free" | "Individual/Pro" | "Team" | "Enterprise" | "API";

export interface PricingTier {
  plan: PlanType;
  pricePerUser: number;
  minSeats: number;
}

export const TOOL_PRICING: Record<AITool, PricingTier[]> = {
  "Cursor": [
    { plan: "Free", pricePerUser: 0, minSeats: 1 },
    { plan: "Individual/Pro", pricePerUser: 20, minSeats: 1 },
    { plan: "Enterprise", pricePerUser: 40, minSeats: 10 },
  ],
  "GitHub Copilot": [
    { plan: "Free", pricePerUser: 0, minSeats: 1 },
    { plan: "Individual/Pro", pricePerUser: 10, minSeats: 1 },
    { plan: "Team", pricePerUser: 19, minSeats: 1 },
    { plan: "Enterprise", pricePerUser: 39, minSeats: 1 },
  ],
  "Claude": [
    { plan: "Free", pricePerUser: 0, minSeats: 1 },
    { plan: "Individual/Pro", pricePerUser: 20, minSeats: 1 },
    { plan: "Team", pricePerUser: 30, minSeats: 5 },
  ],
  "ChatGPT": [
    { plan: "Free", pricePerUser: 0, minSeats: 1 },
    { plan: "Individual/Pro", pricePerUser: 20, minSeats: 1 },
    { plan: "Team", pricePerUser: 30, minSeats: 2 },
    { plan: "Enterprise", pricePerUser: 60, minSeats: 150 }, // Estimated
  ],
  "Gemini": [
    { plan: "Free", pricePerUser: 0, minSeats: 1 },
    { plan: "Individual/Pro", pricePerUser: 20, minSeats: 1 },
    { plan: "Enterprise", pricePerUser: 30, minSeats: 1 },
  ],
  "Windsurf": [
    { plan: "Free", pricePerUser: 0, minSeats: 1 },
    { plan: "Individual/Pro", pricePerUser: 15, minSeats: 1 }, // Using rough estimates if missing
    { plan: "Team", pricePerUser: 25, minSeats: 1 },
  ],
  "v0": [
    { plan: "Free", pricePerUser: 0, minSeats: 1 },
    { plan: "Individual/Pro", pricePerUser: 20, minSeats: 1 },
    { plan: "Team", pricePerUser: 30, minSeats: 1 },
  ],
  "OpenAI API": [
    { plan: "API", pricePerUser: 0, minSeats: 1 } // Usage based
  ],
  "Anthropic API": [
    { plan: "API", pricePerUser: 0, minSeats: 1 } // Usage based
  ]
};
