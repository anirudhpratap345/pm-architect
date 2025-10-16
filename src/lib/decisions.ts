import { mockDecisions } from '@/data/mock-decisions';
import { Decision } from '@/types/decision';

export function getMockDecisions(): Decision[] {
  return mockDecisions;
}

export function getMockDecisionById(id: string): Decision | undefined {
  return mockDecisions.find(decision => decision.id === id);
}

export function getMockDecisionsByStatus(status: Decision['status']): Decision[] {
  return mockDecisions.filter(decision => decision.status === status);
}

export function getMockDecisionsByPriority(priority: Decision['priority']): Decision[] {
  return mockDecisions.filter(decision => decision.priority === priority);
} 