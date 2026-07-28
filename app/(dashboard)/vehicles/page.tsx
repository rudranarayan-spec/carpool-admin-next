"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  ExternalLink,
  X,
  RefreshCw,
  Eye,
  Clock,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
  Check,
} from "lucide-react";
import { vehicleService } from "@/services/vehicle.service"; // Adjust import path if needed
import {
  VerificationStatus,
  VehicleListItem,
  VehicleDetail,
} from "@/types/vehicle.types"; // Adjust import path if needed

export default function VehicleApprovalsPage() {
  const queryClient = useQueryClient();

  // Filter & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Selected vehicle state (stores ID so we fetch fresh detailed data)
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null,
  );

  // Rejection modal state
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionInput, setRejectionInput] = useState("");

  // ---------------------------------------------------------------------------
  // 1. Fetch Vehicle List (useQuery)
  // ---------------------------------------------------------------------------
  const {
    data: listResponse,
    isLoading: isListLoading,
    isFetching: isListFetching,
    refetch: refetchList,
  } = useQuery({
    queryKey: [
      "vehicles",
      { page, limit, status: statusFilter, search: searchQuery },
    ],
    queryFn: () =>
      vehicleService.getAllVehicles({
        page,
        limit,
        status:
          statusFilter === "all"
            ? undefined
            : (statusFilter as VerificationStatus),
        search: searchQuery.trim() || undefined,
      }),
  });

  const vehicles = listResponse?.data || [];
  const pagination = listResponse?.pagination;

  // ---------------------------------------------------------------------------
  // 2. Fetch Selected Vehicle Details (useQuery - enabled only when drawer is open)
  // ---------------------------------------------------------------------------
  const { data: detailResponse, isLoading: isDetailLoading } = useQuery({
    queryKey: ["vehicleDetail", selectedVehicleId],
    queryFn: () => vehicleService.getVehicleById(selectedVehicleId!),
    enabled: !!selectedVehicleId,
  });

  const selectedVehicle: VehicleDetail | undefined = detailResponse?.data;

  // ---------------------------------------------------------------------------
  // 3. Update Vehicle Status Mutation (useMutation)
  // ---------------------------------------------------------------------------
  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      reason,
    }: {
      id: number;
      status: VerificationStatus;
      reason?: string;
    }) => vehicleService.updateVehicleStatus(id, { status, reason }),
    onSuccess: () => {
      // Refresh list and detail queries on successful status change
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({
        queryKey: ["vehicleDetail", selectedVehicleId],
      });
      setRejectionModalOpen(false);
      setRejectionInput("");
    },
  });

  const handleApprove = (id: number) => {
    updateStatusMutation.mutate({ id, status: "active" });
  };

  const handleReject = () => {
    if (!selectedVehicleId || !rejectionInput.trim()) return;
    updateStatusMutation.mutate({
      id: selectedVehicleId,
      status: "blocked",
      reason: rejectionInput.trim(),
    });
  };

  // Status Badge Helper
  const renderStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Active / Approved
          </span>
        );
      case "blocked":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" /> Blocked
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20">
            Inactive
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen transition-colors duration-300 select-none">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Car className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Vehicle Approvals
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            Verify registration certificates, insurance compliance, and document
            records for platform vehicles.
          </p>
        </div>

        <button
          onClick={() => refetchList()}
          className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition active:scale-95 self-start sm:self-auto flex items-center gap-2 text-xs font-bold"
          title="Refresh Data"
        >
          <RefreshCw
            className={`w-4 h-4 ${isListFetching ? "animate-spin text-blue-500" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* 2. Controls & Search Filter */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-[#090C10] p-3 sm:p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by Registration Number, Driver Name, or Phone..."
            className="w-full bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
          {[
            { label: "Pending", value: "pending" },
            { label: "Active", value: "active" },
            { label: "Blocked", value: "blocked" },
            { label: "Inactive", value: "inactive" },
            { label: "All", value: "all" },
          ].map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => {
                  setStatusFilter(tab.value);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Vehicle Table */}
      <div className="bg-white dark:bg-[#090C10] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden relative">
        {isListLoading && (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-xs font-medium text-gray-400">
              Loading vehicles...
            </p>
          </div>
        )}

        {!isListLoading && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Vehicle Specification</th>
                  <th className="px-6 py-4">Driver Details</th>
                  <th className="px-6 py-4">Reg Number</th>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10 text-sm">
                {vehicles.length > 0 ? (
                  vehicles.map((item: VehicleListItem) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedVehicleId(item.id)}
                      className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition cursor-pointer group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">
                            {item.model}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                            {item.fuel_type} • {item.color}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-bold text-gray-800 dark:text-gray-200">
                            {item.driver_name}
                          </p>
                          <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                            {item.driver_phone}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-mono font-extrabold text-blue-600 dark:text-blue-400">
                          {item.registration_number}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStatusBadge(item.status)}
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button className="px-3.5 py-1.5 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-bold transition flex items-center gap-1.5 ml-auto">
                          <Eye className="w-3.5 h-3.5" /> Inspect
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                    >
                      No vehicle records found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              Showing Page <strong>{pagination.page}</strong> of{" "}
              <strong>{pagination.totalPages}</strong> ({pagination.total}{" "}
              total)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-white/10 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-white/10 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Document Verification Drawer */}
      <AnimatePresence>
        {selectedVehicleId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVehicleId(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[600px] bg-white dark:bg-[#090C10] border-l border-gray-200 dark:border-white/10 z-50 p-6 overflow-y-auto space-y-6 shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Vehicle Verification Panel
                  </h2>
                  <p className="text-xs font-mono text-blue-600 dark:text-blue-400">
                    ID #{selectedVehicleId}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedVehicleId(null)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isDetailLoading ? (
                <div className="py-24 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="text-xs text-gray-400">Loading details...</p>
                </div>
              ) : selectedVehicle ? (
                <>
                  {/* Driver Summary */}
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Driver Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400">Name:</span>
                        <p className="font-bold text-gray-900 dark:text-white mt-0.5">
                          {selectedVehicle.driver_name}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Phone:</span>
                        <p className="font-mono text-gray-900 dark:text-white mt-0.5 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400" />{" "}
                          {selectedVehicle.driver_phone}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400">Email:</span>
                        <p className="font-mono text-gray-900 dark:text-white mt-0.5 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-400" />{" "}
                          {selectedVehicle.driver_email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Specifications */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                      Vehicle Specs & Identification
                    </h3>
                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-400">Brand & Model:</span>
                        <p className="font-bold text-gray-900 dark:text-white mt-0.5">
                          {selectedVehicle.brand} {selectedVehicle.model} (
                          {selectedVehicle.manufacture_year})
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Reg Plate:</span>
                        <p className="font-mono font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
                          {selectedVehicle.registration_number}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">RC Number:</span>
                        <p className="font-mono text-gray-900 dark:text-white mt-0.5">
                          {selectedVehicle.rc_number || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Fuel & Seats:</span>
                        <p className="font-bold text-gray-900 dark:text-white mt-0.5">
                          {selectedVehicle.fuel_type} • {selectedVehicle.seats}{" "}
                          Seats
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Documents & Files Preview */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                      Document & Image Records
                    </h3>

                    <DocumentCard
                      title="Registration Certificate (RC)"
                      fileUrl={selectedVehicle.rc_file}
                      expiry={selectedVehicle.rc_expiry_date}
                      verifiedStatus={selectedVehicle.is_rc_verified}
                    />

                    <DocumentCard
                      title="Insurance Document"
                      fileUrl={selectedVehicle.insurance_file}
                      expiry={selectedVehicle.insurance_expiry}
                      provider={selectedVehicle.insurance_provider}
                      policyNo={selectedVehicle.policy_number}
                      verifiedStatus={selectedVehicle.is_insurance_verified}
                    />

                    {/* Vehicle Photos */}
                    <div className="grid grid-cols-2 gap-3">
                      <PhotoCard
                        title="Front View"
                        url={selectedVehicle.front_image}
                        status={selectedVehicle.is_front_image_verified}
                      />
                      <PhotoCard
                        title="Back View"
                        url={selectedVehicle.back_image}
                        status={selectedVehicle.is_back_image_verified}
                      />
                      <PhotoCard
                        title="Side View"
                        url={selectedVehicle.side_image}
                        status={selectedVehicle.is_side_image_verified}
                      />
                      <PhotoCard
                        title="Number Plate"
                        url={selectedVehicle.number_plate_image}
                        status={selectedVehicle.is_number_plate_verified}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-200 dark:border-white/10 space-y-2">
                    {selectedVehicle.status !== "active" && (
                      <button
                        onClick={() => handleApprove(selectedVehicle.id)}
                        disabled={updateStatusMutation.isPending}
                        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                      >
                        {updateStatusMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        Approve Vehicle
                      </button>
                    )}

                    {selectedVehicle.status !== "blocked" && (
                      <button
                        onClick={() => setRejectionModalOpen(true)}
                        disabled={updateStatusMutation.isPending}
                        className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject / Block Vehicle
                      </button>
                    )}
                  </div>
                </>
              ) : null}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 5. Rejection Reason Modal */}
      <AnimatePresence>
        {rejectionModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#090C10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Reject / Block Vehicle
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Please state why this vehicle is being rejected or blocked.
              </p>

              <textarea
                value={rejectionInput}
                onChange={(e) => setRejectionInput(e.target.value)}
                placeholder="e.g., Insurance policy expired or RC document scan blurry..."
                className="w-full h-28 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setRejectionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={
                    !rejectionInput.trim() || updateStatusMutation.isPending
                  }
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white transition flex items-center gap-1.5"
                >
                  {updateStatusMutation.isPending && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Sub-Component for Document Cards
function DocumentCard({
  title,
  fileUrl,
  expiry,
  provider,
  policyNo,
  verifiedStatus,
}: {
  title: string;
  fileUrl: string | null;
  expiry?: string;
  provider?: string;
  policyNo?: string;
  verifiedStatus?: VerificationStatus;
}) {
  return (
    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-blue-500" /> {title}
        </span>
        {verifiedStatus && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
              verifiedStatus === "active"
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-amber-500/10 text-amber-500"
            }`}
          >
            {verifiedStatus}
          </span>
        )}
      </div>

      {(provider || policyNo) && (
        <p className="text-[11px] text-gray-400">
          Provider:{" "}
          <strong className="text-gray-200">{provider || "N/A"}</strong> •
          Policy: <strong className="text-gray-200">{policyNo || "N/A"}</strong>
        </p>
      )}

      {expiry && (
        <p className="text-[11px] text-gray-400 flex items-center gap-1">
          <Calendar className="w-3 h-3" /> Expiry Date:{" "}
          <strong className="text-gray-200">{expiry}</strong>
        </p>
      )}

      <div className="aspect-video w-full bg-gray-200 dark:bg-white/10 rounded-xl flex items-center justify-center overflow-hidden relative group">
        {fileUrl ? (
          <>
            <img
              src={fileUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-black/70 text-white text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm hover:bg-black transition"
            >
              <ExternalLink className="w-3 h-3" /> View Full
            </a>
          </>
        ) : (
          <p className="text-xs font-medium text-gray-400">
            No document file provided
          </p>
        )}
      </div>
    </div>
  );
}

// Helper Sub-Component for Image Previews
function PhotoCard({
  title,
  url,
  status,
}: {
  title: string;
  url: string | null;
  status?: VerificationStatus;
}) {
  return (
    <div className="p-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl space-y-1">
      <div className="flex items-center justify-between text-[10px]">
        <span className="font-bold text-gray-400">{title}</span>
        {status === "active" && <Check className="w-3 h-3 text-emerald-500" />}
      </div>
      <div className="aspect-video bg-gray-200 dark:bg-white/10 rounded-lg overflow-hidden relative">
        {url ? (
          <a href={url} target="_blank" rel="noreferrer">
            <img
              src={url}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition"
            />
          </a>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500">
            No image
          </div>
        )}
      </div>
    </div>
  );
}
