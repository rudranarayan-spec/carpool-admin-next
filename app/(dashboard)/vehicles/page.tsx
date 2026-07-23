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
  X,
  RefreshCw,
  Eye,
  AlertTriangle,
  Clock,
  Check,
  Building2,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface VehicleDocument {
  id: string;
  name: string;
  type: "RC" | "Insurance" | "Fitness Certificate" | "Vehicle Photo";
  url: string;
  expiryDate?: string;
  verified: boolean;
}

interface VehicleApplication {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  submittedAt: string;
  status: "Pending" | "Approved" | "Rejected";
  vehicleDetails: {
    make: string;
    model: string;
    year: number;
    plateNumber: string;
    color: string;
    vinNumber: string;
    fuelType: "Electric" | "Petrol" | "Diesel" | "Hybrid";
  };
  documents: VehicleDocument[];
  rejectionReason?: string;
}

const initialVehicleApps: VehicleApplication[] = [
  {
    id: "VAPP-301",
    driverId: "DRV-104",
    driverName: "Marcus Vance",
    driverPhone: "+1 (555) 876-5432",
    submittedAt: "23 Jul 2026, 11:20",
    status: "Pending",
    vehicleDetails: {
      make: "Tesla",
      model: "Model 3",
      year: 2024,
      plateNumber: "EV-892-CA",
      color: "Pearl White",
      vinNumber: "5YJ3E1EA1KF123456",
      fuelType: "Electric",
    },
    documents: [
      {
        id: "VDOC-1",
        name: "Vehicle Registration Certificate (RC)",
        type: "RC",
        url: "https://via.placeholder.com/600x380?text=Vehicle+Registration+Certificate",
        verified: false,
      },
      {
        id: "VDOC-2",
        name: "Commercial Auto Insurance Policy",
        type: "Insurance",
        url: "https://via.placeholder.com/600x380?text=Commercial+Insurance+Policy",
        expiryDate: "15 Oct 2027",
        verified: false,
      },
      {
        id: "VDOC-3",
        name: "Vehicle Exterior & Interior Photos",
        type: "Vehicle Photo",
        url: "https://via.placeholder.com/600x380?text=Vehicle+Inspection+Photos",
        verified: false,
      },
    ],
  },
  {
    id: "VAPP-302",
    driverId: "DRV-105",
    driverName: "David Chen",
    driverPhone: "+1 (555) 654-3210",
    submittedAt: "22 Jul 2026, 16:45",
    status: "Pending",
    vehicleDetails: {
      make: "Toyota",
      model: "Camry Hybrid",
      year: 2023,
      plateNumber: "7XYZ89",
      color: "Midnight Black",
      vinNumber: "4T1B11HK2NU987654",
      fuelType: "Hybrid",
    },
    documents: [
      {
        id: "VDOC-4",
        name: "Vehicle Registration Certificate (RC)",
        type: "RC",
        url: "https://via.placeholder.com/600x380?text=Registration+Card",
        verified: true,
      },
      {
        id: "VDOC-5",
        name: "Vehicle Fitness / Inspection Certificate",
        type: "Fitness Certificate",
        url: "https://via.placeholder.com/600x380?text=State+Fitness+Certificate",
        expiryDate: "01 Aug 2026",
        verified: false,
      },
    ],
  },
  {
    id: "VAPP-303",
    driverId: "DRV-102",
    driverName: "Elena Rostova",
    driverPhone: "+1 (555) 901-2345",
    submittedAt: "20 Jul 2026, 09:30",
    status: "Rejected",
    rejectionReason: "Vehicle Registration Certificate scan is blurred and unreadable.",
    vehicleDetails: {
      make: "Honda",
      model: "Civic",
      year: 2020,
      plateNumber: "9LMN34",
      color: "Silver",
      vinNumber: "1HGFC2F60LH543210",
      fuelType: "Petrol",
    },
    documents: [],
  },
];

