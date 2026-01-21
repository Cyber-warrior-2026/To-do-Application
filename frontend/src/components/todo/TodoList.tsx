'use client';

import { Todo } from '../../types/todo.types';
import TodoCard from './TodoCard';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  isLoading: boolean;
  filter: string;
}

export default function TodoList({ 
  todos, 
  onToggle, 
  onDelete, 
  onEdit, 
  isLoading,
  filter 
}: TodoListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading your tasks...</p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📭</div>
        <p className="text-xl text-gray-600 font-semibold mb-2">
          No tasks found
        </p>
        <p className="text-gray-500">
          {filter !== 'all'
            ? `No ${filter} tasks. Try changing the filter.`
            : 'Create your first task to get started!'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoCard
          key={todo._id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
