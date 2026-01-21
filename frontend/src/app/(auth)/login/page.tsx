'use client';

import { AxiosError } from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import SpotlightBackground from '@/components/ui/SpotlightBackground';
import { GlassInput, NeonButton } from '@/components/ui/AuthComponents';
import { AuthService } from '../../services/auth.service';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await AuthService.login(form);
      toast.success('Welcome back, Commander.');
      router.push('/dashboard');
      
    } catch (err) {
      
      const error = err as AxiosError<{ message: string }>;
      
      const errorMessage = error.response?.data?.message || 'Login Failed';
      toast.error(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <SpotlightBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-4xl font-black text-transparent">
            NEON TODO
          </h1>
          <p className="mt-2 text-gray-400">Enter the system</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <GlassInput 
            label="Email" 
            type="email" 
            placeholder="cyber@punk.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <GlassInput 
            label="Password" 
            type="password" 
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <NeonButton type="submit" isLoading={loading}>
            INITIATE SEQUENCE
          </NeonButton>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          New user?{' '}
          <Link href="/register" className="text-purple-400 hover:text-purple-300 hover:underline">
            Create Identity
          </Link>
        </p>
      </motion.div>
    </SpotlightBackground>
  );
}