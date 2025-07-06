import { Decision } from '@/types/decision';

export const mockDecisions: Decision[] = [
  {
    id: '1',
    title: 'Recommendation Engine: Transformer vs DeepFM',
    context: 'Need to choose between Transformer-based and DeepFM models for our product recommendation system. Current CTR is 2.1% and we need to improve to 3.5% to meet Q4 targets.',
    options: [
      {
        id: '1a',
        name: 'Transformer-based Model',
        description: 'Multi-head attention mechanism with user-item interaction modeling',
        pros: ['Better at capturing complex user-item patterns', 'State-of-the-art performance on sequential data', 'Highly interpretable attention weights'],
        cons: ['Higher computational cost', 'Requires more training data', 'Longer inference time'],
        estimatedCost: 50000,
        estimatedTime: '8-12 weeks',
        riskLevel: 'medium'
      },
      {
        id: '1b',
        name: 'DeepFM Model',
        description: 'Factorization machines with deep neural networks for feature interactions',
        pros: ['Faster training and inference', 'Works well with sparse features', 'Lower computational requirements'],
        cons: ['May not capture complex sequential patterns', 'Limited interpretability', 'Lower ceiling for performance'],
        estimatedCost: 30000,
        estimatedTime: '4-6 weeks',
        riskLevel: 'low'
      }
    ],
    tradeoffs: [
      {
        id: 't1',
        title: 'Performance vs Speed',
        description: 'Transformer offers better accuracy but slower inference',
        impact: 'neutral',
        magnitude: 'high'
      },
      {
        id: 't2',
        title: 'Cost vs Quality',
        description: 'Higher development cost for potentially better results',
        impact: 'negative',
        magnitude: 'medium'
      }
    ],
    constraints: ['Must maintain <100ms inference time', 'Budget limited to $60k', 'Need to ship before Black Friday'],
    status: 'in-progress',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    priority: 'high',
    category: 'model-selection'
  },
  {
    id: '2',
    title: 'Database Migration: PostgreSQL to ClickHouse',
    context: 'Our analytics queries are taking 15+ seconds on PostgreSQL. Need to migrate to a columnar database for better performance on large-scale analytics.',
    options: [
      {
        id: '2a',
        name: 'ClickHouse',
        description: 'Column-oriented database optimized for analytical queries',
        pros: ['10-100x faster analytics queries', 'Excellent compression ratios', 'Built-in data replication'],
        cons: ['Complex setup and maintenance', 'Limited ACID compliance', 'Steep learning curve for team'],
        estimatedCost: 80000,
        estimatedTime: '12-16 weeks',
        riskLevel: 'high'
      },
      {
        id: '2b',
        name: 'PostgreSQL with TimescaleDB',
        description: 'Hypertables extension for time-series data',
        pros: ['Minimal migration effort', 'Maintains ACID compliance', 'Team already familiar with PostgreSQL'],
        cons: ['Limited performance improvement', 'Still row-based storage', 'May not scale as well'],
        estimatedCost: 25000,
        estimatedTime: '4-6 weeks',
        riskLevel: 'low'
      }
    ],
    tradeoffs: [
      {
        id: 't3',
        title: 'Performance vs Complexity',
        description: 'ClickHouse offers massive performance gains but increases operational complexity',
        impact: 'positive',
        magnitude: 'high'
      },
      {
        id: 't4',
        title: 'Migration Risk vs Benefits',
        description: 'Higher risk migration for potentially transformative performance improvements',
        impact: 'negative',
        magnitude: 'high'
      }
    ],
    constraints: ['Must maintain data consistency', 'Zero downtime requirement', 'Team needs to be trained'],
    status: 'pending',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    priority: 'critical',
    category: 'infrastructure'
  },
  {
    id: '3',
    title: 'Microservices vs Monolith for New Feature',
    context: 'Building a real-time collaboration feature for our document editor. Need to decide between microservices architecture or extending the existing monolith.',
    options: [
      {
        id: '3a',
        name: 'Microservices Architecture',
        description: 'Separate services for collaboration, document management, and real-time sync',
        pros: ['Independent scaling', 'Technology flexibility', 'Easier team ownership'],
        cons: ['Distributed system complexity', 'Network latency', 'More infrastructure to manage'],
        estimatedCost: 120000,
        estimatedTime: '16-20 weeks',
        riskLevel: 'high'
      },
      {
        id: '3b',
        name: 'Monolith Extension',
        description: 'Add collaboration features to existing monolithic application',
        pros: ['Faster development', 'Simpler deployment', 'Lower operational overhead'],
        cons: ['Tight coupling', 'Harder to scale independently', 'Technology lock-in'],
        estimatedCost: 60000,
        estimatedTime: '8-10 weeks',
        riskLevel: 'medium'
      }
    ],
    tradeoffs: [
      {
        id: 't5',
        title: 'Development Speed vs Scalability',
        description: 'Monolith is faster to build but microservices offer better long-term scalability',
        impact: 'neutral',
        magnitude: 'medium'
      },
      {
        id: 't6',
        title: 'Complexity vs Flexibility',
        description: 'Microservices add complexity but provide more flexibility for future changes',
        impact: 'positive',
        magnitude: 'medium'
      }
    ],
    constraints: ['Must support 10k concurrent users', 'Real-time latency <50ms', 'Feature needed by Q2'],
    status: 'completed',
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-15'),
    priority: 'medium',
    category: 'architecture'
  },
  {
    id: '4',
    title: 'Feature Priority: AI Assistant vs Advanced Analytics',
    context: 'Limited engineering resources for Q1. Need to choose between building an AI-powered assistant or advanced analytics dashboard. Both have strong user demand.',
    options: [
      {
        id: '4a',
        name: 'AI Assistant',
        description: 'Chatbot that helps users navigate the platform and automate tasks',
        pros: ['High user engagement potential', 'Competitive differentiation', 'Viral growth potential'],
        cons: ['Complex ML requirements', 'High maintenance costs', 'Uncertain ROI'],
        estimatedCost: 150000,
        estimatedTime: '20-24 weeks',
        riskLevel: 'high'
      },
      {
        id: '4b',
        name: 'Advanced Analytics',
        description: 'Comprehensive dashboard with custom reports and data visualization',
        pros: ['Clear user value', 'Easier to implement', 'Predictable development timeline'],
        cons: ['Less differentiation', 'Lower engagement potential', 'May not drive growth'],
        estimatedCost: 80000,
        estimatedTime: '12-16 weeks',
        riskLevel: 'low'
      }
    ],
    tradeoffs: [
      {
        id: 't7',
        title: 'Innovation vs Reliability',
        description: 'AI assistant is more innovative but analytics is more reliable to build',
        impact: 'positive',
        magnitude: 'high'
      },
      {
        id: 't8',
        title: 'Growth vs Stability',
        description: 'AI has higher growth potential but analytics provides stable value',
        impact: 'neutral',
        magnitude: 'medium'
      }
    ],
    constraints: ['Q1 deadline', 'Limited to 3 engineers', 'Must improve user retention'],
    status: 'pending',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12'),
    priority: 'high',
    category: 'feature-priority'
  }
]; 