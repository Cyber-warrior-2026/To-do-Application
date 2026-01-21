'use client';

import { useState } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassInput, NeonButton } from '@/components/ui/AuthComponents'; 
import { Todo, CreateTodoInput } from '@/types/todo.types';

interface TodoModalProps {
  onClose: () => void;
  onSubmit: (data: CreateTodoInput) => Promise<void>;
  editTodo: Todo | null;
}

export default function TodoModal({ onClose, onSubmit, editTodo }: TodoModalProps) {
  const [loading, setLoading] = useState(false);
  
  // ✅ FIX: Initialize state directly from props once on mount.
  // No useEffect needed because we mount a fresh component every time.
  const [formData, setFormData] = useState<CreateTodoInput>({
    title: editTodo?.title || '',
    description: editTodo?.description || '',
    priority: editTodo?.priority || 'medium',
    dueDate: editTodo?.dueDate ? new Date(editTodo.dueDate).toISOString().split('T')[0] : '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  // Note: We removed the outer "fixed inset" div because AnimatePresence in the parent handles it now.
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <h2 className="text-xl font-bold text-white">
            {editTodo ? 'Reconfigure Directive' : 'New Directive'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <GlassInput
            label="Mission Objective"
            placeholder="e.g. Hack the Mainframe"
            value={formData.title} 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            autoFocus
          />

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Details</label>
            <textarea
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none backdrop-blur-md transition-all placeholder:text-gray-500 focus:bg-white/10 focus:border-purple-500/50 min-h-[100px]"
              placeholder="Add briefing notes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Priority
              </label>
              <select
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:bg-white/10 cursor-pointer"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              >
                <option value="low" className="bg-black">Low</option>
                <option value="medium" className="bg-black">Medium</option>
                <option value="high" className="bg-black">High</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Deadline
              </label>
              <input
                type="date"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:bg-white/10 [color-scheme:dark]"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-gray-400 hover:bg-white/5 hover:text-white transition"
            >
              Cancel
            </button>
            <div className="w-32">
              <NeonButton type="submit" isLoading={loading}>
                {editTodo ? 'Update' : 'Initialize'}
              </NeonButton>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}