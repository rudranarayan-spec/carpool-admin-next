"use client";

import { useState, useEffect, useCallback } from "react";
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
  Loader2,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
  MapPin,
  Building,
  CreditCard,
} from "lucide-react";
import userService, {
  UserListItem,
  UserDetails,
  UserStats,
} from "@/services/userService"; // Adjust path if needed
import Image from "next/image";

export default function UserManagementPage() {
  // --- States ---
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    verifiedAccounts: 0,
    pendingApproval: 0,
    suspendedUsers: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [drawerLoading, setDrawerLoading] = useState<boolean>(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Selected User State for Drawer Modal
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState<UserDetails | null>(null);

  // --- API Fetch Functions ---

  // 1. Fetch Users List & Metrics
  const fetchUsersData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers({
        search: searchQuery,
        role: roleFilter !== "All" ? roleFilter : undefined,
        status: statusFilter !== "All" ? statusFilter : undefined,
      });

      setUsers(data.users);
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching users list:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, roleFilter, statusFilter]);

  // Debounce search query / fetch trigger on filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsersData();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchUsersData]);

  // 2. Fetch User Details for Modal Drawer
  const handleUserClick = async (userId: number) => {
    setSelectedUserId(userId);
    try {
      setDrawerLoading(true);
      const userDetail = await userService.getUserDetails(userId);
      setSelectedUserDetails(userDetail);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleCloseDrawer = () => {
    setSelectedUserId(null);
    setSelectedUserDetails(null);
  };

  // Status Badge Helper Component
  const renderStatusBadge = (status: string) => {
    const formattedStatus = status.toLowerCase();
    if (formattedStatus === "active" || formattedStatus === "verified") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          Verified
        </span>
      );
    }
    if (formattedStatus === "pending") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Clock className="w-3.5 h-3.5" />
          KYC Pending
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
        <ShieldAlert className="w-3.5 h-3.5" />
        Suspended
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen transition-colors duration-300 select-none">
      {/* 1. Page Header & Action Controls */}
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
          onClick={fetchUsersData}
          disabled={loading}
          className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition active:scale-95 self-start sm:self-auto disabled:opacity-50"
          title="Refresh Users"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Metrics Row from API Data */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-[#090C10] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Total Users</p>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            {stats.totalUsers}
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-[#090C10] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Verified Accounts</p>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            {stats.verifiedAccounts}
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-[#090C10] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Pending Approval</p>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            {stats.pendingApproval}
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-[#090C10] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
          <p className="text-xs font-bold text-rose-600 dark:text-rose-400">Suspended Users</p>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            {stats.suspendedUsers}
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
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none"
          >
            <option value="All">All Roles</option>
            <option value="Rider">Rider</option>
            <option value="Driver">Driver</option>
            <option value="Admin">Admin</option>
          </select>

          {["All", "active", "pending", "suspended"].map((tab) => {
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap capitalize ${isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                {tab === "active" ? "Verified" : tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Responsive User Data Table */}
      <div className="bg-white dark:bg-[#090C10] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-[#090C10]/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Verification Status</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10 text-sm">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => handleUserClick(user.id)}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition cursor-pointer group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {user.profile_picture ? (
                          <Image
                            src={user.profile_picture}
                            alt={user.name}
                            width={36}
                            height={36}
                            className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-white/10"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-600 font-bold flex items-center justify-center text-sm border border-blue-500/20">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email} • <span className="font-mono text-blue-600 dark:text-blue-400">{user.custom_id}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-600 dark:text-gray-300">
                      {user.location || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
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
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    {loading ? "Loading users..." : "No users match your search criteria."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. User Details Drawer Modal */}
      <AnimatePresence>
        {selectedUserId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDrawer}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-white dark:bg-[#090C10] border-l border-gray-200 dark:border-white/10 z-50 p-6 overflow-y-auto space-y-6 shadow-2xl"
            >
              {drawerLoading || !selectedUserDetails ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <p className="text-xs font-bold">Fetching user details...</p>
                </div>
              ) : (
                <>
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        User Inspection
                      </h2>
                      <p className="text-xs font-mono text-blue-600 dark:text-blue-400">
                        {selectedUserDetails.custom_id}
                      </p>
                    </div>
                    <button
                      onClick={handleCloseDrawer}
                      className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Status Header */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Account Status</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5 capitalize">
                        {selectedUserDetails.status}
                      </p>
                    </div>
                    {renderStatusBadge(selectedUserDetails.status)}
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
                          {selectedUserDetails.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {selectedUserDetails.phone}
                        </span>
                      </div>
                      {selectedUserDetails.user_details?.address && (
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {selectedUserDetails.user_details.address},{" "}
                            {selectedUserDetails.user_details.city}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Registered on{" "}
                          {new Date(selectedUserDetails.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Banking / Financial Information */}
                  {selectedUserDetails.user_details?.bank_account_number && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                        Banking Details
                      </h3>
                      <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-2 text-xs">
                        <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                          <Building className="w-4 h-4 text-gray-400" />
                          {selectedUserDetails.user_details.bank_name}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          Account: {selectedUserDetails.user_details.bank_account_number}
                        </div>
                        <p className="text-gray-500">
                          IFSC: {selectedUserDetails.user_details.bank_account_ifsc}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Verification Documents */}
                  {selectedUserDetails.user_details?.driver_license && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                        Verification Documents
                      </h3>
                      <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-2">
                        <a
                          href={selectedUserDetails.user_details.driver_license}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Driving License Document
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="pt-4 border-t border-gray-200 dark:border-white/10 space-y-2">
                    {selectedUserDetails.status !== "active" && (
                      <button
                        onClick={handleCloseDrawer}
                        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                      >
                        <UserCheck className="w-4 h-4" />
                        Approve KYC & Verify Account
                      </button>
                    )}

                    {selectedUserDetails.status !== "suspended" && (
                      <button
                        onClick={handleCloseDrawer}
                        className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition flex items-center justify-center gap-2"
                      >
                        <UserX className="w-4 h-4" />
                        Suspend User Account
                      </button>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}