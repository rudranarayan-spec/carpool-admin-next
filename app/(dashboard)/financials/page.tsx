"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Calendar,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  PieChart,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface Transaction {
  id: string;
  rideId: string;
  driverName: string;
  riderName: string;
  grossAmount: number;
  platformFee: number;
  driverPayout: number;
  paymentMethod: "Credit Card" | "Apple Pay" | "Google Pay" | "In-App Wallet";
  status: "Completed" | "Pending" | "Refunded";
  timestamp: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN-8801",
    rideId: "RIDE-9921",
    driverName: "Marcus Vance",
    riderName: "Sarah Jenkins",
    grossAmount: 48.50,
    platformFee: 9.70, // 20% commission
    driverPayout: 38.80,
    paymentMethod: "Apple Pay",
    status: "Completed",
    timestamp: "23 Jul 2026, 18:42",
  },
  {
    id: "TXN-8802",
    rideId: "RIDE-9922",
    driverName: "Elena Rostova",
    riderName: "Alex Rivera",
    grossAmount: 112.00,
    platformFee: 22.40,
    driverPayout: 89.60,
    paymentMethod: "Credit Card",
    status: "Completed",
    timestamp: "23 Jul 2026, 17:15",
  },
  {
    id: "TXN-8803",
    rideId: "RIDE-9923",
    driverName: "David Chen",
    riderName: "Michael Chang",
    grossAmount: 24.00,
    platformFee: 4.80,
    driverPayout: 19.20,
    paymentMethod: "In-App Wallet",
    status: "Pending",
    timestamp: "23 Jul 2026, 16:30",
  },
  {
    id: "TXN-8804",
    rideId: "RIDE-9924",
    driverName: "Marcus Vance",
    riderName: "Jessica Alba",
    grossAmount: 65.20,
    platformFee: 13.04,
    driverPayout: 52.16,
    paymentMethod: "Google Pay",
    status: "Refunded",
    timestamp: "22 Jul 2026, 14:10",
  },
];

