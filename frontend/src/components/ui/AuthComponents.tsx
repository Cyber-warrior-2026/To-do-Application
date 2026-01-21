import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import React from 'react'; 


interface InputProps extends HTMLMotionProps<"input"> {
  label: string;
}

export const GlassInput = ({ label, ...props }: InputProps) => (
  <div className="mb-4">
    <label className="mb-1 block text-sm font-medium text-gray-300">{label}</label>
    <motion.input
      whileFocus={{ scale: 1.02, borderColor: "rgba(168, 85, 247, 0.8)" }}
      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none backdrop-blur-md transition-all placeholder:text-gray-500 focus:bg-white/10"
      {...props}
    />
  </div>
);


interface ButtonProps extends HTMLMotionProps<"button"> {
  isLoading?: boolean;
  children: React.ReactNode; 
}

export const NeonButton = ({ children, isLoading, ...props }: ButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)" }}
    whileTap={{ scale: 0.95 }}
    disabled={isLoading}
    className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 font-bold text-white transition-all disabled:opacity-70"
    {...props}
  >
    <div className="flex items-center justify-center gap-2">
      {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
      {children}
    </div>
  </motion.button>
);