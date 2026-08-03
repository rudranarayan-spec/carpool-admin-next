"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  X,
  CheckCircle2,
  XCircle,
  Clock,
  Car,
  Phone,
  Mail,
  FileText,
  Eye,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { DriverApproval } from "@/services/driver.service";
import { Driver } from "@/types/driver.types";

interface DriverDocument {
  id: string;
  name: string;
  type: "license" | "insurance" | "registration" | "background_check";
  url: string;
  status: "pending" | "approved" | "rejected";
}

interface PendingApprovalsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PendingApprovalsDrawer({
  isOpen,
  onClose,
}: PendingApprovalsDrawerProps) {
  const queryClient = useQueryClient();

  // Fetch pending drivers using DriverApproval.getPendingDrivers service
  const { data: pendingData, isLoading: isFetchingPending } = useQuery({
    queryKey: ["pending-drivers"],
    queryFn: () => DriverApproval.getPendingDrivers(),
    enabled: isOpen, // Only fetch when the drawer is open
  });

  const pendingDrivers: Driver[] = pendingData?.data || [];

  // Expanded card state
  const [expandedDriverId, setExpandedDriverId] = useState<number | null>(null);

  // TanStack Query mutation for individual document verification
  const verifyDocMutation = useMutation({
    mutationFn: DriverApproval.verifyDocument,
    onSuccess: (_, variables) => {
      toast.success(`Document marked as ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["pending-drivers"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        `Failed to update document: ${error?.message || "Something went wrong"}`
      );
    },
  });

  // TanStack Query mutation for driver status update using DriverApproval.updateDriverStatus
  const updateStatusMutation = useMutation({
    mutationFn: DriverApproval.updateDriverStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["pending-drivers"] });
    },
  });

  const handleDocStatusChange = (
    driverId: number,
    docType: "license" | "insurance" | "registration" | "background_check",
    currentStatus: "approved" | "rejected" | "pending",
    targetStatus: "approved" | "rejected"
  ) => {
    const newStatus = currentStatus === targetStatus ? "pending" : targetStatus;

    verifyDocMutation.mutate({
      driverId,
      docType,
      status: newStatus,
    });
  };

  const handleApprove = (driver: Driver) => {
    const toastId = toast.loading(`Approving ${driver.name}...`);

    updateStatusMutation.mutate(
      { driverId: driver.id, status: "active" },
      {
        onSuccess: () => {
          toast.success(`${driver.name} has been approved successfully!`, {
            id: toastId,
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message || error.message || "Something went wrong";

          toast.error(errorMessage, { id: toastId });
        },
      }
    );
  };

  const handleReject = (driver: Driver) => {
    const toastId = toast.loading(`Rejecting ${driver.name}...`);

    updateStatusMutation.mutate(
      { driverId: driver.id, status: "rejected" },
      {
        onSuccess: () => {
          toast.error(`${driver.name} application was rejected`, {
            id: toastId,
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          toast.error(
            `Failed to reject driver: ${error?.message || "Unknown error"}`,
            { id: toastId }
          );
        },
      }
    );
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
            className="fixed top-0 right-0 bottom-0 w-full sm:w-135 bg-white dark:bg-[#090C10] border-l border-gray-200 dark:border-white/10 z-50 p-6 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between"
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
                      {pendingDrivers.length} applicants waiting for document audit
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
                {isFetchingPending ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-sm gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                    <span>Loading pending approvals...</span>
                  </div>
                ) : pendingDrivers.length > 0 ? (
                  pendingDrivers.map((driver) => {
                    const isExpanded =
                      expandedDriverId === driver.id ||
                      (expandedDriverId === null &&
                        pendingDrivers[0]?.id === driver.id);

                    // Real backend documents array from driver model
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const docsList: DriverDocument[] =
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (driver as any).documents || [];
                    const approvedCount = docsList.filter(
                      (d) => d.status === "approved"
                    ).length;
                    const rejectedCount = docsList.filter(
                      (d) => d.status === "rejected"
                    ).length;

                    return (
                      <div
                        key={driver.id}
                        className={`p-4 bg-gray-50 dark:bg-white/3 rounded-2xl border transition-all space-y-4 ${isExpanded
                            ? "border-amber-500/40 shadow-lg"
                            : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                          }`}
                      >
                        {/* Driver Card Header */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm capitalize">
                              {driver.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                              ID: #{driver.id}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              Pending Audit
                            </span>
                            <button
                              onClick={() =>
                                setExpandedDriverId(
                                  isExpanded ? null : driver.id
                                )
                              }
                              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/10 transition"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Driver Metadata */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-1.5 truncate">
                            <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">{driver.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{driver.phone}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 pt-1">
                          <span className="flex items-center gap-1">
                            <Car className="w-3.5 h-3.5 text-blue-500" />
                            {driver.total_vehicles ?? 0} Vehicle(s)
                          </span>
                          <span>
                            Registered:{" "}
                            {new Date(driver.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Document Verification Drawer Section */}
                        {isExpanded && (
                          <div className="pt-3 border-t border-gray-200 dark:border-white/10 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-amber-500" />
                                Verify Documents
                              </h4>
                              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                <span className="text-emerald-500 font-bold">
                                  {approvedCount}
                                </span>{" "}
                                approved,{" "}
                                <span className="text-rose-500 font-bold">
                                  {rejectedCount}
                                </span>{" "}
                                rejected
                              </span>
                            </div>

                            {/* Documents Checklist */}
                            <div className="space-y-2">
                              {docsList.length > 0 ? (
                                docsList.map((doc: DriverDocument) => {
                                  const currentStatus =
                                    doc.status || "pending";
                                  const isUpdatingThisDoc =
                                    verifyDocMutation.isPending &&
                                    verifyDocMutation.variables?.docType ===
                                    doc.type &&
                                    verifyDocMutation.variables?.driverId ===
                                    driver.id;

                                  return (
                                    <div
                                      key={doc.id || doc.type}
                                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition ${currentStatus === "approved"
                                          ? "bg-emerald-500/5 border-emerald-500/30"
                                          : currentStatus === "rejected"
                                            ? "bg-rose-500/5 border-rose-500/30"
                                            : "bg-white dark:bg-black/20 border-gray-200 dark:border-white/10"
                                        }`}
                                    >
                                      <div className="flex items-center gap-2 overflow-hidden mr-2">
                                        <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                                          <FileText className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="font-medium text-gray-800 dark:text-gray-200 truncate capitalize">
                                          {doc.name ||
                                            doc.type.replace("_", " ")}
                                        </span>
                                      </div>

                                      {/* Document Controls */}
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        {doc.url && doc.url !== "#" && (
                                          <a
                                            href={doc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition"
                                            title="Preview Document"
                                          >
                                            <Eye className="w-3.5 h-3.5" />
                                          </a>
                                        )}

                                        {/* Approve Doc Button */}
                                        <button
                                          type="button"
                                          disabled={verifyDocMutation.isPending}
                                          onClick={() =>
                                            handleDocStatusChange(
                                              driver.id,
                                              doc.type,
                                              currentStatus,
                                              "approved"
                                            )
                                          }
                                          className={`p-1.5 rounded-lg font-bold transition flex items-center gap-1 ${currentStatus === "approved"
                                              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                                              : "bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10"
                                            }`}
                                          title="Approve Document"
                                        >
                                          {isUpdatingThisDoc ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                          ) : (
                                            <Check className="w-3.5 h-3.5" />
                                          )}
                                        </button>

                                        {/* Reject Doc Button */}
                                        <button
                                          type="button"
                                          disabled={verifyDocMutation.isPending}
                                          onClick={() =>
                                            handleDocStatusChange(
                                              driver.id,
                                              doc.type,
                                              currentStatus,
                                              "rejected"
                                            )
                                          }
                                          className={`p-1.5 rounded-lg font-bold transition flex items-center gap-1 ${currentStatus === "rejected"
                                              ? "bg-rose-600 text-white shadow-sm shadow-rose-600/30"
                                              : "bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10"
                                            }`}
                                          title="Reject Document"
                                        >
                                          {isUpdatingThisDoc ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                          ) : (
                                            <X className="w-3.5 h-3.5" />
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="text-center py-4 text-xs text-gray-400">
                                  No documents uploaded for this driver.
                                </div>
                              )}
                            </div>

                            {/* Warning Banner */}
                            {rejectedCount > 0 && (
                              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>
                                  {rejectedCount} document(s) marked for
                                  rejection.
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Overall Action Buttons */}
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-white/5">
                          <button
                            onClick={() => handleApprove(driver)}
                            disabled={updateStatusMutation.isPending}
                            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                          >
                            {updateStatusMutation.isPending ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            Approve Driver
                          </button>
                          <button
                            onClick={() => handleReject(driver)}
                            disabled={updateStatusMutation.isPending}
                            className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                          >
                            {updateStatusMutation.isPending ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            Reject Driver
                          </button>
                        </div>
                      </div>
                    );
                  })
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