export default function FinanceDashboardPage() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [timeRange, setTimeRange] = useState("This Month");
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  // Totals calculations
  const totalGross = transactions.reduce((acc, curr) => acc + curr.grossAmount, 0);
  const totalCommission = transactions.reduce((acc, curr) => acc + curr.platformFee, 0);
  const totalPayouts = transactions.reduce((acc, curr) => acc + curr.driverPayout, 0);

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.rideId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.riderName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || txn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen transition-colors duration-300 select-none">
      
      {/* 1. Page Header & Time Window Selection */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <DollarSign className="w-7 h-7" />
            </div>
            Financial Insights & Earnings
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            Real-time breakdown of ride earnings, platform commission revenue, and driver disbursements.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white dark:bg-[#090C10] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl px-4 py-3 focus:outline-none shadow-sm"
          >
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="Quarter To Date">Quarter To Date</option>
          </select>

          <button className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* 2. Glassmorphic Hero Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1: Total Platform Commission (Net Revenue) */}
        <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-blue-600/10 via-blue-500/5 to-transparent border border-blue-500/20 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Net Admin Revenue (20%)
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              ${totalCommission.toFixed(2)}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs font-bold text-emerald-500">
              <ArrowUpRight className="w-4 h-4" />
              <span>+14.2% vs last month</span>
            </div>
          </div>
          {/* Subtle background glow */}
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Metric 2: Gross Ride Earnings */}
        <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-emerald-600/10 via-emerald-500/5 to-transparent border border-emerald-500/20 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Gross Fare Volume
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              ${totalGross.toFixed(2)}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs font-bold text-emerald-500">
              <ArrowUpRight className="w-4 h-4" />
              <span>+8.6% ride volume</span>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Metric 3: Total Driver Payouts */}
        <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-purple-600/10 via-purple-500/5 to-transparent border border-purple-500/20 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Driver Payouts Disbursed
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              ${totalPayouts.toFixed(2)}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs font-medium text-gray-400">
              <span>80% driver share split</span>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>

      </div>

      {/* 3. Revenue Breakdown Banner */}
      <div className="p-6 bg-white dark:bg-[#090C10] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-blue-500" />
            Fare Split Model Allocation
          </h2>
          <span className="text-xs text-gray-400 font-mono">20% Platform / 80% Driver</span>
        </div>

        {/* Visual Multi-color Progress Bar */}
        <div className="h-4 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden flex p-0.5">
          <div className="h-full bg-blue-600 rounded-l-full w-[20%]" title="Platform Fee (20%)" />
          <div className="h-full bg-emerald-500 rounded-r-full w-[80%]" title="Driver Share (80%)" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
            <span className="text-gray-500 dark:text-gray-400 font-medium">Platform Fee:</span>
            <span className="font-bold text-gray-900 dark:text-white">$20.00 / $100</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="text-gray-500 dark:text-gray-400 font-medium">Driver Share:</span>
            <span className="font-bold text-gray-900 dark:text-white">$80.00 / $100</span>
          </div>
        </div>
      </div>

      {/* 4. Controls & Transactions Ledger Header */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-[#090C10] p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Transaction ID, Ride ID, Driver, or Passenger..."
            className="w-full bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
          {["All", "Completed", "Pending", "Refunded"].map((tab) => {
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Interactive Ledger Table */}
      <div className="bg-white dark:bg-[#090C10] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Parties Involved</th>
                <th className="px-6 py-4">Gross Fare</th>
                <th className="px-6 py-4">Platform Fee ($)</th>
                <th className="px-6 py-4">Driver Payout</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10 text-sm">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn) => (
                  <tr
                    key={txn.id}
                    onClick={() => setSelectedTxn(txn)}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition cursor-pointer group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {txn.id}
                      </p>
                      <p className="text-[10px] font-mono text-gray-400">
                        {txn.rideId}
                      </p>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {txn.driverName} <span className="text-xs font-normal text-gray-400">(Driver)</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Rider: {txn.riderName}
                      </p>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-black text-gray-900 dark:text-white">
                      ${txn.grossAmount.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-600 dark:text-blue-400">
                      +${txn.platformFee.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-700 dark:text-gray-300">
                      ${txn.driverPayout.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-gray-500 dark:text-gray-400">
                      {txn.paymentMethod}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {txn.status === "Completed" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                        </span>
                      )}
                      {txn.status === "Pending" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <Clock className="w-3.5 h-3.5" /> Processing
                        </span>
                      )}
                      {txn.status === "Refunded" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          <AlertCircle className="w-3.5 h-3.5" /> Refunded
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No transactions found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Inspection Drawer */}
      <AnimatePresence>
        {selectedTxn && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTxn(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-white dark:bg-[#090C10] border-l border-gray-200 dark:border-white/10 z-50 p-6 overflow-y-auto space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Transaction Audit
                  </h2>
                  <p className="text-xs font-mono text-blue-600 dark:text-blue-400">
                    {selectedTxn.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTxn(null)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 transition"
                >
                  ✕
                </button>
              </div>

              {/* Amount Breakdown Box */}
              <div className="p-5 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-2xl space-y-3">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase">Net Admin Commission</span>
                <p className="text-3xl font-black text-gray-900 dark:text-white">
                  ${selectedTxn.platformFee.toFixed(2)}
                </p>
                <div className="pt-2 border-t border-gray-200 dark:border-white/10 text-xs space-y-1.5 text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Total Gross Fare:</span>
                    <span className="font-bold text-gray-900 dark:text-white">${selectedTxn.grossAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Driver Net Disbursed:</span>
                    <span className="font-bold text-gray-900 dark:text-white">${selectedTxn.driverPayout.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Transaction Metadata */}
              <div className="space-y-3 text-xs">
                <h3 className="font-extrabold uppercase text-gray-400">Transaction Details</h3>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Associated Ride ID:</span>
                    <span className="font-mono font-bold text-blue-500">{selectedTxn.rideId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Driver:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{selectedTxn.driverName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Passenger:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{selectedTxn.riderName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment Gateway:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{selectedTxn.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Timestamp:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{selectedTxn.timestamp}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}