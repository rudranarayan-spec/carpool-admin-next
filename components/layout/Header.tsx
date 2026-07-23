"use client";

import { useState } from "react";
import { Search, Bell, Sparkles, Command } from "lucide-react";

export default function Header() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [unreadNotifications, setUnreadNotifications] = useState(true);

  const navTabs = ["Dashboard", "Analytics", "Reports"];

  return (
    <header className="h-18 min-h-[4.5rem] border-b border-gray-200/80 dark:border-white/10 px-4 sm:px-6 lg:px-8 flex items-center justify-between bg-white/80 dark:bg-[#090C10]/80 backdrop-blur-xl sticky top-0 z-40 transition-colors duration-300 select-none">
      
      {/* 1. Left Section: Title / Brand & Navigation Tabs */}
      <div className="flex items-center gap-6 lg:gap-10">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-black text-blue-600 dark:text-white tracking-wider">
            PoolShare
          </h2>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Sparkles className="w-3 h-3" />
            PRO
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-3.5 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 font-bold"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                }`}
              >
                {tab}
                {isActive && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full shadow-sm shadow-blue-500" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 2. Right Section: Command K Search, Notification Bell & Admin Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        
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

        {/* Mobile Search Button Icon */}
        <button className="sm:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition">
          <Search className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <button 
          onClick={() => setUnreadNotifications(false)}
          className="p-2.5 bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition relative active:scale-95"
          aria-label="Notifications"
        >
          <Bell className="w-4.5 h-4.5" />
          {unreadNotifications && (
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white dark:ring-[#090C10] absolute top-2 right-2 animate-pulse" />
          )}
        </button>

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