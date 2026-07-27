"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { RideService } from "@/services/ride.service"; // Adjust path as needed
import { RideListItem, RideStatus } from "@/types/rides.types"; // Adjust path as needed

export default function RideManagementPage() {
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  // Selection & Modal States
  const [selectedRideId, setSelectedRideId] = useState<number | string | null>(null);

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

  const error = ridesError instanceof Error ? ridesError.message : ridesError ? "Failed to load rides" : null;

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

  const detailsError = detailsErrorObj instanceof Error ? detailsErrorObj.message : detailsErrorObj ? "Failed to fetch ride details" : null;
  // ----------------------------------------------------
  // 2. Mutations (Update & Delete)
  // ----------------------------------------------------

  // Update Ride Mutation
  const updateRideMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: Partial<RideListItem> }) =>
      RideService.updateRide(id, payload),
    onSuccess: (response) => {
      if (response.status === "success") {
        // Invalidate list query and single ride query to refresh data
        queryClient.invalidateQueries({ queryKey: ["rides"] });
        queryClient.invalidateQueries({ queryKey: ["ride", selectedRideId] });
        setIsEditing(false);
      }
    },
    onError: (err: Error) => {
      alert(err.message || "Failed to update ride");
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
      alert(err.message || "Failed to delete ride");
    },
  });

  // Action Loading helper
  const actionLoading = updateRideMutation.isPending || deleteRideMutation.isPending;

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
    updateRideMutation.mutate({ id: selectedRideId, payload: editFormData });
  };

  const handleDeleteRide = () => {
    if (!selectedRideId) return;
    deleteRideMutation.mutate(selectedRideId);
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
            Monitor, inspect, and direct active carpool journeys across your fleet.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchRides()}
            disabled={isFetching}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition active:scale-95 disabled:opacity-50"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>
          <button className="flex-1 sm:flex-initial px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition active:scale-95">
            <Plus className="w-4 h-4" />
            Create Manual Ride
          </button>
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
          {["All", "Scheduled", "In Progress", "Completed", "Cancelled"].map((tab) => {
            const isActive = selectedFilter.toLowerCase() === tab.toLowerCase();
            return (
              <button
                key={tab}
                onClick={() => setSelectedFilter(tab)}
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
                      const seatsBooked = ride.total_seats - ride.available_seats;
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
                                <span className="truncate">{ride.source_address}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 truncate">
                                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                <span className="truncate">{ride.destination_address}</span>
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
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
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
                              {ride.vehicle_model} • {ride.vehicle_registration_number}
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
                          <span className="truncate">{ride.source_address}</span>
                        </div>
                        <div className="flex items-center gap-2 truncate">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">{ride.destination_address}</span>
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
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-white dark:bg-[#090C10] border-l border-gray-200 dark:border-white/10 z-50 p-6 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      {isEditing ? "Edit Ride Configuration" : "Ride Overview"}
                    </h2>
                    <p className="text-xs font-mono text-blue-600 dark:text-blue-400">
                      Ride ID: #{selectedRideId}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseDrawer}
                    className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Body - State Logic */}
                {loadingDetails ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <p className="text-sm font-medium">Fetching specific ride record...</p>
                  </div>
                ) : detailsError ? (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm flex flex-col gap-2">
                    <p>{detailsError}</p>
                    <button
                      onClick={() => handleSelectRide(selectedRideId)}
                      className="underline font-bold self-start text-xs"
                    >
                      Try Again
                    </button>
                  </div>
                ) : selectedRide && !isEditing ? (
                  /* VIEW MODE */
                  <div className="space-y-6">
                    {/* Status Display */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Current Status
                      </span>
                      {getStatusBadge(selectedRide.status)}
                    </div>

                    {/* Route Info */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                        Route & Schedule
                      </h3>
                      <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400 font-medium">Pickup Location</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {selectedRide.source_address}
                            </p>
                          </div>
                        </div>
                        <div className="h-4 border-l-2 border-dashed border-gray-300 dark:border-white/20 ml-2" />
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400 font-medium">Destination</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {selectedRide.destination_address}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-200 dark:border-white/10 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-400 block">Date:</span>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {formatDate(selectedRide.ride_date)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Departure Time:</span>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {formatTime(selectedRide.departure_time)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Driver Profile */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                        Driver Information
                      </h3>
                      <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-2.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center justify-center">
                            {getDriverInitials(selectedRide.driver_name)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white capitalize">
                              {selectedRide.driver_name}
                            </p>
                            <p className="text-xs text-gray-400">Driver ID: #{selectedRide.driver_id}</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-gray-200 dark:border-white/10 space-y-1.5 text-xs">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <Phone className="w-3.5 h-3.5 text-blue-500" />
                            <span>{selectedRide.driver_phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <Mail className="w-3.5 h-3.5 text-blue-500" />
                            <span>{selectedRide.driver_email}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Details */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                        Vehicle Specs
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                          <p className="text-[10px] text-gray-400 uppercase font-medium">Model</p>
                          <p className="font-bold text-gray-900 dark:text-white text-xs mt-0.5 capitalize truncate">
                            {selectedRide.vehicle_model}
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                          <p className="text-[10px] text-gray-400 uppercase font-medium">Reg Number</p>
                          <p className="font-bold text-gray-900 dark:text-white text-xs mt-0.5 uppercase truncate">
                            {selectedRide.vehicle_registration_number}
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                          <p className="text-[10px] text-gray-400 uppercase font-medium">Fuel Type</p>
                          <p className="font-bold text-gray-900 dark:text-white text-xs mt-0.5 capitalize truncate">
                            {selectedRide.vehicle_fuel_type}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Seat Occupancy */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                        Billing & Occupancy
                      </h3>
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                        <div>
                          <p className="text-xs text-gray-400 font-medium">Price per Seat</p>
                          <p className="text-xl font-black text-gray-900 dark:text-white">
                            {formatCurrency(selectedRide.price_per_seat)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 font-medium">Seat Availability</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {selectedRide.available_seats} / {selectedRide.total_seats} Available
                          </p>
                          <p className="text-xs text-blue-500 font-medium mt-0.5">
                            {selectedRide.total_seats - selectedRide.available_seats} Booked
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* EDIT MODE FORM */
                  <form id="edit-ride-form" onSubmit={handleUpdateRide} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-gray-500 dark:text-gray-400 font-bold mb-1">Status</label>
                      <select
                        value={editFormData.status || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            status: e.target.value as RideStatus,
                          })
                        }
                        className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-2.5 font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-500 dark:text-gray-400 font-bold mb-1">Price per Seat (₹)</label>
                        <input
                          type="number"
                          value={editFormData.price_per_seat ?? ""}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, price_per_seat: Number(e.target.value) })
                          }
                          className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-2.5 font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 dark:text-gray-400 font-bold mb-1">Available Seats</label>
                        <input
                          type="number"
                          value={editFormData.available_seats ?? ""}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, available_seats: Number(e.target.value) })
                          }
                          className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-2.5 font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-500 dark:text-gray-400 font-bold mb-1">Source Address</label>
                      <input
                        type="text"
                        value={editFormData.source_address || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, source_address: e.target.value })}
                        className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-2.5 font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-500 dark:text-gray-400 font-bold mb-1">Destination Address</label>
                      <input
                        type="text"
                        value={editFormData.destination_address || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, destination_address: e.target.value })}
                        className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-2.5 font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                  </form>
                )}
              </div>

              {/* Action Buttons Footer */}
              {selectedRide && !loadingDetails && (
                <div className="pt-4 border-t border-gray-200 dark:border-white/10 space-y-3">
                  {isDeleting ? (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center space-y-2">
                      <p className="text-xs font-bold text-rose-500">
                        Are you sure you want to permanently delete this ride?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsDeleting(false)}
                          className="flex-1 py-2 bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white rounded-lg text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDeleteRide}
                          disabled={actionLoading}
                          className="flex-1 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold flex justify-center items-center gap-1"
                        >
                          {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Confirm Delete"}
                        </button>
                      </div>
                    </div>
                  ) : isEditing ? (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-3 px-4 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white font-bold text-xs rounded-xl transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        form="edit-ride-form"
                        disabled={actionLoading}
                        className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition flex justify-center items-center gap-2"
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
                        onClick={() => setIsEditing(true)}
                        className="flex-1 py-3 px-4 bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-bold text-xs rounded-xl transition flex justify-center items-center gap-2 border border-blue-500/20"
                      >
                        <Edit2 className="w-4 h-4" /> Edit Ride
                      </button>
                      <button
                        onClick={() => setIsDeleting(true)}
                        className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition flex justify-center items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Ride
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