"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Car,
  TrendingUp,
  Clock,
  DollarSign,
  ArrowUpRight,
  ShieldAlert,
  Navigation,
  UserCheck,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  RefreshCw,
  AlertCircle,
  LucideIcon,
  FileCheck2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { dashboardService } from "@/services/dashboard.service";
import { RecentActivity } from "@/types/dashboard.types";
import { DriverApproval } from "@/services/driver.service";
import { Driver, DriverDocument } from "@/types/driver.types";
import LoadingSpinner from "@/components/common/LoadingSpinner";

// Helper function to format ISO timestamps into relative time (e.g. "2m ago")
function formatRelativeTime(isoString: string): string {
  if (!isoString) return "Just now";
  const now = new Date();
  const past = new Date(isoString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return `${Math.max(1, diffInSeconds)}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

// Maps backend activity type/action to UI styling & Lucide icon
function getActivityConfig(activity: RecentActivity): {
  icon: LucideIcon;
  badge: string;
  badgeStyle: string;
  iconStyle: string;
} {
  switch (activity.type?.toLowerCase()) {
    case "rides":
      return {
        icon: Navigation,
        badge: activity.action || "DISPATCH",
        badgeStyle:
          "bg-cyan-500/15 text-cyan-700 border-cyan-300 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30",
        iconStyle:
          "bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400",
      };
    case "drivers":
      return {
        icon: UserCheck,
        badge: activity.action || "DRIVER_UPDATE",
        badgeStyle:
          "bg-emerald-500/15 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30",
        iconStyle:
          "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
      };
    default:
      return {
        icon: ShieldAlert,
        badge: activity.action || "SYSTEM",
        badgeStyle:
          "bg-rose-500/15 text-rose-700 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30",
        iconStyle:
          "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
      };
  }
}

function formatDocumentStatus(documents: DriverDocument[] = []): string {
  if (!documents.length) return "0 Docs Uploaded";
  const approvedCount = documents.filter(
    (doc) => doc.status === "approved"
  ).length;
  return `Verified (${approvedCount}/${documents.length})`;
}

export default function DashboardPage() {
  const router = useRouter();

  // 1. React Query integration for live dashboard metrics
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-dashboard-bootstrap"],
    queryFn: () => dashboardService.getDashboardBootstrap(),
    refetchInterval: 15000,
    staleTime: 10000,
  });

  const dashboardData = data?.data;

  const { data: pendingDriversData, isLoading: isPendingDriversLoading } =
    useQuery({
      queryKey: ["pending-drivers"],
      queryFn: () => DriverApproval.getPendingDrivers({ page: 1, limit: 5 }),
      staleTime: 10000,
    });

  const pendingDrivers: Driver[] = pendingDriversData?.data || [];

  // Dynamic stat cards configuration built from API response
  const statsConfig = [
    {
      title: "ACTIVE LIVE RIDES",
      value:
        dashboardData?.metrics?.active_live_rides?.value?.toString() ?? "0",
      change: `${
        dashboardData?.metrics?.active_live_rides?.percentage_change ?? 0
      }% ${
        dashboardData?.metrics?.active_live_rides?.comparison_period ?? ""
      }`,
      isPositive: true,
      icon: Car,
      theme: {
        lightBorder: "border-emerald-200/60",
        iconBg:
          "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
        badge:
          "text-emerald-700 bg-emerald-100/80 dark:bg-emerald-500/10 dark:text-emerald-400",
        accentGlow: "from-emerald-500/10 via-transparent to-transparent",
      },
    },
    {
      title: "TOTAL BOOKINGS TODAY",
      value:
        dashboardData?.metrics?.total_trips_today?.value?.toString() ?? "0",
      change: `${
        dashboardData?.metrics?.total_trips_today?.percentage_change ?? 0
      }% ${
        dashboardData?.metrics?.total_trips_today?.comparison_period ?? ""
      }`,
      isPositive: true,
      icon: TrendingUp,
      theme: {
        lightBorder: "border-blue-200/60",
        iconBg:
          "bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
        badge:
          "text-blue-700 bg-blue-100/80 dark:bg-blue-500/10 dark:text-blue-400",
        accentGlow: "from-blue-500/10 via-transparent to-transparent",
      },
    },
    {
      title: "PENDING APPROVALS",
      value:
        dashboardData?.metrics?.pending_approvals?.value?.toString() ?? "0",
      change:
        dashboardData?.metrics?.pending_approvals?.status_label ??
        "Requires review",
      isWarning: true,
      icon: Clock,
      theme: {
        lightBorder: "border-amber-200/60",
        iconBg:
          "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
        badge:
          "text-amber-700 bg-amber-100/80 dark:bg-amber-500/10 dark:text-amber-400",
        accentGlow: "from-amber-500/10 via-transparent to-transparent",
      },
    },
    {
      title: "PLATFORM REVENUE",
      value: dashboardData?.metrics?.platform_revenue
        ? `${
            dashboardData.metrics.platform_revenue.currency === "INR"
              ? "₹"
              : "$"
          }${dashboardData.metrics.platform_revenue.value.toLocaleString()}`
        : "₹0.00",
      change: dashboardData?.metrics?.platform_revenue?.last_updated
        ? `Updated ${formatRelativeTime(
            dashboardData.metrics.platform_revenue.last_updated
          )}`
        : "Live",
      isNeutral: true,
      icon: DollarSign,
      theme: {
        lightBorder: "border-violet-200/60",
        iconBg:
          "bg-violet-500/15 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400",
        badge:
          "text-violet-700 bg-violet-100/80 dark:bg-violet-500/10 dark:text-violet-400",
        accentGlow: "from-violet-500/10 via-transparent to-transparent",
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50 dark:bg-[#090C10] max-w-[1600px] mx-auto flex items-center justify-center">
        <LoadingSpinner 
          message="Compiling Platform Analytics" 
          subtext="Fetching telemetry metrics, ride conversions, and revenue insights..." 
          variant="page"
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-4 space-y-8 max-w-[1600px] mx-auto text-slate-900 dark:text-slate-100">
      {/* 1. Header & Controls */}
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

        {/* Search Bar & Manual Refresh */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search driver, trip ID, route..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-xs backdrop-blur-md transition-all"
            />
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 shadow-xs backdrop-blur-md transition disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                isFetching ? "animate-spin text-blue-500" : ""
              }`}
            />
          </button>

          <button className="p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 shadow-xs backdrop-blur-md transition">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {isError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>
              Failed to synchronize live dashboard data:{" "}
              {(error as Error)?.message || "Network Error"}
            </span>
          </div>
          <button
            onClick={() => refetch()}
            className="underline hover:text-rose-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-32 rounded-2xl bg-slate-200/60 dark:bg-white/5 animate-pulse"
              />
            ))
          : statsConfig.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group border ${stat.theme.lightBorder} dark:border-white/10 bg-gradient-to-br from-white via-slate-50/50 to-white dark:from-[#0B0F17] dark:via-[#090C10] dark:to-[#0B0F17] shadow-xs hover:shadow-md dark:hover:border-white/20 transition-all backdrop-blur-md`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.theme.accentGlow} opacity-60 pointer-events-none`}
                  />

                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[11px] font-extrabold tracking-wider text-slate-500 dark:text-gray-400 uppercase">
                      {stat.title}
                    </span>
                    <div
                      className={`p-2.5 rounded-xl ${stat.theme.iconBg} shadow-xs transition-transform group-hover:scale-110`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="mt-4 relative z-10">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      {stat.value}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs font-extrabold ${stat.theme.badge}`}
                      >
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

      {/* 3. Main Center Grid: Chart Analytics & Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Analytics Area Chart */}
        <div className="lg:col-span-2 rounded-2xl p-5 sm:p-6 flex flex-col justify-between border border-slate-200/80 dark:border-white/10 bg-gradient-to-br from-white to-slate-50/60 dark:from-[#0B0F17] dark:to-[#090C10] shadow-xs backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Live Ride Demand
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                7-day continuous trip volume telemetry
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Traffic
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-6">
            {isLoading ? (
              <div className="w-full h-full bg-slate-200/50 dark:bg-white/5 rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dashboardData?.live_ride_demand || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRides" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#2563EB"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="#2563EB"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    stroke="#64748B"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    fontWeight={600}
                  />
                  <YAxis
                    stroke="#64748B"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    fontWeight={600}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderColor: "rgba(255, 255, 255, 0.15)",
                      borderRadius: "14px",
                      color: "#fff",
                      fontSize: "12px",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="volume"
                    name="Ride Volume"
                    stroke="#2563EB"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRides)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="rounded-2xl p-5 sm:p-6 flex flex-col justify-between border border-slate-200/80 dark:border-white/10 bg-gradient-to-br from-white to-slate-50/60 dark:from-[#0B0F17] dark:to-[#090C10] shadow-xs backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Live Activity
              </h2>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                View All
              </span>
            </div>

            <div className="space-y-3.5 mt-5 max-h-[320px] overflow-y-auto pr-1">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-16 rounded-xl bg-slate-200/60 dark:bg-white/5 animate-pulse"
                  />
                ))
              ) : (dashboardData?.recent_activities ?? []).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">
                  No recent activity logged
                </p>
              ) : (
                dashboardData?.recent_activities.map((act) => {
                  const config = getActivityConfig(act);
                  const Icon = config.icon;
                  return (
                    <div
                      key={act.id}
                      className="p-3.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/5 flex items-start gap-3.5 hover:border-blue-500/40 dark:hover:border-blue-500/40 shadow-xs transition-all group"
                    >
                      <div
                        className={`p-2.5 rounded-xl mt-0.5 ${config.iconStyle} transition-transform group-hover:scale-105`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate capitalize">
                            {act.type} Event
                          </h3>
                          <span className="text-[10px] font-semibold text-slate-400 dark:text-gray-400 whitespace-nowrap">
                            {formatRelativeTime(act.timestamp)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5 truncate font-medium">
                          {act.description}
                        </p>

                        <div className="mt-2">
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-md border ${config.badgeStyle}`}
                          >
                            {config.badge}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Driver Approvals Queue Table Section */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-gradient-to-br from-white to-slate-50/60 dark:from-[#0B0F17] dark:to-[#090C10] shadow-xs backdrop-blur-md overflow-hidden">
        {/* Table Header Section */}
        <div className="p-5 sm:p-6 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Pending Driver Approvals
            </h2>
            <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
              Review and process onboarding applications for new drivers
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-extrabold">
            {pendingDrivers.length} Action Required
          </span>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-white/10 text-[11px] uppercase font-bold text-slate-400 dark:text-gray-400 tracking-wider bg-slate-50/50 dark:bg-white/[0.02]">
                <th className="py-3.5 px-6">Applicant</th>
                <th className="py-3.5 px-6">Vehicles & Contact</th>
                <th className="py-3.5 px-6">Compliance Status</th>
                <th className="py-3.5 px-6">Submitted</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/60 dark:divide-white/5 text-xs font-medium">
              {isPendingDriversLoading ? (
                // Loading Skeleton Rows
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td colSpan={5} className="py-4 px-6">
                      <div className="h-10 bg-slate-200/60 dark:bg-white/5 rounded-xl w-full" />
                    </td>
                  </tr>
                ))
              ) : pendingDrivers.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="p-3 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400">
                        <FileCheck2 className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-500 dark:text-gray-400">
                        All pending driver applications have been processed.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Live Data Rows
                pendingDrivers.map((driver) => (
                  <tr
                    key={driver.id}
                    onClick={() => router.push(`/users/${driver.id}`)}
                    className="group hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-colors cursor-pointer"
                  >
                    {/* Applicant */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {driver.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-gray-400">
                        {driver.email}
                      </div>
                    </td>

                    {/* Vehicles & Contact */}
                    <td className="py-4 px-6">
                      <div className="text-slate-800 dark:text-gray-200 font-semibold">
                        {driver.total_vehicles} Registered Vehicle(s)
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 dark:text-gray-400 uppercase tracking-wider">
                        {driver.phone || "N/A"}
                      </div>
                    </td>

                    {/* Documents Summary Badge */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200/80 dark:border-blue-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        {formatDocumentStatus(driver.documents)}
                      </span>
                    </td>

                    {/* Submitted Date */}
                    <td className="py-4 px-6 text-slate-500 dark:text-gray-400 font-medium">
                      {formatRelativeTime(driver.created_at)}
                    </td>

                    {/* Navigation Action */}
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 text-slate-600 dark:text-gray-300 font-semibold text-[11px] transition-all duration-200 shadow-2xs">
                        <span>Review</span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}