/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  X,
  RefreshCw,
  User,
  Building2,
  Send,
  AlertCircle,
  Calendar,
  Hash,
  Phone,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { PayoutService } from "@/services/payout.service";
import { PayoutStatus } from "@/types/payouts.types";

interface PayoutDetailDrawerProps {
  payoutId: number | null;
  isOpen: boolean;
  onClose: () => void;
  renderStatusBadge: (status: PayoutStatus) => React.ReactNode;
}

export function PayoutDetailDrawer({
  payoutId,
  isOpen,
  onClose,
  renderStatusBadge,
}: PayoutDetailDrawerProps) {
  const queryClient = useQueryClient();

  // 1. Fetch Detailed Payout Information
  const {
    data: payoutDetailData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-payout-detail", payoutId],
    queryFn: () => PayoutService.getPayoutById(payoutId!),
    enabled: !!payoutId && isOpen,
  });

  // 2. Process Payout Mutation
  const processPayoutMutation = useMutation({
    mutationFn: (id: number) => PayoutService.processPayout(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
      if (payoutId) {
        queryClient.invalidateQueries({
          queryKey: ["admin-payout-detail", payoutId],
        });
      }
      toast.success("Payout Disbursed Successfully!", {
        description: res.message || `Funds transferred to driver #${payoutDetailData?.data?.driver_id}.`,
      });
    },
    onError: (err: any) => {
      toast.error("Disbursal Failed", {
        description: err.response?.data?.message || "An unexpected error occurred while processing payout.",
      });
    },
  });

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const detail = payoutDetailData?.data;

  // Confirmation Toast Trigger
  const triggerDisbursalConfirmation = () => {
    if (!detail) return;

    toast.custom((t) => (
      <div className="w-full max-w-sm bg-white dark:bg-[#161C24] border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-2xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              Confirm Disbursal
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Disburse <span className="font-semibold text-emerald-500">₹{detail.net_payout_amount}</span> to{" "}
              <span className="font-semibold text-gray-900 dark:text-white">{detail.driver_name}</span>?
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100 dark:border-white/5">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t);
              processPayoutMutation.mutate(detail.id);
            }}
            className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-sm transition"
          >
            Confirm & Send
          </button>
        </div>
      </div>
    ), { duration: 6000 });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Animated Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
          >
            {/* Animated Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-[#12171F] border-l border-gray-200 dark:border-white/10 h-full p-6 space-y-6 overflow-y-auto shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500 dark:bg-indigo-400/10 dark:text-indigo-400">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Payout Details
                      </h2>
                      <p className="text-xs text-gray-400">
                        Settlement Ref #{payoutId}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-white/10 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="flex flex-col items-center justify-center h-64 space-y-3">
                    <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-full animate-bounce">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                      Fetching settlement metadata...
                    </span>
                  </div>
                )}

                {/* Error State */}
                {isError && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 text-xs shadow-xs">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>
                      {(error as any)?.response?.data?.message ||
                        "Failed to load payout details. Please try again."}
                    </p>
                  </div>
                )}

                {/* Content View */}
                {!isLoading && detail && (
                  <div className="space-y-5 text-xs">
                    {/* Status & Amount Summary Card */}
                    <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/60 dark:from-[#0B0F17] dark:to-[#161C24] border border-gray-200/80 dark:border-white/10 space-y-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-0.5">
                            Payout Code
                          </span>
                          <p className="font-mono font-bold text-sm text-gray-900 dark:text-white tracking-tight">
                            {detail.payout_code}
                          </p>
                        </div>
                        {renderStatusBadge(detail.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200/60 dark:border-white/5">
                        <div className="col-span-2 p-3 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-xl border border-emerald-500/20">
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                            Net Transfer Amount
                          </span>
                          <p className="font-black text-2xl text-emerald-600 dark:text-emerald-400">
                            ₹{detail.net_payout_amount}
                          </p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/60 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                          <span className="text-gray-400 block text-[10px]">Gross Amount</span>
                          <p className="font-bold text-gray-800 dark:text-gray-200 text-xs">
                            ₹{detail.gross_amount}
                          </p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/60 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                          <span className="text-gray-400 block text-[10px]">Platform Fee</span>
                          <p className="font-bold text-gray-800 dark:text-gray-200 text-xs">
                            ₹{detail.platform_fee}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Driver Section */}
                    <div className="space-y-2">
                      <label className="font-bold text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-indigo-500" /> Driver Information
                      </label>
                      <div className="p-4 bg-white dark:bg-[#0B0F17] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-2.5 shadow-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Name:</span>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {detail.driver_name}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" /> Phone:
                          </span>
                          <span className="font-mono text-gray-800 dark:text-gray-200">
                            {detail.driver_phone}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 flex items-center gap-1">
                            <Hash className="w-3 h-3 text-gray-400" /> Driver ID:
                          </span>
                          <span className="font-mono px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-200 font-semibold text-[11px]">
                            #{detail.driver_id}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Settlement Bank Account Details */}
                    <div className="space-y-2">
                      <label className="font-bold text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-teal-500" /> Settlement Account
                      </label>
                      <div className="p-4 bg-white dark:bg-[#0B0F17] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-2.5 shadow-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Gateway:</span>
                          <span className="font-bold uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md text-[10px]">
                            {detail.payout_gateway}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Account Number:</span>
                          <span className="font-mono font-bold text-gray-800 dark:text-gray-200">
                            {detail.account_number}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">IFSC Code:</span>
                          <span className="font-mono font-bold text-gray-800 dark:text-gray-200">
                            {detail.ifsc_code}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Transaction Metadata */}
                    <div className="p-4 bg-white dark:bg-[#0B0F17] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-2.5 text-gray-400 shadow-xs">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" /> Created At:
                        </span>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {new Date(detail.created_at).toLocaleString()}
                        </span>
                      </div>
                      {detail.processed_at && (
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Processed At:
                          </span>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {new Date(detail.processed_at).toLocaleString()}
                          </span>
                        </div>
                      )}
                      {detail.payout_id && (
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Gateway Ref:
                          </span>
                          <span className="font-mono text-gray-700 dark:text-gray-300 font-semibold">
                            {detail.payout_id}
                          </span>
                        </div>
                      )}
                      {detail.failure_reason && (
                        <div className="pt-2 border-t border-gray-200/60 dark:border-white/5 text-rose-500">
                          <span className="font-semibold block mb-0.5">Failure Reason:</span>
                          <p className="bg-rose-500/10 p-2.5 rounded-xl text-[11px] leading-relaxed">
                            {detail.failure_reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              {!isLoading && detail && (
                <div className="pt-4 border-t border-gray-100 dark:border-white/10 space-y-2">
                  {detail.status === "pending" ? (
                    <button
                      onClick={triggerDisbursalConfirmation}
                      disabled={processPayoutMutation.isPending}
                      className="group relative w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 active:scale-[0.99] text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer overflow-hidden"
                    >
                      {processPayoutMutation.isPending ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Processing Disbursal...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          <span>Process Disbursal Now</span>
                          <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="w-full py-3 bg-gray-100 dark:bg-white/5 text-gray-400 font-semibold rounded-2xl text-xs text-center border border-gray-200/50 dark:border-white/5 flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-gray-400" />
                      Payout Status: <span className="uppercase font-bold">{detail.status}</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}