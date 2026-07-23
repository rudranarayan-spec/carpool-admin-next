"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Search,
  Clock,
  User,
  Globe,
  Monitor,
  Shield,
  X,
  RefreshCw,
  Eye,
  Terminal,
  Filter,
  Download,
  Database,
  Layers,
} from "lucide-react";

interface ActivityLog {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    email: string;
    role: "Admin" | "Driver" | "Rider" | "System";
  };
  action: string;
  entityType: "Driver" | "Vehicle" | "Ride" | "Payment" | "User";
  entityId: string;
  ipAddress: string;
  userAgent: string;
  status: "Success" | "Failed" | "Warning";
  metadata?: Record<string, unknown>;
}

const initialLogs: ActivityLog[] = [
  {
    id: "LOG-10921",
    timestamp: "23 Jul 2026, 18:54:12",
    actor: {
      name: "Rudranarayan Sahu",
      email: "rudra@admin.com",
      role: "Admin",
    },
    action: "DRIVER_APPROVED",
    entityType: "Driver",
    entityId: "DRV-104",
    ipAddress: "157.32.102.44",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126.0.0.0",
    status: "Success",
    metadata: {
      driverName: "Marcus Vance",
      approvedBy: "rudra@admin.com",
      previousStatus: "Pending",
    },
  },
  {
    id: "LOG-10922",
    timestamp: "23 Jul 2026, 18:30:05",
    actor: {
      name: "Ashirbad Swain",
      email: "ashirbad@admin.com",
      role: "Admin",
    },
    action: "VEHICLE_REJECTED",
    entityType: "Vehicle",
    entityId: "VAPP-303",
    ipAddress: "103.112.45.12",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/126.0.0.0",
    status: "Warning",
    metadata: {
      reason: "Blurry Registration Certificate image scan",
      vehiclePlate: "9LMN34",
    },
  },
  {
    id: "LOG-10923",
    timestamp: "23 Jul 2026, 17:45:22",
    actor: {
      name: "Elena Rostova",
      email: "elena.r@example.com",
      role: "Driver",
    },
    action: "DOCUMENTS_UPLOADED",
    entityType: "Driver",
    entityId: "DRV-102",
    ipAddress: "49.36.192.110",
    userAgent: "Expo/2.30.0 (Android 14; Mobile)",
    status: "Success",
    metadata: {
      documentTypes: ["Insurance", "Fitness Certificate"],
    },
  },
  {
    id: "LOG-10924",
    timestamp: "23 Jul 2026, 16:12:00",
    actor: {
      name: "System Automation",
      email: "system@internal.bot",
      role: "System",
    },
    action: "PAYMENT_SETTLED",
    entityType: "Payment",
    entityId: "TXN-8801",
    ipAddress: "127.0.0.1",
    userAgent: "InternalWorker/1.0.0 (Node.js/v20.11.0)",
    status: "Success",
    metadata: {
      grossAmount: 48.5,
      platformCommission: 9.7,
      driverPayout: 38.8,
    },
  },
  {
    id: "LOG-10925",
    timestamp: "23 Jul 2026, 15:02:11",
    actor: {
      name: "Anand Verma",
      email: "anand@admin.com",
      role: "Admin",
    },
    action: "UNAUTHORIZED_LOGIN_ATTEMPT",
    entityType: "User",
    entityId: "USR-902",
    ipAddress: "185.220.101.5",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) Firefox/125.0",
    status: "Failed",
    metadata: {
      failureReason: "Invalid OTP credentials",
    },
  },
];

export default function ActivityLogsPage() {
  const [logs] = useState<ActivityLog[]>(initialLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState<string>("All");
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  // Filtering Logic
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);

    const matchesEntity = entityFilter === "All" || log.entityType === entityFilter;

    return matchesSearch && matchesEntity;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen transition-colors duration-300 select-none">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Activity className="w-7 h-7" />
            </div>
            System Activity Audit Logs
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            Immutable tracking ledger capturing user actions, timestamps, client details, and target entities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Logs
          </button>
        </div>
      </div>

      {/* 2. Search & Entity Filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-[#090C10] p-3 sm:p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Action, Actor Name/Email, IP, or Entity ID..."
            className="w-full bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
          />
        </div>

        {/* Entity Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
          {["All", "Driver", "Vehicle", "Ride", "Payment", "User"].map((tab) => {
            const isActive = entityFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setEntityFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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

      {/* 3. Activity Logs Table */}
      <div className="bg-white dark:bg-[#090C10] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Timestamp & Event</th>
                <th className="px-6 py-4">Actor Details</th>
                <th className="px-6 py-4">Action Flag</th>
                <th className="px-6 py-4">Target Entity</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10 text-sm">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition cursor-pointer group"
                  >
                    {/* Timestamp */}
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

                    {/* Actor */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-500" />
                          {log.actor.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {log.actor.email} • <span className="font-semibold text-blue-600 dark:text-blue-400">{log.actor.role}</span>
                        </p>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200">
                        {log.action}
                      </span>
                    </td>

                    {/* Target Entity */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                          <Layers className="w-3 h-3 text-purple-500" />
                          {log.entityType}
                        </span>
                        <p className="text-xs font-mono text-blue-600 dark:text-blue-400">
                          {log.entityId}
                        </p>
                      </div>
                    </td>

                    {/* IP Address */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-emerald-500" />
                        {log.ipAddress}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.status === "Success" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Success
                        </span>
                      )}
                      {log.status === "Warning" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          Warning
                        </span>
                      )}
                      {log.status === "Failed" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          Failed
                        </span>
                      )}
                    </td>

                    {/* Inspector Link */}
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
                    No activity logs recorded for this query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. JSON Payload Drawer Inspector */}
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
              {/* Drawer Header */}
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

              {/* General Metadata */}
              <div className="space-y-3 text-xs">
                <h3 className="font-extrabold uppercase text-gray-400">Event Context</h3>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Action:</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">{selectedLog.action}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Actor Name:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{selectedLog.actor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Actor Email:</span>
                    <span className="font-mono text-gray-700 dark:text-gray-300">{selectedLog.actor.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Target Entity:</span>
                    <span className="font-bold text-purple-500">{selectedLog.entityType} ({selectedLog.entityId})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">IP Address:</span>
                    <span className="font-mono text-emerald-500">{selectedLog.ipAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Timestamp:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{selectedLog.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* User Agent Scan */}
              <div className="space-y-2 text-xs">
                <h3 className="font-extrabold uppercase text-gray-400 flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5" /> Client User-Agent
                </h3>
                <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 font-mono text-[11px] text-gray-700 dark:text-gray-300 break-all">
                  {selectedLog.userAgent}
                </div>
              </div>

              {/* JSON Metadata Dump */}
              <div className="space-y-2 text-xs">
                <h3 className="font-extrabold uppercase text-gray-400 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" /> Extended Payload (JSON)
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