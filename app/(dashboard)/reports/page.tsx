"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  RefreshCw,
  FileSpreadsheet,
  ShieldCheck,
  Car,
  Sparkles,
  ArrowUpRight,
  FileCode2,
} from "lucide-react";

interface ReportItem {
  id: string;
  title: string;
  category: "Fleet Operations" | "Financials" | "Compliance & Safety" | "User Growth";
  generatedAt: string;
  fileSize: string;
  format: "CSV" | "PDF" | "XLSX";
  status: "Ready" | "Processing" | "Scheduled";
  recordCount: string;
}

const mockReports: ReportItem[] = [
  {
    id: "REP-2026-089",
    title: "Weekly Fleet Telemetry & Ride Audit",
    category: "Fleet Operations",
    generatedAt: "Jul 23, 2026 • 18:30",
    fileSize: "4.2 MB",
    format: "CSV",
    status: "Ready",
    recordCount: "12,840 rows",
  },
  {
    id: "REP-2026-088",
    title: "Driver Earnings & Payout Reconciliation",
    category: "Financials",
    generatedAt: "Jul 22, 2026 • 23:59",
    fileSize: "8.1 MB",
    format: "XLSX",
    status: "Ready",
    recordCount: "3,450 rows",
  },
  {
    id: "REP-2026-087",
    title: "Identity Verification & Document Compliance",
    category: "Compliance & Safety",
    generatedAt: "Jul 21, 2026 • 12:15",
    fileSize: "1.8 MB",
    format: "PDF",
    status: "Ready",
    recordCount: "412 audits",
  },
  {
    id: "REP-2026-086",
    title: "Monthly Passenger Acquisition & Churn Log",
    category: "User Growth",
    generatedAt: "Jul 20, 2026 • 09:00",
    fileSize: "3.5 MB",
    format: "CSV",
    status: "Ready",
    recordCount: "28,900 rows",
  },
  {
    id: "REP-2026-085",
    title: "Dispute Flags & Settlement Summary",
    category: "Compliance & Safety",
    generatedAt: "Generating now...",
    fileSize: "--",
    format: "PDF",
    status: "Processing",
    recordCount: "89 open cases",
  },
];

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = [
    "All",
    "Fleet Operations",
    "Financials",
    "Compliance & Safety",
    "User Growth",
  ];

  const filteredReports = mockReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || report.category === selectedCategory;
    const matchesFormat =
      selectedFormat === "All" || report.format === selectedFormat;

    return matchesSearch && matchesCategory && matchesFormat;
  });

  const handleInstantReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 min-h-screen bg-slate-50 dark:bg-[#090C10] text-slate-900 dark:text-gray-100 transition-colors duration-300 max-w-[1600px] mx-auto">
      
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Platform Reports & Audits
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
              <Sparkles className="w-3 h-3" /> System Logs
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1 font-medium">
            Access compiled telemetry data, regulatory compliance logs, and export system audit summaries.
          </p>
        </div>

        <button
          onClick={handleInstantReport}
          disabled={isGenerating}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/25 transition flex items-center gap-2 disabled:opacity-70 active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
          <span>{isGenerating ? "Generating Audit..." : "Generate Instant Report"}</span>
        </button>
      </div>

      {/* 2. Quick Stat Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-4 backdrop-blur-md"
        >
          <div className="p-3 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-gray-400 font-black uppercase tracking-wider">
              Operations Logs
            </p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">142 Reports</h3>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3 h-3" /> +12 this week
            </span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-4 backdrop-blur-md"
        >
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-gray-400 font-black uppercase tracking-wider">
              Financial Exports
            </p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">$428.5k Audited</h3>
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-semibold mt-0.5 block">
              Reconciled through Jul 2026
            </span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-4 backdrop-blur-md"
        >
          <div className="p-3 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-gray-400 font-black uppercase tracking-wider">
              Compliance Score
            </p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">99.8% Passed</h3>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 block">
              412 driver checks passed
            </span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-4 backdrop-blur-md"
        >
          <div className="p-3 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-gray-400 font-black uppercase tracking-wider">
              Auto-Schedules
            </p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">4 Active Tasks</h3>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-0.5 block">
              Next batch in 4h 12m
            </span>
          </div>
        </motion.div>
      </div>

      {/* 3. Search and Category Filters */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by ID or title..."
              className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
            />
          </div>

          {/* Format Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-xs font-bold text-slate-500 dark:text-gray-400 mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Format:
            </span>
            {["All", "CSV", "PDF", "XLSX"].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                  selectedFormat === fmt
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-200 dark:border-white/10 pt-3 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 shadow-sm"
                  : "text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Main Reports Table */}
      <div className="rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-gray-400">
                <th className="py-4 px-6">Report Title & ID</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Generated</th>
                <th className="py-4 px-6">Records</th>
                <th className="py-4 px-6">Format</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-white/5 text-xs font-semibold">
              <AnimatePresence>
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-gray-500">
                      <FileCode2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      No matching reports found.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <motion.tr
                      key={report.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition"
                    >
                      {/* Report Title & ID */}
                      <td className="py-4 px-6 space-y-0.5">
                        <p className="font-bold text-slate-900 dark:text-white">{report.title}</p>
                        <p className="text-[10px] font-mono font-semibold text-slate-400 dark:text-gray-500">
                          {report.id}
                        </p>
                      </td>

                      {/* Category Badge */}
                      <td className="py-4 px-6 text-slate-700 dark:text-gray-300">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-bold">
                          {report.category}
                        </span>
                      </td>

                      {/* Generated At */}
                      <td className="py-4 px-6 text-slate-500 dark:text-gray-400 font-medium">
                        {report.generatedAt}
                      </td>

                      {/* Records Count */}
                      <td className="py-4 px-6 font-mono text-slate-700 dark:text-gray-300">
                        {report.recordCount}
                      </td>

                      {/* Format Badge */}
                      <td className="py-4 px-6">
                        <span
                          className={`font-black text-[10px] px-2.5 py-1 rounded-md border ${
                            report.format === "CSV"
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                              : report.format === "PDF"
                              ? "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
                              : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                          }`}
                        >
                          {report.format}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {report.status === "Ready" && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                          </span>
                        )}
                        {report.status === "Processing" && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-bold">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-4 px-6 text-right">
                        {report.status === "Ready" ? (
                          <button className="px-3.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-600 text-blue-600 hover:text-white dark:text-blue-400 border border-blue-500/20 transition-all text-xs font-black inline-flex items-center gap-1.5 shadow-sm active:scale-95">
                            <Download className="w-3.5 h-3.5" />
                            <span>Export ({report.fileSize})</span>
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-gray-500 cursor-not-allowed text-xs font-bold"
                          >
                            Preparing...
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}