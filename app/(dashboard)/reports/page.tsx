"use client";

import { useState } from "react";
import {
    FileText,
    Download,
    Calendar,
    Filter,
    Search,
    CheckCircle2,
    Clock,
    RefreshCw,
    FileSpreadsheet,
    FileCheck,
    TrendingUp,
    ShieldCheck,
    Users,
    Car,
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

    return (
        <div className="p-6 md:p-8 space-y-8 min-h-screen bg-[#090C10] text-gray-100">
            {/* 1. Header & Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-500" />
                        Platform Reports & Audits
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Access compiled telemetry data, regulatory compliance logs, and export system audit summaries.
                    </p>
                </div>

                <button className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    <span>Generate Instant Report</span>
                </button>
            </div>

            {/* 2. Quick Stat Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Car className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">Operations Logs</p>
                        <h3 className="text-xl font-bold">142 Reports</h3>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">Financial Exports</p>
                        <h3 className="text-xl font-bold">$428.5k Audited</h3>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">Compliance Score</p>
                        <h3 className="text-xl font-bold">99.8% Passed</h3>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">Auto-Schedules</p>
                        <h3 className="text-xl font-bold">4 Active Tasks</h3>
                    </div>
                </div>
            </div>

            {/* 3. Search and Category Filters */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search reports by ID or title..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>

                    {/* Format Selector Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
                        <span className="text-xs font-semibold text-gray-400 mr-1 flex items-center gap-1">
                            <Filter className="w-3.5 h-3.5" /> Format:
                        </span>
                        {["All", "CSV", "PDF", "XLSX"].map((fmt) => (
                            <button
                                key={fmt}
                                onClick={() => setSelectedFormat(fmt)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedFormat === fmt
                                        ? "bg-blue-600 text-white"
                                        : "bg-white/5 text-gray-400 hover:text-white"
                                    }`}
                            >
                                {fmt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex items-center gap-2 border-t border-white/10 pt-3 overflow-x-auto">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${selectedCategory === cat
                                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* 4. Main Reports Table */}
            <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                                <th className="py-3.5 px-6">Report Title & ID</th>
                                <th className="py-3.5 px-6">Category</th>
                                <th className="py-3.5 px-6">Generated</th>
                                <th className="py-3.5 px-6">Records</th>
                                <th className="py-3.5 px-6">Format</th>
                                <th className="py-3.5 px-6">Status</th>
                                <th className="py-3.5 px-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs font-medium">
                            {filteredReports.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-400">
                                        No matching reports found.
                                    </td>
                                </tr>
                            ) : (
                                filteredReports.map((report) => (
                                    <tr
                                        key={report.id}
                                        className="hover:bg-white/[0.02] transition"
                                    >
                                        <td className="py-4 px-6 space-y-0.5">
                                            <p className="font-bold text-white">{report.title}</p>
                                            <p className="text-[10px] font-mono text-gray-400">
                                                {report.id}
                                            </p>
                                        </td>

                                        <td className="py-4 px-6 text-gray-300">
                                            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px]">
                                                {report.category}
                                            </span>
                                        </td>

                                        <td className="py-4 px-6 text-gray-400">
                                            {report.generatedAt}
                                        </td>

                                        <td className="py-4 px-6 font-mono text-gray-300">
                                            {report.recordCount}
                                        </td>

                                        <td className="py-4 px-6">
                                            <span
                                                className={`font-black text-[10px] px-2 py-0.5 rounded ${report.format === "CSV"
                                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                        : report.format === "PDF"
                                                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                                    }`}
                                            >
                                                {report.format}
                                            </span>
                                        </td>

                                        <td className="py-4 px-6">
                                            {report.status === "Ready" && (
                                                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                                                </span>
                                            )}
                                            {report.status === "Processing" && (
                                                <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing
                                                </span>
                                            )}
                                        </td>

                                        <td className="py-4 px-6 text-right">
                                            {report.status === "Ready" ? (
                                                <button className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 transition text-xs font-bold inline-flex items-center gap-1.5">
                                                    <Download className="w-3.5 h-3.5" />
                                                    <span>Export ({report.fileSize})</span>
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-500 cursor-not-allowed text-xs font-bold"
                                                >
                                                    Preparing...
                                                </button>
                                            )}
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