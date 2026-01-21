'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import SpotlightBackground from '@/components/ui/SpotlightBackground';
import { GlassInput, NeonButton } from '@/components/ui/AuthComponents';
import { AuthService } from '../../services/auth.service';
import { useAuth } from '@/context/AuthContext'; // Use the new hook

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth(); // We'll use this to auto-login after register
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await AuthService.register(form);
      toast.success('Identity Created. Welcome.');
      
      // Auto Login using the context
      if (response.token && response.user) {
        login(response.token, response.user);
      } else {
        router.push('/login');
      }

    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SpotlightBackground>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-4xl font-black text-transparent">
            NEW USER
          </h1>
          <p className="mt-2 text-gray-400">Join the system</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <GlassInput 
            label="Codename" 
            placeholder="Neo"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <GlassInput 
            label="Email" 
            type="email" 
            placeholder="neo@matrix.com"
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
            CREATE ACCOUNT
          </NeonButton>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an identity?{' '}
          <Link href="/login" className="text-purple-400 hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </SpotlightBackground>
  );
}