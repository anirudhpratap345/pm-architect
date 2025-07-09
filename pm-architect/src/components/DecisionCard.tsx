import { Decision } from '@/types/decision';
import Link from 'next/link';

interface DecisionCardProps {
  decision: Decision;
}

export default function DecisionCard({ decision }: DecisionCardProps) {
  const getStatusColor = (status: Decision['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }; 

  const getPriorityColor = (priority: Decision['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: Decision['category']) => {
    switch (category) {
      case 'model-selection':
        return '🧠';
      case 'architecture':
        return '🏗️';
      case 'infrastructure':
        return '⚙️';
      case 'feature-priority':
        return '📋';
      case 'technology-stack':
        return '🛠️';
      default:
        return '📊';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Link href={`/decision/${decision.id}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getCategoryIcon(decision.category)}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {decision.title}
              </h3>
              <p className="text-sm text-gray-500 capitalize">
                {decision.category.replace('-', ' ')}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(decision.status)}`}>
              {decision.status.replace('-', ' ')}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(decision.priority)}`}>
              {decision.priority}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {decision.context}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>{decision.options.length} options</span>
            <span>{decision.tradeoffs.length} tradeoffs</span>
          </div>
          <span>Updated {formatDate(decision.updatedAt)}</span>
        </div>

        {decision.constraints.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-500">Constraints:</span>
              <span className="text-xs text-gray-600">
                {decision.constraints.length} constraint{decision.constraints.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
} 