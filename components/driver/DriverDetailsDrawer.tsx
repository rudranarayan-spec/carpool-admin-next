/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useId, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  X,
  Car,
  Users,
  Mail,
  Phone,
  Calendar,
  IndianRupee,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  TrendingUp,
  MapPin,
  MapPinOff,
  FileText,
  CreditCard,
  Building2,
  ShieldCheck,
  ExternalLink,
  UserCheck,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { DriverRideItem, DriverStatus } from "@/types/driver.types";
import { RideService } from "@/services/ride.service";
import { useRouter } from "next/navigation";
import { DriverService } from "@/services/driver.service";

export interface DriverDocumentBriefing {
  id: string | number;
  type: "dl" | "aadhaar" | "pan" | "rc" | "insurance" | string;
  title: string;
  file_url: string;
  status: "pending" | "approved" | "rejected" | string;
  [key: string]: any;
}

export interface BankDetails {
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  ifsc_code?: string;
  [key: string]: any;
}

export interface AddressDetails2 {
  current_address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  permanent_address?: string;
  [key: string]: any;
}

export interface DriverDetailDataBrief {
  id: number | string;
  name: string;
  email: string;
  phone?: string;
  created_at?: string;
  status: "active" | "inactive" | "pending" | "blocked" | string;
  total_vehicles?: number;
  total_rides?: number;
  total_earnings?: number;
  address_details?: AddressDetails2 | null;
  bank_details?: BankDetails | null;
  documents?: DriverDocumentBriefing[];
  [key: string]: any;
}

interface DriverDetailsDrawerProps {
  driver: DriverDetailDataBrief | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (driverId: string | number, newStatus: DriverStatus) => void;
  isUpdatingStatus?: boolean;
}

type TabType = "overview" | "documents" | "banking" | "address";

const TABS: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: UserCheck },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "banking", label: "Bank & Payouts", icon: CreditCard },
  { id: "address", label: "Address", icon: MapPin },
];

