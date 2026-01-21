'use client';

import { Todo } from '@/types/todo.types';
import { Check, Trash2, Edit, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

export default function TodoCard({ todo, onToggle, onDelete, onEdit }: TodoCardProps) {
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50/50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50/50';
      case 'low':
        return 'border-l-green-500 bg-green-50/50';
      default:
        return 'border-l-gray-500 bg-gray-50/50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200',
    };
    return styles[priority as keyof typeof styles] || '';
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  return (
    <div
      className={`border-l-4 ${getPriorityStyles(todo.priority)} rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 bg-white`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(todo._id)}
          className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
            todo.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
          }`}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed && <Check className="w-4 h-4 text-white stroke-3" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-lg ${
              todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
            }`}
          >
            {todo.title}
          </h3>
          
          {todo.description && (
            <p className={`text-sm mt-1 ${
              todo.completed ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {todo.description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span
              className={`text-xs px-2 py-1 rounded-full border font-medium ${getPriorityBadge(
                todo.priority
              )}`}
            >
              {todo.priority.toUpperCase()}
            </span>

            {todo.dueDate && (
              <span
                className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                  isOverdue
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                }`}
              >
                <Calendar className="w-3 h-3" />
                {format(new Date(todo.dueDate), 'MMM dd, yyyy')}
                {isOverdue && ' (Overdue)'}
              </span>
            )}

            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(new Date(todo.createdAt), 'MMM dd')}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(todo)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            aria-label="Edit todo"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(todo._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            aria-label="Delete todo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
