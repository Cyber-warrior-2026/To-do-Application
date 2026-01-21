'use client';

import { useState, useEffect } from 'react';
import { Plus, SortAsc } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import TodoList from '@/components/todo/TodoList';
import TodoModal from '@/components/todo/TodoModal';
import StatsCard from '@/components/todo/StatsCard';
import { todoService } from '@/services/todo.service';
import { 
  Todo, 
  CreateTodoInput, 
  TodoStats, 
  TodoFilter, 
  TodoSort 
} from '@/types/todo.types';

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [sortBy, setSortBy] = useState<TodoSort>('createdAt');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [stats, setStats] = useState<TodoStats>({
    total: 0,
    completed: 0,
    active: 0,
    highPriority: 0,
  });

  // Fetch todos when filter or sort changes
  useEffect(() => {
    fetchTodos();
    fetchStats();
  }, [filter, sortBy]);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const data = await todoService.getTodos(filter, sortBy);
      setTodos(data);
    } catch (error) {
      toast.error('Failed to fetch todos');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await todoService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleCreateTodo = async (data: CreateTodoInput) => {
    try {
      if (editTodo) {
        await todoService.updateTodo(editTodo._id, data);
        toast.success('Task updated successfully! 🎉');
      } else {
        await todoService.createTodo(data);
        toast.success('Task created successfully! ✅');
      }
      setShowModal(false);
      setEditTodo(null);
      fetchTodos();
      fetchStats();
    } catch (error) {
      toast.error('Operation failed 😞');
      console.error(error);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const updated = await todoService.toggleTodo(id);
      setTodos(todos.map(todo => 
        todo._id === id ? updated : todo
      ));
      toast.success(updated.completed ? 'Task completed! 🎉' : 'Task reopened 🔄');
      fetchStats();
    } catch (error) {
      toast.error('Failed to update task');
      console.error(error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(todo => todo._id !== id));
      toast.success('Task deleted 🗑️');
      fetchStats();
    } catch (error) {
      toast.error('Failed to delete task');
      console.error(error);
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditTodo(todo);
    setShowModal(true);
  };

  const getFilteredTodos = () => {
    if (filter === 'all') return todos;
    if (filter === 'active') return todos.filter(t => !t.completed);
    if (filter === 'completed') return todos.filter(t => t.completed);
    return todos;
  };

  const filteredTodos = getFilteredTodos();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📝 Task Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your tasks efficiently and stay organized
          </p>
        </div>

        {/* Stats */}
        <StatsCard stats={stats} />

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filters */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'active'
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active ({stats.active})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'completed'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed ({stats.completed})
              </button>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <SortAsc className="w-4 h-4" />
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as TodoSort)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">Date Created</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            {/* Add Task Button */}
            <button
              onClick={() => {
                setEditTodo(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-semibold shadow-lg shadow-blue-500/30"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          </div>
        </div>

        {/* Todo List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <TodoList
            todos={filteredTodos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onEdit={handleEditTodo}
            isLoading={isLoading}
            filter={filter}
          />
        </div>
      </div>

      {/* Modal */}
      <TodoModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditTodo(null);
        }}
        onSubmit={handleCreateTodo}
        editTodo={editTodo}
      />
    </div>
  );
}
