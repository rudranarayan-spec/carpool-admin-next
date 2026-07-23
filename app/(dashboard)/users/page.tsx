"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  ShieldCheck,
  ShieldAlert,
  Clock,
  UserCheck,
  UserX,
  X,
  RefreshCw,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  FileText,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
} from "lucide-react";

// User Data Structure
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Rider" | "Driver" | "Both";
  status: "Verified" | "Pending" | "Suspended";
  joinedDate: string;
  totalRides: number;
  rating: number;
  kycDocumentUrl?: string;
}

const mockUsers: UserProfile[] = [
  {
    id: "USR-1082",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    phone: "+1 (555) 234-5678",
    role: "Rider",
    status: "Verified",
    joinedDate: "12 Jan 2026",
    totalRides: 48,
    rating: 4.9,
  },
  {
    id: "USR-1083",
    name: "Marcus Vance",
    email: "marcus.v@example.com",
    phone: "+1 (555) 876-5432",
    role: "Driver",
    status: "Pending",
    joinedDate: "18 Jul 2026",
    totalRides: 12,
    rating: 4.7,
    kycDocumentUrl: "https://via.placeholder.com/600x400?text=Driver+License+Sample",
  },
  {
    id: "USR-1084",
    name: "Alex Rivera",
    email: "alex.r@poolshare.io",
    phone: "+1 (555) 345-6789",
    role: "Both",
    status: "Verified",
    joinedDate: "05 Mar 2025",
    totalRides: 142,
    rating: 4.95,
  },
  {
    id: "USR-1085",
    name: "Elena Rostova",
    email: "elena.r@example.com",
    phone: "+1 (555) 901-2345",
    role: "Rider",
    status: "Suspended",
    joinedDate: "22 Feb 2026",
    totalRides: 5,
    rating: 3.2,
  },
  {
    id: "USR-1086",
    name: "David Chen",
    email: "david.c@example.com",
    phone: "+1 (555) 654-3210",
    role: "Driver",
    status: "Pending",
    joinedDate: "21 Jul 2026",
    totalRides: 0,
    rating: 0.0,
    kycDocumentUrl: "https://via.placeholder.com/600x400?text=State+ID+Verification",
  },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserProfile[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Filter Logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    const matchesStatus = statusFilter === "All" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: UserProfile["status"]) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
    if (selectedUser?.id === id) {
      setSelectedUser((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const getStatusBadge = (status: UserProfile["status"]) => {
    switch (status) {
      case "Verified":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            KYC Pending
          </span>
        );
      case "Suspended":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-3.5 h-3.5" />
            Suspended
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen transition-colors duration-300 select-none">
      
      {/* 1. Page Header & Stats Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            User & KYC Verification
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            Manage passenger accounts, driver credentials, and legal compliance.
          </p>
        </div>

        <button
          onClick={() => setUsers([...mockUsers])}
          className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition active:scale-95 self-start sm:self-auto"
          title="Refresh Users"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-[#090C10] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Total Users</p>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            {users.length}
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-[#090C10] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Verified Accounts</p>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            {users.filter((u) => u.status === "Verified").length}
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-[#090C10] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Pending Approval</p>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            {users.filter((u) => u.status === "Pending").length}
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-[#090C10] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
          <p className="text-xs font-bold text-rose-600 dark:text-rose-400">Suspended Users</p>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            {users.filter((u) => u.status === "Suspended").length}
          </p>
        </div>
      </div>

      {/* 2. Controls & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-[#090C10] p-3 sm:p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by User ID, Name, or Email..."
            className="w-full bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
          {/* Role Filter Dropdown */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none"
          >
            <option value="All">All Roles</option>
            <option value="Rider">Rider</option>
            <option value="Driver">Driver</option>
            <option value="Both">Both</option>
          </select>

          {/* Status Filter Tabs */}
          {["All", "Verified", "Pending", "Suspended"].map((tab) => {
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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

      {/* 3. Responsive User Data Table */}
      <div className="bg-white dark:bg-[#090C10] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Verification Status</th>
                <th className="px-6 py-4">Trips</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10 text-sm">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition cursor-pointer group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email} • <span className="font-mono text-blue-600 dark:text-blue-400">{user.id}</span>
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                      {user.totalRides}
                    </td>
                    <td className="px-6 py-4 font-bold text-amber-500">
                      ★ {user.rating > 0 ? user.rating.toFixed(1) : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                      {user.joinedDate}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition">
                        Review Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No users match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. User Details & Verification Drawer Modal */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-white dark:bg-[#090C10] border-l border-gray-200 dark:border-white/10 z-50 p-6 overflow-y-auto space-y-6 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    User Inspection
                  </h2>
                  <p className="text-xs font-mono text-blue-600 dark:text-blue-400">
                    {selectedUser.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Header */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Account Status</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
                    {selectedUser.status}
                  </p>
                </div>
                {getStatusBadge(selectedUser.status)}
              </div>

              {/* Profile Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                  Account Details
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedUser.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedUser.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Registered on {selectedUser.joinedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* KYC Document Verification Section */}
              {selectedUser.kycDocumentUrl && (
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                    Uploaded Verification Document
                  </h3>
                  <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-2">
                    <div className="aspect-video w-full rounded-xl bg-gray-200 dark:bg-white/10 overflow-hidden flex items-center justify-center relative">
                      <p className="text-xs text-gray-500 font-bold">[ KYC Document Scan ]</p>
                    </div>
                    <a
                      href={selectedUser.kycDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 pt-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View High-Res Document
                    </a>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="pt-4 border-t border-gray-200 dark:border-white/10 space-y-2">
                {selectedUser.status !== "Verified" && (
                  <button
                    onClick={() => handleUpdateStatus(selectedUser.id, "Verified")}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    Approve KYC & Verify Account
                  </button>
                )}

                {selectedUser.status !== "Suspended" && (
                  <button
                    onClick={() => handleUpdateStatus(selectedUser.id, "Suspended")}
                    className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition flex items-center justify-center gap-2"
                  >
                    <UserX className="w-4 h-4" />
                    Suspend User Account
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}