export function DriverDetailsDrawer({
  driver,
  isOpen,
  onClose,
  onStatusChange,
  isUpdatingStatus = false,
}: DriverDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const tabLayoutId = useId();

  const router = useRouter();
  const driverId = driver?.id;

  // 1. Fetch Brief Details API when Drawer Opens
  const {
    data: briefData, // Now strictly typed as DriverDetailDataBrief | undefined
    isLoading: isLoadingBrief,
    isError: isBriefError,
    error: briefError,
  } = useQuery({
    queryKey: ["driver-brief", driverId],
    queryFn: () => DriverService.getDriverBrief(driverId!),
    select: (res) => res.data,
    enabled: isOpen && !!driverId,
    staleTime: 1000 * 60 * 5,
  });
  
  console.log(briefData);
  

  // 2. Safe assignment with full autocomplete and no type errors
  const activeDriver: DriverDetailDataBrief = {
    ...driver!,
    ...briefData,
    documents: briefData?.documents ?? driver?.documents,
    bank_details: briefData?.bank_details ?? driver?.bank_details,
    address_details: briefData?.address_details ?? driver?.address_details,
  };

  // 2. Fetch Driver Rides (Kept same)
  const {
    data: fetchedRides,
    isLoading: isLoadingRides,
    isError: isRidesError,
    error: ridesError,
  } = useQuery<DriverRideItem[]>({
    queryKey: ["driver-rides", driverId],
    queryFn: () => RideService.getRidesByDriverId(driverId!),
    enabled: isOpen && !!driverId && activeTab === "overview",
    staleTime: 1000 * 60 * 3,
  });

  // Handle Error Toasts
  useEffect(() => {
    if (isRidesError && ridesError) {
      toast.error(
        (ridesError as Error)?.message || "Failed to fetch driver rides"
      );
    }
  }, [isRidesError, ridesError]);

  useEffect(() => {
    if (isBriefError && briefError) {
      toast.error(
        (briefError as Error)?.message || "Failed to fetch driver brief details"
      );
    }
  }, [isBriefError, briefError]);

  const handleCopy = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!driver) return null;

  const ridesToDisplay = fetchedRides ?? activeDriver.recent_rides ?? [];

  const maskAccountNumber = (accNum?: string) => {
    if (!accNum) return "N/A";
    if (accNum.length < 4) return accNum;
    return `•••• •••• ${accNum.slice(-4)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md will-change-[opacity]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 34,
              mass: 0.8,
            }}
            className="relative w-full max-w-lg h-full bg-white dark:bg-[#090D16] text-slate-900 dark:text-slate-100 shadow-2xl flex flex-col z-10 border-l border-slate-200/80 dark:border-white/10 will-change-transform"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-200/80 dark:border-white/10 bg-gradient-to-b from-slate-50 to-white dark:from-white/[0.03] dark:to-transparent shrink-0">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2
                      onClick={() => {
                        onClose();
                        router.push(`/users/${activeDriver.id}`);
                      }}
                      className="text-xl font-black tracking-tight capitalize text-slate-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                      title="View full user profile"
                    >
                      {activeDriver.name}
                      <ExternalLink className="w-4 h-4 transition-opacity" />
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      Driver
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                    ID: #{activeDriver.id}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs Nav */}
              <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-white/[0.05] p-1 rounded-2xl border border-slate-200/60 dark:border-white/5">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold rounded-xl transition-colors duration-200 select-none z-10 ${isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId={`active-tab-${tabLayoutId}`}
                          className="absolute inset-0 bg-white dark:bg-[#121824] rounded-xl shadow-sm border border-slate-200/80 dark:border-white/10"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                      <Icon className="w-3.5 h-3.5 relative z-10" />
                      <span className="relative z-10 hidden sm:inline">
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* OVERVIEW TAB */}
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20">
                          <p className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1">
                            <IndianRupee className="w-3 h-3" /> Earned
                          </p>
                          <p className="text-base font-black text-slate-900 dark:text-white truncate">
                            ₹{(activeDriver.total_earnings || 0).toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20">
                          <p className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1 mb-1">
                            <Users className="w-3 h-3" /> Rides
                          </p>
                          <p className="text-base font-black text-slate-900 dark:text-white">
                            {activeDriver.total_rides || ridesToDisplay.length || 0}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/20">
                          <p className="text-[10px] uppercase tracking-wider font-extrabold text-purple-600 dark:text-purple-400 flex items-center gap-1 mb-1">
                            <Car className="w-3 h-3" /> Vehicles
                          </p>
                          <p className="text-base font-black text-slate-900 dark:text-white">
                            {activeDriver.total_vehicles || 0}
                          </p>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div>
                        <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                          Contact Details
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
                            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                              <Mail className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] text-slate-400 font-medium">
                                Email
                              </p>
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                {activeDriver.email || "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
                            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-500">
                              <Phone className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] text-slate-400 font-medium">
                                Phone
                              </p>
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                {activeDriver.phone || "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
                            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] text-slate-400 font-medium">
                                Joined Date
                              </p>
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                {activeDriver.created_at
                                  ? new Date(
                                    activeDriver.created_at
                                  ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Published Rides
                          </h3>
                          <span className="text-xs font-bold text-blue-500 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" /> History
                          </span>
                        </div>

                        {isLoadingRides ? (
                          <div className="p-8 flex flex-col items-center justify-center gap-2 rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-200/60 dark:border-white/5 text-slate-400">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                            <span className="text-xs font-medium">
                              Fetching rides...
                            </span>
                          </div>
                        ) : ridesToDisplay.length > 0 ? (
                          <div className="space-y-2.5">
                            {ridesToDisplay.map((ride: any) => (
                              <div
                                key={ride.id}
                                onClick={() => {
                                  onClose();
                                  router.push(`/rides/${ride.id}`);
                                }}
                                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-2 cursor-pointer hover:border-slate-300 dark:hover:border-white/20 transition-all"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-mono font-bold text-slate-500">
                                    #{ride.id}
                                  </span>
                                  <span className="text-xs font-black text-emerald-500">
                                    ₹{ride.price_per_seat}
                                  </span>
                                </div>
                                <div className="space-y-1.5 text-xs">
                                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    <span className="truncate">
                                      {ride.source_address}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <MapPinOff className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                    <span className="truncate">
                                      {ride.destination_address}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-dashed border-slate-200 dark:border-white/10 text-xs text-slate-400">
                            No published rides recorded for this driver.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* DOCUMENTS TAB */}
                  {activeTab === "documents" && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                        Submitted Verification Documents
                      </h3>

                      {isLoadingBrief ? (
                        <div className="p-8 flex flex-col items-center justify-center gap-2 rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-200/60 dark:border-white/5 text-slate-400">
                          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                          <span className="text-xs font-medium">
                            Fetching driver documents...
                          </span>
                        </div>
                      ) : activeDriver.documents &&
                        activeDriver.documents.length > 0 ? (
                        activeDriver.documents.map((doc, index) => {
                          const docTitle =
                            doc.title || doc.type || `Document #${index + 1}`;
                          const docFileUrl = doc.file_url;
                          const docStatus = doc.status || "pending";

                          return (
                            <div
                              key={doc.id || index}
                              className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                                    <ShieldCheck className="w-4 h-4" />
                                  </div>
                                  <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                                    {docTitle}
                                  </span>
                                </div>
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold capitalize ${docStatus === "approved" ||
                                      docStatus === "verified"
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                      : docStatus === "rejected"
                                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                    }`}
                                >
                                  {docStatus}
                                </span>
                              </div>

                              {docFileUrl ? (
                                <a
                                  href={docFileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors"
                                >
                                  View Document{" "}
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              ) : (
                                <p className="text-[11px] text-slate-400 italic">
                                  No file attachment provided
                                </p>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-dashed border-slate-200 dark:border-white/10 text-xs text-slate-400">
                          No verification documents available
                        </div>
                      )}
                    </div>
                  )}

                  {/* BANKING TAB */}
                  {activeTab === "banking" && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                        Payout Account Info
                      </h3>

                      {isLoadingBrief ? (
                        <div className="p-8 flex flex-col items-center justify-center gap-2 rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-200/60 dark:border-white/5 text-slate-400">
                          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                          <span className="text-xs font-medium">
                            Fetching bank details...
                          </span>
                        </div>
                      ) : activeDriver.bank_details ? (
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-3.5 text-xs">
                          <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/40 dark:border-white/5">
                            <span className="text-slate-400">Bank Name</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              {activeDriver.bank_details.bank_name || "N/A"}
                            </span>
                          </div>

                          <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/40 dark:border-white/5">
                            <span className="text-slate-400">
                              Account Holder
                            </span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {activeDriver.bank_details.account_name || "N/A"}
                            </span>
                          </div>

                          <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/40 dark:border-white/5">
                            <span className="text-slate-400">
                              Account Number
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                {maskAccountNumber(
                                  activeDriver.bank_details.account_number
                                )}
                              </span>
                              {activeDriver.bank_details.account_number && (
                                <button
                                  onClick={() =>
                                    handleCopy(
                                      activeDriver.bank_details!.account_number!,
                                      "Account Number"
                                    )
                                  }
                                  className="p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors"
                                  title="Copy Account Number"
                                >
                                  {copiedField === "Account Number" ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/40 dark:border-white/5">
                            <span className="text-slate-400">IFSC Code</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                {activeDriver.bank_details.ifsc_code || "N/A"}
                              </span>
                              {activeDriver.bank_details.ifsc_code && (
                                <button
                                  onClick={() =>
                                    handleCopy(
                                      activeDriver.bank_details!.ifsc_code!,
                                      "IFSC Code"
                                    )
                                  }
                                  className="p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors"
                                  title="Copy IFSC Code"
                                >
                                  {copiedField === "IFSC Code" ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-dashed border-slate-200 dark:border-white/10 text-xs text-slate-400">
                          No banking details recorded
                        </div>
                      )}
                    </div>
                  )}

                  {/* ADDRESS TAB */}
                  {activeTab === "address" && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                        Address Verification
                      </h3>

                      {isLoadingBrief ? (
                        <div className="p-8 flex flex-col items-center justify-center gap-2 rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-200/60 dark:border-white/5 text-slate-400">
                          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                          <span className="text-xs font-medium">
                            Fetching address details...
                          </span>
                        </div>
                      ) : activeDriver.address_details ? (
                        <div className="space-y-3 text-xs">
                          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-1">
                            <p className="text-[10px] font-extrabold uppercase text-slate-400">
                              Current Address
                            </p>
                            <p className="text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                              {activeDriver.address_details.current_address ||
                                "N/A"}
                            </p>
                            <p className="text-slate-500 pt-1">
                              {[
                                activeDriver.address_details.city,
                                activeDriver.address_details.state,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                              {activeDriver.address_details.pincode &&
                                ` - ${activeDriver.address_details.pincode}`}
                            </p>
                          </div>

                          {activeDriver.address_details.permanent_address && (
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-1">
                              <p className="text-[10px] font-extrabold uppercase text-slate-400">
                                Permanent Address
                              </p>
                              <p className="text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                                {activeDriver.address_details.permanent_address}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-dashed border-slate-200 dark:border-white/10 text-xs text-slate-400">
                          No address records found
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] shrink-0">
              <label className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 block">
                Account Status Controls
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  disabled={
                    activeDriver.status === "active" || isUpdatingStatus
                  }
                  onClick={() =>
                    onStatusChange(activeDriver.id, "active" as DriverStatus)
                  }
                  className="px-3 py-2.5 rounded-xl text-xs font-bold transition-all border bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 disabled:opacity-40 flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active
                </button>

                <button
                  disabled={
                    activeDriver.status === "inactive" || isUpdatingStatus
                  }
                  onClick={() =>
                    onStatusChange(activeDriver.id, "inactive" as DriverStatus)
                  }
                  className="px-3 py-2.5 rounded-xl text-xs font-bold transition-all border bg-slate-500/10 hover:bg-slate-500/20 text-slate-600 dark:text-slate-300 border-slate-500/20 disabled:opacity-40 flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <XCircle className="w-3.5 h-3.5" /> Deactivate
                </button>

                <button
                  disabled={
                    activeDriver.status === "pending" || isUpdatingStatus
                  }
                  onClick={() =>
                    onStatusChange(activeDriver.id, "pending" as DriverStatus)
                  }
                  className="px-3 py-2.5 rounded-xl text-xs font-bold transition-all border bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/20 disabled:opacity-40 flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Clock className="w-3.5 h-3.5" /> Pending
                </button>

                <button
                  disabled={
                    activeDriver.status === "blocked" || isUpdatingStatus
                  }
                  onClick={() =>
                    onStatusChange(activeDriver.id, "blocked" as DriverStatus)
                  }
                  className="px-3 py-2.5 rounded-xl text-xs font-bold transition-all border bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/20 disabled:opacity-40 flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Ban className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}