export default function VehicleApprovalsPage() {
  const [applications, setApplications] = useState<VehicleApplication[]>(initialVehicleApps);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Pending");
  const [selectedApp, setSelectedApp] = useState<VehicleApplication | null>(null);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionInput, setRejectionInput] = useState("");

  // Filtering
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.vehicleDetails.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.vehicleDetails.vinNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Toggle individual document verification status inside modal
  const handleToggleDocVerify = (docId: string) => {
    if (!selectedApp) return;

    const updatedDocs = selectedApp.documents.map((doc) =>
      doc.id === docId ? { ...doc, verified: !doc.verified } : doc
    );

    const updatedApp = { ...selectedApp, documents: updatedDocs };
    setSelectedApp(updatedApp);

    setApplications((prev) =>
      prev.map((a) => (a.id === selectedApp.id ? updatedApp : a))
    );
  };

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
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Car className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Vehicle Approvals
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            Verify registration certificates, insurance compliance, and VIN records for platform vehicles.
          </p>
        </div>

        <button
          onClick={() => setApplications(initialVehicleApps)}
          className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition active:scale-95 self-start sm:self-auto"
          title="Reset Queue"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Pending Approvals</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
              {applications.filter((a) => a.status === "Pending").length}
            </p>
          </div>
          <Clock className="w-8 h-8 text-amber-500 opacity-80" />
        </div>

        <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Approved Vehicles</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
              {applications.filter((a) => a.status === "Approved").length}
            </p>
          </div>
          <ShieldCheck className="w-8 h-8 text-emerald-500 opacity-80" />
        </div>

        <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400">Rejected Vehicles</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
              {applications.filter((a) => a.status === "Rejected").length}
            </p>
          </div>
          <ShieldAlert className="w-8 h-8 text-rose-500 opacity-80" />
        </div>
      </div>

      {/* 2. Controls & Search Filter */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-[#090C10] p-3 sm:p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Plate Number, Driver Name, App ID, or VIN..."
            className="w-full bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
          />
        </div>

        {/* Status Filter Tabs */}
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

      {/* 3. Vehicle Approval Queue Table */}
      <div className="bg-white dark:bg-[#090C10] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Vehicle Specification</th>
                <th className="px-6 py-4">Driver Details</th>
                <th className="px-6 py-4">Plate & VIN</th>
                <th className="px-6 py-4">Submission Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
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
                          {app.vehicleDetails.year} {app.vehicleDetails.make} {app.vehicleDetails.model}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                          {app.vehicleDetails.fuelType} • {app.vehicleDetails.color}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">
                          {app.driverName}
                        </p>
                        <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                          {app.driverPhone}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-mono font-extrabold text-blue-600 dark:text-blue-400">
                          {app.vehicleDetails.plateNumber}
                        </p>
                        <p className="text-[10px] font-mono text-gray-400">
                          VIN: {app.vehicleDetails.vinNumber}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {app.submittedAt}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {app.status === "Pending" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <Clock className="w-3.5 h-3.5" /> Docs Pending
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
                        <Eye className="w-3.5 h-3.5" /> Inspect Vehicle
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No vehicle records match your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Document Verification Drawer */}
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
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[560px] bg-white dark:bg-[#090C10] border-l border-gray-200 dark:border-white/10 z-50 p-6 overflow-y-auto space-y-6 shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Vehicle Verification Panel
                  </h2>
                  <p className="text-xs font-mono text-blue-600 dark:text-blue-400">
                    {selectedApp.id} • Assigned to {selectedApp.driverName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Vehicle Specifications Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                  Vehicle Specs & Identifiers
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400">Model:</span>
                    <p className="font-bold text-gray-900 dark:text-white mt-0.5">
                      {selectedApp.vehicleDetails.year} {selectedApp.vehicleDetails.make} {selectedApp.vehicleDetails.model}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Plate Number:</span>
                    <p className="font-mono font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
                      {selectedApp.vehicleDetails.plateNumber}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Fuel Engine Type:</span>
                    <p className="font-bold text-gray-900 dark:text-white mt-0.5">
                      {selectedApp.vehicleDetails.fuelType}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">VIN Number:</span>
                    <p className="font-mono text-gray-900 dark:text-white mt-0.5 break-all">
                      {selectedApp.vehicleDetails.vinNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rejection Note if applies */}
              {selectedApp.status === "Rejected" && selectedApp.rejectionReason && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs space-y-1">
                  <p className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Reason for Rejection:
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {selectedApp.rejectionReason}
                  </p>
                </div>
              )}

              {/* Interactive Vehicle Documents Checklist */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                    Uploaded Document Verification
                  </h3>
                  <span className="text-[11px] text-gray-400">
                    Verify each document manually
                  </span>
                </div>

                {selectedApp.documents.length > 0 ? (
                  selectedApp.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-4 rounded-2xl border transition space-y-3 ${
                        doc.verified
                          ? "bg-emerald-500/5 border-emerald-500/30"
                          : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="font-bold text-gray-900 dark:text-white">
                            {doc.name}
                          </span>
                        </div>

                        {/* Checkbox Toggle button */}
                        <button
                          onClick={() => handleToggleDocVerify(doc.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                            doc.verified
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-emerald-600 hover:text-white"
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          {doc.verified ? "Verified" : "Mark Verified"}
                        </button>
                      </div>

                      {doc.expiryDate && (
                        <p className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Policy Expiry:{" "}
                          <span className="font-bold text-gray-700 dark:text-gray-300">
                            {doc.expiryDate}
                          </span>
                        </p>
                      )}

                      {/* Mock Canvas View */}
                      <div className="aspect-video w-full bg-gray-200 dark:bg-white/10 rounded-xl flex items-center justify-center overflow-hidden relative">
                        <p className="text-xs font-bold text-gray-500">[ Document Scan: {doc.type} ]</p>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/60 text-white text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm hover:bg-black transition"
                        >
                          <ExternalLink className="w-3 h-3" /> Fullscreen
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic">No documents attached to this vehicle request.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-200 dark:border-white/10 space-y-2">
                {selectedApp.status !== "Approved" && (
                  <button
                    onClick={() => handleApprove(selectedApp.id)}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Vehicle for Fleet
                  </button>
                )}

                {selectedApp.status !== "Rejected" && (
                  <button
                    onClick={() => setRejectionModalOpen(true)}
                    className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Vehicle
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 5. Rejection Reason Modal */}
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
                Reject Vehicle Registration
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Please provide a clear reason for rejection so the driver can upload revised documents.
              </p>

              <textarea
                value={rejectionInput}
                onChange={(e) => setRejectionInput(e.target.value)}
                placeholder="e.g., Vehicle Registration Certificate expired or VIN does not match state records..."
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