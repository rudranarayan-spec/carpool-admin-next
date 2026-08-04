/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    ShieldAlert,
    Search,
    RefreshCw,
    Loader2,
    Phone,
    Calendar,
    MapPin,
    X,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Eye,
    User,
    SlidersHorizontal,
    FileText,
} from "lucide-react";
import sosService from "@/services/sos.service";
import { SosAlertItem } from "@/types/sos.types";
import { useRouter } from "next/navigation";

export default function SosManagementPage() {
    const queryClient = useQueryClient();
    const router = useRouter();

    // --- States ---
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);

    // Selected SOS for Status Update / Action Modal
    const [selectedSos, setSelectedSos] = useState<SosAlertItem | null>(null);
    const [newStatus, setNewStatus] = useState<"triggered" | "acknowledged" | "resolved">("triggered");
    const [resolutionNotes, setResolutionNotes] = useState("");

    // Hover preview state
    const [hoveredSos, setHoveredSos] = useState<SosAlertItem | null>(null);

    // --- TanStack Query: Fetch SOS Alerts ---
    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["admin-sos-alerts", page, limit, statusFilter, searchQuery],
        queryFn: () =>
            sosService.getSosAlerts({
                page,
                limit,
                status: statusFilter !== "All" ? statusFilter : undefined,
                search: searchQuery || undefined,
            }),
        placeholderData: (previousData) => previousData,
        refetchInterval: 10000, // Poll every 10 seconds for real-time emergency updates
    });

    const sosList = data?.data || [];
    const totalPages = data?.pagination?.totalPages || 1;
    const totalRecords = data?.pagination?.totalRecords || 0;

    // Calculate quick summary metrics needing attention (triggered or acknowledged)
    const pendingAttentionCount = sosList.filter(
        (item) => item.status === "triggered" || item.status === "acknowledged"
    ).length;

    // --- TanStack Mutation: Update SOS Status ---
    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status, notes }: { id: number; status: "triggered" | "acknowledged" | "resolved"; notes?: string }) =>
            sosService.updateSosStatus(id, { status, resolution_notes: notes }),
        onSuccess: (res) => {
            toast.success(res.message || "SOS status updated successfully.");
            queryClient.invalidateQueries({ queryKey: ["admin-sos-alerts"] });
            setSelectedSos(null);
            setResolutionNotes("");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update SOS status.");
        },
    });

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSos) return;
        updateStatusMutation.mutate({
            id: selectedSos.id,
            status: newStatus,
            notes: resolutionNotes,
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "triggered":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5" /> Triggered
                    </span>
                );
            case "acknowledged":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Clock className="w-3.5 h-3.5" /> Acknowledged
                    </span>
                );
            case "resolved":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-10 space-y-6 max-w-[1700px] mx-auto min-h-screen transition-colors duration-300 select-none">
            {/* 1. Page Header with Quick Metric Task Card */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-linear-to-r from-rose-500/10 via-amber-500/5 to-transparent p-6 rounded-3xl border border-gray-200/80 dark:border-white/10 backdrop-blur-xl">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/20 mb-1">
                        <ShieldAlert className="w-3.5 h-3.5 animate-bounce" />
                        Emergency Control Center
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        SOS Emergency Monitoring
                    </h1>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Monitor real-time distress alerts, coordinate rapid response protocols, and secure passenger/driver safety.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Quick Task / Attention Badge Card */}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-rose-500/30 shadow-sm">
                        <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                            <ShieldAlert className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Require Attention</p>
                            <p className="text-base font-black text-rose-600 dark:text-rose-400">{pendingAttentionCount} Active Alerts</p>
                        </div>
                    </div>

                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 font-bold text-xs hover:bg-gray-50 dark:hover:bg-white/10 transition shadow-sm active:scale-95 disabled:opacity-50"
                        title="Sync Alerts"
                    >
                        <RefreshCw className={`w-4 h-4 text-rose-500 ${isFetching ? "animate-spin" : ""}`} />
                        <span className="hidden sm:inline">Sync Live</span>
                    </button>
                </div>
            </div>

            {/* 2. Controls & Filter Bar */}
            <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 bg-white dark:bg-[#090C10] p-4 rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl shadow-black/[0.02]">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search by user name, phone, or route address..."
                        className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition shadow-inner"
                    />
                </div>

                {/* Status Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/[0.03] p-1.5 rounded-2xl border border-gray-200 dark:border-white/10">
                        <SlidersHorizontal className="w-4 h-4 text-gray-400 ml-2 mr-1 hidden sm:block" />
                        {["All", "triggered", "acknowledged", "resolved"].map((tab) => {
                            const isActive = statusFilter === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        setStatusFilter(tab);
                                        setPage(1);
                                    }}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap capitalize ${isActive
                                        ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 scale-[1.02]"
                                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/5"
                                        }`}
                                >
                                    {tab === "All" ? "All Alerts" : tab}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 3. SOS Table Showcase Layout */}
            <div className="relative bg-white dark:bg-[#090C10] rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl shadow-black/[0.02] overflow-hidden min-h-[400px]">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/70 dark:bg-[#090C10]/70 backdrop-blur-md flex items-center justify-center z-20">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
                            <p className="text-xs font-bold text-gray-500 animate-pulse">Fetching emergency logs...</p>
                        </div>
                    </div>
                )}

                {sosList.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/2 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6">User / Role</th>
                                    <th className="py-4 px-6">Ride & Route</th>
                                    <th className="py-4 px-6">Coordinates</th>
                                    <th className="py-4 px-6">Timestamp</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-white/10 text-xs font-medium text-gray-700 dark:text-gray-300">
                                {sosList.map((item: any) => (
                                    <tr
                                        key={item.id}
                                        onMouseEnter={() => setHoveredSos(item)}
                                        onMouseLeave={() => setHoveredSos(null)}
                                        className="hover:bg-rose-500/2 dark:hover:bg-white/[0.01] transition-colors relative group"
                                    >
                                        {/* Status Column */}
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            {getStatusBadge(item.status)}
                                        </td>

                                        {/* User & Role Column */}
                                        <td className="py-4 px-6 whitespace-nowrap cursor-pointer" onClick={() => router.push(`/users/${item.user_id}`) }
                                            title="Click to view user details">
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white">
                                                    <User className="w-3.5 h-3.5 text-blue-500" />
                                                    {item.user_name}
                                                    <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded uppercase font-bold">
                                                        {item.user_type}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-[11px] text-gray-400 font-mono">
                                                    <Phone className="w-3 h-3" /> {item.user_phone}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Ride & Route Column */}

                                        <td
                                            className="py-4 px-6 max-w-xs cursor-pointer group/ride"
                                            onClick={() => router.push(`/rides/${item.ride_id}`)}
                                            title="Click to view ride details"
                                        >
                                            <div className="space-y-1">
                                                <p className="font-mono text-[11px] text-rose-600 dark:text-rose-400 font-bold group-hover/ride:underline">
                                                    Ride ID: #{item.ride_id}
                                                </p>
                                                <div className="truncate text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                                                    <span className="truncate">{item.source_address || "Origin address N/A"}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Coordinates Column */}
                                        <td className="py-4 px-6 whitespace-nowrap font-mono text-[11px] text-gray-500">
                                            <div className="bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-xl border border-gray-200 dark:border-white/10 w-fit">
                                                {item.latitude}, {item.longitude}
                                            </div>
                                        </td>

                                        {/* Timestamp Column */}
                                        <td className="py-4 px-6 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                {new Date(item.created_at).toLocaleString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                        </td>

                                        {/* Actions Column */}
                                        <td className="py-4 px-6 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => {
                                                    setSelectedSos(item);
                                                    setNewStatus(item.status);
                                                    setResolutionNotes(item.resolution_notes || "");
                                                }}
                                                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition flex items-center gap-1.5 ml-auto active:scale-95"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-24 text-center text-gray-500 dark:text-gray-400 space-y-3">
                        <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">No active emergency signals</p>
                            <p className="text-xs text-gray-500 mt-0.5">All clear! No SOS logs matched your current filters.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Hover Preview Card Popup / Tooltip Effect */}
            <AnimatePresence>
                {hoveredSos && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="fixed bottom-6 right-6 z-40 w-96 bg-white dark:bg-[#090C10] border border-rose-500/30 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl space-y-3 pointer-events-none hidden lg:block"
                    >
                        <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600">
                                    <ShieldAlert className="w-4 h-4 animate-pulse" />
                                </div>
                                <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">
                                    Quick Details Preview
                                </span>
                            </div>
                            {getStatusBadge(hoveredSos.status)}
                        </div>

                        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                            <p className="flex justify-between">
                                <span className="text-gray-400 font-medium">User:</span>
                                <strong className="text-gray-900 dark:text-white">{hoveredSos.user_name} ({hoveredSos.user_phone})</strong>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-400 font-medium">Resolved By:</span>
                                <strong className="text-gray-900 dark:text-white">{hoveredSos.resolved_by_name || "Unassigned"}</strong>
                            </p>
                            <div className="bg-gray-50 dark:bg-white/3 p-2.5 rounded-xl border border-gray-200 dark:border-white/10 space-y-1">
                                <p className="truncate"><strong className="text-emerald-500">From:</strong> {hoveredSos.source_address || "N/A"}</p>
                                <p className="truncate"><strong className="text-rose-500">To:</strong> {hoveredSos.destination_address || "N/A"}</p>
                            </div>
                            {hoveredSos.resolution_notes && (
                                <p className="italic text-gray-500 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                                    &ldquo;{hoveredSos.resolution_notes}&rdquo;
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 4. Pagination Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 bg-white dark:bg-[#090C10] border border-gray-200 dark:border-white/10 rounded-3xl shadow-xl shadow-black/[0.02]">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Showing page <span className="font-bold text-gray-900 dark:text-white">{page}</span> of{" "}
                    <span className="font-bold text-gray-900 dark:text-white">{totalPages || 1}</span> (Total Records: {totalRecords})
                </p>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1 || isFetching}
                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95"
                    >
                        Previous
                    </button>

                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page >= totalPages || isFetching}
                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* 5. Manage / Update Status Modal */}
            <AnimatePresence>
                {selectedSos && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSos(null)}
                            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-white dark:bg-[#090C10] border border-gray-200 dark:border-white/10 rounded-3xl p-6 sm:p-7 z-50 shadow-2xl space-y-6"
                        >
                            <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 border border-rose-500/20 shadow-inner">
                                        <ShieldAlert className="w-6 h-6 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-gray-900 dark:text-white">
                                            Manage SOS Alert #{selectedSos.id}
                                        </h3>
                                        <p className="text-xs text-gray-500">Update emergency handling status and dispatch logs.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedSos(null)}
                                    className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateSubmit} className="space-y-4">
                                <div className="p-4 bg-gray-50 dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-white/10 space-y-2 text-xs text-gray-600 dark:text-gray-300">
                                    <p className="flex justify-between">
                                        <span className="text-gray-400">Triggered By:</span>
                                        <strong className="text-gray-900 dark:text-white">{selectedSos.user_name} ({selectedSos.user_phone})</strong>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-gray-400">Associated Ride:</span>
                                        <strong className="text-rose-600 dark:text-rose-400 font-mono">#{selectedSos.ride_id}</strong>
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Update Status</label>
                                    <select
                                        value={newStatus}
                                        onChange={(e: any) => setNewStatus(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition"
                                    >
                                        <option value="triggered" className="dark:bg-[#090C10]">Triggered</option>
                                        <option value="acknowledged" className="dark:bg-[#090C10]">Acknowledged</option>
                                        <option value="resolved" className="dark:bg-[#090C10]">Resolved</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5 text-rose-500" /> Resolution Notes
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={resolutionNotes}
                                        onChange={(e) => setResolutionNotes(e.target.value)}
                                        placeholder="Enter action taken, police dispatch info, or resolution remarks..."
                                        className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl p-4 text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition shadow-inner resize-none"
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedSos(null)}
                                        className="flex-1 py-3 px-4 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 font-bold text-xs transition border border-gray-200 dark:border-white/10 shadow-sm active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updateStatusMutation.isPending}
                                        className="flex-1 py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                                    >
                                        {updateStatusMutation.isPending ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="w-4 h-4" />
                                        )}
                                        <span>Save Changes</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}