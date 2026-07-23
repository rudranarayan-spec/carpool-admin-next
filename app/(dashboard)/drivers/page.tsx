"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  X,
  RefreshCw,
  Eye,
  AlertTriangle,
  Clock,
  Filter,
} from "lucide-react";

interface DocumentItem {
  id: string;
  name: string;
  type: "License" | "Insurance" | "Vehicle Registration";
  url: string;
  status: "Verified" | "Pending" | "Flagged";
}

interface DriverApplication {
  id: string;
  driverId: string;
  name: string;
  email: string;
  phone: string;
  submittedAt: string;
  status: "Pending" | "Approved" | "Rejected";
  vehicle: {
    make: string;
    model: string;
    year: number;
    plateNumber: string;
    color: string;
  };
  documents: DocumentItem[];
  rejectionReason?: string;
}

const initialApplications: DriverApplication[] = [
  {
    id: "APP-901",
    driverId: "DRV-104",
    name: "Marcus Vance",
    email: "marcus.v@example.com",
    phone: "+1 (555) 876-5432",
    submittedAt: "22 Jul 2026, 14:30",
    status: "Pending",
    vehicle: {
      make: "Toyota",
      model: "Camry Hybrid",
      year: 2023,
      plateNumber: "7XYZ89",
      color: "Midnight Blue",
    },
    documents: [
      {
        id: "DOC-1",
        name: "Driver's License (Front/Back)",
        type: "License",
        url: "https://via.placeholder.com/600x380?text=Drivers+License+Front",
        status: "Pending",
      },
      {
        id: "DOC-2",
        name: "Vehicle Insurance Certificate",
        type: "Insurance",
        url: "https://via.placeholder.com/600x380?text=Insurance+Certificate",
        status: "Pending",
      },
      {
        id: "DOC-3",
        name: "State Registration Document",
        type: "Vehicle Registration",
        url: "https://via.placeholder.com/600x380?text=State+Registration",
        status: "Pending",
      },
    ],
  },
  {
    id: "APP-902",
    driverId: "DRV-105",
    name: "David Chen",
    email: "david.c@example.com",
    phone: "+1 (555) 654-3210",
    submittedAt: "23 Jul 2026, 09:15",
    status: "Pending",
    vehicle: {
      make: "Honda",
      model: "Accord",
      year: 2022,
      plateNumber: "4ABC12",
      color: "Silver",
    },
    documents: [
      {
        id: "DOC-4",
        name: "Driver's License (Front/Back)",
        type: "License",
        url: "https://via.placeholder.com/600x380?text=Drivers+License+Front",
        status: "Pending",
      },
      {
        id: "DOC-5",
        name: "Vehicle Insurance Certificate",
        type: "Insurance",
        url: "https://via.placeholder.com/600x380?text=Insurance+Certificate",
        status: "Flagged",
      },
    ],
  },
  {
    id: "APP-903",
    driverId: "DRV-102",
    name: "Elena Rostova",
    email: "elena.r@example.com",
    phone: "+1 (555) 901-2345",
    submittedAt: "20 Jul 2026, 11:00",
    status: "Rejected",
    rejectionReason: "Expired insurance policy certificate provided.",
    vehicle: {
      make: "Hyundai",
      model: "Elantra",
      year: 2021,
      plateNumber: "9LMN34",
      color: "Black",
    },
    documents: [],
  },
];

