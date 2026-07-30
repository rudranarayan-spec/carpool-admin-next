"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  Search,
  MapPin,
  Clock,
  ChevronRight,
  X,
  Plus,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  Calendar,
  Loader2,
  AlertCircle,
  Edit2,
  Trash2,
  Save,
  Car,
  Hash,
  Fuel,
  User,
  DollarSign,
  Users,
  Navigation,
} from "lucide-react";
import { RideService } from "@/services/ride.service"; // Adjust path as needed
import {
  CreateRidePayload,
  RideListItem,
  RideStatus,
} from "@/types/rides.types"; // Adjust path as needed
import { toast } from "sonner";
import EditRideForm from "@/components/dashboard/EditRideForm";
import CreateRideModal from "@/components/dashboard/CreateRideModal";

export default function RideManagementPage() {
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  // Selection & Modal States
  const [selectedRideId, setSelectedRideId] = useState<number | string | null>(
    null,
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Edit / Delete State Controls
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<Partial<RideListItem>>({});
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // ----------------------------------------------------
  // 1. Queries (Data Fetching)
  // ----------------------------------------------------

  // Fetch All Rides
  const {
    data: rides = [],
    isLoading: loading,
    isFetching,
    error: ridesError,
    refetch: fetchRides,
  } = useQuery({
    queryKey: ["rides"],
    queryFn: RideService.getAllRides,
  });

  const error =
    ridesError instanceof Error
      ? ridesError.message
      : ridesError
        ? "Failed to load rides"
        : null;

  // Fetch Single Ride Details when selectedRideId is set
  const {
    data: selectedRide,
    isLoading: loadingDetails,
    error: detailsErrorObj,
  } = useQuery({
    queryKey: ["ride", selectedRideId],
    queryFn: () => RideService.getRideById(selectedRideId!),
    enabled: selectedRideId !== null,
  });

  const createRideMutation = useMutation({
    mutationFn: (newRide: CreateRidePayload) => RideService.createRide(newRide),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rides"] });
    },
  });

  const handleCreateRide = (data: CreateRidePayload) => {
    toast.promise(createRideMutation.mutateAsync(data), {
      loading: "Creating new ride...",
      success: () => {
        setIsCreateOpen(false);
        return "Ride created successfully! 🚗";
      },
      error: (err) => err?.message || "Failed to create ride",
    });
  };

  const detailsError =
    detailsErrorObj instanceof Error
      ? detailsErrorObj.message
      : detailsErrorObj
        ? "Failed to fetch ride details"
        : null;
  // ----------------------------------------------------
  // 2. Mutations (Update & Delete)
  // ----------------------------------------------------

  // Update Ride Mutation
  const updateRideMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: Partial<RideListItem>;
    }) => RideService.updateRide(id, payload),
    onSuccess: (response) => {
      if (response.status === "success") {
        // Invalidate list query and single ride query to refresh data
        queryClient.invalidateQueries({ queryKey: ["rides"] });
        queryClient.invalidateQueries({ queryKey: ["ride", selectedRideId] });
        setIsEditing(false);
      }
    },
    onError: (err: Error) => {
      toast(err.message || "Failed to update ride");
    },
  });

  // Delete Ride Mutation
  const deleteRideMutation = useMutation({
    mutationFn: (id: number | string) => RideService.deleteRide(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rides"] });
      handleCloseDrawer();
    },
    onError: (err: Error) => {
      toast(err.message || "Failed to delete ride");
    },
  });

  // Action Loading helper
  const actionLoading =
    updateRideMutation.isPending || deleteRideMutation.isPending;

  // ----------------------------------------------------
  // 3. Handlers
  // ----------------------------------------------------

  const handleSelectRide = (rideId: number | string) => {
    setSelectedRideId(rideId);
    setIsEditing(false);
    setIsDeleting(false);
  };

  const handleCloseDrawer = () => {
    setSelectedRideId(null);
    setIsEditing(false);
    setIsDeleting(false);
  };

  const handleUpdateRide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRideId) return;

    toast(`Update Ride #${selectedRideId}?`, {
      description: "Are you sure you want to save these changes?",
      duration: 5000,
      action: {
        label: "Update",
        onClick: () => {
          toast.promise(
            updateRideMutation.mutateAsync({
              id: selectedRideId,
              payload: editFormData,
            }),
            {
              loading: "Updating ride details...",
              success: () => {
                setIsEditing(false);
                return `Ride #${selectedRideId} updated successfully!`;
              },
              error: (err) =>
                err?.message || "Failed to update ride. Please try again.",
            },
          );
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => toast.dismiss(),
      },
    });
  };

  // 2. DELETE RIDE WITH CONFIRMATION
  const handleDeleteRide = () => {
    if (!selectedRideId) return;

    toast(`Delete Ride #${selectedRideId}?`, {
      description: "This action is permanent and cannot be undone.",
      duration: 6000,
      action: {
        label: "Delete",
        onClick: () => {
          toast.promise(deleteRideMutation.mutateAsync(selectedRideId), {
            loading: "Deleting ride record...",
            success: () => {
              handleCloseDrawer();
              return `Ride #${selectedRideId} deleted successfully!`;
            },
            error: (err) =>
              err?.message || "Failed to delete ride. Please try again.",
          });
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => toast.dismiss(),
      },
    });
  };

  // Safe Formatters
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return isNaN(num) ? "₹0.00" : `₹${num.toFixed(2)}`;
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return isNaN(date.getTime())
      ? "N/A"
      : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "N/A";
    const parts = timeString.split(":");
    if (parts.length < 2) return timeString;
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  const getDriverInitials = (name?: string) => {
    if (!name) return "D";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Filter rides based on search query & status pills
  const filteredRides = rides.filter((ride) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      ride.id.toString().includes(query) ||
      ride.driver_name.toLowerCase().includes(query) ||
      ride.driver_email.toLowerCase().includes(query) ||
      ride.driver_phone.includes(query) ||
      ride.source_address.toLowerCase().includes(query) ||
      ride.destination_address.toLowerCase().includes(query) ||
      ride.vehicle_model.toLowerCase().includes(query) ||
      ride.vehicle_registration_number.toLowerCase().includes(query);

    const matchesStatus =
      selectedFilter === "All" ||
      ride.status.toLowerCase() === selectedFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: RideStatus | string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "in progress":
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            In Progress
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case "scheduled":
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            Scheduled
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20 capitalize">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen transition-colors duration-300">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            Ride Management
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            Monitor, inspect, and direct active carpool journeys across your
            fleet.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchRides()}
            disabled={isFetching}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition active:scale-95 disabled:opacity-50"
            title="Refresh List"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create Manual Ride
          </button>

          {/* Modal Component */}
          <CreateRideModal
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onSubmit={handleCreateRide}
            isLoading={createRideMutation.isPending}
          />
        </div>
      </div>

      {/* 2. Controls & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-[#090C10] p-3 sm:p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Ride ID, Driver, Route, Vehicle, or Phone..."
            className="w-full bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
          {["All", "Scheduled", "In Progress", "Completed", "Cancelled"].map(
            (tab) => {
              const isActive =
                selectedFilter.toLowerCase() === tab.toLowerCase();
              return (
                <button
                  key={tab}
                  onClick={() => setSelectedFilter(tab)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                  {tab}
                </button>
              );
            },
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchRides()}
            className="underline font-bold hover:text-rose-700 dark:hover:text-rose-300"
          >
            Retry
          </button>
        </div>
      )}

      {/* 3. Table / Mobile Card Display */}
      <div className="bg-white dark:bg-[#090C10] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium">Fetching rides dataset...</p>
          </div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Ride ID</th>
                    <th className="px-6 py-4">Driver</th>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Route</th>
                    <th className="px-6 py-4">Schedule</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Seat Price</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/10 text-sm">
                  {filteredRides.length > 0 ? (
                    filteredRides.map((ride) => {
                      const seatsBooked =
                        ride.total_seats - ride.available_seats;
                      return (
                        <tr
                          key={ride.id}
                          onClick={() => handleSelectRide(ride.id)}
                          className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition cursor-pointer group"
                        >
                          <td className="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                            #{ride.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                                {getDriverInitials(ride.driver_name)}
                              </div>
                              <div>
                                <span className="font-semibold text-gray-900 dark:text-white block capitalize">
                                  {ride.driver_name}
                                </span>
                                <span className="text-xs text-gray-400 block">
                                  {ride.driver_phone}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-700 dark:text-gray-300 font-medium capitalize">
                              {ride.vehicle_model}
                            </div>
                            <div className="text-xs text-gray-400 uppercase">
                              {ride.vehicle_registration_number}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1 max-w-xs">
                              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 truncate">
                                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span className="truncate">
                                  {ride.source_address}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 truncate">
                                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                <span className="truncate">
                                  {ride.destination_address}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600 dark:text-gray-300">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {formatDate(ride.ride_date)}
                            </div>
                            <div className="text-gray-400">
                              {formatTime(ride.departure_time)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(ride.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-bold text-gray-900 dark:text-white">
                              {formatCurrency(ride.price_per_seat)}
                            </div>
                            <div className="text-xs text-gray-400">
                              {seatsBooked}/{ride.total_seats} booked
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                      >
                        No rides found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="block md:hidden divide-y divide-gray-200 dark:divide-white/10">
              {filteredRides.length > 0 ? (
                filteredRides.map((ride) => {
                  const seatsBooked = ride.total_seats - ride.available_seats;
                  return (
                    <div
                      key={ride.id}
                      onClick={() => handleSelectRide(ride.id)}
                      className="p-4 space-y-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition active:bg-gray-100 dark:active:bg-white/5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                          #{ride.id}
                        </span>
                        {getStatusBadge(ride.status)}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                            {getDriverInitials(ride.driver_name)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight capitalize">
                              {ride.driver_name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {ride.vehicle_model} •{" "}
                              {ride.vehicle_registration_number}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black text-gray-900 dark:text-white block">
                            {formatCurrency(ride.price_per_seat)}
                          </span>
                          <span className="text-[10px] text-gray-400 block">
                            {seatsBooked}/{ride.total_seats} Seats
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-white/5 p-2.5 rounded-xl space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2 truncate">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">
                            {ride.source_address}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 truncate">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">
                            {ride.destination_address}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(ride.ride_date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatTime(ride.departure_time)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                  No rides found matching your criteria.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 4. Slide-Over Details / Edit / Delete Drawer */}
      <AnimatePresence>
        {selectedRideId !== null && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDrawer}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Slide Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[540px] bg-slate-50 dark:bg-[#0B0F17] border-l border-slate-200 dark:border-slate-800 z-50 p-6 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between text-slate-900 dark:text-slate-100"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800/80">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800/50">
                      {isEditing ? "Configuration" : "Ride Summary"}
                    </span>
                    <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white pt-1">
                      {isEditing ? "Edit Ride Details" : "Ride Overview"}
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-300/50 dark:border-slate-700/50">
                      #{selectedRideId}
                    </span>
                    <button
                      onClick={handleCloseDrawer}
                      className="p-2 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-200 active:scale-95"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Drawer Body - State Logic */}
                {loadingDetails ? (
                  <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
                    <Loader2 className="w-9 h-9 animate-spin text-indigo-500" />
                    <p className="text-sm font-medium tracking-wide animate-pulse">
                      Fetching ride analytics...
                    </p>
                  </div>
                ) : detailsError ? (
                  <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm flex flex-col gap-3">
                    <p className="font-medium">{detailsError}</p>
                    <button
                      onClick={() => handleSelectRide(selectedRideId)}
                      className="px-4 py-2 bg-rose-500 text-white font-bold rounded-xl text-xs self-start hover:bg-rose-600 transition shadow-sm"
                    >
                      Try Again
                    </button>
                  </div>
                ) : selectedRide && !isEditing ? (
                  /* VIEW MODE */
                  <div className="space-y-5">
                    {/* Status Card */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-100 to-white dark:from-slate-900/90 dark:to-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Current Status
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(selectedRide.status)}
                        <Link
                          href={`/rides/${selectedRide.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-amber-700 dark:text-white dark:hover:text-blue-300 transition-colors"
                        >
                          View Details
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Route & Schedule Info (Amber / Orange Theme) */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 px-1">
                        <Navigation className="w-3.5 h-3.5 text-amber-500" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          Route & Schedule
                        </h3>
                      </div>
                      <div className="p-4 bg-amber-50/40 dark:bg-amber-950/10 rounded-2xl border border-amber-200/60 dark:border-amber-900/30 space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-500 mt-0.5">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                Pickup Location
                              </p>
                              <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                                {selectedRide.source_address}
                              </p>
                            </div>
                          </div>

                          <div className="h-4 border-l-2 border-dashed border-amber-300 dark:border-amber-700/50 ml-3.5" />

                          <div className="flex items-start gap-3">
                            <div className="p-1.5 bg-rose-500/10 rounded-lg text-rose-500 mt-0.5">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                Destination
                              </p>
                              <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                                {selectedRide.destination_address}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-amber-200/60 dark:border-amber-900/30 grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-amber-200/40 dark:border-amber-900/20">
                            <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                            <div>
                              <span className="text-[10px] text-slate-400 font-medium block">
                                Date
                              </span>
                              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                                {formatDate(selectedRide.ride_date)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-amber-200/40 dark:border-amber-900/20">
                            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                            <div>
                              <span className="text-[10px] text-slate-400 font-medium block">
                                Departure Time
                              </span>
                              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                                {formatTime(selectedRide.departure_time)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Driver Profile (Indigo Theme) */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 px-1">
                        <User className="w-3.5 h-3.5 text-indigo-500" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          Driver Information
                        </h3>
                      </div>

                      <div className="p-4 bg-indigo-50/40 dark:bg-indigo-950/10 rounded-2xl border border-indigo-200/60 dark:border-indigo-900/30 space-y-3">
                        {/* Avatar & Name Header */}
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-black text-sm flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
                            {getDriverInitials(selectedRide.driver_name)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-900 dark:text-white capitalize text-sm truncate">
                              {selectedRide.driver_name}
                            </p>
                            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                              Driver ID: #{selectedRide.driver_id}
                            </p>
                          </div>
                        </div>

                        {/* Contact Information Row */}
                        <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-900/30 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 bg-white/80 dark:bg-slate-900/80 px-3 py-2 rounded-xl border border-indigo-200/50 dark:border-indigo-900/30 shadow-xs">
                            <Phone className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <span className="font-mono text-xs font-medium truncate">
                              {selectedRide.driver_phone}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 bg-white/80 dark:bg-slate-900/80 px-3 py-2 rounded-xl border border-indigo-200/50 dark:border-indigo-900/30 shadow-xs">
                            <Mail className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <span
                              className="text-xs font-medium truncate"
                              title={selectedRide.driver_email}
                            >
                              {selectedRide.driver_email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Details (Violet Theme) */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 px-1">
                        <Car className="w-3.5 h-3.5 text-violet-500" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                          Vehicle Specs
                        </h3>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-3 bg-violet-50/40 dark:bg-violet-950/10 rounded-2xl border border-violet-200/60 dark:border-violet-900/30">
                          <div className="flex items-center gap-1 text-slate-400 mb-1">
                            <Car className="w-3 h-3 text-violet-500" />
                            <p className="text-[10px] font-semibold uppercase">
                              Model
                            </p>
                          </div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs capitalize truncate">
                            {selectedRide.vehicle_model}
                          </p>
                        </div>
                        <div className="p-3 bg-violet-50/40 dark:bg-violet-950/10 rounded-2xl border border-violet-200/60 dark:border-violet-900/30">
                          <div className="flex items-center gap-1 text-slate-400 mb-1">
                            <Hash className="w-3 h-3 text-violet-500" />
                            <p className="text-[10px] font-semibold uppercase">
                              Plate
                            </p>
                          </div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs uppercase truncate">
                            {selectedRide.vehicle_registration_number}
                          </p>
                        </div>
                        <div className="p-3 bg-violet-50/40 dark:bg-violet-950/10 rounded-2xl border border-violet-200/60 dark:border-violet-900/30">
                          <div className="flex items-center gap-1 text-slate-400 mb-1">
                            <Fuel className="w-3 h-3 text-violet-500" />
                            <p className="text-[10px] font-semibold uppercase">
                              Fuel
                            </p>
                          </div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs capitalize truncate">
                            {selectedRide.vehicle_fuel_type}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Seat Occupancy (Emerald Theme) */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 px-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          Billing & Occupancy
                        </h3>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-emerald-50/40 dark:bg-emerald-950/10 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/30">
                        <div>
                          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                            Price per Seat
                          </p>
                          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                            {formatCurrency(selectedRide.price_per_seat)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1 text-slate-400 mb-0.5">
                            <Users className="w-3.5 h-3.5 text-emerald-500" />
                            <p className="text-[11px] font-semibold uppercase tracking-wider">
                              Occupancy
                            </p>
                          </div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {selectedRide.available_seats} /{" "}
                            {selectedRide.total_seats} Available
                          </p>
                          <span className="inline-block text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1">
                            {selectedRide.total_seats -
                              selectedRide.available_seats}{" "}
                            Booked
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* EDIT MODE FORM */
                  <EditRideForm
                    editFormData={editFormData}
                    setEditFormData={setEditFormData}
                    handleUpdateRide={handleUpdateRide}
                  />
                )}
              </div>

              {/* Action Buttons Footer */}
              {selectedRide && !loadingDetails && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  {isEditing ? (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-3 px-4 bg-slate-200/60 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all duration-200 active:scale-95"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        form="edit-ride-form"
                        disabled={actionLoading}
                        className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all duration-200 active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50"
                      >
                        {actionLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Save className="w-4 h-4" /> Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          if (selectedRide) {
                            setEditFormData(selectedRide);
                          }
                          setIsEditing(true);
                        }}
                        className="flex-1 py-3 px-4 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-xl transition-all duration-200 active:scale-95 flex justify-center items-center gap-2 border border-indigo-500/20"
                      >
                        <Edit2 className="w-4 h-4" /> Edit Ride
                      </button>
                      <button
                        onClick={handleDeleteRide}
                        disabled={actionLoading}
                        className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition-all duration-200 active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50"
                      >
                        {actionLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" /> Delete Ride
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
