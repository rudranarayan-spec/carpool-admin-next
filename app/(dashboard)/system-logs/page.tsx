"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Cpu,
  HardDrive,
  Database,
  Clock,
  Play,
  RotateCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Terminal,
  Activity,
  Zap,
  Filter,
  Search,
  RefreshCw,
  Layers,
  X,
  ExternalLink,
} from "lucide-react";

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  lastRun: string;
  nextRun: string;
  status: "Success" | "Failed" | "Running";
  durationMs: number;
}

interface SystemLog {
  id: string;
  timestamp: string;
  service: "CronWorker" | "Database" | "AuthGateway" | "PaymentQueue" | "PushNotifier";
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  message: string;
  host: string;
  details?: Record<string, unknown>;
}

const initialCronJobs: CronJob[] = [
  {
    id: "JOB-101",
    name: "Driver Payout Auto-Settlement",
    schedule: "Every Day at 00:00 UTC",
    lastRun: "23 Jul 2026, 00:00:02",
    nextRun: "24 Jul 2026, 00:00:00",
    status: "Success",
    durationMs: 1420,
  },
  {
    id: "JOB-102",
    name: "Expired Insurance Flagging Worker",
    schedule: "Every 6 Hours",
    lastRun: "23 Jul 2026, 18:00:00",
    nextRun: "24 Jul 2026, 00:00:00",
    status: "Success",
    durationMs: 380,
  },
  {
    id: "JOB-103",
    name: "Database Vacuum & Index Maintenance",
    schedule: "Every Sunday at 02:00 UTC",
    lastRun: "19 Jul 2026, 02:00:15",
    nextRun: "26 Jul 2026, 02:00:00",
    status: "Success",
    durationMs: 8900,
  },
  {
    id: "JOB-104",
    name: "Stale Ride Cleanup Worker",
    schedule: "Every 15 Minutes",
    lastRun: "23 Jul 2026, 19:00:00",
    nextRun: "23 Jul 2026, 19:15:00",
    status: "Failed",
    durationMs: 5120,
  },
];

const initialLogs: SystemLog[] = [
  {
    id: "SYSLOG-901",
    timestamp: "23 Jul 2026, 19:10:44",
    service: "CronWorker",
    level: "ERROR",
    message: "CronJob [Stale Ride Cleanup Worker] execution failed: Connection pool exhausted.",
    host: "worker-node-02.prod",
    details: {
      errorCode: "POOL_MAX_CLIENTS",
      activeConnections: 100,
      maxAllowed: 100,
    },
  },
  {
    id: "SYSLOG-902",
    timestamp: "23 Jul 2026, 19:05:12",
    service: "PaymentQueue",
    level: "INFO",
    message: "Processed batch of 48 payout disbursements successfully.",
    host: "payment-node-01.prod",
    details: { batchSize: 48, totalDisbursed: "$1,840.50" },
  },
  {
    id: "SYSLOG-903",
    timestamp: "23 Jul 2026, 18:55:00",
    service: "Database",
    level: "WARN",
    message: "High query execution latency detected on table 'vehicle_documents' (>450ms).",
    host: "db-primary.prod",
    details: { queryTimeMs: 482, table: "vehicle_documents" },
  },
  {
    id: "SYSLOG-904",
    timestamp: "23 Jul 2026, 18:30:10",
    service: "PushNotifier",
    level: "INFO",
    message: "FCMSender: Sent 120 push notifications for document review updates.",
    host: "app-node-03.prod",
  },
];

