/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    Bell,
    Send,
    Smartphone,
    Plus,
    Trash2,
    RefreshCw,
    CheckCircle2,
    AlertTriangle,
    Layers,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Monitor,
    Globe,
    Info,
    X,
} from "lucide-react";

import { NotificationService } from "@/services/notification.service";
import { NotificationItem, DeviceItem } from "@/types/notification.types";

export default function NotificationDashboard() {
    const queryClient = useQueryClient();

    // Tab & Pagination State
    const [activeTab, setActiveTab] = useState<"broadcast" | "logs" | "devices">(
        "broadcast"
    );
    const [logsPage, setLogsPage] = useState(1);
    const [devicesPage, setDevicesPage] = useState(1);

    // Drawer / Detail Modals
    const [selectedNotificationId, setSelectedNotificationId] = useState<number | null>(null);
    const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);

    // Broadcast Form State
    const [title, setTitle] = useState("Test notification");
    const [body, setBody] = useState("We've added exciting new features to the carpooling experience!");
    const [type, setType] = useState("SYSTEM");
    const [metadata, setMetadata] = useState<{ key: string; value: string }[]>([
        { key: "screen", value: "about" },
    ]);

    // --- API QUERIES ---
    const { data: statsRes, refetch: refetchStats } = useQuery({
        queryKey: ["admin-notification-stats"],
        queryFn: () => NotificationService.getStats(),
    });

    const {
        data: notificationsRes,
        isLoading: isLoadingNotifications,
        refetch: refetchNotifications,
    } = useQuery({
        queryKey: ["admin-notifications", logsPage],
        queryFn: () => NotificationService.getNotifications(logsPage, 20),
        enabled: activeTab === "logs",
    });

    const {
        data: devicesRes,
        isLoading: isLoadingDevices,
        refetch: refetchDevices,
    } = useQuery({
        queryKey: ["admin-devices", devicesPage],
        queryFn: () => NotificationService.getDevices(devicesPage, 20),
        enabled: activeTab === "devices",
    });

    const { data: singleNotificationRes } = useQuery({
        queryKey: ["admin-notification-detail", selectedNotificationId],
        queryFn: () => NotificationService.getNotificationById(selectedNotificationId!),
        enabled: !!selectedNotificationId,
    });

    const { data: singleDeviceRes } = useQuery({
        queryKey: ["admin-device-detail", selectedDeviceId],
        queryFn: () => NotificationService.getDeviceById(selectedDeviceId!),
        enabled: !!selectedDeviceId,
    });

    // --- MUTATION ---
    const broadcastMutation = useMutation({
        mutationFn: NotificationService.broadcast,
        onSuccess: (res) => {
            const sentCount = res?.data?.sent ?? 0;
            const failedCount = res?.data?.failed ?? 0;

            toast.success(
                `Broadcast processed! Sent to ${sentCount} devices (${failedCount} failed).`
            );


            // Invalidate queries to refresh lists
            queryClient.invalidateQueries({ queryKey: ["admin-notification-stats"] });
            queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
        },
        onError: (err: any) => {
            toast.error(
                err.response?.data?.message || "Failed to broadcast notification."
            );
        },
    });

    // Metadata Input Handlers
    const handleAddMeta = () => setMetadata([...metadata, { key: "", value: "" }]);
    const handleRemoveMeta = (index: number) => setMetadata(metadata.filter((_, i) => i !== index));
    const handleMetaChange = (index: number, field: "key" | "value", val: string) => {
        const updated = [...metadata];
        updated[index][field] = val;
        setMetadata(updated);
    };

    const handleSubmitBroadcast = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !body.trim()) {
            toast.error("Title and Body are required.");
            return;
        }

        const payloadData: Record<string, string> = {};
        metadata.forEach((m) => {
            if (m.key.trim()) payloadData[m.key.trim()] = m.value;
        });

        broadcastMutation.mutate({
            title,
            body,
            type,
            data: Object.keys(payloadData).length ? payloadData : undefined,
        });
    };

    // Safe Stats Mapping
    const stats = statsRes?.data || {
        devices: {
            total_devices: 0,
            active_devices: 0,
            web_devices: 0,
            android_devices: 0,
            ios_devices: 0,
        },
        notifications: { total_notifications: 0 },
    };

    // Helper to parse double-escaped backend JSON
    const parseJsonData = (rawJson: string) => {
        try {
            return JSON.parse(rawJson);
        } catch {
            return rawJson;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-[#0B0F17] text-gray-900 dark:text-gray-100 p-4 md:p-8 space-y-6 transition-colors duration-200">
            {/* HEADER & TABS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                        <Bell className="w-6 h-6 text-blue-500" /> Notifications & Broadcasts
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Dispatch announcements, view registered device stats, and inspect message logs.
                    </p>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-gray-200/60 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 w-fit">
                    <button
                        onClick={() => setActiveTab("broadcast")}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${activeTab === "broadcast"
                            ? "bg-white dark:bg-[#12171F] text-blue-600 dark:text-blue-400 shadow-xs"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                    >
                        <Send className="w-3.5 h-3.5" /> Broadcast
                    </button>
                    <button
                        onClick={() => setActiveTab("logs")}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${activeTab === "logs"
                            ? "bg-white dark:bg-[#12171F] text-blue-600 dark:text-blue-400 shadow-xs"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                    >
                        <Layers className="w-3.5 h-3.5" /> Logs
                    </button>
                    <button
                        onClick={() => setActiveTab("devices")}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${activeTab === "devices"
                            ? "bg-white dark:bg-[#12171F] text-blue-600 dark:text-blue-400 shadow-xs"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                    >
                        <Smartphone className="w-3.5 h-3.5" /> Devices
                    </button>
                </div>
            </div>

            {/* METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-white dark:bg-[#12171F] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Total Notifications</span>
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                            <Send className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold">{stats.notifications.total_notifications}</div>
                    <p className="text-xs text-gray-400">Recorded across system</p>
                </div>

                <div className="p-5 bg-white dark:bg-[#12171F] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Active Devices</span>
                        <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold">{stats.devices.active_devices} / {stats.devices.total_devices}</div>
                    <p className="text-xs text-gray-400">Devices receiving alerts</p>
                </div>

                <div className="p-5 bg-white dark:bg-[#12171F] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Web Devices</span>
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                            <Globe className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold">{stats.devices.web_devices}</div>
                    <p className="text-xs text-gray-400">Browser FCM tokens</p>
                </div>

                <div className="p-5 bg-white dark:bg-[#12171F] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Mobile Devices</span>
                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                            <Smartphone className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold">
                        {Number(stats.devices.android_devices) + Number(stats.devices.ios_devices)}
                    </div>
                    <p className="text-xs text-gray-400">Android & iOS endpoints</p>
                </div>
            </div>

            {/* BROADCAST FORM TAB */}
            {activeTab === "broadcast" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 bg-white dark:bg-[#12171F] border border-gray-200/80 dark:border-white/10 rounded-2xl p-6 shadow-xs space-y-5">
                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-blue-500" /> Send Push Broadcast
                            </h2>
                        </div>

                        <form onSubmit={handleSubmitBroadcast} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                                    Notification Type
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {["SYSTEM", "PROMOTION", "CONVERSATION"].map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setType(t)}
                                            className={`py-2 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${type === t
                                                ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                                                : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400"
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="Notification title..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0B0F17] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                                    Body Message
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Notification body content..."
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0B0F17] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
                                />
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Custom Key-Value Data Payload
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAddMeta}
                                        className="text-xs text-blue-500 font-bold flex items-center gap-1 cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Add Field
                                    </button>
                                </div>

                                {metadata.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="key (e.g. screen)"
                                            value={item.key}
                                            onChange={(e) => handleMetaChange(idx, "key", e.target.value)}
                                            className="w-1/2 px-3 py-2 bg-gray-50 dark:bg-[#0B0F17] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-mono"
                                        />
                                        <input
                                            type="text"
                                            placeholder="value (e.g. about)"
                                            value={item.value}
                                            onChange={(e) => handleMetaChange(idx, "value", e.target.value)}
                                            className="w-1/2 px-3 py-2 bg-gray-50 dark:bg-[#0B0F17] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-mono"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMeta(idx)}
                                            className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={broadcastMutation.isPending}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                                >
                                    <Send className="w-4 h-4" />
                                    {broadcastMutation.isPending ? "Broadcasting..." : "Dispatch Broadcast"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* PREVIEW */}
                    <div className="lg:col-span-5 bg-white dark:bg-[#12171F] border border-gray-200/80 dark:border-white/10 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-center space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Live Preview
                        </h3>

                        <div className="w-full max-w-xs bg-gray-100 dark:bg-[#0B0F17] border-4 border-gray-300 dark:border-gray-800 rounded-3xl p-3 shadow-xl space-y-3">
                            <div className="w-20 h-3.5 bg-gray-300 dark:bg-gray-800 rounded-full mx-auto" />
                            <div className="bg-white/80 dark:bg-[#12171F]/90 backdrop-blur-md p-3.5 rounded-2xl border border-gray-200/60 dark:border-white/10 shadow-lg space-y-1.5">
                                <div className="flex items-center justify-between text-[10px] text-gray-500 font-semibold">
                                    <div className="flex items-center gap-1.5">
                                        <div className="p-1 bg-blue-500 rounded-lg text-white">
                                            <Bell className="w-3 h-3" />
                                        </div>
                                        <span>System Alert</span>
                                    </div>
                                    <span>Now</span>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                                        {title || "Notification Title Preview"}
                                    </h4>
                                    <p className="text-[11px] text-gray-600 dark:text-gray-300 line-clamp-2 mt-0.5">
                                        {body || "Message payload body text will be displayed here..."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* LOGS TAB */}
            {activeTab === "logs" && (
                <div className="bg-white dark:bg-[#12171F] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-gray-200/80 dark:border-white/10 flex items-center justify-between">
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white">Notification History</h3>
                        <button
                            onClick={() => refetchNotifications()}
                            className="p-2 bg-gray-100 dark:bg-white/5 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition cursor-pointer"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50/80 dark:bg-white/2 border-b border-gray-200/80 dark:border-white/10 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Target User</th>
                                    <th className="p-4">Notification Info</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Data Payload</th>
                                    <th className="p-4">Created At</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200/80 dark:divide-white/5">
                                {isLoadingNotifications ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-gray-400">Loading notifications...</td>
                                    </tr>
                                ) : (notificationsRes?.data?.items || []).map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                                        <td className="p-4 font-mono font-bold">#{item.id}</td>
                                        <td className="p-4 font-medium">User #{item.user_id}</td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900 dark:text-white">{item.title}</div>
                                            <div className="text-gray-500 dark:text-gray-400 line-clamp-1">{item.body}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono text-[11px] text-gray-500 max-w-xs truncate">
                                            {item.data}
                                        </td>
                                        <td className="p-4 text-gray-500">{item.created_at}</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => setSelectedNotificationId(item.id)}
                                                className="p-1.5 bg-gray-100 dark:bg-white/5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 cursor-pointer"
                                            >
                                                <Info className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {notificationsRes?.data?.pagination && (
                        <div className="p-4 border-t border-gray-200/80 dark:border-white/10 flex items-center justify-between text-xs">
                            <span className="text-gray-500">
                                Page {notificationsRes.data.pagination.page} of {notificationsRes.data.pagination.totalPages}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setLogsPage((p) => Math.max(1, p - 1))}
                                    disabled={logsPage === 1}
                                    className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 disabled:opacity-40 cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setLogsPage((p) => p + 1)}
                                    disabled={logsPage >= notificationsRes.data.pagination.totalPages}
                                    className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 disabled:opacity-40 cursor-pointer"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* DEVICES TAB */}
            {activeTab === "devices" && (
                <div className="bg-white dark:bg-[#12171F] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-gray-200/80 dark:border-white/10 flex items-center justify-between">
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white">Registered Devices</h3>
                        <button
                            onClick={() => refetchDevices()}
                            className="p-2 bg-gray-100 dark:bg-white/5 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition cursor-pointer"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50/80 dark:bg-white/2 border-b border-gray-200/80 dark:border-white/10 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">ID</th>
                                    <th className="p-4">User ID</th>
                                    <th className="p-4">Platform</th>
                                    <th className="p-4">Installation ID</th>
                                    <th className="p-4">Permission</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Registered At</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200/80 dark:divide-white/5">
                                {isLoadingDevices ? (
                                    <tr>
                                        <td colSpan={8} className="p-8 text-center text-gray-400">Loading devices...</td>
                                    </tr>
                                ) : (devicesRes?.data?.items || []).map((dev) => (
                                    <tr key={dev.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                                        <td className="p-4 font-mono font-bold">#{dev.id}</td>
                                        <td className="p-4 font-medium">User #{dev.user_id}</td>
                                        <td className="p-4 uppercase font-bold text-blue-500">{dev.platform}</td>
                                        <td className="p-4 font-mono text-[11px] text-gray-500 max-w-xs truncate">
                                            {dev.installation_id}
                                        </td>
                                        <td className="p-4 capitalize">{dev.permission_status}</td>
                                        <td className="p-4">
                                            {dev.is_active === 1 ? (
                                                <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-gray-500/10 text-gray-500">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-500">{dev.last_registered_at}</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => setSelectedDeviceId(dev.id)}
                                                className="p-1.5 bg-gray-100 dark:bg-white/5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 cursor-pointer"
                                            >
                                                <Info className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* NOTIFICATION DETAIL MODAL */}
            {singleNotificationRes?.data && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
                            <h3 className="font-bold text-sm">Notification Details #{singleNotificationRes.data.id}</h3>
                            <button onClick={() => setSelectedNotificationId(null)} className="cursor-pointer">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-2 text-xs">
                            <p><strong>Title:</strong> {singleNotificationRes.data.title}</p>
                            <p><strong>Body:</strong> {singleNotificationRes.data.body}</p>
                            <p><strong>Type:</strong> {singleNotificationRes.data.type}</p>
                            <p><strong>User ID:</strong> #{singleNotificationRes.data.user_id}</p>
                            <p><strong>Created At:</strong> {singleNotificationRes.data.created_at}</p>
                            <div>
                                <strong>Parsed Data Payload:</strong>
                                <pre className="p-3 bg-gray-100 dark:bg-[#0B0F17] rounded-xl font-mono text-[11px] mt-1 overflow-x-auto">
                                    {JSON.stringify(parseJsonData(singleNotificationRes.data.data), null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* DEVICE DETAIL MODAL */}
            {singleDeviceRes?.data && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
                            <h3 className="font-bold text-sm">Device Details #{singleDeviceRes.data.id}</h3>
                            <button onClick={() => setSelectedDeviceId(null)} className="cursor-pointer">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-2 text-xs">
                            <p><strong>User ID:</strong> #{singleDeviceRes.data.user_id}</p>
                            <p><strong>Platform:</strong> {singleDeviceRes.data.platform}</p>
                            <p><strong>Installation ID:</strong> <span className="font-mono">{singleDeviceRes.data.installation_id}</span></p>
                            <p><strong>Browser / User Agent:</strong> {singleDeviceRes.data.browser || "N/A"}</p>
                            <p><strong>Permission Status:</strong> {singleDeviceRes.data.permission_status}</p>
                            <p><strong>Last Registered:</strong> {singleDeviceRes.data.last_registered_at}</p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}