"use client";

import { useState } from "react";
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
  PieChart,
  BarChart3,
  MapPin,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [compareMode, setCompareMode] = useState<"prev_period" | "prior_year">(
    "prev_period"
  );

  // Dynamic values depending on selected time range
  const isMonth = timeRange === "30d" || timeRange === "90d";

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen bg-[#090C10] text-gray-100">
      {/* 1. Top Header & Interactive Range Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-500" />
            Platform Performance Analytics
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Comparative insights across user growth, ride conversions, seat occupancy, and revenue streams.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Comparison Mode Toggle */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setCompareMode("prev_period")}
              className={`px-3 py-1.5 rounded-lg transition ${
                compareMode === "prev_period"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              vs Previous Period
            </button>
            <button
              onClick={() => setCompareMode("prior_year")}
              className={`px-3 py-1.5 rounded-lg transition ${
                compareMode === "prior_year"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              vs Prior Year
            </button>
          </div>

          {/* Time Filter Pill */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            {["24h", "7d", "30d", "90d"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                  timeRange === range
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition flex items-center gap-2 text-xs font-semibold">
            <Download className="w-4 h-4" />
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {/* 2. Comparative KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black">{isMonth ? "$142,850" : "$38,420"}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {compareMode === "prev_period" ? "+14.2%" : "+28.6%"}
              </span>
              <span className="text-[10px] text-gray-500">
                {compareMode === "prev_period" ? "vs prior 7 days ($33,640)" : "vs YoY ($29,870)"}
              </span>
            </div>
          </div>
        </div>

        {/* Rides Published vs Booked */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Rides Conversion Rate
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black">81.4%</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +3.8%
              </span>
              <span className="text-[10px] text-gray-500">
                12,480 booked / 15,330 published
              </span>
            </div>
          </div>
        </div>

        {/* Active Users Growth */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Active Platform Users
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black">24,910</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +8.5%
              </span>
              <span className="text-[10px] text-gray-500">
                19.2k Passengers • 5.7k Drivers
              </span>
            </div>
          </div>
        </div>

        {/* Average Seat Fill Rate */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Avg Occupancy Rate
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black">3.2 / 4</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-0.5">
                <ArrowDownRight className="w-3.5 h-3.5" />
                -0.1 seats
              </span>
              <span className="text-[10px] text-gray-500">
                Target: 3.5 seats per pooled car
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Chart Row 1: Revenue vs Rides Published & Booked */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Bar/Line Combo Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Revenue & Ride Booking Velocity
              </h3>
              <p className="text-xs text-gray-400">
                Comparison of total rides offered versus actual passenger seat conversions
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-500" />
                <span>Rides Published</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-400" />
                <span>Rides Booked</span>
              </div>
            </div>
          </div>

          {/* Visual Custom Bar Graph with Historical Overlay */}
          <div className="space-y-4 pt-4">
            {[
              { day: "Mon", published: 2100, booked: 1820, oldBooked: 1500, rev: "$5,400" },
              { day: "Tue", published: 2450, booked: 2100, oldBooked: 1750, rev: "$6,200" },
              { day: "Wed", published: 2300, booked: 1950, oldBooked: 1680, rev: "$5,900" },
              { day: "Thu", published: 2800, booked: 2400, oldBooked: 1900, rev: "$7,100" },
              { day: "Fri", published: 3400, booked: 2980, oldBooked: 2200, rev: "$9,300" },
              { day: "Sat", published: 1900, booked: 1450, oldBooked: 1300, rev: "$4,100" },
              { day: "Sun", published: 1500, booked: 1100, oldBooked: 950, rev: "$3,200" },
            ].map((item) => {
              const pubWidth = (item.published / 3500) * 100;
              const bookWidth = (item.booked / 3500) * 100;
              const oldWidth = (item.oldBooked / 3500) * 100;

              return (
                <div key={item.day} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-gray-300 w-10">{item.day}</span>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-gray-400">{item.published} published</span>
                      <span className="text-emerald-400 font-bold">{item.booked} booked</span>
                      <span className="text-gray-200 font-bold">{item.rev}</span>
                    </div>
                  </div>
                  {/* Stacked / Overlay Bar */}
                  <div className="relative h-3.5 w-full bg-white/5 rounded-full overflow-hidden">
                    {/* Published (Background) */}
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-blue-500/30 rounded-full"
                      style={{ width: `${pubWidth}%` }}
                    />
                    {/* Booked Current Period */}
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      style={{ width: `${bookWidth}%` }}
                    />
                    {/* Historical Benchmark Line Indicator */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white/70 z-10"
                      style={{ left: `${oldWidth}%` }}
                      title={`Previous Period: ${item.oldBooked}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-gray-400 border-t border-white/10">
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-3 bg-white/70 rounded-full" />
              White marker indicates prior period baseline
            </span>
            <span className="text-emerald-400 font-semibold">
              Average Fill Yield: 81.2%
            </span>
          </div>
        </div>

        {/* Donut / Pie Breakdown: Ride Status Efficiency */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-400" />
              Ride Capacity Breakdown
            </h3>
            <p className="text-xs text-gray-400">
              Occupancy rates per published ride departure
            </p>
          </div>

          {/* Visual CSS-based Donut Representation */}
          <div className="flex items-center justify-center my-2">
            <div className="relative w-44 h-44 rounded-full bg-[conic-gradient(#3b82f6_0deg_180deg,#10b981_180deg_270deg,#f59e0b_270deg_330deg,#ef4444_330deg_360deg)] flex items-center justify-center p-4 shadow-xl">
              <div className="w-32 h-32 rounded-full bg-[#090C10] flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-white">15.3k</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                  Total Rides
                </span>
              </div>
            </div>
          </div>

          {/* Pie Legend Breakdown */}
          <div className="space-y-2 text-xs font-semibold">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Full (3-4 Passengers)</span>
              </div>
              <span className="font-mono text-gray-300">50% (7,665)</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Partial (1-2 Passengers)</span>
              </div>
              <span className="font-mono text-gray-300">25% (3,832)</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Solo (Driver Only)</span>
              </div>
              <span className="font-mono text-gray-300">16.6% (2,545)</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span>Cancelled Rides</span>
              </div>
              <span className="font-mono text-gray-300">8.4% (1,288)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Chart Row 2: User Demographics & Highest Revenue City Corridors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Acquisition (Riders vs Drivers) */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                User Acquisition Growth
              </h3>
              <p className="text-xs text-gray-400">
                New Passenger vs Driver onboarding comparison
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              +1,420 New Users
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-gray-300">Passenger Onboarding</span>
                <span className="text-indigo-400 font-mono">1,120 riders (+12.4%)</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full w-[78%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-gray-300">Verified Driver Applications</span>
                <span className="text-cyan-400 font-mono">300 drivers (+4.1%)</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full w-[22%]" />
              </div>
            </div>
          </div>

          {/* Key Metric Insights Callout */}
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3 text-xs text-indigo-300">
            <Lightbulb className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong>Supply Shift Detected:</strong> Driver registration grew by 4.1% while Passenger demand spiked by 12.4%. Consider launching a driver recruitment referral campaign to maintain balance.
            </div>
          </div>
        </div>

        {/* Highest Revenue City Corridors */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-400" />
                Top Performing Routes
              </h3>
              <p className="text-xs text-gray-400">
                Highest trip density & fare volume by travel corridors
              </p>
            </div>
            <span className="text-xs font-mono text-gray-400">Avg Fare / Trip</span>
          </div>

          <div className="space-y-3">
            {[
              { route: "Downtown Tech Corridor ➔ Airport Express", volume: "4,120 trips", fare: "$28.50", growth: "+15%" },
              { route: "Suburban West ➔ Financial District", volume: "3,280 trips", fare: "$19.20", growth: "+8%" },
              { route: "University Campus ➔ Metro North Hub", volume: "2,840 trips", fare: "$12.00", growth: "+22%" },
              { route: "South Bay Residential ➔ Innovation Park", volume: "2,100 trips", fare: "$24.00", growth: "-2%" },
            ].map((r, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="font-bold text-white">{r.route}</p>
                  <p className="text-[10px] text-gray-400">{r.volume}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-emerald-400">{r.fare}</p>
                  <p className={`text-[10px] font-semibold ${r.growth.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}>
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