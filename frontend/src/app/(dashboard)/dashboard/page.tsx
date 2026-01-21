'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, SortAsc, LayoutGrid, CheckCircle2, 
  Clock, AlertCircle, Shield, LogOut, X, LucideIcon 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { AxiosError } from 'axios'; // 👈 Import this for error handling

// Components
import TodoList from '@/components/todo/TodoList';
import TodoModal from '@/components/todo/TodoModal';
import SpotlightBackground from '@/components/ui/SpotlightBackground';
import { GlassInput, NeonButton } from '@/components/ui/AuthComponents';

// Services & Types
import { todoService } from '@/services/todo.service';
import { useAuth } from '@/context/AuthContext';
import { Todo, CreateTodoInput, TodoStats, TodoFilter, TodoSort } from '@/types/todo.types';
import api from '@/lib/axios';

export default function DashboardPage() {
  // --- STATE ---
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [sortBy, setSortBy] = useState<TodoSort>('createdAt');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [stats, setStats] = useState<TodoStats>({
    total: 0, completed: 0, active: 0, highPriority: 0,
  });

  // Password Form State
  const [passForm, setPassForm] = useState({ current: '', new: '' });
  const [passLoading, setPassLoading] = useState(false);

  // --- EFFECTS ---
  useEffect(() => {
    fetchTodos();
    fetchStats();
  }, [filter, sortBy]);

  // --- API ACTIONS ---
  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const data = await todoService.getTodos(filter, sortBy);
      setTodos(data);
    } catch (error) {
      // Simple error logging doesn't need strict typing
      console.error(error);
      toast.error('Could not sync with the matrix.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await todoService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Stats sync failed:', error);
    }
  };

  const handleCreateTodo = async (data: CreateTodoInput) => {
    try {
      if (editTodo) {
        await todoService.updateTodo(editTodo._id, data);
        toast.success('Task reconfigured successfully.');
      } else {
        await todoService.createTodo(data);
        toast.success('New directive established.');
      }
      setShowTodoModal(false);
      setEditTodo(null);
      fetchTodos();
      fetchStats();
    } catch (error) {
      toast.error('Operation failed.');
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const updated = await todoService.toggleTodo(id);
      setTodos(todos.map(t => t._id === id ? updated : t));
      toast.success(updated.completed ? 'Objective complete.' : 'Objective reopened.');
      fetchStats();
    } catch (error) {
      toast.error('Update failed.');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!confirm('Purge this directive?')) return;
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(t => t._id !== id));
      toast.success('Directive purged.');
      fetchStats();
    } catch (error) {
      toast.error('Delete failed.');
    }
  };

  // --- PASSWORD CHANGE LOGIC (FIXED ERROR HANDLING) ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passForm.current,
        newPassword: passForm.new
      });
      toast.success('Security protocols updated.');
      setShowPasswordModal(false);
      setPassForm({ current: '', new: '' });
      
    } catch (err) { // 👈 Error is 'unknown' here
      // Strictly type the error to access response data safely
      const error = err as AxiosError<{ message: string }>;
      const msg = error.response?.data?.message || 'Update failed';
      toast.error(msg);
      
    } finally {
      setPassLoading(false);
    }
  };

  // --- ANIMATION VARIANTS ---
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <SpotlightBackground>
      <div className="relative z-10 min-h-screen w-full p-4 md:p-8">
        
        {/* TOP HEADER */}
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-4xl font-black text-transparent">
              COMMAND CENTER
            </h1>
            <p className="text-gray-400">Welcome back, {user?.name || 'User'}</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 backdrop-blur-md transition hover:bg-white/10"
            >
              <Shield className="h-4 w-4 text-purple-400" />
              Security
            </button>
            <button 
              onClick={logout}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-red-500/10 px-4 py-2 text-sm text-red-400 backdrop-blur-md transition hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4" />
              Disconnect
            </button>
          </div>
        </header>

        {/* STATS GRID */}
        <motion.div 
          variants={containerVars}
          initial="hidden"
          animate="show"
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* 👈 Pass correct typed props here */}
          <StatCard label="Total Directives" value={stats.total} icon={LayoutGrid} color="text-blue-400" />
          <StatCard label="Active" value={stats.active} icon={Clock} color="text-yellow-400" />
          <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} color="text-green-400" />
          <StatCard label="High Priority" value={stats.highPriority} icon={AlertCircle} color="text-red-400" />
        </motion.div>

        {/* CONTROLS BAR */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl">
          
          {/* Filters */}
          <div className="flex gap-2">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filter === f 
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <SortAsc className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as TodoSort)}
                className="appearance-none rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-8 text-sm text-gray-300 outline-none focus:border-purple-500/50"
              >
                <option value="createdAt">Date Created</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            {/* Add Button */}
            <NeonButton onClick={() => { setEditTodo(null); setShowTodoModal(true); }}>
              <Plus className="h-5 w-5" />
              NEW TASK
            </NeonButton>
          </div>
        </div>

        {/* TODO LIST */}
        <motion.div 
          layout 
          className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm"
        >
          <TodoList
            todos={todos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onEdit={(todo) => { setEditTodo(todo); setShowTodoModal(true); }}
            isLoading={isLoading}
            filter={filter}
          />
        </motion.div>
      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f0f0f] p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Update Credentials</h3>
                <button onClick={() => setShowPasswordModal(false)} className="text-gray-500 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleChangePassword}>
                <GlassInput 
                  label="Current Password" type="password" 
                  value={passForm.current}
                  onChange={e => setPassForm({...passForm, current: e.target.value})}
                />
                <GlassInput 
                  label="New Password" type="password" 
                  value={passForm.new}
                  onChange={e => setPassForm({...passForm, new: e.target.value})}
                />
                <div className="mt-6 flex justify-end gap-3">
                  <button 
                    type="button" onClick={() => setShowPasswordModal(false)}
                    className="rounded-lg px-4 py-2 text-sm text-gray-400 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <NeonButton type="submit" isLoading={passLoading}>
                    Confirm Update
                  </NeonButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <TodoModal
        isOpen={showTodoModal}
        onClose={() => { setShowTodoModal(false); setEditTodo(null); }}
        onSubmit={handleCreateTodo}
        editTodo={editTodo}
      />
      
    </SpotlightBackground>
  );
}

// --- FIX: STRICTLY TYPED STAT CARD ---
// 1. Define the interface
interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon; // 👈 Strict type for Lucide icons
  color: string;
}

// 2. Use the interface in the component
function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <motion.div 
      variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}
      whileHover={{ y: -5 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
    >
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${color} opacity-10 blur-xl`}></div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{label}</p>
          <p className="mt-1 text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`rounded-full bg-white/5 p-3 ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}