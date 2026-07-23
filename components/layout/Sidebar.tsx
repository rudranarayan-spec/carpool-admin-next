"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useSyncExternalStore, useState } from "react";
import {
    LayoutDashboard,
    Car,
    UserCheck,
    ShieldCheck,
    Map,
    Wallet,
    Truck,
    Settings,
    Plus,
    LogOut,
    Sun,
    Moon,
    Share2,
    ChevronLeft,
    Menu,
    X
} from "lucide-react";

const navItems = [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "Ride Management", href: "/rides", icon: Car },
    { name: "Driver Approvals", href: "/drivers", icon: UserCheck, badge: "12" },
    { name: "User Verification", href: "/verification", icon: ShieldCheck },
    { name: "Live Map", href: "/map", icon: Map },
    { name: "Financials", href: "/financials", icon: Wallet },
    { name: "Vehicle Approvals", href: "/vehicles", icon: Truck },
    { name: "Settings", href: "/settings", icon: Settings },
];

const emptySubscribe = () => () => { };

export default function Sidebar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    // Responsive UI state
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Hydration-safe client check using useSyncExternalStore
    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);
    const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);

    return (
        <>
            {/* Mobile Top Bar Bar trigger */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#090C10]/90 dark:bg-[#090C10]/90 bg-white/90 backdrop-blur-md border-b border-white/10 dark:border-white/10 border-gray-200 px-4 flex items-center justify-between z-40">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                        <Share2 className="w-5 h-5" />
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-white tracking-wider">
                        PoolShare
                    </span>
                </div>
                <button
                    onClick={toggleMobileMenu}
                    className="p-2.5 rounded-xl bg-white/5 dark:bg-white/5 bg-gray-100 border border-white/10 dark:border-white/10 border-gray-200 text-gray-300 dark:text-gray-300 text-gray-700"
                    aria-label="Toggle Mobile Sidebar"
                >
                    {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Overlay Background */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleMobileMenu}
                        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />
                )}
            </AnimatePresence>

            {/* Main Sidebar Shell */}
            <aside
                className={`fixed lg:static top-0 bottom-0 left-0 z-50 h-screen bg-[#090C10] dark:bg-[#090C10] bg-white border-r border-white/10 dark:border-white/10 border-gray-200 flex flex-col justify-between p-4 select-none transition-all duration-300 ease-in-out ${isCollapsed ? "lg:w-22" : "w-72 lg:w-72"
                    } ${isMobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                {/* Top Header Section */}
                <div>
                    <div className="flex items-center justify-between px-2 pt-2 pb-6">
                        <div className="flex items-center gap-3.5 overflow-hidden">
                            <div className="min-w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white">
                                <Share2 className="w-5 h-5" />
                            </div>

                            {!isCollapsed && (
                                <div className="whitespace-nowrap transition-opacity duration-200">
                                    <h1 className="text-xl font-extrabold tracking-wider text-blue-600 dark:text-white leading-tight">
                                        PoolShare
                                    </h1>
                                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-400 text-gray-500">
                                        Fleet Management
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Desktop Collapse Toggle Button */}
                        <button
                            onClick={toggleCollapse}
                            className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 hover:bg-gray-100 text-gray-400 transition"
                            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                        >
                            <ChevronLeft
                                className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="space-y-2 relative mt-3">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`relative flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${isActive
                                        ? "text-blue-400 dark:text-blue-400 text-blue-600 font-bold"
                                        : "text-gray-300 dark:text-gray-300 text-gray-600 hover:text-white dark:hover:text-white hover:text-black"
                                        }`}
                                    title={isCollapsed ? item.name : undefined}
                                >
                                    {/* Sliding Animated Active Indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activePill"
                                            className="absolute inset-0 blue-active-pill rounded-xl -z-10"
                                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                                        />
                                    )}

                                    <div className="flex items-center gap-3.5 z-10">
                                        <Icon
                                            className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive
                                                ? "text-blue-400 dark:text-blue-400 text-blue-600"
                                                : "text-gray-400 dark:text-gray-400 text-gray-500 group-hover:text-white dark:group-hover:text-white group-hover:text-black"
                                                }`}
                                        />
                                        {!isCollapsed && <span className="text-sm">{item.name}</span>}
                                    </div>

                                    {/* Badge Notification Indicator */}
                                    {item.badge && !isCollapsed && (
                                        <span className="z-10 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 dark:text-amber-400 text-red-800  border border-amber-500/30">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Actions Section */}
                <div className="space-y-3.5 pt-4 border-t border-white/10 dark:border-white/10 border-gray-200">
                    {/* Dispatch Action Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-blue-600/30 transition-all duration-200 ${isCollapsed ? "px-2" : ""
                            }`}
                    >
                        <Plus className="w-5 h-5" />
                        {!isCollapsed && <span>New Dispatch</span>}
                    </motion.button>

                    {/* Theme & Logout Controls */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 dark:bg-white/5 bg-gray-100 border border-white/10 dark:border-white/10 border-gray-300 text-gray-200 dark:text-gray-200 text-gray-800 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition active:scale-95"
                            >
                                {theme === "dark" ? (
                                    <>
                                        <Sun className="w-4 h-4 text-amber-400" />
                                        {!isCollapsed && <span>Light</span>}
                                    </>
                                ) : (
                                    <>
                                        <Moon className="w-4 h-4 text-blue-600" />
                                        {!isCollapsed && <span>Dark</span>}
                                    </>
                                )}
                            </button>
                        )}

                        <button
                            className="p-2.5 rounded-xl bg-white/5 dark:bg-white/5 bg-gray-100 border border-white/10 dark:border-white/10 border-gray-300 text-gray-400 hover:text-red-400 transition"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}