export default function DriverApprovalsPage() {
  const [applications, setApplications] = useState<DriverApplication[]>(initialApplications);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Pending");
  const [selectedApp, setSelectedApp] = useState<DriverApplication | null>(null);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionInput, setRejectionInput] = useState("");

  // Filtering
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: "Approved" } : app))
    );
    if (selectedApp?.id === appId) {
      setSelectedApp((prev) => (prev ? { ...prev, status: "Approved" } : null));
    }
  };

  const handleReject = () => {
    if (!selectedApp || !rejectionInput.trim()) return;

    setApplications((prev) =>
      prev.map((app) =>
        app.id === selectedApp.id
          ? { ...app, status: "Rejected", rejectionReason: rejectionInput }
          : app
      )
    );
    setSelectedApp((prev) =>
      prev ? { ...prev, status: "Rejected", rejectionReason: rejectionInput } : null
    );
    setRejectionModalOpen(false);
    setRejectionInput("");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen transition-colors duration-300 select-none">
      
      {/* 1. Header & Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            Driver Approvals
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            Review submitted credentials, license details, and vehicle registrations for fleet access.
          </p>
        </div>

        <button
          onClick={() => setApplications(initialApplications)}
          className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition active:scale-95 self-start sm:self-auto"
          title="Reset Applications"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Pending Review</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
              {applications.filter((a) => a.status === "Pending").length}
            </p>
          </div>
          <Clock className="w-8 h-8 text-amber-500 opacity-80" />
        </div>

        <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Approved Drivers</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
              {applications.filter((a) => a.status === "Approved").length}
            </p>
          </div>
          <ShieldCheck className="w-8 h-8 text-emerald-500 opacity-80" />
        </div>

        <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400">Rejected Applications</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
              {applications.filter((a) => a.status === "Rejected").length}
            </p>
          </div>
          <ShieldAlert className="w-8 h-8 text-rose-500 opacity-80" />
        </div>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-[#090C10] p-3 sm:p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Driver Name, Email, App ID, or License Plate..."
            className="w-full bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
          {["Pending", "Approved", "Rejected", "All"].map((tab) => {
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Driver Application Table */}
      <div className="bg-white dark:bg-[#090C10] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">Vehicle Specs</th>
                <th className="px-6 py-4">Submitted Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10 text-sm">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition cursor-pointer group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {app.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {app.email} • <span className="font-mono text-blue-600 dark:text-blue-400">{app.id}</span>
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">
                          {app.vehicle.year} {app.vehicle.make} {app.vehicle.model}
                        </p>
                        <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                          Plate: <span className="text-gray-900 dark:text-white font-bold">{app.vehicle.plateNumber}</span> ({app.vehicle.color})
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {app.submittedAt}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {app.status === "Pending" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <Clock className="w-3.5 h-3.5" /> Pending Audit
                        </span>
                      )}
                      {app.status === "Approved" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      )}
                      {app.status === "Rejected" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          <XCircle className="w-3.5 h-3.5" /> Rejected
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button className="px-3.5 py-1.5 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-bold transition flex items-center gap-1.5 ml-auto">
                        <Eye className="w-3.5 h-3.5" /> Inspect Documents
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No application requests match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Document Audit & Approval Drawer Modal */}
      <AnimatePresence>
        {selectedApp && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[540px] bg-white dark:bg-[#090C10] border-l border-gray-200 dark:border-white/10 z-50 p-6 overflow-y-auto space-y-6 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Driver Credentials Audit
                  </h2>
                  <p className="text-xs font-mono text-blue-600 dark:text-blue-400">
                    {selectedApp.id} • {selectedApp.driverId}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Driver Info Card */}
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-2">
                <p className="text-base font-extrabold text-gray-900 dark:text-white">
                  {selectedApp.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedApp.email} • {selectedApp.phone}
                </p>
              </div>

              {/* Vehicle Particulars */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                  Registered Vehicle Info
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400">Make & Model:</span>
                    <p className="font-bold text-gray-900 dark:text-white mt-0.5">
                      {selectedApp.vehicle.year} {selectedApp.vehicle.make} {selectedApp.vehicle.model}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">License Plate:</span>
                    <p className="font-mono font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
                      {selectedApp.vehicle.plateNumber}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Color:</span>
                    <p className="font-bold text-gray-900 dark:text-white mt-0.5">
                      {selectedApp.vehicle.color}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rejection Note if applies */}
              {selectedApp.status === "Rejected" && selectedApp.rejectionReason && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs space-y-1">
                  <p className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Rejection Reason:
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {selectedApp.rejectionReason}
                  </p>
                </div>
              )}

              {/* Documents Scans */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                  Attached Verification Documents
                </h3>

                {selectedApp.documents.length > 0 ? (
                  selectedApp.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-blue-500" />
                          {doc.name}
                        </span>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Open High-Res
                        </a>
                      </div>

                      {/* Mock Image Canvas */}
                      <div className="aspect-video w-full bg-gray-200 dark:bg-white/10 rounded-xl flex items-center justify-center overflow-hidden relative">
                        <p className="text-xs font-bold text-gray-500">[ Document Scan: {doc.type} ]</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic">No documents attached to this profile.</p>
                )}
              </div>

              {/* Approval Controls */}
              <div className="pt-4 border-t border-gray-200 dark:border-white/10 space-y-2">
                {selectedApp.status !== "Approved" && (
                  <button
                    onClick={() => handleApprove(selectedApp.id)}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    Approve Driver & Grant Access
                  </button>
                )}

                {selectedApp.status !== "Rejected" && (
                  <button
                    onClick={() => setRejectionModalOpen(true)}
                    className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition flex items-center justify-center gap-2"
                  >
                    <UserX className="w-4 h-4" />
                    Reject Application
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 5. Rejection Reason Modal Overlay */}
      <AnimatePresence>
        {rejectionModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#090C10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Reject Driver Application
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Please enter a reason for rejecting this applicant. This note will be sent to the driver via email.
              </p>

              <textarea
                value={rejectionInput}
                onChange={(e) => setRejectionInput(e.target.value)}
                placeholder="e.g., Drivers license image is unreadable or insurance policy has expired..."
                className="w-full h-28 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setRejectionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectionInput.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white transition"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}