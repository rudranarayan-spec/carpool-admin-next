"use client";

import { useState } from "react";
import {
  Car,
  Search,
  RefreshCw,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  X,
  Mail,
  Phone,
  Calendar,
  ShieldAlert,
} from "lucide-react";
import { useDrivers, useUpdateDriverStatus } from "@/services/driver.service";
import { PendingApprovalsDrawer } from "@/components/pendingApprovalDrawer";

export default function DriverManagementPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Selected driver for details modal
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);

  // Fetch Drivers using React Query
  const { data, isLoading, isError, refetch, isFetching } = useDrivers({
    page,
    limit: 10,
    status: statusFilter,
    search: searchQuery,
  });

  // Fetch pending count specifically for the badge
  const { data: pendingData } = useDrivers({
    status: "pending",
  });

  // Status update mutation
  const updateStatusMutation = useUpdateDriverStatus();

  const drivers = data?.data || [];
  const pagination = data?.pagination;
  const pendingCount = pendingData?.pagination?.total || 0;
  const pendingList = pendingData?.data || [];

  const handleStatusChange = (driverId: string | number, newStatus: string) => {
    updateStatusMutation.mutate(
      { id: driverId, status: newStatus },
      {
        onSuccess: () => {
          // Sync state if driver modal is open
          if (selectedDriver && selectedDriver.id === driverId) {
            setSelectedDriver((prev: any) => ({ ...prev, status: newStatus }));
          }
        },
      }
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen transition-colors duration-300 select-none">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            Fleet Drivers Management
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            Monitor active fleet drivers, track ride metrics, and manage access requests.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => refetch()}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition active:scale-95"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>

          {/* Pending Approvals Button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs hover:bg-amber-500/20 transition flex items-center gap-2 active:scale-95"
          >
            <Clock className="w-4 h-4" />
            <span>Pending Approvals</span>
            {pendingCount > 0 && (
              <span className="ml-1 px-2 py-0.5 text-[10px] font-black bg-amber-500 text-white rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Total Fleet Drivers</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
              {pagination?.total || 0}
            </p>
          </div>
          <Users className="w-8 h-8 text-blue-500 opacity-80" />
        </div>

        <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Active Drivers</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
              {drivers.filter((d: any) => d.status === "active").length}
            </p>
          </div>
          <CheckCircle className="w-8 h-8 text-emerald-500 opacity-80" />
        </div>

        <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Pending Approvals</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
              {pendingCount}
            </p>
          </div>
          <Clock className="w-8 h-8 text-amber-500 opacity-80" />
        </div>
      </div>

      {/* 3. Controls & Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-[#090C10] p-3 sm:p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Driver Name, Email, or Phone..."
            className="w-full bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
          {["all", "active", "inactive", "pending"].map((tab) => {
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setStatusFilter(tab);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize whitespace-nowrap ${
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

      {/* 4. Driver List Table */}
      <div className="bg-white dark:bg-[#090C10] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Driver Profile</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 text-center">Vehicles</th>
                <th className="px-6 py-4 text-center">Total Rides</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Joined Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500 mb-2" />
                    Fetching fleet drivers...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-rose-500">
                    Failed to load drivers. Check your API connection.
                  </td>
                </tr>
              ) : drivers.length > 0 ? (
                drivers.map((driver: any) => (
                  <tr
                    key={driver.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition cursor-pointer"
                    onClick={() => setSelectedDriver(driver)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white capitalize">
                          {driver.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          ID: #{driver.id}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs space-y-0.5">
                        <p className="font-medium text-gray-800 dark:text-gray-200">{driver.email}</p>
                        <p className="text-gray-500 dark:text-gray-400">{driver.phone}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-xs font-bold text-gray-700 dark:text-gray-300">
                        <Car className="w-3.5 h-3.5 text-blue-500" />
                        {driver.total_vehicles || 0}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center whitespace-nowrap font-bold text-gray-900 dark:text-white">
                      {driver.total_rides || 0}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      {driver.status === "active" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle className="w-3.5 h-3.5" /> Active
                        </span>
                      )}
                      {driver.status === "inactive" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          <XCircle className="w-3.5 h-3.5" /> Inactive
                        </span>
                      )}
                      {driver.status === "pending" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {driver.created_at
                        ? new Date(driver.created_at).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>

                    <td className="px-6 py-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedDriver(driver)}
                          className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No drivers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Showing Page <span className="font-bold text-gray-900 dark:text-white">{pagination.page}</span> of{" "}
              <span className="font-bold text-gray-900 dark:text-white">{pagination.totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 disabled:opacity-40 text-gray-600 dark:text-gray-300 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                disabled={page === pagination.totalPages}
                className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 disabled:opacity-40 text-gray-600 dark:text-gray-300 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Driver Details Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0D1117] border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-6 p-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                  {selectedDriver.name}
                </h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">ID: #{selectedDriver.id}</p>
              </div>
              <button
                onClick={() => setSelectedDriver(null)}
                className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-100 dark:border-white/5">
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 font-medium mb-1">
                    <Car className="w-3.5 h-3.5 text-blue-500" /> Total Vehicles
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedDriver.total_vehicles || 0}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-100 dark:border-white/5">
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 font-medium mb-1">
                    <Users className="w-3.5 h-3.5 text-emerald-500" /> Total Rides
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedDriver.total_rides || 0}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{selectedDriver.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{selectedDriver.phone || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>
                    Joined:{" "}
                    {selectedDriver.created_at
                      ? new Date(selectedDriver.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>

              {/* Status Management Actions */}
              <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                  Update Account Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    disabled={selectedDriver.status === "active" || updateStatusMutation.isPending}
                    onClick={() => handleStatusChange(selectedDriver.id, "active")}
                    className="px-3 py-2 rounded-xl text-xs font-bold border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-40 transition flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve / Active
                  </button>

                  <button
                    disabled={selectedDriver.status === "inactive" || updateStatusMutation.isPending}
                    onClick={() => handleStatusChange(selectedDriver.id, "inactive")}
                    className="px-3 py-2 rounded-xl text-xs font-bold border border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-40 transition flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Deactivate
                  </button>

                  <button
                    disabled={selectedDriver.status === "pending" || updateStatusMutation.isPending}
                    onClick={() => handleStatusChange(selectedDriver.id, "pending")}
                    className="px-3 py-2 rounded-xl text-xs font-bold border border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-40 transition flex items-center justify-center gap-1"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" /> Set Pending
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Pending Approvals Drawer Component */}
      <PendingApprovalsDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pendingDrivers={pendingList}
      />
    </div>
  );
}