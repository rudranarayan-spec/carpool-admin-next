"use client";

import { motion } from "framer-motion";
import { 
  Car, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight, 
  ShieldAlert, 
  Navigation,
  UserCheck,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Sparkles
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample Analytics Data for Ride Density Chart
const rideData = [
  { time: "06 AM", rides: 24 },
  { time: "09 AM", rides: 85 },
  { time: "12 PM", rides: 120 },
  { time: "03 PM", rides: 98 },
  { time: "06 PM", rides: 142 },
  { time: "09 PM", rides: 110 },
  { time: "12 AM", rides: 45 },
];

// Stat Card Data Config with Dynamic Colors
const stats = [
  {
    title: "ACTIVE LIVE RIDES",
    value: "142",
    change: "+12.5% from yesterday",
    isPositive: true,
    icon: Car,
    theme: {
      lightBg: "bg-emerald-50",
      lightBorder: "border-emerald-200/60",
      iconBg: "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
      badge: "text-emerald-700 bg-emerald-100/80 dark:bg-emerald-500/10 dark:text-emerald-400",
      accentGlow: "from-emerald-500/10 via-transparent to-transparent"
    }
  },
  {
    title: "TOTAL TRIPS TODAY",
    value: "1,284",
    change: "+8.2% vs last week",
    isPositive: true,
    icon: TrendingUp,
    theme: {
      lightBg: "bg-blue-50",
      lightBorder: "border-blue-200/60",
      iconBg: "bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
      badge: "text-blue-700 bg-blue-100/80 dark:bg-blue-500/10 dark:text-blue-400",
      accentGlow: "from-blue-500/10 via-transparent to-transparent"
    }
  },
  {
    title: "PENDING APPROVALS",
    value: "12",
    change: "Requires immediate review",
    isWarning: true,
    icon: Clock,
    theme: {
      lightBg: "bg-amber-50",
      lightBorder: "border-amber-200/60",
      iconBg: "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
      badge: "text-amber-700 bg-amber-100/80 dark:bg-amber-500/10 dark:text-amber-400",
      accentGlow: "from-amber-500/10 via-transparent to-transparent"
    }
  },
  {
    title: "PLATFORM REVENUE",
    value: "$42,850.20",
    change: "Updated 2m ago",
    isNeutral: true,
    icon: DollarSign,
    theme: {
      lightBg: "bg-violet-50",
      lightBorder: "border-violet-200/60",
      iconBg: "bg-violet-500/15 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400",
      badge: "text-violet-700 bg-violet-100/80 dark:bg-violet-500/10 dark:text-violet-400",
      accentGlow: "from-violet-500/10 via-transparent to-transparent"
    }
  },
];

// Pending Driver Approvals Queue
const driverQueue = [
  {
    id: "DRV-1024",
    name: "Alex Rivera",
    email: "alex.r@poolshare.io",
    vehicle: "Tesla Model 3 (2023)",
    plate: "7XYZ89",
    docs: "Verified (4/4)",
    date: "10 mins ago",
  },
  {
    id: "DRV-1025",
    name: "Sophia Chen",
    email: "sophia.c@poolshare.io",
    vehicle: "Toyota Prius (2022)",
    plate: "3ABC12",
    docs: "Pending Background",
    date: "25 mins ago",
  },
  {
    id: "DRV-1026",
    name: "Marcus Vance",
    email: "m.vance@poolshare.io",
    vehicle: "Hyundai Ioniq 5",
    plate: "9KLM45",
    docs: "Verified (4/4)",
    date: "1 hour ago",
  },
];

// Live Activity Feed Items
const liveActivities = [
  {
    id: 1,
    title: "New Pool Booking",
    subtitle: "Route: Tech Park → Downtown Hub",
    time: "2m ago",
    badge: "DISPATCH",
    icon: Navigation,
    type: "dispatch",
    badgeStyle: "bg-cyan-500/15 text-cyan-700 border-cyan-300 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30",
    iconStyle: "bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400",
  },
  {
    id: 2,
    title: "Dispute Flagged",
    subtitle: "Driver 'Marcus V.' reported passenger delay dispute.",
    time: "14m ago",
    badge: "RESOLVE NOW",
    icon: ShieldAlert,
    type: "alert",
    badgeStyle: "bg-rose-500/15 text-rose-700 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30",
    iconStyle: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
  },
  {
    id: 3,
    title: "Identity Verified",
    subtitle: "Sarah K. successfully completed facial recognition.",
    time: "45m ago",
    badge: "VERIFIED",
    icon: UserCheck,
    type: "success",
    badgeStyle: "bg-emerald-500/15 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30",
    iconStyle: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto text-slate-900 dark:text-slate-100">
      
      {/* 1. Header & Quick Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              System Overview
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
              <Sparkles className="w-3 h-3" /> Live Control
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mt-1">
            Real-time telemetry and fleet management operations
          </p>
        </div>

        {/* Global Search & Filter Trigger */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search driver, trip ID, route..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm backdrop-blur-md transition-all"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 shadow-sm backdrop-blur-md transition">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group border ${stat.theme.lightBorder} dark:border-white/10 bg-gradient-to-br from-white via-slate-50/50 to-white dark:from-[#0B0F17] dark:via-[#090C10] dark:to-[#0B0F17] shadow-sm hover:shadow-md dark:hover:border-white/20 transition-all backdrop-blur-md`}
            >
              {/* Subtle Gradient Accent Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.theme.accentGlow} opacity-60 pointer-events-none`} />

              <div className="flex items-center justify-between relative z-10">
                <span className="text-[11px] font-extrabold tracking-wider text-slate-500 dark:text-gray-400 uppercase">
                  {stat.title}
                </span>
                <div className={`p-2.5 rounded-xl ${stat.theme.iconBg} shadow-sm transition-transform group-hover:scale-110`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-4 relative z-10">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-extrabold ${stat.theme.badge}`}>
                    {stat.isWarning ? (
                      stat.change
                    ) : stat.isPositive ? (
                      <span className="flex items-center gap-0.5">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        {stat.change}
                      </span>
                    ) : (
                      stat.change
                    )}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Main Center Grid: Analytics & Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time Analytics Area Chart */}
        <div className="lg:col-span-2 rounded-2xl p-5 sm:p-6 flex flex-col justify-between border border-slate-200/80 dark:border-white/10 bg-gradient-to-br from-white to-slate-50/60 dark:from-[#0B0F17] dark:to-[#090C10] shadow-sm backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Live Ride Demand
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                Hourly trip volume across active zones
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Traffic
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rideData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRides" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} fontWeight={600} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} fontWeight={600} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    borderColor: "rgba(255, 255, 255, 0.15)",
                    borderRadius: "14px",
                    color: "#fff",
                    fontSize: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rides"
                  stroke="#2563EB"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRides)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="rounded-2xl p-5 sm:p-6 flex flex-col justify-between border border-slate-200/80 dark:border-white/10 bg-gradient-to-br from-white to-slate-50/60 dark:from-[#0B0F17] dark:to-[#090C10] shadow-sm backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Live Activity
              </h2>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                View All
              </span>
            </div>

            <div className="space-y-3.5 mt-5">
              {liveActivities.map((act) => {
                const Icon = act.icon;
                return (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/5 flex items-start gap-3.5 hover:border-blue-500/40 dark:hover:border-blue-500/40 shadow-xs transition-all group"
                  >
                    <div className={`p-2.5 rounded-xl mt-0.5 ${act.iconStyle} transition-transform group-hover:scale-105`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {act.title}
                        </h3>
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-gray-400 whitespace-nowrap">
                          {act.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5 truncate font-medium">
                        {act.subtitle}
                      </p>

                      <div className="mt-2">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border ${act.badgeStyle}`}>
                          {act.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Driver Approvals Data Table Queue */}
      <div className="rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-white/10 bg-gradient-to-br from-white to-slate-50/60 dark:from-[#0B0F17] dark:to-[#090C10] shadow-sm backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Driver Approval Queue
            </h2>
            <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
              Applications requiring compliance checks before dispatch access
            </p>
          </div>

          <button className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition">
            <span>View All Queue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-white/10 text-[11px] uppercase font-bold text-slate-400 dark:text-gray-400 tracking-wider">
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Vehicle Details</th>
                <th className="py-3 px-4">Documents</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-white/5 text-xs font-medium">
              {driverQueue.map((driver) => (
                <tr key={driver.id} className="hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{driver.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-gray-400">{driver.email}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 dark:text-gray-200 font-semibold">{driver.vehicle}</div>
                    <div className="text-[10px] font-mono text-slate-400 dark:text-gray-400 uppercase tracking-wider">{driver.plate}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-blue-100/80 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400 border border-blue-200/80 dark:border-blue-500/30">
                      {driver.docs}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 dark:text-gray-400 font-medium">
                    {driver.date}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition" title="Approve">
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition" title="Reject">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}