export interface Decision {
  id: string;
  title: string;
  description: string;
  context: string;
  options: string[];
  constraints: string[];
  metrics: string[];
  stakeholders: string[];
  tags: string[];
  status: 'pending' | 'open' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline?: Date | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  teamId?: string | null;
  templateId?: string | null;
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

export interface Comment {
  id: string;
  content: string;
  decisionId: string;
  userId: string;
  parentId?: string | null;
  mentions: string[];
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  replies?: Comment[];
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  emailVerified?: Date | null;
}

export interface Team {
  id: string;
  name: string;
  description?: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  owner: User;
  members: TeamMember[];
  decisions: Decision[];
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;
  team: Team;
  user: User;
}

export interface DecisionTemplate {
  id: string;
  name: string;
  description?: string | null;
  framework: string;
  steps: string[];
  questions: string[];
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  createdByUser: User;
  decisions: Decision[];
  usages: TemplateUsage[];
}

export interface TemplateUsage {
  id: string;
  templateId: string;
  decisionId: string;
  usedAt: Date;
  template: DecisionTemplate;
}

export interface Notification {
  id: string;
  userId: string;
  decisionId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  user: User;
  decision: Decision;
} 