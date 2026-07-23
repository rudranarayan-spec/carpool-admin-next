"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Sliders,
  Bell,
  Shield,
  Key,
  Save,
  Check,
  Percent,
  Car,
  Globe,
  RefreshCw,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "general" | "pricing" | "notifications" | "api"
  >("general");
  const [saved, setSaved] = useState(false);

  // Form State
  const [generalConfig, setGeneralConfig] = useState({
    platformName: "PoolShare",
    supportEmail: "support@poolshare.io",
    maxPassengersPerRide: 4,
    autoApproveDrivers: false,
    currency: "USD ($)",
  });

  const [pricingConfig, setPricingConfig] = useState({
    baseFare: "3.50",
    perKmRate: "1.20",
    platformCommission: "15", // Percentage
    cancellationFee: "5.00",
    surgePricing: true,
  });

  const [notificationConfig, setNotificationConfig] = useState({
    emailAlerts: true,
    smsNotifications: true,
    pushNewRide: true,
    pushDisputes: true,
  });

  const [apiKey, setApiKey] = useState("ps_live_99f82d1109a82e7ba02");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto min-h-screen transition-colors duration-300 select-none">
      {/* 1. Header & Quick Save */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Platform Settings
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            Configure system parameters, dispatch rules, commission rates, and API keys.
          </p>
        </div>

        <button
          onClick={handleSave}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition active:scale-95 ${
            saved
              ? "bg-emerald-600 text-white shadow-emerald-600/20"
              : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20"
          }`}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" /> Saved Successfully
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>

      {/* 2. Main Content Grid (Tabs on Left, Forms on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 bg-white dark:bg-[#090C10] p-3 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm h-fit space-y-1">
          {[
            { id: "general", label: "General & Fleet", icon: Globe },
            { id: "pricing", label: "Ride & Pricing Rules", icon: Sliders },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "api", label: "API & Keys", icon: Key },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Container */}
        <div className="lg:col-span-3 bg-white dark:bg-[#090C10] p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
          
          {/* TAB 1: GENERAL SETTINGS */}
          {activeTab === "general" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-4">
                General Fleet Parameters
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Platform Title
                  </label>
                  <input
                    type="text"
                    value={generalConfig.platformName}
                    onChange={(e) =>
                      setGeneralConfig({ ...generalConfig, platformName: e.target.value })
                    }
                    className="w-full bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={generalConfig.supportEmail}
                    onChange={(e) =>
                      setGeneralConfig({ ...generalConfig, supportEmail: e.target.value })
                    }
                    className="w-full bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Max Passengers Per Pool Ride
                  </label>
                  <input
                    type="number"
                    value={generalConfig.maxPassengersPerRide}
                    onChange={(e) =>
                      setGeneralConfig({
                        ...generalConfig,
                        maxPassengersPerRide: parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Default Platform Currency
                  </label>
                  <select
                    value={generalConfig.currency}
                    onChange={(e) =>
                      setGeneralConfig({ ...generalConfig, currency: e.target.value })
                    }
                    className="w-full bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="INR (₹)">INR (₹)</option>
                  </select>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    Auto-Approve Verified Drivers
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Bypass admin review if driver verification documents pass AI check.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setGeneralConfig({
                      ...generalConfig,
                      autoApproveDrivers: !generalConfig.autoApproveDrivers,
                    })
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    generalConfig.autoApproveDrivers ? "bg-blue-600" : "bg-gray-300 dark:bg-white/20"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      generalConfig.autoApproveDrivers ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB 2: PRICING RULES */}
          {activeTab === "pricing" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-4">
                Ride Rates & Revenue Splits
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Base Fare ($)
                  </label>
                  <input
                    type="text"
                    value={pricingConfig.baseFare}
                    onChange={(e) =>
                      setPricingConfig({ ...pricingConfig, baseFare: e.target.value })
                    }
                    className="w-full bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Per Kilometer Rate ($)
                  </label>
                  <input
                    type="text"
                    value={pricingConfig.perKmRate}
                    onChange={(e) =>
                      setPricingConfig({ ...pricingConfig, perKmRate: e.target.value })
                    }
                    className="w-full bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Platform Commission (%)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={pricingConfig.platformCommission}
                      onChange={(e) =>
                        setPricingConfig({
                          ...pricingConfig,
                          platformCommission: e.target.value,
                        })
                      }
                      className="w-full bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                    <Percent className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Cancellation Penalty ($)
                  </label>
                  <input
                    type="text"
                    value={pricingConfig.cancellationFee}
                    onChange={(e) =>
                      setPricingConfig({ ...pricingConfig, cancellationFee: e.target.value })
                    }
                    className="w-full bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-4">
                System Alerts & Admin Routing
              </h2>

              <div className="space-y-4">
                {[
                  {
                    title: "Email Dispatch Alerts",
                    desc: "Receive daily email summaries of total trips and revenue.",
                    key: "emailAlerts",
                  },
                  {
                    title: "SMS Escalations",
                    desc: "Send instant SMS to ops managers during high dispute triggers.",
                    key: "smsNotifications",
                  },
                  {
                    title: "Push Notifications on New Ride",
                    desc: "Notify admin web application when a ride gets created.",
                    key: "pushNewRide",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10"
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setNotificationConfig({
                          ...notificationConfig,
                          [item.key]:
                            !notificationConfig[
                              item.key as keyof typeof notificationConfig
                            ],
                        })
                      }
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                        notificationConfig[
                          item.key as keyof typeof notificationConfig
                        ]
                          ? "bg-blue-600"
                          : "bg-gray-300 dark:bg-white/20"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          notificationConfig[
                            item.key as keyof typeof notificationConfig
                          ]
                            ? "translate-x-6"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 4: API KEYS */}
          {activeTab === "api" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-4">
                API Integration Keys
              </h2>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-600 dark:text-amber-400 font-medium">
                Keep these secret keys safe. Do not share live keys in client-side code repositories.
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Production Secret Key
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    readOnly
                    value={apiKey}
                    className="flex-1 bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-gray-900 dark:text-white focus:outline-none"
                  />
                  <button
                    onClick={() =>
                      setApiKey(`ps_live_${Math.random().toString(36).substring(2)}`)
                    }
                    className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-200 dark:hover:bg-white/10 transition flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Regenerate
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}