"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  MapPinOff,
  Calendar,
  Clock,
  Car,
  User,
  Phone,
  Mail,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  CreditCard,
  Receipt,
  History,
  Navigation,
  Sparkles,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import RideService from "@/services/ride.service";
import { formatDate } from "@/lib/dateFormatter";

// --- Main Page Component ---

export default function RideDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const rideId = params.id as string;

  const {
    data: ride,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ride", rideId, "admin-details"],
    queryFn: () => RideService.getAdminRideDetails(rideId),
    enabled: !!rideId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] dark:bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />

          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Loading ride details...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !ride) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] dark:bg-black flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 mx-auto text-rose-500 mb-3" />

          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Unable to load ride
          </h2>

          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">
            {error instanceof Error
              ? error.message
              : "Ride details could not be found."}
          </p>

          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-sm font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header / Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#121824] p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Ride Details
                </h1>
                <StatusBadge status={ride.header.status} />
              </div>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                ID: #{ride.header.ride_code} • Created on{" "}
                {/* {new Date(ride.header.created_at).toLocaleDateString("en-GB")} */}
                {formatDate(ride.header.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Download Invoice
            </button>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT & CENTER COLUMN (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Route & Trip Overview Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#121824] p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6"
            >
              <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-500" /> Route &
                Schedule
              </h2>

              <div className="relative pl-6 border-l-2 border-dashed border-slate-200 dark:border-white/10 space-y-6">
                {/* Pickup */}
                <div className="relative">
                  <div className="absolute -left-7.75 top-0 p-1 rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-500">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold uppercase text-slate-400">
                      Pickup Location
                    </p>

                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {ride.route_schedule.pickup.location}
                    </p>

                    {ride.route_schedule.pickup.scheduled_at && (
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Scheduled:
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {formatDate(ride.route_schedule.pickup.scheduled_at)}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Destination */}
                <div className="relative">
                  <div className="absolute -left-7.75 top-0 p-1 rounded-full bg-rose-500/10 border border-rose-500 text-rose-500">
                    <MapPinOff className="w-3.5 h-3.5" />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold uppercase text-slate-400">
                      Dropoff Location
                    </p>

                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {ride.route_schedule.dropoff.location}
                    </p>

                    {ride.route_schedule.dropoff.estimated_arrival && (
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Estimated Arrival:
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {formatTime(
                            ride.route_schedule.dropoff.estimated_arrival,
                          )}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Ride Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200/60 dark:border-white/5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Distance
                  </p>
                  <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                    {ride.route_schedule.metrics.distance_km} km
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Est. Duration
                  </p>
                  <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                    {ride.route_schedule.metrics.duration_mins}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Seat Price
                  </p>
                  <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    ₹{ride.route_schedule.metrics.seat_price}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Occupancy
                  </p>
                  <p className="text-sm font-black text-blue-600 dark:text-blue-400 mt-0.5">
                    {ride.route_schedule.metrics.occupancy}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Passenger Bookings Table */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-[#121824] p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" /> Passenger
                  Bookings ({ride.passenger_bookings.length})
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/80 dark:border-white/10 text-slate-400 font-extrabold uppercase tracking-wider">
                      <th className="py-3 px-2">Booking ID</th>
                      <th className="py-3 px-2">Passenger</th>
                      <th className="py-3 px-2">Seats</th>
                      <th className="py-3 px-2">Pickup / Drop</th>
                      <th className="py-3 px-2">Amount</th>
                      <th className="py-3 px-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {ride.passenger_bookings.map((booking) => (
                      <tr
                        key={booking.booking_id}
                        className="hover:bg-slate-50/50 dark:hover:bg-white/1"
                      >
                        <td className="py-3.5 px-2">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {booking.booking_id}
                          </p>
                          <p className="text-[11px] font-mono text-slate-400">
                            {booking.booking_code}
                          </p>
                        </td>
                        <td className="py-3.5 px-2">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {booking.passenger_name}
                          </p>
                          <p className="text-[11px] font-mono text-slate-400">
                            {booking.passenger_phone}
                          </p>
                        </td>
                        <td className="py-3.5 px-2 font-black text-slate-800 dark:text-slate-200">
                          {booking.seats}
                        </td>
                        <td className="py-3.5 px-2 space-y-0.5">
                          <p className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[150px]">
                            <span className="text-emerald-500 font-bold">
                              From:
                            </span>{" "}
                            {booking.pickup_location}
                          </p>
                          <p className="text-slate-500 truncate max-w-[150px]">
                            <span className="text-rose-500 font-bold">To:</span>{" "}
                            {booking.dropoff_location}
                          </p>
                        </td>
                        <td className="py-3.5 px-2 font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                          ₹{booking.amount_paid}
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <BookingStatusBadge status={booking.booking_status} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Financial & Payout Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-[#121824] p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4"
            >
              <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-500" /> Financial &
                Payout Breakup
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Total Revenue
                  </p>
                  <p className="text-lg font-black text-slate-900 dark:text-white">
                    ₹{ride.financial_breakup.total_revenue}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Platform Fee (10%)
                  </p>
                  <p className="text-lg font-black text-blue-600 dark:text-blue-400">
                    ₹{ride.financial_breakup.platform_fee.toFixed(2)}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Driver Payout
                  </p>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    ₹{ride.financial_breakup.driver_payout}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    GST / Tax
                  </p>
                  <p className="text-lg font-black text-slate-700 dark:text-slate-300">
                    ₹{ride.financial_breakup.gst_tax.toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN (1 Col) - Driver & Vehicle Info + Timeline */}
          <div className="space-y-6">
            {/* Driver & Vehicle Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-[#121824] p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-white/5">
                <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Car className="w-4 h-4 text-indigo-500" /> Driver & Vehicle
                </h2>
                <span
                  className="text-xs font-bold text-blue-500 flex items-center gap-1 cursor-pointer hover:underline"
                  onClick={() => {
                    router.push(`/users/${ride.driver_vehicle.driver.id}`);
                  }}
                >
                  View Profile <ExternalLink className="w-3 h-3" />
                </span>
              </div>

              {/* Driver Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black text-base">
                    {ride.driver_vehicle.driver.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {ride.driver_vehicle.driver.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      ★ {ride.driver_vehicle.driver.rating} •{" "}
                      {ride.driver_vehicle.driver.total_rides} rides
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-2">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ride.driver_vehicle.driver.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ride.driver_vehicle.driver.email}</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-2">
                <p className="text-[10px] font-extrabold uppercase text-slate-400">
                  Assigned Vehicle
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {ride.driver_vehicle.vehicle.title} (
                      {ride.driver_vehicle.vehicle.type})
                    </p>
                    <p className="text-[11px] font-mono text-slate-500">
                      {ride.driver_vehicle.vehicle.registration_number}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-mono text-xs font-black tracking-wider">
                    {ride.driver_vehicle.vehicle.registration_number}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Ride Activity Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white dark:bg-[#121824] p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4"
            >
              <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-amber-500" /> Activity Log
              </h2>

              <div className="relative pl-5 border-l border-slate-200 dark:border-white/10 space-y-5">
                {ride.activity_logs.map((item, index) => (
                  <div key={index} className="relative text-xs">
                    <div className="absolute -left-[25px] top-1 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white dark:ring-[#121824]" />
                    <p className="font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {item.description}
                    </p>
                    <p className="text-[10px] font-mono text-slate-500 mt-1">
                      {formatDate(item.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase().replace(/\s+/g, "_");

  const styles: Record<string, string> = {
    scheduled:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    upcoming:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    in_progress:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    in_transit:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    completed:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    cancelled:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    pending:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  };

  const icons: Record<string, React.ReactNode> = {
    scheduled: <Clock className="w-3.5 h-3.5" />,
    upcoming: <Clock className="w-3.5 h-3.5" />,
    in_progress: <Navigation className="w-3.5 h-3.5" />,
    in_transit: <Navigation className="w-3.5 h-3.5" />,
    completed: <CheckCircle2 className="w-3.5 h-3.5" />,
    cancelled: <XCircle className="w-3.5 h-3.5" />,
    pending: <Clock className="w-3.5 h-3.5" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize border ${styles[normalized] ??
        "bg-slate-500/10 text-slate-500 border-slate-500/20"
        }`}
    >
      {icons[normalized] ?? <AlertCircle className="w-3.5 h-3.5" />}
      {status.replace("_", " ")}
    </span>
  );
}

function BookingStatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase().replace(/\s+/g, "_");

  const styles: Record<string, string> = {
    confirmed:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",

    pending:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",

    cancelled:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",

    rejected:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",

    completed:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",

    ongoing:
      "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  };

  const icons: Record<string, React.ReactNode> = {
    confirmed: <CheckCircle2 className="w-3 h-3" />,
    pending: <Clock className="w-3 h-3" />,
    cancelled: <XCircle className="w-3 h-3" />,
    rejected: <XCircle className="w-3 h-3" />,
    completed: <CheckCircle2 className="w-3 h-3" />,
    ongoing: <Navigation className="w-3 h-3" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${styles[normalized] ??
        "bg-slate-500/10 text-slate-500 dark:text-zinc-400 border-slate-500/20"
        }`}
    >
      {icons[normalized] ?? <AlertCircle className="w-3 h-3" />}

      {status.replace(/_/g, " ")}
    </span>
  );
}

const formatTime = (value?: string) => {
  if (!value) return "N/A";
  const parts = value.split(":");
  if (parts.length < 2) return value;
  const hours = Number(parts[0]);
  const minutes = parts[1];
  if (Number.isNaN(hours)) return value;
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes} ${ampm}`;
};
