/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  RefreshCw,
  Eye,
  Send,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PayoutService } from "@/services/payout.service";
import { PayoutListItem, PayoutStatus } from "@/types/payouts.types";
import { PayoutDetailDrawer } from "@/components/dashboard/payouts/PayoutDetailDrawer";

export default function AdminPayoutsPage() {
  const queryClient = useQueryClient();

  // State Management
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<PayoutStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPayoutId, setSelectedPayoutId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  // 1. Fetch Payouts List
  const {
    data: payoutsData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["admin-payouts", currentPage, statusFilter],
    queryFn: () =>
      PayoutService.getPayouts({
        page: currentPage,
        limit: 10,
        status: statusFilter === "all" ? undefined : statusFilter,
      }),
  });

  // 2. Process Payout Mutation
  const processPayoutMutation = useMutation({
    mutationFn: (id: number) => PayoutService.processPayout(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
      alert(res.message || "Payout processed successfully!");
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to process payout.");
    },
  });

  // Open Drawer Handler
  const handleOpenDrawer = (payoutId: number) => {
    setSelectedPayoutId(payoutId);
    setIsDetailOpen(true);
  };

  // Filter Client-side Search
  const payoutsList = payoutsData?.data || [];
  const filteredPayouts = payoutsList.filter((item) => {
    return (
      item.driver_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.payout_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.driver_phone.includes(searchQuery)
    );
  });

  // Status Badge Component Renderer
  const renderStatusBadge = (status: PayoutStatus) => {
    const config: Record<
      PayoutStatus,
      {
        label: string;
        bg: string;
        text: string;
        border: string;
        icon: React.ElementType;
      }
    > = {
      pending: {
        label: "Pending",
        bg: "bg-amber-500/10 dark:bg-amber-500/20",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-500/20 dark:border-amber-500/30",
        icon: Clock,
      },
      processing: {
        label: "Processing",
        bg: "bg-blue-500/10 dark:bg-blue-500/20",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-500/20 dark:border-blue-500/30",
        icon: RefreshCw,
      },
      completed: {
        label: "Completed",
        bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/20 dark:border-emerald-500/30",
        icon: CheckCircle2,
      },
      failed: {
        label: "Failed",
        bg: "bg-rose-500/10 dark:bg-rose-500/20",
        text: "text-rose-600 dark:text-rose-400",
        border: "border-rose-500/20 dark:border-rose-500/30",
        icon: XCircle,
      },
    };

    const current = config[status] || config.pending;
    const Icon = current.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.bg} ${current.text} ${current.border}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {current.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0B0F17] text-gray-900 dark:text-gray-100 p-4 md:p-8 space-y-6 transition-colors duration-200">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Driver Payouts
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monitor, verify, and disburse settlements directly to drivers.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold shadow-xs hover:bg-gray-50 dark:hover:bg-white/5 active:scale-95 transition cursor-pointer"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh Data
        </button>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-[#12171F] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Records
            </span>
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold">
            {payoutsData?.pagination?.totalRecords ?? 0}
          </div>
          <p className="text-xs text-gray-400">
            Total payout requests recorded
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-[#12171F] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Active Gateway
            </span>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold capitalize">RazorpayX</div>
          <p className="text-xs text-gray-400">
            Instant payout bank transfer integration
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-[#12171F] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Current Page
            </span>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold">
            {payoutsData?.pagination?.currentPage || 1} /{" "}
            {payoutsData?.pagination?.totalPages || 1}
          </div>
          <p className="text-xs text-gray-400">Page iteration index</p>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="p-4 bg-white dark:bg-[#12171F] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search code, driver, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#0B0F17] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {(
            ["all", "pending", "processing", "completed", "failed"] as const
          ).map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition cursor-pointer ${
                statusFilter === st
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white dark:bg-[#12171F] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-200/80 dark:border-white/10 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Payout Info</th>
                <th className="p-4">Driver</th>
                <th className="p-4">Route Info</th>
                <th className="p-4">Net Payout</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/80 dark:divide-white/5">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4">
                      <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-28"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-24"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-36"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-16"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-20"></div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="h-8 bg-gray-200 dark:bg-white/10 rounded w-20 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : filteredPayouts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No payouts found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredPayouts.map((payout: PayoutListItem) => (
                  <tr
                    key={payout.id}
                    onClick={() => handleOpenDrawer(payout.id)}
                    className="hover:bg-gray-50/80 dark:hover:bg-white/[0.03] transition cursor-pointer"
                  >
                    {/* Code & Ride */}
                    <td className="p-4">
                      <div className="font-bold text-gray-900 dark:text-white">
                        {payout.payout_code}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        Ride ID: #{payout.ride_id} • {payout.ride_date}
                      </div>
                    </td>

                    {/* Driver Info */}
                    <td className="p-4">
                      <div className="font-semibold text-gray-800 dark:text-gray-200">
                        {payout.driver_name}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {payout.driver_phone}
                      </div>
                    </td>

                    {/* Route Info */}
                    <td className="p-4 max-w-xs truncate">
                      <div className="text-gray-700 dark:text-gray-300 truncate">
                        <span className="font-medium text-emerald-500">
                          From:
                        </span>{" "}
                        {payout.source_address}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 truncate">
                        <span className="font-medium text-rose-500">To:</span>{" "}
                        {payout.destination_address}
                      </div>
                    </td>

                    {/* Net Amount */}
                    <td className="p-4 font-bold text-gray-900 dark:text-white">
                      <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm">
                        ₹{payout.net_payout_amount}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        Gross: ₹{payout.gross_amount}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">{renderStatusBadge(payout.status)}</td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div
                        className="flex items-center justify-end gap-2"
                        onClick={(e) => e.stopPropagation()} // Stop drawer from opening when clicking action buttons directly
                      >
                        <button
                          onClick={() => handleOpenDrawer(payout.id)}
                          className="p-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl transition text-gray-700 dark:text-gray-300 cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {payout.status === "pending" && (
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  `Process payout of ₹${payout.net_payout_amount} to ${payout.driver_name}?`
                                )
                              ) {
                                processPayoutMutation.mutate(payout.id);
                              }
                            }}
                            disabled={processPayoutMutation.isPending}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold rounded-xl text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            Disburse
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        {payoutsData?.pagination && (
          <div className="p-4 border-t border-gray-200/80 dark:border-white/10 flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">
              Page {payoutsData.pagination.currentPage} of{" "}
              {payoutsData.pagination.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-40 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage >= payoutsData.pagination.totalPages}
                className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-40 transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL SIDE DRAWER COMPONENT */}
      <PayoutDetailDrawer
        payoutId={selectedPayoutId}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        renderStatusBadge={renderStatusBadge}
      />
    </div>
  );
}