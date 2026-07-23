"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useSyncExternalStore, useState } from "react";
import {
  LayoutDashboard,
  Car,
  UserCheck,
  ShieldCheck,
  Wallet,
  Truck,
  Settings,
  Plus,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronDown,
  Menu,
  X,
  Activity,
  MonitorX,
  Share2,
  FileText,
  Ticket,
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Ride Management", href: "/rides", icon: Car },
  { name: "Driver Approvals", href: "/drivers", icon: UserCheck, badge: "12" },
  { name: "Users", href: "/users", icon: ShieldCheck },
  { name: "Financials", href: "/financials", icon: Wallet },
  { name: "Vehicle Approvals", href: "/vehicles", icon: Truck },
  { name: "Offers", href: "/offers", icon: Ticket },
];

const logSubItems = [
  { name: "Activity Logs", href: "/activity-logs", icon: Activity },
  { name: "System Logs", href: "/system-logs", icon: MonitorX },
];

const emptySubscribe = () => () => {};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Responsive UI state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Manual user override state for Logs accordion
  const [userLogsToggle, setUserLogsToggle] = useState<boolean | null>(null);

  // Derived state: Active if pathname matches any log sub-item
  const isLogRouteActive = logSubItems.some((item) => pathname === item.href);

  // If user explicitly toggled, use that state; otherwise default to opening when active
  const isLogsOpen = userLogsToggle ?? isLogRouteActive;

  // Hydration-safe client check
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) setUserLogsToggle(false);
  };

  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);

  // Handle Logout Logic
  const handleLogout = () => {
    document.cookie =
      "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile Top Bar */}
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
          className="p-2.5 rounded-xl bg-white/5 dark:bg-white/5 bg-gray-100 border border-white/10 dark:border-white/10 border-gray-200 text-gray-700 dark:text-gray-300"
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
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 h-screen bg-white dark:bg-[#090C10] border-r border-gray-200 dark:border-white/10 flex flex-col justify-between p-4 select-none transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:w-22" : "w-72 lg:w-72"
        } ${
          isMobileOpen
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
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Fleet Management
                  </p>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle Button */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <ChevronLeft
                className={`w-5 h-5 transition-transform duration-300 ${
                  isCollapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 relative mt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`relative flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 font-bold"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}

                  <div className="flex items-center gap-3.5 z-10">
                    <Icon
                      className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      }`}
                    />
                    {!isCollapsed && <span className="text-sm">{item.name}</span>}
                  </div>

                  {item.badge && !isCollapsed && (
                    <span className="z-10 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 dark:text-amber-400 text-amber-700 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* LOGS DROPDOWN SECTION */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  if (isCollapsed) setIsCollapsed(false);
                  setUserLogsToggle(!isLogsOpen);
                }}
                className={`w-full relative flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isLogRouteActive
                    ? "text-blue-600 dark:text-blue-400 font-bold"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                }`}
                title={isCollapsed ? "Logs" : undefined}
              >
                <div className="flex items-center gap-3.5 z-10">
                  <FileText
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      isLogRouteActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    }`}
                  />
                  {!isCollapsed && <span className="text-sm">Logs</span>}
                </div>

                {!isCollapsed && (
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isLogsOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Sub-menu Items */}
              <AnimatePresence>
                {isLogsOpen && !isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden pl-9 space-y-1"
                  >
                    {logSubItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = pathname === subItem.href;

                      return (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          onClick={() => {
                            setIsMobileOpen(false);
                            setUserLogsToggle(null); // Reset manual toggle on navigation so derived state takes over
                          }}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                            isSubActive
                              ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 font-bold"
                              : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                          }`}
                        >
                          <SubIcon className="w-4 h-4" />
                          <span>{subItem.name}</span>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Settings Link */}
            <Link
              href="/settings"
              onClick={() => setIsMobileOpen(false)}
              className={`relative flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                pathname === "/settings"
                  ? "text-blue-600 dark:text-blue-400 font-bold"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
              }`}
              title={isCollapsed ? "Settings" : undefined}
            >
              {pathname === "/settings" && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <div className="flex items-center gap-3.5 z-10">
                <Settings
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    pathname === "/settings"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  }`}
                />
                {!isCollapsed && <span className="text-sm">Settings</span>}
              </div>
            </Link>
          </nav>
        </div>

        {/* Bottom Actions Section */}
        <div className="space-y-3.5 pt-4 border-t border-gray-200 dark:border-white/10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-blue-600/30 transition-all duration-200 ${
              isCollapsed ? "px-2" : ""
            }`}
          >
            <Plus className="w-5 h-5" />
            {!isCollapsed && <span>New Dispatch</span>}
          </motion.button>

          <div className="flex items-center justify-between gap-2 pt-1">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-white/10 transition active:scale-95"
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
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
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