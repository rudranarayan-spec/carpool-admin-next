"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, XCircle, Clock, Car, Phone, Mail } from "lucide-react";
import { Driver, useUpdateDriverStatus } from "@/services/driver.service";

interface PendingApprovalsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pendingDrivers: Driver[];
}

export function PendingApprovalsDrawer({
  isOpen,
  onClose,
  pendingDrivers,
}: PendingApprovalsDrawerProps) {
  const updateStatus = useUpdateDriverStatus();

  const handleApprove = (id: number) => {
    updateStatus.mutate({ driverId: id, status: "active" });
  };

  const handleReject = (id: number) => {
    updateStatus.mutate({ driverId: id, status: "rejected" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-white dark:bg-[#090C10] border-l border-gray-200 dark:border-white/10 z-50 p-6 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">
                      Pending Approvals
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {pendingDrivers.length} applicants waiting for verification
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Pending List */}
              <div className="space-y-4">
                {pendingDrivers.length > 0 ? (
                  pendingDrivers.map((driver) => (
                    <div
                      key={driver.id}
                      className="p-4 bg-gray-50 dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-white/10 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white text-sm capitalize">
                            {driver.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            ID: #{driver.id}
                          </p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          Pending Audit
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{driver.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span>{driver.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Car className="w-3.5 h-3.5 text-blue-500" />
                          {driver.total_vehicles} Vehicle(s)
                        </span>
                        <span>Registered: {new Date(driver.created_at).toLocaleDateString()}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-white/5">
                        <button
                          onClick={() => handleApprove(driver.id)}
                          disabled={updateStatus.isPending}
                          className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(driver.id)}
                          disabled={updateStatus.isPending}
                          className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400 text-sm">
                    No pending driver approvals.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}