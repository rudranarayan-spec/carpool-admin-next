"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Car,
  Clock,
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
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Sample Bar Chart Analytics Data
const chartData = [
  { day: "Mon", published: 2100, booked: 1820, oldBooked: 1500 },
  { day: "Tue", published: 2450, booked: 2100, oldBooked: 1750 },
  { day: "Wed", published: 2300, booked: 1950, oldBooked: 1680 },
  { day: "Thu", published: 2800, booked: 2400, oldBooked: 1900 },
  { day: "Fri", published: 3400, booked: 2980, oldBooked: 2200 },
  { day: "Sat", published: 1900, booked: 1450, oldBooked: 1300 },
  { day: "Sun", published: 1500, booked: 1100, oldBooked: 950 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [compareMode, setCompareMode] = useState<"prev_period" | "prior_year">(
    "prev_period"
  );

  const isMonth = timeRange === "30d" || timeRange === "90d";

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 min-h-screen bg-slate-50 dark:bg-[#090C10] text-slate-900 dark:text-gray-100 transition-colors duration-300 max-w-[1600px] mx-auto">
      
      {/* 1. Header & Interactive Range Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <Activity className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Platform Performance
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
              <Sparkles className="w-3 h-3" /> Real-time
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1 font-medium">
            Comparative insights across user growth, ride conversions, seat occupancy, and revenue streams.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Comparison Mode Toggle */}
          <div className="flex bg-slate-200/70 dark:bg-white/5 p-1 rounded-xl border border-slate-300/60 dark:border-white/10 text-xs font-bold backdrop-blur-md">
            <button
              onClick={() => setCompareMode("prev_period")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                compareMode === "prev_period"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              vs Previous
            </button>
            <button
              onClick={() => setCompareMode("prior_year")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                compareMode === "prior_year"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              vs Prior Year
            </button>
          </div>

          {/* Time Filter Pills */}
          <div className="flex bg-slate-200/70 dark:bg-white/5 p-1 rounded-xl border border-slate-300/60 dark:border-white/10 backdrop-blur-md">
            {["24h", "7d", "30d", "90d"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase transition-all ${
                  timeRange === range
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

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
              Total Revenue
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isMonth ? "$142,850" : "$38,420"}
            </h3>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="px-2 py-0.5 rounded-md text-xs font-extrabold text-emerald-700 bg-emerald-100/80 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {compareMode === "prev_period" ? "+14.2%" : "+28.6%"}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-gray-500">
                {compareMode === "prev_period" ? "vs prior period" : "vs YoY"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Rides Conversion Rate */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/50 via-white to-slate-50 dark:from-[#0B0F17] dark:via-[#090C10] dark:to-[#0B0F17] border border-blue-200/60 dark:border-white/10 shadow-sm space-y-3 relative overflow-hidden backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-gray-400">
              Rides Conversion Rate
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              81.4%
            </h3>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="px-2 py-0.5 rounded-md text-xs font-extrabold text-blue-700 bg-blue-100/80 dark:bg-blue-500/10 dark:text-blue-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +3.8%
              </span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-gray-500">
                12.4k booked / 15.3k published
              </span>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Active Platform Users */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-violet-50/50 via-white to-slate-50 dark:from-[#0B0F17] dark:via-[#090C10] dark:to-[#0B0F17] border border-violet-200/60 dark:border-white/10 shadow-sm space-y-3 relative overflow-hidden backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-gray-400">
              Active Platform Users
            </span>
            <div className="p-2.5 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              24,910
            </h3>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="px-2 py-0.5 rounded-md text-xs font-extrabold text-violet-700 bg-violet-100/80 dark:bg-violet-500/10 dark:text-violet-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +8.5%
              </span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-gray-500">
                19.2k Riders • 5.7k Drivers
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
              Avg Occupancy Rate
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              3.2 / 4
            </h3>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="px-2 py-0.5 rounded-md text-xs font-extrabold text-amber-700 bg-amber-100/80 dark:bg-amber-500/10 dark:text-amber-400 flex items-center gap-0.5">
                <ArrowDownRight className="w-3.5 h-3.5" />
                -0.1 seats
              </span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-gray-500">
                Target: 3.5 seats per car
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. Main Chart Row 1: Revenue vs Rides & Capacity Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Bar Chart Section */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50/60 dark:from-[#0B0F17] dark:to-[#090C10] border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Revenue & Ride Booking Velocity
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-medium mt-0.5">
                Comparison of total rides offered versus actual passenger seat conversions
              </p>
            </div>
          </div>

          {/* Recharts Bar Chart Container */}
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} fontWeight={600} />
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
                <Legend 
                  wrapperStyle={{ paddingTop: "15px", fontSize: "12px", fontWeight: "600" }}
                />
                <Bar dataKey="published" name="Rides Published" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="booked" name="Rides Booked" fill="#10B981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="oldBooked" name="Prior Period Target" fill="#94A3B8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-semibold text-slate-500 dark:text-gray-400 border-t border-slate-200/80 dark:border-white/10 gap-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-slate-400 rounded-full" />
              Prior period baseline included for velocity calculation
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
              Average Fill Yield: 81.2%
            </span>
          </div>
        </div>

        {/* Capacity Breakdown Donut Chart */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50/60 dark:from-[#0B0F17] dark:to-[#090C10] border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-md flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-violet-500" />
              Ride Capacity Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 font-medium mt-0.5">
              Occupancy rates per published ride departure
            </p>
          </div>

          {/* Styled CSS Conic Donut Graphic */}
          <div className="flex items-center justify-center my-2">
            <div className="relative w-44 h-44 rounded-full bg-[conic-gradient(#3b82f6_0deg_180deg,#10b981_180deg_270deg,#f59e0b_270deg_330deg,#ef4444_330deg_360deg)] flex items-center justify-center p-4 shadow-xl hover:scale-105 transition-transform">
              <div className="w-32 h-32 rounded-full bg-white dark:bg-[#090C10] flex flex-col items-center justify-center text-center shadow-inner">
                <span className="text-2xl font-black text-slate-900 dark:text-white">15.3k</span>
                <span className="text-[10px] text-slate-400 dark:text-gray-400 uppercase tracking-widest font-bold">
                  Total Rides
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Donut Legend Breakdown */}
          <div className="space-y-2 text-xs font-bold">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-slate-700 dark:text-gray-200">Full (3-4 Passengers)</span>
              </div>
              <span className="font-mono text-slate-900 dark:text-gray-300">50% (7,665)</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-700 dark:text-gray-200">Partial (1-2 Passengers)</span>
              </div>
              <span className="font-mono text-slate-900 dark:text-gray-300">25% (3,832)</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-slate-700 dark:text-gray-200">Solo (Driver Only)</span>
              </div>
              <span className="font-mono text-slate-900 dark:text-gray-300">16.6% (2,545)</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-slate-700 dark:text-gray-200">Cancelled Rides</span>
              </div>
              <span className="font-mono text-slate-900 dark:text-gray-300">8.4% (1,288)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Chart Row 2: Demographics & Top Corridors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* User Acquisition Split Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50/60 dark:from-[#0B0F17] dark:to-[#090C10] border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-md space-y-6">
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
              +1,420 New
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700 dark:text-gray-300">Passenger Onboarding</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono">1,120 riders (+12.4%)</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full w-[78%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700 dark:text-gray-300">Verified Driver Applications</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-mono">300 drivers (+4.1%)</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full w-[22%]" />
              </div>
            </div>
          </div>

          {/* AI Insight Callout Box */}
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3 text-xs text-indigo-900 dark:text-indigo-300 font-medium">
            <Lightbulb className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <strong>Supply Shift Detected:</strong> Driver registration grew by 4.1% while Passenger demand spiked by 12.4%. Consider launching a driver recruitment referral campaign to maintain balance.
            </div>
          </div>
        </div>

        {/* Top Routes & Corridors */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50/60 dark:from-[#0B0F17] dark:to-[#090C10] border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-md space-y-5">
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
            {[
              { route: "Tech Corridor ➔ Airport Express", volume: "4,120 trips", fare: "$28.50", growth: "+15%" },
              { route: "Suburban West ➔ Financial District", volume: "3,280 trips", fare: "$19.20", growth: "+8%" },
              { route: "University Campus ➔ Metro Hub", volume: "2,840 trips", fare: "$12.00", growth: "+22%" },
              { route: "South Bay ➔ Innovation Park", volume: "2,100 trips", fare: "$24.00", growth: "-2%" },
            ].map((r, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs hover:border-blue-500/40 transition">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900 dark:text-white">{r.route}</p>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400 font-medium">{r.volume}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">{r.fare}</p>
                  <p className={`text-[10px] font-bold ${r.growth.startsWith("+") ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                    {r.growth} vs prev
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}