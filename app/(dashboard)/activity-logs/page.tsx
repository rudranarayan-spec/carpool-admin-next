"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Search,
  Clock,
  User,
  Globe,
  Monitor,
  X,
  RefreshCw,
  Eye,
  Terminal,
  Database,
  Layers,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

import {
  getActivityLogs,
  ActivityLog,
  LogPagination,
} from "@/services/activityLog.service";

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<LogPagination | null>(null);

  // Drawer state
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getActivityLogs({
        page: currentPage,
        limit: 20,
        search: searchQuery,
        entityType: entityFilter,
      });

      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (err: unknown) {
      let message = "Failed to load activity logs";
      if (err && typeof err === "object" && "message" in err) {
        message = String((err as { message: string }).message);
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, entityFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchLogs]);

  const handleFilterChange = (tab: string) => {
    setEntityFilter(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Activity className="w-7 h-7" />
            </div>
            Activity Logs
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            Real-time audit ledger for rides, vehicle status updates, and user actions.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition disabled:opacity-50 self-start sm:self-auto"
          title="Refresh Logs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-[#090C10] p-3 sm:p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search action, description, IP..."
            className="w-full bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          {["All", "rides", "vehicles"].map((tab) => {
            const isActive = entityFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => handleFilterChange(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize whitespace-nowrap ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
          <button onClick={fetchLogs} className="underline font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-[#090C10] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Timestamp & ID</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Target Entity</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      <span>Fetching logs from server...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <div>
                          <p className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                            {log.timestamp}
                          </p>
                          <p className="text-[10px] font-mono text-gray-400">
                            {log.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-500" />
                          {log.actor.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {log.actor.email} •{" "}
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {log.actor.role}
                          </span>
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200">
                        {log.action}
                      </span>
                    </td>

                    <td className="px-6 py-4 max-w-xs truncate text-gray-600 dark:text-gray-300">
                      {log.description}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1 capitalize">
                          <Layers className="w-3 h-3 text-purple-500" />
                          {log.entityType}
                        </span>
                        <p className="text-xs font-mono text-blue-600 dark:text-blue-400">
                          {log.entityId}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-emerald-500" />
                        {log.ipAddress}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No activity logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-gray-50/30 dark:bg-white/[0.01]">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Page <span className="font-bold text-gray-900 dark:text-white">{pagination.page}</span> of{" "}
              <span className="font-bold text-gray-900 dark:text-white">{pagination.totalPages}</span> ({pagination.total} total)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
                className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-white/10 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages || loading}
                className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-white/10 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inspector Drawer */}
      <AnimatePresence>
        {selectedLog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLog(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-white dark:bg-[#090C10] border-l border-gray-200 dark:border-white/10 z-50 p-6 overflow-y-auto space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-blue-500" /> Log Inspector
                  </h2>
                  <p className="text-xs font-mono text-blue-600 dark:text-blue-400">
                    {selectedLog.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <h3 className="font-extrabold uppercase text-gray-400">Details</h3>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Action:</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">
                      {selectedLog.action}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Description:</span>
                    <span className="font-medium text-gray-900 dark:text-white text-right max-w-[200px]">
                      {selectedLog.description}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">User ID:</span>
                    <span className="font-mono text-gray-900 dark:text-white">
                      {selectedLog.actor.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Actor Name:</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {selectedLog.actor.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Actor Email:</span>
                    <span className="font-mono text-gray-700 dark:text-gray-300">
                      {selectedLog.actor.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">IP Address:</span>
                    <span className="font-mono text-emerald-500">
                      {selectedLog.ipAddress}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <h3 className="font-extrabold uppercase text-gray-400 flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5" /> User-Agent
                </h3>
                <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 font-mono text-[11px] text-gray-700 dark:text-gray-300 break-all">
                  {selectedLog.userAgent}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <h3 className="font-extrabold uppercase text-gray-400 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" /> Metadata Dump
                </h3>
                <pre className="p-4 bg-gray-900 text-emerald-400 rounded-2xl border border-gray-800 font-mono text-xs overflow-x-auto">
                  {JSON.stringify(selectedLog.metadata || {}, null, 2)}
                </pre>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}