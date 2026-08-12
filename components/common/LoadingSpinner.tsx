// @/components/common/LoadingSpinner.tsx
"use client";

import { motion } from "framer-motion";
import { Sparkles, Loader2, Compass } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  subtext?: string;
  variant?: "page" | "card" | "inline";
}

export default function LoadingSpinner({
  message = "Compiling Telemetry & Analytics",
  subtext = "Synthesizing real-time rides, user growth, and operational metrics...",
  variant = "page",
}: LoadingSpinnerProps) {
  // 1. INLINE VARIANT (For buttons / compact table cells)
  if (variant === "inline") {
    return (
      <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-md">
        <div className="relative flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
        </div>
        <span className="text-xs font-bold tracking-wide text-slate-700 dark:text-gray-300">
          {message}
        </span>
      </div>
    );
  }

  // 2. CARD / CONTAINER VARIANT (For embedding inside individual dashboard grids)
  if (variant === "card") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full min-h-[280px] flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-white/80 to-slate-50/50 dark:from-[#0B0F17]/80 dark:to-[#090C10]/50 border border-slate-200/80 dark:border-white/10 shadow-lg backdrop-blur-xl overflow-hidden"
      >
        {/* Subtle Ambient Backlight */}
        <div className="absolute inset-0 bg-radial from-blue-500/10 via-transparent to-transparent blur-2xl pointer-events-none" />

        {/* Pulsing Concentric Radar Rings */}
        <div className="relative flex items-center justify-center mb-4">
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-16 h-16 rounded-full border border-blue-500/30 dark:border-blue-400/20"
          />
          <motion.div
            animate={{ scale: [1, 1.45, 1], opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="absolute w-20 h-20 rounded-full border border-indigo-500/20 dark:border-indigo-400/10"
          />

          {/* Central Glass Orb */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-transparent border border-blue-500/30 dark:border-blue-400/30 shadow-xl backdrop-blur-md text-blue-600 dark:text-blue-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </div>

        {/* Typography with Shimmer Effect */}
        <div className="text-center max-w-xs space-y-1 relative z-10">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
            {message}
          </h4>
          {subtext && (
            <p className="text-[11px] font-medium text-slate-500 dark:text-gray-400 leading-relaxed">
              {subtext}
            </p>
          )}
        </div>
      </motion.div>
    );
  }

  // 3. FULL PAGE PREMIUM RADAR SWEEP (Default full view)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[75vh] w-full flex flex-col items-center justify-center p-6 space-y-6 relative overflow-hidden"
    >
      {/* Background Mesh Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-blue-600/15 via-indigo-500/10 to-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Central Interactive Loader Graphic */}
      <div className="relative flex items-center justify-center">
        {/* Continuous Rotating Radar Gradient Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 via-indigo-500 to-transparent shadow-2xl shadow-blue-500/20"
        >
          <div className="w-full h-full rounded-full bg-white dark:bg-[#090C10]" />
        </motion.div>

        {/* Inner Floating Glass Core */}
        <motion.div
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute p-4 rounded-2xl bg-white/90 dark:bg-[#0B0F17]/90 border border-slate-200 dark:border-white/15 shadow-2xl backdrop-blur-2xl flex items-center justify-center"
        >
          <Compass className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
        </motion.div>
      </div>

      {/* Dynamic Status Display */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="text-center space-y-2 max-w-sm z-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-widest mb-1">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Syncing Live Platform Data</span>
        </div>

        <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
          {message}
        </h3>

        {subtext && (
          <p className="text-xs font-medium text-slate-500 dark:text-gray-400 leading-relaxed">
            {subtext}
          </p>
        )}
      </motion.div>

      {/* Minimal Process Progress Line */}
      <div className="w-36 h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden relative">
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full"
        />
      </div>
    </motion.div>
  );
}