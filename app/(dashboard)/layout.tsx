"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Toaster } from "sonner";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import { BellRing } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMounted, permission, requestPermission } = useAdminNotifications();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-velocity-bg text-gray-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        {/* Permission Request Banner - safely gated behind client hydration */}
        {isMounted && permission === "default" && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Enable browser notifications to receive real-time ride and booking alerts.</span>
            </div>
            <button
              onClick={requestPermission}
              className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-md hover:bg-amber-400 transition"
            >
              Enable
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {children}
          <Toaster position="top-right" richColors closeButton />
        </main>
      </div>
    </div>
  );
}