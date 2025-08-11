"use client";

import { useState, useEffect } from 'react';
import { Decision } from '@/types/decision';

interface DashboardAnalyticsProps {
  decisions: Decision[];
}

interface AnalyticsData {
  totalDecisions: number;
  openDecisions: number;
  closedDecisions: number;
  highPriorityDecisions: number;
  decisionsThisWeek: number;
  decisionsThisMonth: number;
  averageDecisionAge: number;
  priorityDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  statusDistribution: {
    open: number;
    inProgress: number;
    closed: number;
  };
}

export default function DashboardAnalytics({ decisions }: DashboardAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalDecisions: 0,
    openDecisions: 0,
    closedDecisions: 0,
    highPriorityDecisions: 0,
    decisionsThisWeek: 0,
    decisionsThisMonth: 0,
    averageDecisionAge: 0,
    priorityDistribution: { low: 0, medium: 0, high: 0, critical: 0 },
    statusDistribution: { open: 0, inProgress: 0, closed: 0 },
  });

  useEffect(() => {
    if (decisions.length > 0) {
      calculateAnalytics();
    }
  }, [decisions]);

  const calculateAnalytics = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalDecisions = decisions.length;
    const openDecisions = decisions.filter(d => d.status === 'open').length;
    const closedDecisions = decisions.filter(d => d.status === 'closed').length;
    const highPriorityDecisions = decisions.filter(d => d.priority === 'high' || d.priority === 'critical').length;
    
    const decisionsThisWeek = decisions.filter(d => new Date(d.createdAt) >= oneWeekAgo).length;
    const decisionsThisMonth = decisions.filter(d => new Date(d.createdAt) >= oneMonthAgo).length;

    // Calculate average decision age
    const totalAge = decisions.reduce((sum, d) => {
      const age = now.getTime() - new Date(d.createdAt).getTime();
      return sum + age;
    }, 0);
    const averageDecisionAge = totalAge / totalDecisions / (1000 * 60 * 60 * 24); // in days

    // Priority distribution
    const priorityDistribution = {
      low: decisions.filter(d => d.priority === 'low').length,
      medium: decisions.filter(d => d.priority === 'medium').length,
      high: decisions.filter(d => d.priority === 'high').length,
      critical: decisions.filter(d => d.priority === 'critical').length,
    };

    // Status distribution
    const statusDistribution = {
      open: decisions.filter(d => d.status === 'open').length,
      inProgress: decisions.filter(d => d.status === 'in-progress').length,
      closed: decisions.filter(d => d.status === 'closed').length,
    };

    setAnalytics({
      totalDecisions,
      openDecisions,
      closedDecisions,
      highPriorityDecisions,
      decisionsThisWeek,
      decisionsThisMonth,
      averageDecisionAge,
      priorityDistribution,
      statusDistribution,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Decisions</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.totalDecisions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Decisions</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.openDecisions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.highPriorityDecisions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.decisionsThisWeek}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
          <div className="space-y-3">
            {Object.entries(analytics.priorityDistribution).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(priority)}`}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        priority === 'critical' ? 'bg-red-500' :
                        priority === 'high' ? 'bg-orange-500' :
                        priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${(count / analytics.totalDecisions) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <div className="space-y-3">
            {Object.entries(analytics.statusDistribution).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        status === 'open' ? 'bg-green-500' :
                        status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${(count / analytics.totalDecisions) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{analytics.decisionsThisMonth}</p>
            <p className="text-sm text-gray-600">Decisions this month</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{analytics.averageDecisionAge.toFixed(1)}</p>
            <p className="text-sm text-gray-600">Average age (days)</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">
              {analytics.totalDecisions > 0 ? ((analytics.closedDecisions / analytics.totalDecisions) * 100).toFixed(1) : 0}%
            </p>
            <p className="text-sm text-gray-600">Completion rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
