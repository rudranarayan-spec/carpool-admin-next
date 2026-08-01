"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  Download,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  PieChart,
  ChevronRight,
  RefreshCw,
  Loader2,
  X,
  RotateCcw,
} from "lucide-react";
import { paymentService } from "@/services/paymentService";
import { PaymentTransactionRaw } from "@/types/payment";

export default function FinanceDashboardPage() {
  // API State
  const [transactions, setTransactions] = useState<PaymentTransactionRaw[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [timeRange, setTimeRange] = useState("This Month");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Drawer & Action State
  const [selectedTxn, setSelectedTxn] = useState<PaymentTransactionRaw | null>(null);
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [refundAmount, setRefundAmount] = useState<string>("");

  // Fetch Payments from Backend
  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await paymentService.getAdminPayments({
        page,
        limit: 10,
        status: statusFilter === "All" ? undefined : statusFilter.toLowerCase(),
        search: searchQuery.trim() || undefined,
      });

      if (response.success) {
        setTransactions(response.data || []);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
        }
      } else {
        setError(response.message || "Failed to load transactions.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error fetching admin payments:", err);
      setError(
        err?.response?.data?.message || "Failed to establish connection with server."
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, searchQuery]);

  // Initial Fetch & Auto Refetch on filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPayments();
    }, 300); // 300ms debounce for search input

    return () => clearTimeout(timer);
  }, [fetchPayments]);

  // Handle Refund Action
  const handleProcessRefund = async () => {
    if (!selectedTxn) return;

    try {
      setIsProcessingRefund(true);
      const parsedAmount = refundAmount ? parseFloat(refundAmount) : undefined;

      const res = await paymentService.processRefund(selectedTxn.id, {
        refund_amount: parsedAmount,
        reason_of_refund: refundReason || "Admin initiated refund",
      });

      if (res.success) {
        alert("Refund processed successfully!");
        setRefundReason("");
        setRefundAmount("");
        setSelectedTxn(null);
        fetchPayments(); // Refresh table
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to process refund.");
    } finally {
      setIsProcessingRefund(false);
    }
  };

  // Mocked Metrics calculation (Preserved as requested)
  const totalGross = transactions.reduce(
    (acc, curr) => acc + (Number(curr.amount) || 0),
    0
  );
  const totalCommission = totalGross * 0.2;
  const totalPayouts = totalGross * 0.8; 

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

          <button
            onClick={() => fetchPayments()}
            className="p-3 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* 2. Glassmorphic Hero Metrics Grid (Mocked for now) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              ₹{totalCommission.toFixed(2)}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs font-bold text-emerald-500">
              <ArrowUpRight className="w-4 h-4" />
              <span>+14.2% vs last month</span>
            </div>
          </div>
        </div>

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
              ₹{totalGross.toFixed(2)}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs font-bold text-emerald-500">
              <ArrowUpRight className="w-4 h-4" />
              <span>+8.6% ride volume</span>
            </div>
          </div>
        </div>

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
              ₹{totalPayouts.toFixed(2)}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs font-medium text-gray-400">
              <span>80% driver share split</span>
            </div>
          </div>
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

        <div className="h-4 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden flex p-0.5">
          <div className="h-full bg-blue-600 rounded-l-full w-[20%]" title="Platform Fee (20%)" />
          <div className="h-full bg-emerald-500 rounded-r-full w-[80%]" title="Driver Share (80%)" />
        </div>
      </div>

      {/* 4. Search & Filters Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-[#090C10] p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Booking Code, or Payment ID..."
            className="w-full bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
          {["All", "Paid", "Unpaid", "Failed", "Refunded"].map((tab) => {
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setStatusFilter(tab);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${isActive
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

      {/* 5. Live Ledger Table */}
      <div className="bg-white dark:bg-[#090C10] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Database ID</th>
                <th className="px-6 py-4">Booking / Order ID</th>
                <th className="px-6 py-4">Razorpay Payment ID</th>
                <th className="px-6 py-4">Gross Fare</th>
                <th className="px-6 py-4">Gateway</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500 mb-2" />
                    Loading payment records...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-rose-500 font-medium">
                    {error}
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((txn) => (
                  <tr
                    key={txn.id}
                    onClick={() => setSelectedTxn(txn)}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition cursor-pointer group"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-gray-900 dark:text-white">
                      #{txn.id}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {txn.booking_code || txn.booking_id}
                      </p>
                      <p className="text-[10px] font-mono text-gray-400">
                        Ord: {txn.order_id}
                      </p>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-600 dark:text-gray-300">
                      {txn.payment_id || <span className="text-gray-400 italic">N/A</span>}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-black text-gray-900 dark:text-white">
                      ₹{Number(txn.amount || 0).toFixed(2)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs uppercase font-bold text-gray-500 dark:text-gray-400">
                      {txn.payment_gateway || "Razorpay"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {txn.payment_status === "paid" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                        </span>
                      )}
                      {txn.payment_status === "unpaid" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <Clock className="w-3.5 h-3.5" /> Unpaid
                        </span>
                      )}
                      {txn.payment_status === "failed" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          <AlertCircle className="w-3.5 h-3.5" /> Failed
                        </span>
                      )}
                      {txn.payment_status === "refunded" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                          <RotateCcw className="w-3.5 h-3.5" /> Refunded
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                      {new Date(txn.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
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

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-white/10 text-xs">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* 6. Inspection & Refund Drawer */}
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
                    Payment DB ID: #{selectedTxn.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTxn(null)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Amount Box */}
              <div className="p-5 bg-linear-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-2xl space-y-3">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase">
                  Transaction Amount
                </span>
                <p className="text-3xl font-black text-gray-900 dark:text-white">
                  ₹{Number(selectedTxn.amount || 0).toFixed(2)}
                </p>
                <div className="pt-2 border-t border-gray-200 dark:border-white/10 text-xs flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Status:</span>
                  <span className="font-bold uppercase text-blue-500">
                    {selectedTxn.payment_status}
                  </span>
                </div>
              </div>

              {/* Transaction Metadata */}
              <div className="space-y-3 text-xs">
                <h3 className="font-extrabold uppercase text-gray-400">Metadata</h3>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Booking Code:</span>
                    <span className="font-mono font-bold text-blue-500">
                      {selectedTxn.booking_code || selectedTxn.booking_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Order ID:</span>
                    <span className="font-mono text-gray-700 dark:text-gray-300">
                      {selectedTxn.order_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Razorpay Payment ID:</span>
                    <span className="font-mono text-gray-700 dark:text-gray-300">
                      {selectedTxn.payment_id || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Refund ID:</span>
                    <span className="font-mono text-gray-700 dark:text-gray-300">
                      {selectedTxn.refund_id || "None"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Timestamp:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {new Date(selectedTxn.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Refund Trigger Box */}
              {selectedTxn.payment_status === "paid" && (
                <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
                  <h4 className="text-xs font-bold text-rose-500 uppercase flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5" /> Trigger Razorpay Refund
                  </h4>

                  <input
                    type="number"
                    placeholder={`Amount (Optional - Full ₹${selectedTxn.amount})`}
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="w-full bg-white dark:bg-[#090C10] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none"
                  />

                  <textarea
                    placeholder="Reason for refund..."
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    rows={2}
                    className="w-full bg-white dark:bg-[#090C10] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs text-gray-900 dark:text-white focus:outline-none"
                  />

                  <button
                    onClick={handleProcessRefund}
                    disabled={isProcessingRefund}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 disabled:opacity-50"
                  >
                    {isProcessingRefund ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Process Refund Now"
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}