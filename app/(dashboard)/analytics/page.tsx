/* eslint-disable react-hooks/immutability */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics.service";
import {
  AnalyticsQueryParams,
} from "@/types/analytics.types";
import {
  Users,
  Car,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Activity,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
  MapPin,
  Lightbulb,
  Sparkles,
  AlertCircle,
  Loader2,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "90d">("7d");
  const [compareMode, setCompareMode] = useState<"vs_previous" | "vs_prior_year">(
    "vs_previous"
  );

  // Map local state to API Query parameters
  const queryParams: AnalyticsQueryParams = {
    timeframe: timeRange.toUpperCase() as AnalyticsQueryParams["timeframe"],
    comparison: compareMode,
  };

  // React Query Hook
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["platform-performance", queryParams],
    queryFn: () => analyticsService.getPlatformPerformance(queryParams),
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (res) => res.data, // Extract data payload directly
  });

  const {
    data: growthData,
    isLoading: isGrowthLoading,
    isError: isGrowthError,
  } = useQuery({
    queryKey: ["dashboard-growth"],
    queryFn: () => analyticsService.getDashboardGrowth(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (res) => res.data, // Extract GrowthAndCorridorsData directly
  });

  if (isLoading || isGrowthLoading) {
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

  const userAcquisition = growthData?.user_acquisition;
  const topCorridors = growthData?.top_corridors;

  if (isError || isGrowthError) {
    return (
      <div className="p-8 min-h-screen flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-3 rounded-full bg-rose-500/10 text-rose-500">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">Failed to load analytics</h2>
        <p className="text-sm text-slate-500 dark:text-gray-400">
          {error instanceof Error ? error.message : "An error occurred while fetching data."}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const kpis = data?.kpis;
  const bookingVelocity = data?.booking_velocity;
  const capacityBreakdown = data?.capacity_breakdown;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 min-h-screen bg-slate-50 dark:bg-[#090C10] text-slate-900 dark:text-gray-100 transition-colors duration-300 max-w-[1600px] mx-auto">

      {/* 1. Header & Interactive Range Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <Activity className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {data?.overview.title || "Platform Performance"}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
              {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Real-time
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1 font-medium">
            {data?.overview.subtitle || "Comparative insights across user growth, ride conversions, seat occupancy, and revenue streams."}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Comparison Mode Toggle */}
          {/* <div className="flex bg-slate-200/70 dark:bg-white/5 p-1 rounded-xl border border-slate-300/60 dark:border-white/10 text-xs font-bold backdrop-blur-md">
            <button
              onClick={() => setCompareMode("vs_previous")}
              className={`px-3 py-1.5 rounded-lg transition-all ${compareMode === "vs_previous"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              vs Previous
            </button>
            <button
              onClick={() => setCompareMode("vs_prior_year")}
              className={`px-3 py-1.5 rounded-lg transition-all ${compareMode === "vs_prior_year"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              vs Prior Year
            </button>
          </div> */}

          {/* Time Filter Pills */}
          {/* <div className="flex bg-slate-200/70 dark:bg-white/5 p-1 rounded-xl border border-slate-300/60 dark:border-white/10 backdrop-blur-md">
            {(["24h", "7d", "30d", "90d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase transition-all ${timeRange === range
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
              >
                {range}
              </button>
            ))}
          </div> */}

          {/* Export Button */}
          <button className="px-3.5 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 shadow-sm backdrop-blur-md transition flex items-center gap-2 text-xs font-bold">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/50 via-white to-slate-50 dark:from-[#0B0F17] dark:via-[#090C10] dark:to-[#0B0F17] border border-emerald-200/60 dark:border-white/10 shadow-sm space-y-3 relative overflow-hidden backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-gray-400">
              {kpis?.total_revenue.label || "TOTAL REVENUE"}
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isLoading ? "---" : kpis?.total_revenue.formatted_value}
            </h3>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="px-2 py-0.5 rounded-md text-xs font-extrabold text-emerald-700 bg-emerald-100/80 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{kpis?.total_revenue.percentage_change}%
              </span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-gray-500">
                {kpis?.total_revenue.comparison_label}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Rides Conversion Rate */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl  from-blue-50/50 via-white to-slate-50 dark:from-[#0B0F17] dark:via-[#090C10] dark:to-[#0B0F17] border border-blue-200/60 dark:border-white/10 shadow-sm space-y-3 relative overflow-hidden backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-gray-400">
              {kpis?.rides_conversion_rate.label || "RIDES CONVERSION RATE"}
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isLoading ? "---" : kpis?.rides_conversion_rate.formatted_value}
            </h3>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="px-2 py-0.5 rounded-md text-xs font-extrabold text-blue-700 bg-blue-100/80 dark:bg-blue-500/10 dark:text-blue-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{kpis?.rides_conversion_rate.percentage_change}%
              </span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-gray-500">
                {kpis?.rides_conversion_rate.sub_text}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Active Platform Users */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-linear-to-br from-violet-50/50 via-white to-slate-50 dark:from-[#0B0F17] dark:via-[#090C10] dark:to-[#0B0F17] border border-violet-200/60 dark:border-white/10 shadow-sm space-y-3 relative overflow-hidden backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-gray-400">
              {kpis?.active_platform_users.label || "ACTIVE PLATFORM USERS"}
            </span>
            <div className="p-2.5 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isLoading ? "---" : kpis?.active_platform_users.formatted_value}
            </h3>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="px-2 py-0.5 rounded-md text-xs font-extrabold text-violet-700 bg-violet-100/80 dark:bg-violet-500/10 dark:text-violet-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{kpis?.active_platform_users.percentage_change}%
              </span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-gray-500">
                {kpis?.active_platform_users.breakdown.riders} Passengers • {kpis?.active_platform_users.breakdown.drivers} Drivers
              </span>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Avg Occupancy Rate */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/50 via-white to-slate-50 dark:from-[#0B0F17] dark:via-[#090C10] dark:to-[#0B0F17] border border-amber-200/60 dark:border-white/10 shadow-sm space-y-3 relative overflow-hidden backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-gray-400">
              {kpis?.avg_occupancy_rate.label || "AVG OCCUPANCY RATE"}
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isLoading ? "---" : kpis?.avg_occupancy_rate.formatted_value}
            </h3>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="px-2 py-0.5 rounded-md text-xs font-extrabold text-amber-700 bg-amber-100/80 dark:bg-amber-500/10 dark:text-amber-400 flex items-center gap-0.5">
                <ArrowDownRight className="w-3.5 h-3.5" />
                {kpis?.avg_occupancy_rate.change_value} {kpis?.avg_occupancy_rate.change_unit}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-gray-500">
                {kpis?.avg_occupancy_rate.target_text}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. Main Chart Row 1: Revenue vs Rides & Capacity Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Interactive Bar Chart Section */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50/60 dark:from-[#0B0F17] dark:to-[#090C10] border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-md space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                {bookingVelocity?.title || "Revenue & Ride Booking Velocity"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-medium mt-0.5">
                {bookingVelocity?.description}
              </p>
            </div>

            {/* Improved 7-Day Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-inner w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>Last 7 Days</span>
            </div>
          </div>

          {/* Recharts Bar Chart Container */}
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bookingVelocity?.chart_data || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
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
                <Legend
                  wrapperStyle={{ paddingTop: "15px", fontSize: "12px", fontWeight: "600" }}
                />
                <Bar
                  dataKey="rides_published"
                  name="Rides Published"
                  fill="#3B82F6"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="rides_booked"
                  name="Rides Booked"
                  fill="#10B981"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="prior_period_target"
                  name="Prior Period Target"
                  fill="#94A3B8"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Footer Stats */}
          <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-semibold text-slate-500 dark:text-gray-400 border-t border-slate-200/80 dark:border-white/10 gap-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-slate-400 rounded-full" />
              Prior period baseline included for velocity calculation
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              Average Fill Yield: {bookingVelocity?.average_fill_yield}%
            </span>
          </div>
        </div>

        {/* Capacity Breakdown Donut Chart */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50/60 dark:from-[#0B0F17] dark:to-[#090C10] border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-md flex flex-col justify-between space-y-6">
          {/* Header Section with Side-by-Side Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-violet-500" />
                {capacityBreakdown?.title || "Ride Capacity Breakdown"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-medium mt-0.5">
                {capacityBreakdown?.description}
              </p>
            </div>

            {/* Modern Last 7 Days Pill Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-inner w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              <Calendar className="w-3.5 h-3.5 text-violet-500" />
              <span>Last 7 Days</span>
            </div>
          </div>

          {/* Dynamic Conic Donut Graphic */}
          <div className="flex items-center justify-center my-2">
            {(() => {
              // Calculate dynamic degree stops from backend segments
              let cumulativeDeg = 0;
              const gradientStops = capacityBreakdown?.segments?.map((segment) => {
                const startDeg = cumulativeDeg;
                const degSpan = (segment.percentage / 100) * 360;
                cumulativeDeg += degSpan;
                return `${segment.color} ${startDeg.toFixed(1)}deg ${cumulativeDeg.toFixed(1)}deg`;
              }).join(", ");

              const backgroundStyle = gradientStops
                ? `conic-gradient(${gradientStops})`
                : `conic-gradient(#3b82f6 0deg 180deg, #10b981 180deg 270deg, #f59e0b 270deg 330deg, #ef4444 330deg 360deg)`;

              return (
                <div
                  className="relative w-44 h-44 rounded-full flex items-center justify-center p-4 shadow-xl hover:scale-105 transition-transform duration-300"
                  style={{ background: backgroundStyle }}
                >
                  <div className="w-32 h-32 rounded-full bg-white dark:bg-[#090C10] flex flex-col items-center justify-center text-center shadow-inner">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {capacityBreakdown?.formatted_total_rides || "0"}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-gray-400 uppercase tracking-widest font-bold">
                      Total Rides
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Dynamic Donut Legend Breakdown */}
          <div className="space-y-2 text-xs font-bold">
            {capacityBreakdown?.segments?.map((segment) => (
              <div
                key={segment.key}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shadow-sm"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-slate-700 dark:text-gray-200">{segment.label}</span>
                </div>
                <span className="font-mono text-slate-900 dark:text-gray-300">
                  {segment.percentage}% ({segment.formatted_count})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Main Chart Row 2: Demographics & Top Corridors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* User Acquisition Split Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-linear-to-br from-white to-slate-50/60 dark:from-[#0B0F17] dark:to-[#090C10] border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                User Acquisition Growth
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-medium mt-0.5">
                New Passenger vs Driver onboarding comparison
              </p>
            </div>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/80 dark:bg-emerald-500/10 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20">
              {isGrowthLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : `${userAcquisition?.total_new ?? 0} New`}
            </span>
          </div>

          <div className="space-y-4">
            {/* Passenger Onboarding Bar */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700 dark:text-gray-300">
                  {userAcquisition?.riders.label || "Passenger Onboarding"}
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                  {userAcquisition?.riders.count} Passengers ({userAcquisition?.riders.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${userAcquisition?.riders.percentage ?? 0}%` }}
                />
              </div>
            </div>

            {/* Driver Applications Bar */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700 dark:text-gray-300">
                  {userAcquisition?.drivers.label || "Verified Driver Applications"}
                </span>
                <span className="text-cyan-600 dark:text-cyan-400 font-mono">
                  {userAcquisition?.drivers.count} Drivers ({userAcquisition?.drivers.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${userAcquisition?.drivers.percentage ?? 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Dynamic AI Insight Callout Box */}
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3 text-xs text-indigo-900 dark:text-indigo-300 font-medium">
            <Lightbulb className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              {isGrowthLoading ? (
                <span>Analyzing onboarding trends...</span>
              ) : (
                userAcquisition?.ai_insight
              )}
            </div>
          </div>
        </div>
        {/* Top Routes & Corridors */}
        <div className="p-5 sm:p-6 rounded-2xl bg-linear-to-br from-white to-slate-50/60 dark:from-[#0B0F17] dark:to-[#090C10] border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-md space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-500" />
                Top Performing Corridors
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-medium mt-0.5">
                Highest trip density & fare volume by travel corridors
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 dark:text-gray-400 font-semibold">Avg Fare</span>
          </div>

          <div className="space-y-2.5">
            {isGrowthLoading ? (
              <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                Loading corridor insights...
              </div>
            ) : topCorridors && topCorridors.length > 0 ? (
              topCorridors.map((r, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs hover:border-blue-500/40 transition"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900 dark:text-white">{r.route}</p>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 font-medium">{r.volume}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">{r.fare}</p>
                    <p
                      className={`text-[10px] font-bold ${r.growth.startsWith("+")
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                        }`}
                    >
                      {r.growth} vs prev
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400">
                No corridor data available.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}