"use client";

import { motion } from "framer-motion";
import { Car, ShieldCheck, Route, Users2 } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-[#05070A] transition-colors duration-300">
      {/* Left Branding & Visual Hero Panel (Visible on lg screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#090C10] border-r border-slate-800 dark:border-white/10 p-12 flex-col justify-between overflow-hidden select-none">
        
        {/* Background Decorative Mesh Gradients */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding & Real-time Status */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-600/30 ring-1 ring-white/20">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
                PoolShare <span className="text-blue-500 font-extrabold text-xs px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">Admin</span>
              </h2>
              <p className="text-xs font-medium text-slate-400">
                Carpool Operations & Fleet Management
              </p>
            </div>
          </div>

          {/* Engine Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Dispatch Engine Online
          </div>
        </div>

        {/* Hero Copy & Dynamic Metrics Grid */}
        <div className="relative z-10 my-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-4"
          >
            <span className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider">
              Management Portal
            </span>
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
              Manage rides, drivers & payout workflows seamlessly.
            </h1>
            <p className="text-slate-400 text-sm xl:text-base max-w-md leading-relaxed font-medium">
              Real-time monitoring for ride requests, driver document approvals, user verification, and platform analytics.
            </p>
          </motion.div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-white/20 transition">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold mb-1.5">
                <Users2 className="w-4 h-4" /> Driver Approvals
              </div>
              <p className="text-xl font-extrabold text-white font-mono">Verified</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Automated KYC Checks</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-white/20 transition">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1.5">
                <Route className="w-4 h-4" /> Active Routes
              </div>
              <p className="text-xl font-extrabold text-white font-mono">Real-Time</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Live Trip Telemetry</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 font-mono pt-4 border-t border-white/5">
          <span>© {new Date().getFullYear()} PoolShare Platform Inc.</span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Admin Access
          </span>
        </div>
      </div>

      {/* Right Children Workspace Container (Form Content) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}