export default function SystemLogsPage() {
  const [cronJobs, setCronJobs] = useState<CronJob[]>(initialCronJobs);
  const [logs] = useState<SystemLog[]>(initialLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);

  // Manual Trigger Cron Simulation
  const handleTriggerCron = (jobId: string) => {
    setCronJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: "Running" } : job
      )
    );

    setTimeout(() => {
      setCronJobs((prev) =>
        prev.map((job) =>
          job.id === jobId
            ? {
                ...job,
                status: "Success",
                lastRun: "Just now",
                durationMs: Math.floor(Math.random() * 800) + 200,
              }
            : job
        )
      );
    }, 1500);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.host.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = levelFilter === "All" || log.level === levelFilter;

    return matchesSearch && matchesLevel;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen transition-colors duration-300 select-none">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
              <Server className="w-7 h-7" />
            </div>
            System Health & Telemetry Logs
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            Monitor background cron jobs, worker node telemetry, and real-time backend service outputs.
          </p>
        </div>

        <button
          onClick={() => setCronJobs(initialCronJobs)}
          className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition active:scale-95 self-start sm:self-auto"
          title="Refresh Telemetry"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Live Server Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: CPU Load */}
        <div className="p-5 bg-white dark:bg-[#090C10] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">
            <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-blue-500" /> CPU Core Load</span>
            <span className="text-blue-500">28%</span>
          </div>
          <div className="h-2.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full w-[28%]" />
          </div>
          <p className="text-[11px] text-gray-400 font-mono">8 Cores active • 2.4 GHz</p>
        </div>

        {/* Metric 2: RAM Usage */}
        <div className="p-5 bg-white dark:bg-[#090C10] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">
            <span className="flex items-center gap-1.5"><HardDrive className="w-4 h-4 text-purple-500" /> Memory (RAM)</span>
            <span className="text-purple-500">14.2 / 32 GB</span>
          </div>
          <div className="h-2.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full w-[44%]" />
          </div>
          <p className="text-[11px] text-gray-400 font-mono">44% Allocated • Node cluster</p>
        </div>

        {/* Metric 3: DB Connection Pool */}
        <div className="p-5 bg-white dark:bg-[#090C10] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">
            <span className="flex items-center gap-1.5"><Database className="w-4 h-4 text-amber-500" /> DB Connection Pool</span>
            <span className="text-amber-500">84 / 100</span>
          </div>
          <div className="h-2.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full w-[84%]" />
          </div>
          <p className="text-[11px] text-amber-500 font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Near pool limit
          </p>
        </div>

        {/* Metric 4: Health Status */}
        <div className="p-5 bg-white dark:bg-[#090C10] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-emerald-500" /> System Uptime</span>
            <span className="text-emerald-500">99.98%</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse inline-block" />
            <p className="text-sm font-extrabold text-gray-900 dark:text-white">All Systems Operational</p>
          </div>
          <p className="text-[11px] text-gray-400 font-mono">Uptime: 42 days, 14 hrs</p>
        </div>
      </div>

      {/* 3. Cron Jobs Operational Panel */}
      <div className="bg-white dark:bg-[#090C10] rounded-3xl border border-gray-200 dark:border-white/10 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" /> Scheduled Cron Jobs & Background Workers
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Automated maintenance tasks running across worker nodes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {cronJobs.map((job) => (
            <div
              key={job.id}
              className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-gray-900 dark:text-white">{job.name}</p>
                    <span className="font-mono text-[10px] text-gray-400">{job.id}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                    Schedule: <span className="font-mono text-blue-600 dark:text-blue-400">{job.schedule}</span>
                  </p>
                </div>

                {/* Status Indicator */}
                {job.status === "Success" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Healthy
                  </span>
                )}
                {job.status === "Failed" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    <XCircle className="w-3 h-3" /> Failed
                  </span>
                )}
                {job.status === "Running" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <RotateCw className="w-3 h-3 animate-spin" /> Executing...
                  </span>
                )}
              </div>

              {/* Execution Stats & Actions */}
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-white/10 pt-3 text-xs">
                <div className="space-y-0.5">
                  <p className="text-gray-500 dark:text-gray-400 text-[11px]">
                    Last Execution: <span className="text-gray-900 dark:text-white font-medium">{job.lastRun}</span> ({job.durationMs}ms)
                  </p>
                  <p className="text-gray-400 text-[10px]">Next Run: {job.nextRun}</p>
                </div>

                <button
                  onClick={() => handleTriggerCron(job.id)}
                  disabled={job.status === "Running"}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                >
                  <Play className="w-3 h-3 fill-current" /> Trigger Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Controls & Log Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-[#090C10] p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search System Logs by Message, Host, or Service..."
            className="w-full bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
          />
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
          {["All", "INFO", "WARN", "ERROR", "DEBUG"].map((tab) => {
            const isActive = levelFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setLevelFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                    : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. System Terminal Output Table */}
      <div className="bg-white dark:bg-[#090C10] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Microservice</th>
                <th className="px-6 py-4">Log Message</th>
                <th className="px-6 py-4">Host Node</th>
                <th className="px-6 py-4 text-right">Trace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10 text-sm">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition cursor-pointer group font-mono text-xs"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.level === "INFO" && (
                        <span className="px-2.5 py-0.5 rounded-md font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          INFO
                        </span>
                      )}
                      {log.level === "WARN" && (
                        <span className="px-2.5 py-0.5 rounded-md font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          WARN
                        </span>
                      )}
                      {log.level === "ERROR" && (
                        <span className="px-2.5 py-0.5 rounded-md font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                          ERROR
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-bold text-purple-600 dark:text-purple-400">
                      {log.service}
                    </td>

                    <td className="px-6 py-4 text-gray-900 dark:text-gray-200 font-sans max-w-md truncate">
                      {log.message}
                    </td>

                    <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                      {log.host}
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap font-sans">
                      <button className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-white transition">
                        <Terminal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 font-sans">
                    No system log records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Stacktrace & Payload Drawer */}
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
                    <Terminal className="w-5 h-5 text-purple-500" /> Stack & Telemetry Trace
                  </h2>
                  <p className="text-xs font-mono text-purple-500">
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

              {/* Message Header */}
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Log Output</span>
                <p className="text-xs font-mono text-gray-900 dark:text-white leading-relaxed">
                  {selectedLog.message}
                </p>
              </div>

              {/* Host & Context */}
              <div className="space-y-3 text-xs">
                <h3 className="font-extrabold uppercase text-gray-400">Node Context</h3>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Service:</span>
                    <span className="font-bold text-purple-500">{selectedLog.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Node Host:</span>
                    <span className="text-gray-900 dark:text-white">{selectedLog.host}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Severity:</span>
                    <span className="font-bold text-rose-500">{selectedLog.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Timestamp:</span>
                    <span className="text-gray-700 dark:text-gray-300">{selectedLog.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* JSON Error Payload */}
              <div className="space-y-2 text-xs">
                <h3 className="font-extrabold uppercase text-gray-400">Execution Stack Payload</h3>
                <pre className="p-4 bg-gray-900 text-purple-400 rounded-2xl border border-gray-800 font-mono text-xs overflow-x-auto">
                  {JSON.stringify(selectedLog.details || { note: "No stack details for this log level." }, null, 2)}
                </pre>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}