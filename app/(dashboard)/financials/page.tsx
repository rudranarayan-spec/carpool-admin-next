"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  MapPin,
  Car,
  Users,
  ExternalLink,
  ChevronDown,
  Edit3,
  Check,
} from "lucide-react";
import { paymentService } from "@/services/paymentService";
import { PaymentTransactionRaw, RefundRequestItem } from "@/types/payment";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import RefundModal from "@/components/finance/RefundModal";

// Toast state type definition
interface ToastNotification {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

export default function FinanceDashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Active Main Tab ("transactions" | "refunds")
  const [activeTab, setActiveTab] = useState<"transactions" | "refunds">("transactions");

  // Filters & State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [refundStatusFilter, setRefundStatusFilter] = useState("All");
  const [timeRange, setTimeRange] = useState("This Month");
  const [page, setPage] = useState(1);

  // Modals & Drawers
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<PaymentTransactionRaw | null>(null);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequestItem | null>(null);

  // Inline Status Update State
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatusValue, setNewStatusValue] = useState<string>("");

  // Toast System State
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // 1. QUERY: All Payments (Transactions Ledger)
  const {
    data: paymentsData,
    isLoading: isPaymentsLoading,
    isError: isPaymentsError,
    error: paymentsError,
    refetch: refetchPayments,
  } = useQuery({
    queryKey: ["admin-payments", page, statusFilter, searchQuery, timeRange],
    queryFn: async () => {
      const response = await paymentService.getAdminPayments({
        page,
        limit: 10,
        status: statusFilter === "All" ? undefined : statusFilter.toLowerCase(),
        search: searchQuery.trim() || undefined,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to load transactions.");
      }
      return response;
    },
    enabled: activeTab === "transactions",
    placeholderData: (previousData) => previousData,
  });

  // 2. QUERY: Refund Requests
  const {
    data: refundData,
    isLoading: isRefundsLoading,
    isError: isRefundsError,
    error: refundsError,
    refetch: refetchRefunds,
  } = useQuery({
    queryKey: ["admin-refund-requests", page, refundStatusFilter, searchQuery],
    queryFn: async () => {
      const response = await paymentService.getRefundRequests({
        page,
        limit: 10,
        status: refundStatusFilter === "All" ? undefined : refundStatusFilter.toLowerCase(),
        search: searchQuery.trim() || undefined,
      });

      if (!response.success) {
        throw new Error("Failed to load refund requests.");
      }
      return response;
    },
    enabled: activeTab === "refunds",
    placeholderData: (previousData) => previousData,
  });

  // 3. MUTATION: Update Payment Status
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      paymentId,
      status,
    }: {
      paymentId: number | string;
      status: string;
    }) => {
      return await paymentService.updatePaymentStatus(paymentId, {
        payment_status: status.toLowerCase(),
      });
    },
    onSuccess: (res, variables) => {
      if (res.success) {
        showToast("Payment status updated successfully!", "success");
        queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
        if (selectedTxn) {
          setSelectedTxn({
            ...selectedTxn,
            payment_status: variables.status.toLowerCase(),
          });
        }
        setEditingStatus(false);
      } else {
        showToast(res.message || "Failed to update status", "error");
      }
    },
    onError: (err: Error) => {
      showToast(err.message || "An unexpected error occurred", "error");
    },
  });

  // Keep stats persistent and locked regardless of active tab or active filter
  const stats = paymentsData?.stats || {
    gross_fare: 0,
    admin_revenue: 0,
    driver_payouts: 0,
    platform_percent: 20,
    driver_percent: 80,
  };

  const transactions = paymentsData?.data || [];
  const refundRequests = refundData?.data || [];
  const currentTotalPages =
    activeTab === "transactions"
      ? paymentsData?.pagination?.totalPages || 1
      : refundData?.pagination?.totalPages || 1;

  // Navigate to ride page
  const handleNavigateToRide = (rideId: string | number | null | undefined, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!rideId) return;
    router.push(`/rides/${rideId}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Toast Notification Floating Container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-center justify-between gap-3 text-xs font-bold ${
                toast.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  : toast.type === "error"
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
                  : "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
              }`}
            >
              <div className="flex items-center gap-2">
                {toast.type === "success" && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                {toast.type === "error" && <AlertCircle className="w-4 h-4 shrink-0" />}
                {toast.type === "info" && <Clock className="w-4 h-4 shrink-0" />}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="opacity-60 hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 1. Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <DollarSign className="w-7 h-7" />
            </div>
            Financial Insights & Earnings
          </h1>
          <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            Real-time breakdown of ride earnings, platform commission revenue, and refund requests.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-white dark:bg-[#090C10] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 text-xs font-extrabold rounded-2xl pl-4 pr-9 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm cursor-pointer transition-all"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Quarter To Date">Quarter To Date</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => (activeTab === "transactions" ? refetchPayments() : refetchRefunds())}
            className="p-3 rounded-2xl bg-white dark:bg-[#090C10] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition shadow-sm active:scale-95"
            title="Refresh Ledger"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                isPaymentsLoading || isRefundsLoading ? "animate-spin text-blue-500" : ""
              }`}
            />
          </button>

          <button className="px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold transition flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* 2. Persistent Hero Metrics Grid (CONSTANT ACROSS FILTERS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-blue-600/10 via-blue-500/5 to-transparent border border-blue-500/20 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Net Admin Revenue ({stats.platform_percent}%)
            </span>
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              ₹{Number(stats.admin_revenue || 0).toFixed(2)}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs font-bold text-emerald-500">
              <ArrowUpRight className="w-4 h-4" />
              <span>+14.2% vs last period</span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-emerald-600/10 via-emerald-500/5 to-transparent border border-emerald-500/20 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Gross Fare Volume
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              ₹{Number(stats.gross_fare || 0).toFixed(2)}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs font-bold text-emerald-500">
              <ArrowUpRight className="w-4 h-4" />
              <span>+8.6% ride volume</span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl p-6 bg-linear-to-br from-purple-600/10 via-purple-500/5 to-transparent border border-purple-500/20 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Driver Payouts Disbursed
            </span>
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              ₹{Number(stats.driver_payouts || 0).toFixed(2)}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs font-medium text-gray-400">
              <span>{stats.driver_percent}% driver split share</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Fare Allocation Progress Banner */}
      <div className="p-6 bg-white dark:bg-[#090C10] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-blue-500" />
            Fare Split Model Allocation
          </h2>
          <span className="text-xs font-mono font-bold text-gray-400">
            {stats.platform_percent}% Platform / {stats.driver_percent}% Driver
          </span>
        </div>
        <div className="h-3.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden flex p-0.5 border border-gray-200 dark:border-white/5">
          <div
            className="h-full bg-blue-600 rounded-l-full transition-all duration-500 shadow-sm"
            style={{ width: `${stats.platform_percent}%` }}
          />
          <div
            className="h-full bg-emerald-500 rounded-r-full transition-all duration-500 shadow-sm"
            style={{ width: `${stats.driver_percent}%` }}
          />
        </div>
      </div>

      {/* 4. Tab Navigation Bar */}
      <div className="flex items-center gap-3 border-b border-gray-200 dark:border-white/10 pb-4">
        <button
          onClick={() => {
            setActiveTab("transactions");
            setPage(1);
          }}
          className={`px-6 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2.5 cursor-pointer ${
            activeTab === "transactions"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
              : "bg-white dark:bg-[#090C10] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
          }`}
        >
          <DollarSign className="w-4 h-4" /> Transactions Ledger
        </button>

        <button
          onClick={() => {
            setActiveTab("refunds");
            setPage(1);
          }}
          className={`px-6 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2.5 cursor-pointer ${
            activeTab === "refunds"
              ? "bg-rose-600 text-white shadow-lg shadow-rose-600/25"
              : "bg-white dark:bg-[#090C10] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
          }`}
        >
          <RotateCcw className="w-4 h-4" /> Refund Log
        </button>
      </div>

      {/* 5. Dynamic Search & Filters Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-[#090C10] p-4 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder={
              activeTab === "transactions"
                ? "Search by Booking Code, Order ID, Payment ID..."
                : "Search by Booking Code, Reason, or Refund ID..."
            }
            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
          />
        </div>

        {/* Tab-Specific Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {activeTab === "transactions"
            ? ["All", "Paid", "Unpaid", "Failed", "Refunded"].map((tab) => {
                const isActive = statusFilter === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setStatusFilter(tab);
                      setPage(1);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })
            : ["All", "Requested", "Processing", "Processed", "Failed"].map((status) => {
                const isActive = refundStatusFilter === status;
                return (
                  <button
                    key={status}
                    onClick={() => {
                      setRefundStatusFilter(status);
                      setPage(1);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                        : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
        </div>
      </div>

      {/* 6. Dynamic Table Render */}
      <div className="bg-white dark:bg-[#090C10] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === "transactions" ? (
            /* ================= TRANSACTIONS LEDGER TABLE ================= */
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] text-[11px] font-black text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">DB ID</th>
                  <th className="px-6 py-4">Booking / Order ID</th>
                  <th className="px-6 py-4">Ride Route</th>
                  <th className="px-6 py-4">Razorpay Payment ID</th>
                  <th className="px-6 py-4">Gross Fare</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10 text-xs font-medium">
                {isPaymentsLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-gray-400">
                      <Loader2 className="w-7 h-7 animate-spin mx-auto text-blue-500 mb-3" />
                      Fetching financial records...
                    </td>
                  </tr>
                ) : isPaymentsError ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-rose-500 font-bold">
                      {paymentsError instanceof Error ? paymentsError.message : "Failed to load payments."}
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

                      {/* Ride Context / Link Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {txn.ride_id ? (
                          <div
                            onClick={(e) => handleNavigateToRide(txn.ride_id, e)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 transition group/ride"
                            title="Click to view Ride details"
                          >
                            <Car className="w-3.5 h-3.5" />
                            <span className="font-mono font-extrabold text-[11px]">
                              Ride #{txn.ride_id}
                            </span>
                            {txn.seat_booked && (
                              <span className="flex items-center gap-0.5 text-[10px] bg-blue-500/20 px-1.5 py-0.5 rounded-md font-bold">
                                <Users className="w-2.5 h-2.5" /> {txn.seat_booked}
                              </span>
                            )}
                            <ExternalLink className="w-3 h-3 opacity-60 group-hover/ride:opacity-100" />
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">No Ride Attached</span>
                        )}
                        {txn.source && txn.destination && (
                          <p className="text-[10px] text-gray-400 truncate max-w-[180px] mt-1 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-gray-400 shrink-0" />
                            {txn.source} → {txn.destination}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-500 dark:text-gray-400">
                        {txn.payment_id || <span className="text-gray-400 italic">N/A</span>}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-black text-gray-900 dark:text-white text-sm">
                        ₹{Number(txn.amount || 0).toFixed(2)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {txn.payment_status?.toLowerCase() === "paid" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                          </span>
                        )}
                        {txn.payment_status?.toLowerCase() === "unpaid" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <Clock className="w-3.5 h-3.5" /> Unpaid
                          </span>
                        )}
                        {txn.payment_status?.toLowerCase() === "failed" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            <AlertCircle className="w-3.5 h-3.5" /> Failed
                          </span>
                        )}
                        {txn.payment_status?.toLowerCase() === "refunded" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                            <RotateCcw className="w-3.5 h-3.5" /> Refunded
                          </span>
                        )}
                        {txn.payment_status?.toLowerCase() === "partially_refunded" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                            <RotateCcw className="w-3.5 h-3.5" /> Partially Refunded
                          </span>
                        )}
                        {txn.payment_status?.toLowerCase() === "refund_requested" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                            <RotateCcw className="w-3.5 h-3.5" /> Refund Requested
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {new Date(txn.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-400 group-hover:text-blue-500 transition">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-gray-400">
                      No payment transactions found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            /* ================= REFUND REQUESTS TABLE ================= */
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] text-[11px] font-black text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Refund Req ID</th>
                  <th className="px-6 py-4">Booking Code</th>
                  <th className="px-6 py-4">Refund Amount</th>
                  <th className="px-6 py-4">Reason / Notes</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Razorpay Refund ID</th>
                  <th className="px-6 py-4">Requested At</th>
                  <th className="px-6 py-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10 text-xs font-medium">
                {isRefundsLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-gray-400">
                      <Loader2 className="w-7 h-7 animate-spin mx-auto text-rose-500 mb-3" />
                      Loading refund requests...
                    </td>
                  </tr>
                ) : isRefundsError ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-rose-500 font-bold">
                      {refundsError instanceof Error ? refundsError.message : "Failed to load refund requests."}
                    </td>
                  </tr>
                ) : refundRequests.length > 0 ? (
                  refundRequests.map((refund) => (
                    <tr
                      key={refund.refund_table_id}
                      onClick={() => setSelectedRefund(refund)}
                      className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition cursor-pointer group"
                    >
                      <td className="px-6 py-4 font-mono font-bold text-gray-900 dark:text-white">
                        #{refund.refund_table_id}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {refund.booking_code || `#${refund.booking_id}`}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-black text-rose-600 dark:text-rose-400 text-sm">
                        ₹{Number(refund.refund_amount || 0).toFixed(2)}
                      </td>

                      <td className="px-6 py-4 max-w-xs truncate text-gray-600 dark:text-gray-300">
                        {refund.reason_of_refund || "N/A"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {refund.refund_status === "processed" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Processed
                          </span>
                        )}
                        {refund.refund_status === "processing" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <Clock className="w-3.5 h-3.5" /> Processing
                          </span>
                        )}
                        {refund.refund_status === "requested" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            <Clock className="w-3.5 h-3.5" /> Requested
                          </span>
                        )}
                        {refund.refund_status === "failed" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            <AlertCircle className="w-3.5 h-3.5" /> Failed
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-500">
                        {refund.razorpay_refund_id || <span className="italic text-gray-400">Pending</span>}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {new Date(refund.requested_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-400 group-hover:text-rose-500 transition">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-gray-400">
                      No refund requests found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        {currentTotalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-white/10 text-xs">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition font-extrabold"
            >
              Previous
            </button>
            <span className="text-gray-400 font-bold">
              Page {page} of {currentTotalPages}
            </span>
            <button
              disabled={page === currentTotalPages}
              onClick={() => setPage((p) => Math.min(p + 1, currentTotalPages))}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition font-extrabold"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* 7. TRANSACTION AUDIT & STATUS EDIT DRAWER */}
      <AnimatePresence>
        {selectedTxn && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedTxn(null);
                setEditingStatus(false);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-white dark:bg-[#090C10] border-l border-gray-200 dark:border-white/10 z-50 p-6 overflow-y-auto space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">
                    Transaction Audit
                  </h2>
                  <p className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                    Payment DB ID: #{selectedTxn.id}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedTxn(null);
                    setEditingStatus(false);
                  }}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Amount Box */}
              <div className="p-5 bg-gradient-to-br from-blue-600/10 via-blue-500/5 to-transparent border border-blue-500/20 rounded-3xl space-y-3">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-wider">
                  Gross Transaction Value
                </span>
                <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  ₹{Number(selectedTxn.amount || 0).toFixed(2)}
                </p>

                {/* EDITABLE STATUS ROW */}
                <div className="pt-3 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-500">Payment Status:</span>

                  {!editingStatus ? (
                    <div className="flex items-center gap-2">
                      <span className="font-black uppercase text-blue-500 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        {selectedTxn.payment_status}
                      </span>
                      <button
                        onClick={() => {
                          setNewStatusValue(selectedTxn.payment_status);
                          setEditingStatus(true);
                        }}
                        className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-gray-200 text-gray-600 dark:text-gray-300 transition"
                        title="Update Status"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <select
                          value={newStatusValue}
                          onChange={(e) => setNewStatusValue(e.target.value)}
                          className="appearance-none bg-white dark:bg-[#121720] border border-blue-500/50 text-xs font-bold rounded-xl pl-3 pr-7 py-1.5 focus:outline-none text-gray-900 dark:text-white cursor-pointer"
                        >
                          <option value="paid">Paid</option>
                          <option value="unpaid">Unpaid</option>
                          <option value="failed">Failed</option>
                          <option value="refund_requested">Refund Requested</option>
                          <option value="refunded">Refunded</option>
                          <option value="partially_refunded">Partially Refunded</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      <button
                        disabled={updateStatusMutation.isPending}
                        onClick={() =>
                          updateStatusMutation.mutate({
                            paymentId: selectedTxn.id,
                            status: newStatusValue,
                          })
                        }
                        className="p-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition shadow-md disabled:opacity-50 cursor-pointer"
                        title="Save Status"
                      >
                        {updateStatusMutation.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => setEditingStatus(false)}
                        className="p-1.5 rounded-xl bg-gray-200 dark:bg-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Ride Route Context Card */}
              {selectedTxn.ride_id && (
                <div className="p-4 bg-blue-500/5 border border-blue-500/15 rounded-3xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-500 flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5" /> Attached Ride Record
                    </span>
                    <button
                      onClick={() => handleNavigateToRide(selectedTxn.ride_id)}
                      className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Open Ride <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5">
                      <span className="text-[10px] text-gray-400 font-medium block">Route</span>
                      <span className="font-bold text-gray-800 dark:text-gray-200 truncate block">
                        {selectedTxn.source || "N/A"} → {selectedTxn.destination || "N/A"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5">
                      <span className="text-[10px] text-gray-400 font-medium block">Seats Reserved</span>
                      <span className="font-bold text-gray-800 dark:text-gray-200 block">
                        {selectedTxn.seat_booked || 1} Seat(s)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Transaction Metadata */}
              <div className="space-y-3 text-xs">
                <h3 className="font-black uppercase tracking-wider text-gray-400 text-[10px]">
                  Transaction Metadata
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 space-y-3">
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
                    <span className="text-gray-400">Gateway:</span>
                    <span className="font-bold uppercase text-gray-700 dark:text-gray-300">
                      {selectedTxn.payment_gateway || "Razorpay"}
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

              {/* Issue Refund Action Button */}
              {selectedTxn?.payment_status?.toLowerCase() === "paid" && (
                <button
                  onClick={() => setIsRefundModalOpen(true)}
                  className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Issue Refund Process
                </button>
              )}

              {/* Refund Modal Trigger Integration */}
              <RefundModal
                isOpen={isRefundModalOpen}
                onClose={() => setIsRefundModalOpen(false)}
                transaction={selectedTxn}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 8. REFUND REQUEST INSPECTION DRAWER */}
      <AnimatePresence>
        {selectedRefund && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRefund(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-white dark:bg-[#090C10] border-l border-gray-200 dark:border-white/10 z-50 p-6 overflow-y-auto space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">
                    Refund Request Details
                  </h2>
                  <p className="text-xs font-mono font-bold text-rose-500">
                    Request ID: #{selectedRefund.refund_table_id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRefund(null)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Amount Box */}
              <div className="p-5 bg-gradient-to-br from-rose-600/10 via-rose-500/5 to-transparent border border-rose-500/20 rounded-3xl space-y-2">
                <span className="text-[10px] text-rose-500 font-black uppercase tracking-wider">
                  Requested Refund Amount
                </span>
                <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  ₹{Number(selectedRefund.refund_amount || 0).toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">
                  Original Transaction Amount: ₹{Number(selectedRefund.original_payment_amount || 0).toFixed(2)}
                </p>
              </div>

              {/* Reason Box */}
              <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl space-y-2">
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">
                  Reason for Refund
                </span>
                <p className="text-xs text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                  {selectedRefund.reason_of_refund || "No explanation provided."}
                </p>
              </div>

              {/* Metadata Box */}
              <div className="space-y-3 text-xs">
                <h3 className="font-black uppercase tracking-wider text-gray-400 text-[10px]">
                  Request Metadata
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Booking Code:</span>
                    <span className="font-mono font-bold text-blue-500">
                      {selectedRefund.booking_code || `#${selectedRefund.booking_id}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="font-bold uppercase text-rose-500">
                      {selectedRefund.refund_status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Razorpay Payment ID:</span>
                    <span className="font-mono text-gray-700 dark:text-gray-300">
                      {selectedRefund.razorpay_payment_id || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Razorpay Refund ID:</span>
                    <span className="font-mono text-gray-700 dark:text-gray-300">
                      {selectedRefund.razorpay_refund_id || "Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Requested At:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {new Date(selectedRefund.requested_at).toLocaleString()}
                    </span>
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