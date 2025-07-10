export interface Decision {
  id: string;
  title: string;
  context: string;
  options: DecisionOption[];
  tradeoffs: Tradeoff[];
  constraints: string[];
  status: 'pending' | 'in-progress' | 'completed' | 'archived' | 'open' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'architecture' | 'model-selection' | 'infrastructure' | 'feature-priority' | 'technology-stack';
  tags: string[];
}

export interface DecisionOption {
  id: string;
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  estimatedCost?: number;
  estimatedTime?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface Tradeoff {
  id: string;
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  magnitude: 'low' | 'medium' | 'high';
} 