import { archetypes } from "@/data/archetypes";

export interface DecisionInput {
  constraints: string[];
}

export interface SuggestedTradeoff {
  title: string;
  context: string;
  options: {
    name: string;
    pros: string[];
    cons: string[];
  }[];
  recommendation: string;
}

export function suggestTradeoffs(input: DecisionInput): SuggestedTradeoff[] {
  // Simple matching: if any input constraint matches an archetype constraint, include it
  return archetypes.filter(arch =>
    arch.constraints.some(c => input.constraints.includes(c))
  ).map(arch => ({
    title: arch.title,
    context: arch.context,
    options: arch.options,
    recommendation: arch.recommendation
  }));
} 