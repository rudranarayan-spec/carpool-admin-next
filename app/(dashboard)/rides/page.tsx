"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  Search,
  Filter,
  MapPin,
  Clock,
  User,
  ShieldCheck,
  MoreVertical,
  SlidersHorizontal,
  ChevronRight,
  X,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";

// Mock Data Structure for Rides
interface Ride {
  id: string;
  driverName: string;
  driverAvatar: string;
  passengerName: string;
  pickup: string;
  dropoff: string;
  status: "In Progress" | "Completed" | "Pending" | "Cancelled";
  fare: string;
  time: string;
  seatsBooked: number;
  totalSeats: number;
}

const mockRides: Ride[] = [
  {
    id: "RIDE-9021",
    driverName: "Alex Rivera",
    driverAvatar: "AR",
    passengerName: "Sarah K. + 1",
    pickup: "Tech Park Station",
    dropoff: "Downtown Hub",
    status: "In Progress",
    fare: "$24.50",
    time: "Started 12 mins ago",
    seatsBooked: 3,
    totalSeats: 4,
  },
  {
    id: "RIDE-9022",
    driverName: "David Chen",
    driverAvatar: "DC",
    passengerName: "Michael B.",
    pickup: "Airport Terminal 2",
    dropoff: "Financial District",
    status: "Pending",
    fare: "$45.00",
    time: "Pickup in 8 mins",
    seatsBooked: 1,
    totalSeats: 3,
  },
  {
    id: "RIDE-9020",
    driverName: "Elena Rostova",
    driverAvatar: "ER",
    passengerName: "James L.",
    pickup: "North Campus",
    dropoff: "Metro Central",
    status: "Completed",
    fare: "$18.20",
    time: "Ended at 11:45 AM",
    seatsBooked: 2,
    totalSeats: 4,
  },
  {
    id: "RIDE-9019",
    driverName: "Marcus Vance",
    driverAvatar: "MV",
    passengerName: "Emily R.",
    pickup: "Westside Mall",
    dropoff: "Harbor Square",
    status: "Cancelled",
    fare: "$0.00",
    time: "Cancelled 30m ago",
    seatsBooked: 0,
    totalSeats: 4,
  },
  {
    id: "RIDE-9018",
    driverName: "Siddharth Rao",
    driverAvatar: "SR",
    passengerName: "Anand M.",
    pickup: "Silicon Avenue",
    dropoff: "Green Valley",
    status: "In Progress",
    fare: "$32.00",
    time: "Started 25 mins ago",
    seatsBooked: 4,
    totalSeats: 4,
  },
];

export default function RideManagementPage() {
  const [rides, setRides] = useState<Ride[]>(mockRides);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  // Filter rides based on Search & Status Tab
  const filteredRides = rides.filter((ride) => {
    const matchesSearch =
      ride.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.dropoff.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedFilter === "All" || ride.status === selectedFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Ride["status"]) => {
    switch (status) {
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            In Progress
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen transition-colors duration-300">
      {/* 1. Page Title & Action Bar */}
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
            onClick={() => setRides([...mockRides])}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition active:scale-95"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="flex-1 sm:flex-initial px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition active:scale-95">
            <Plus className="w-4 h-4" />
            Create Manual Ride
          </button>
        </div>
      </div>

      {/* 2. Search & Tab Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-[#090C10] p-3 sm:p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Ride ID, Driver, Passenger, or Route..."
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

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
          {["All", "In Progress", "Pending", "Completed", "Cancelled"].map(
            (tab) => {
              const isActive = selectedFilter === tab;
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
            }
          )}
        </div>
      </div>

      {/* 3. Responsive Ride Table / Card List */}
      <div className="bg-white dark:bg-[#090C10] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        
        {/* Desktop Table View (Hidden on Small Screens) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Ride ID</th>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">Passengers</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Fare</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10 text-sm">
              {filteredRides.length > 0 ? (
                filteredRides.map((ride) => (
                  <tr
                    key={ride.id}
                    onClick={() => setSelectedRide(ride)}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition cursor-pointer group"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {ride.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center">
                          {ride.driverAvatar}
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {ride.driverName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-700 dark:text-gray-300 font-medium">
                        {ride.passengerName}
                      </div>
                      <div className="text-xs text-gray-400">
                        {ride.seatsBooked}/{ride.totalSeats} seats filled
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 max-w-xs">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 truncate">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{ride.pickup}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 truncate">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">{ride.dropoff}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(ride.status)}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                      {ride.fare}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No rides found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Mobile Card View (Shown on Small Screens) */}
        <div className="block md:hidden divide-y divide-gray-200 dark:divide-white/10">
          {filteredRides.length > 0 ? (
            filteredRides.map((ride) => (
              <div
                key={ride.id}
                onClick={() => setSelectedRide(ride)}
                className="p-4 space-y-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition active:bg-gray-100 dark:active:bg-white/5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    {ride.id}
                  </span>
                  {getStatusBadge(ride.status)}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center">
                      {ride.driverAvatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                        {ride.driverName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Passenger: {ride.passengerName}
                      </p>
                    </div>
                  </div>
                  <span className="text-base font-black text-gray-900 dark:text-white">
                    {ride.fare}
                  </span>
                </div>

                <div className="bg-gray-50 dark:bg-white/5 p-2.5 rounded-xl space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{ride.pickup}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{ride.dropoff}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
              No rides found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* 4. Slide-over Details Drawer Modal */}
      <AnimatePresence>
        {selectedRide && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRide(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Right Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[450px] bg-white dark:bg-[#090C10] border-l border-gray-200 dark:border-white/10 z-50 p-6 overflow-y-auto space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Ride Details
                  </h2>
                  <p className="text-xs font-mono text-blue-600 dark:text-blue-400">
                    {selectedRide.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRide(null)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Banner */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Current Status
                </span>
                {getStatusBadge(selectedRide.status)}
              </div>

              {/* Route Breakdown */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                  Route Details
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Pickup Point</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {selectedRide.pickup}
                      </p>
                    </div>
                  </div>
                  <div className="h-4 border-l-2 border-dashed border-gray-300 dark:border-white/20 ml-2" />
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Destination</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {selectedRide.dropoff}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver & Passenger Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                  Participants
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                    <p className="text-xs text-gray-400 font-medium">Driver</p>
                    <p className="font-bold text-gray-900 dark:text-white mt-1">
                      {selectedRide.driverName}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                    <p className="text-xs text-gray-400 font-medium">Passenger</p>
                    <p className="font-bold text-gray-900 dark:text-white mt-1">
                      {selectedRide.passengerName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fare & Seats */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                  Billing & Occupancy
                </h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Total Fare</p>
                    <p className="text-xl font-black text-gray-900 dark:text-white">
                      {selectedRide.fare}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-medium">Seat Occupancy</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {selectedRide.seatsBooked} / {selectedRide.totalSeats} Seats
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 dark:border-white/10 flex gap-3">
                <button
                  onClick={() => setSelectedRide(null)}
                  className="flex-1 py-3 px-4 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white font-bold text-xs rounded-xl transition"
                >
                  Close
                </button>
                <button className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition">
                  Cancel Ride
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}