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
  ChevronRight
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

// Stat Card Data Config
const stats = [
  {
    title: "ACTIVE LIVE RIDES",
    value: "142",
    change: "+12.5% from yesterday",
    isPositive: true,
    icon: Car,
    chartData: [12, 18, 25, 30, 22, 40, 52],
  },
  {
    title: "TOTAL TRIPS TODAY",
    value: "1,284",
    change: "+8.2% vs last week",
    isPositive: true,
    icon: TrendingUp,
  },
  {
    title: "PENDING APPROVALS",
    value: "12",
    change: "Requires immediate review",
    isWarning: true,
    icon: Clock,
  },
  {
    title: "PLATFORM REVENUE",
    value: "$42,850.20",
    change: "Updated 2m ago",
    isNeutral: true,
    icon: DollarSign,
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
  },
  {
    id: 2,
    title: "Dispute Flagged",
    subtitle: "Driver 'Marcus V.' reported passenger delay dispute.",
    time: "14m ago",
    badge: "RESOLVE NOW",
    icon: ShieldAlert,
    type: "alert",
  },
  {
    id: 3,
    title: "Identity Verified",
    subtitle: "Sarah K. successfully completed facial recognition.",
    time: "45m ago",
    badge: "VERIFIED",
    icon: UserCheck,
    type: "success",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto text-gray-900 dark:text-gray-100">
      
      {/* 1. Header & Quick Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            System Overview
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            Real-time telemetry and fleet management operations
          </p>
        </div>

        {/* Global Search & Filter Trigger */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search driver, trip ID, route..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition">
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
              className="poolshare-card rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-blue-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider text-gray-500 dark:text-gray-400">
                  {stat.title}
                </span>
                <div className="p-2 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold">
                  {stat.isWarning ? (
                    <span className="text-amber-500 dark:text-amber-400">{stat.change}</span>
                  ) : stat.isPositive ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      {stat.change}
                    </span>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">{stat.change}</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Main Center Grid: Analytics & Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time Analytics Area Chart */}
        <div className="lg:col-span-2 poolshare-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200/10 dark:border-white/10">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Live Ride Demand
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Hourly trip volume across active zones</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-500">Live Traffic</span>
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
                <XAxis dataKey="time" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rides"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRides)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="poolshare-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-200/10 dark:border-white/10">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Live Activity
              </h2>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                View All
              </span>
            </div>

            <div className="space-y-4 mt-5">
              {liveActivities.map((act) => {
                const Icon = act.icon;
                return (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 flex items-start gap-3.5 hover:border-blue-500/30 transition-all"
                  >
                    <div
                      className={`p-2 rounded-lg mt-0.5 ${
                        act.type === "alert"
                          ? "bg-rose-500/10 text-rose-500"
                          : act.type === "dispatch"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-emerald-500/10 text-emerald-500"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                          {act.title}
                        </h3>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                          {act.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {act.subtitle}
                      </p>

                      <div className="mt-2">
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                            act.type === "alert"
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          }`}
                        >
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
      <div className="poolshare-card rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gray-200/10 dark:border-white/10">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Driver Approval Queue
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Applications requiring compliance checks before dispatch access
            </p>
          </div>

          <button className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition">
            <span>View All Queue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200/10 dark:border-white/10 text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Vehicle Details</th>
                <th className="py-3 px-4">Documents</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/10 dark:divide-white/5 text-xs font-medium">
              {driverQueue.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-500/5 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-900 dark:text-white">{driver.name}</div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">{driver.email}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-gray-800 dark:text-gray-200">{driver.vehicle}</div>
                    <div className="text-[10px] font-mono text-gray-400 uppercase">{driver.plate}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">
                      {driver.docs}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400">
                    {driver.date}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition" title="Approve">
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition" title="Reject">
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