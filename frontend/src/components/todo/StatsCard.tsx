'use client';

import { TodoStats } from '@/types/todo.types';
import { CheckCircle2, Circle, AlertCircle, ListTodo } from 'lucide-react';

interface StatsCardProps {
  stats: TodoStats;
}

export default function StatsCard({ stats }: StatsCardProps) {
  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  const statItems = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: ListTodo,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: 'Active',
      value: stats.active,
      icon: Circle,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      label: 'High Priority',
      value: stats.highPriority,
      icon: AlertCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">📊 Your Progress</h2>
        <div className="text-right">
          <p className="text-sm text-gray-600">Completion Rate</p>
          <p className="text-2xl font-bold text-blue-600">{completionRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className={`${item.bgColor} rounded-lg p-4 border border-gray-200`}
          >
            <div className="flex items-center gap-3">
              <div className={`${item.color} p-2 rounded-lg`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{item.value}</p>
                <p className={`text-xs font-medium ${item.textColor}`}>
                  {item.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-linear-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}
