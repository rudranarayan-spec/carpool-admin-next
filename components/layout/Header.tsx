"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Sparkles,
  Command,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "info" | "warning" | "success";
  unread: boolean;
}

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Driver Approval Required",
    description: "3 new driver applications waiting for document review.",
    time: "5m ago",
    type: "warning",
    unread: true,
  },
  {
    id: "2",
    title: "High Peak Demand Alert",
    description: "Surge pricing active in Downtown Hub (+25%).",
    time: "18m ago",
    type: "info",
    unread: true,
  },
  {
    id: "3",
    title: "System Maintenance Complete",
    description: "Database indexing and cache clearance finished.",
    time: "1h ago",
    type: "success",
    unread: false,
  },
];

export default function Header() {
  const pathname = usePathname();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const navTabs = [
    { name: "Dashboard", href: "/" },
    { name: "Analytics", href: "/analytics" },
    { name: "Reports", href: "/reports" },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="h-18 min-h-[4.5rem] border-b border-gray-200/80 dark:border-white/10 px-4 sm:px-6 lg:px-8 flex items-center justify-between bg-white/80 dark:bg-[#090C10]/80 backdrop-blur-xl sticky top-0 z-40 transition-colors duration-300 select-none">
      {/* 1. Left Section: Title / Brand & Navigation Tabs */}
      <div className="flex items-center gap-6 lg:gap-10">
        <Link href="/" className="flex items-center gap-3 group">
          <h2 className="text-xl sm:text-2xl font-black text-blue-600 dark:text-white tracking-wider group-hover:text-blue-500 transition-colors">
            PoolShare
          </h2>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Sparkles className="w-3 h-3" />
            PRO
          </span>
        </Link>

        {/* Navigation Tabs using Next.js Link */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
          {navTabs.map((tab) => {
            const isActive =
              tab.href === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`relative px-3.5 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 font-bold"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                }`}
              >
                {tab.name}
                {isActive && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full shadow-sm shadow-blue-500" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 2. Right Section: Command K Search, Fixed Responsive Notification Bell & Admin Profile */}
      <div className="flex items-center gap-3 sm:gap-4 relative" ref={dropdownRef}>
        {/* Command K Search Input */}
        <div className="relative hidden sm:block w-56 lg:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Command..."
            className="w-full bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-12 py-2 text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-gray-200/60 dark:bg-white/10 border border-gray-300/50 dark:border-white/10 text-[10px] font-bold text-gray-500 dark:text-gray-400 pointer-events-none">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>

        {/* Mobile Search Icon */}
        <button className="sm:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition">
          <Search className="w-4 h-4" />
        </button>

        {/* Notification Bell Button */}
        <button
          onClick={() => setIsNotificationsOpen((prev) => !prev)}
          className={`p-2.5 rounded-xl border transition relative active:scale-95 ${
            isNotificationsOpen
              ? "bg-blue-50 dark:bg-blue-500/20 border-blue-300 dark:border-blue-500/40 text-blue-600 dark:text-blue-400"
              : "bg-gray-100/80 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10"
          }`}
          aria-label="Notifications"
        >
          <Bell className="w-4.5 h-4.5" />
          {unreadCount > 0 && (
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white dark:ring-[#090C10] absolute top-2 right-2 animate-pulse" />
          )}
        </button>

        {/* Fixed Responsive Notification Dropdown Modal */}
        {isNotificationsOpen && (
          <div className="fixed sm:absolute top-[4.5rem] right-4 left-4 sm:left-auto sm:right-0 sm:w-80 md:w-96 bg-white dark:bg-[#0D1117] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-2xl">
            {/* Popover Header */}
            <div className="p-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Notifications
                </h4>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white sm:hidden"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notification Items List */}
            <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-100 dark:divide-white/5">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400">
                  No notifications to show.
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 flex gap-3 transition hover:bg-gray-50 dark:hover:bg-white/[0.02] ${
                      item.unread ? "bg-blue-500/[0.03]" : ""
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.type === "warning" && (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                      {item.type === "info" && (
                        <Info className="w-4 h-4 text-blue-500" />
                      )}
                      {item.type === "success" && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-900 dark:text-white">
                          {item.title}
                        </p>
                        <span className="text-[10px] text-gray-400">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Popover Footer */}
            <div className="p-3 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/10 text-center">
              <Link
                href="/logs"
                onClick={() => setIsNotificationsOpen(false)}
                className="text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                View System Audit Logs →
              </Link>
            </div>
          </div>
        )}

        <div className="h-6 w-px bg-gray-200 dark:bg-white/10 hidden sm:block" />

        {/* Admin Profile Pill */}
        <div className="flex items-center gap-3 pl-1 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              Admin User
            </p>
            <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
              Fleet Ops Manager
            </p>
          </div>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/30 flex items-center justify-center text-xs font-black text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
            AU
          </div>
        </div>
      </div>
    </header>
  );
}