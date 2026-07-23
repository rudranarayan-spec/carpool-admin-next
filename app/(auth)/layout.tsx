"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Activity, Terminal, Server } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex bg-gray-50 dark:bg-[#05070A] transition-colors duration-300">
      {/* Left Branding / Visual Panel (Visible on lg screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#090C10] border-r border-white/10 p-12 flex-col justify-between overflow-hidden select-none">
        
        {/* Background Decorative Gradients */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo & System Status */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-600/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                ControlTower
              </h2>
              <p className="text-xs font-medium text-gray-400">
                Core System Admin Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Node-v20 Active
          </div>
        </div>

        {/* Hero Copy & Dynamic Badges */}
        <div className="relative z-10 my-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <span className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider">
              Secure Auth Portal
            </span>
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
              Enterprise Control & Audit Intelligence.
            </h1>
            <p className="text-gray-400 text-sm xl:text-base max-w-md leading-relaxed font-medium">
              Access system telemetry, driver management, automated payment workflows, and real-time audit logs in one central hub.
            </p>
          </motion.div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold mb-1">
                <Activity className="w-4 h-4" /> Activity Logs
              </div>
              <p className="text-xl font-bold text-white font-mono">100% Audit</p>
              <p className="text-[11px] text-gray-500 font-medium">Immutable User Ledger</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold mb-1">
                <Server className="w-4 h-4" /> Server Telemetry
              </div>
              <p className="text-xl font-bold text-white font-mono">99.98%</p>
              <p className="text-[11px] text-gray-500 font-medium">Active Cron Monitoring</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 flex items-center justify-between text-xs text-gray-500 font-mono">
          <span>© 2026 Internal Control System</span>
          <span className="flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5 text-gray-400" /> Authorized Personnel Only
          </span>
        </div>
      </div>

      {/* Right Children Workspace Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}