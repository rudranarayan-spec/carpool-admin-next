"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import { paymentService } from "@/services/paymentService";
import { PaymentTransactionRaw } from "@/types/payment";

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PaymentTransactionRaw | null;
}

export default function RefundModal({ isOpen, onClose, transaction }: RefundModalProps) {
  const queryClient = useQueryClient();

  const [refundAmount, setRefundAmount] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const maxAmount = Number(transaction?.amount || 0);

  // TanStack Query Mutation
  const refundMutation = useMutation({
    mutationFn: async () => {
      if (!transaction) throw new Error("No transaction selected");

      const parsedAmount = refundAmount ? parseFloat(refundAmount) : undefined;

      // Client-side guardrail
      if (parsedAmount && (parsedAmount <= 0 || parsedAmount > maxAmount)) {
        throw new Error(`Refund amount must be between ₹1 and ₹${maxAmount}`);
      }

      return await paymentService.processRefund(transaction.id, {
        refund_amount: parsedAmount,
        reason_of_refund: reason.trim() || "Admin initiated dashboard refund",
      });
    },
    onSuccess: (data) => {
      // Invalidate queries so tables, stats, and drawer reflect updated payment status
      queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
      queryClient.invalidateQueries({ queryKey: ["booking-details", transaction?.booking_id] });

      handleClose();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Failed to process refund.";
      setErrorMessage(msg);
    },
  });

  const handleClose = () => {
    setRefundAmount("");
    setReason("");
    setErrorMessage(null);
    refundMutation.reset();
    onClose();
  };

  if (!isOpen || !transaction) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-lg bg-white dark:bg-[#090C10] rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 overflow-hidden z-10 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Process Gateway Refund
                </h3>
                <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                  Order ID: {transaction.order_id}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Payment Context Card */}
          <div className="p-4 bg-gray-50 dark:bg-white/2 border border-gray-200 dark:border-white/10 rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Booking Code:</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                {transaction.booking_code || transaction.booking_id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Razorpay Payment ID:</span>
              <span className="font-mono text-gray-800 dark:text-gray-200">
                {transaction.payment_id}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-white/10 font-bold">
              <span className="text-gray-700 dark:text-gray-300">Original Charged Amount:</span>
              <span className="text-gray-900 dark:text-white text-sm">
                ₹{maxAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Form Controls */}
          <div className="space-y-4">
            {/* Amount Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Refund Amount (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  max={maxAmount}
                  placeholder={`Full Amount (₹${maxAmount})`}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="w-full bg-gray-100/80 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition"
                />
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                Leave blank to refund the maximum available balance (₹{maxAmount}).
              </p>
            </div>

            {/* Refund Reason / Admin Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Reason / Admin Notes
              </label>
              <textarea
                rows={3}
                placeholder="e.g., Driver cancelled ride mid-trip, customer requested partial refund..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-gray-100/80 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl p-3 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition resize-none"
              />
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={refundMutation.isPending}
              className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-200 text-xs font-bold hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-50 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => refundMutation.mutate()}
              disabled={refundMutation.isPending}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-rose-600/20 disabled:opacity-50 cursor-pointer"
            >
              {refundMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing Gateway Refund...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Confirm & Process
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}