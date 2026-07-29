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
} from "lucide-react";

// --- Types & Interfaces ---

export type RideStatus = "upcoming" | "in_transit" | "completed" | "cancelled";
export type BookingStatus = "confirmed" | "cancelled" | "pending";
export type PaymentStatus = "paid" | "refunded" | "pending" | "failed";

export interface PassengerBooking {
  id: string;
  passenger_name: string;
  phone: string;
  seats_booked: number;
  pickup_stop: string;
  dropoff_stop: string;
  amount_paid: number;
  booking_status: BookingStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  transaction_id: string;
  booked_at: string;
}

export interface RideDetailData {
  id: string;
  status: RideStatus;
  created_at: string;
  departure_time: string;
  estimated_arrival: string;
  source_address: string;
  destination_address: string;
  distance_km: number;
  estimated_duration: string;
  total_seats: number;
  available_seats: number;
  price_per_seat: number;
  vehicle: {
    model: string;
    plate_number: string;
    color: string;
    type: string;
  };
  driver: {
    id: string;
    name: string;
    phone: string;
    email: string;
    rating: number;
    total_completed_rides: number;
  };
  financials: {
    total_revenue: number;
    platform_commission: number;
    driver_payout: number;
    tax_collected: number;
  };
  bookings: PassengerBooking[];
  timeline: {
    event: string;
    timestamp: string;
    description: string;
  }[];
}

// --- Mock Data ---

const MOCK_RIDE_DETAILS: RideDetailData = {
  id: "RIDE-894201",
  status: "completed",
  created_at: "2026-07-28T09:15:00Z",
  departure_time: "2026-07-29T07:30:00Z",
  estimated_arrival: "2026-07-29T11:45:00Z",
  source_address: "Jayadev Vihar, Bhubaneswar, Odisha",
  destination_address: "Chandi Chhak, Cuttack, Odisha",
  distance_km: 28.5,
  estimated_duration: "45 mins",
  total_seats: 4,
  available_seats: 1,
  price_per_seat: 150,
  vehicle: {
    model: "Hyundai Verna",
    plate_number: "OD-02-AX-4821",
    color: "Polar White",
    type: "Sedan",
  },
  driver: {
    id: "DRV-1042",
    name: "Rajesh Kumar Sahoo",
    phone: "+91 98765 43210",
    email: "rajesh.sahoo@example.com",
    rating: 4.85,
    total_completed_rides: 142,
  },
  financials: {
    total_revenue: 450,
    platform_commission: 45,
    driver_payout: 405,
    tax_collected: 22.5,
  },
  bookings: [
    {
      id: "BKG-7710",
      passenger_name: "Amitav Patnaik",
      phone: "+91 91234 56789",
      seats_booked: 2,
      pickup_stop: "Jayadev Vihar Square",
      dropoff_stop: "Cuttack Netaji Bus Terminal",
      amount_paid: 300,
      booking_status: "confirmed",
      payment_status: "paid",
      payment_method: "UPI (Google Pay)",
      transaction_id: "TXN_9923847101",
      booked_at: "2026-07-28T14:20:00Z",
    },
    {
      id: "BKG-7712",
      passenger_name: "Priyanka Dash",
      phone: "+91 98111 22334",
      seats_booked: 1,
      pickup_stop: "Acharya Vihar",
      dropoff_stop: "Chandi Chhak",
      amount_paid: 150,
      booking_status: "confirmed",
      payment_status: "paid",
      payment_method: "UPI (PhonePe)",
      transaction_id: "TXN_9923851192",
      booked_at: "2026-07-28T18:05:00Z",
    },
  ],
  timeline: [
    {
      event: "Ride Published",
      timestamp: "28 Jul 2026, 09:15 AM",
      description: "Driver published the ride schedule.",
    },
    {
      event: "First Booking Confirmed",
      timestamp: "28 Jul 2026, 02:20 PM",
      description: "Amitav Patnaik booked 2 seats via UPI.",
    },
    {
      event: "Second Booking Confirmed",
      timestamp: "28 Jul 2026, 06:05 PM",
      description: "Priyanka Dash booked 1 seat via UPI.",
    },
    {
      event: "Ride Started",
      timestamp: "29 Jul 2026, 07:32 AM",
      description: "Driver started the trip from Jayadev Vihar.",
    },
    {
      event: "Ride Completed",
      timestamp: "29 Jul 2026, 08:20 AM",
      description: "Driver ended trip. Final payout queued.",
    },
  ],
};

// --- Helper Badge Component ---

function StatusBadge({ status }: { status: RideStatus }) {
  const styles = {
    upcoming: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    in_transit: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    cancelled: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };

  const icons = {
    upcoming: <Clock className="w-3.5 h-3.5" />,
    in_transit: <Navigation className="w-3.5 h-3.5" />,
    completed: <CheckCircle2 className="w-3.5 h-3.5" />,
    cancelled: <XCircle className="w-3.5 h-3.5" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize border ${styles[status]}`}
    >
      {icons[status]}
      {status.replace("_", " ")}
    </span>
  );
}

// --- Main Page Component ---

export default function RideDetailsPage() {
  const [ride] = useState<RideDetailData>(MOCK_RIDE_DETAILS);

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
                <StatusBadge status={ride.status} />
              </div>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                ID: #{ride.id} • Created on {new Date(ride.created_at).toLocaleDateString("en-GB")}
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
                <Navigation className="w-4 h-4 text-blue-500" /> Route & Schedule
              </h2>

              <div className="relative pl-6 border-l-2 border-dashed border-slate-200 dark:border-white/10 space-y-6">
                {/* Source */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 p-1 rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-500">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase text-slate-400">Pickup Location</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {ride.source_address}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Scheduled:{" "}
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {new Date(ride.departure_time).toLocaleString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Destination */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 p-1 rounded-full bg-rose-500/10 border border-rose-500 text-rose-500">
                    <MapPinOff className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase text-slate-400">Dropoff Location</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {ride.destination_address}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Estimated Arrival:{" "}
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {new Date(ride.estimated_arrival).toLocaleString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Ride Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200/60 dark:border-white/5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Distance</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                    {ride.distance_km} km
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Est. Duration</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                    {ride.estimated_duration}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Seat Price</p>
                  <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    ₹{ride.price_per_seat}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Occupancy</p>
                  <p className="text-sm font-black text-blue-600 dark:text-blue-400 mt-0.5">
                    {ride.total_seats - ride.available_seats} / {ride.total_seats} seats
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
                  <Users className="w-4 h-4 text-purple-500" /> Passenger Bookings ({ride.bookings.length})
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/80 dark:border-white/10 text-slate-400 font-extrabold uppercase tracking-wider">
                      <th className="py-3 px-2">Passenger</th>
                      <th className="py-3 px-2">Seats</th>
                      <th className="py-3 px-2">Pickup / Drop</th>
                      <th className="py-3 px-2">Paid</th>
                      <th className="py-3 px-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {ride.bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01]">
                        <td className="py-3.5 px-2">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {booking.passenger_name}
                          </p>
                          <p className="text-[11px] font-mono text-slate-400">{booking.phone}</p>
                        </td>
                        <td className="py-3.5 px-2 font-black text-slate-800 dark:text-slate-200">
                          {booking.seats_booked}
                        </td>
                        <td className="py-3.5 px-2 space-y-0.5">
                          <p className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[150px]">
                            <span className="text-emerald-500 font-bold">From:</span> {booking.pickup_stop}
                          </p>
                          <p className="text-slate-500 truncate max-w-[150px]">
                            <span className="text-rose-500 font-bold">To:</span> {booking.dropoff_stop}
                          </p>
                        </td>
                        <td className="py-3.5 px-2 font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                          ₹{booking.amount_paid}
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            {booking.booking_status}
                          </span>
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
                <Receipt className="w-4 h-4 text-emerald-500" /> Financial & Payout Breakup
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Revenue</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white">
                    ₹{ride.financials.total_revenue}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Platform Fee (10%)</p>
                  <p className="text-lg font-black text-blue-600 dark:text-blue-400">
                    ₹{ride.financials.platform_commission}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Driver Payout</p>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    ₹{ride.financials.driver_payout}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">GST / Tax</p>
                  <p className="text-lg font-black text-slate-700 dark:text-slate-300">
                    ₹{ride.financials.tax_collected}
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
                <span className="text-xs font-bold text-blue-500 flex items-center gap-1 cursor-pointer hover:underline">
                  View Profile <ExternalLink className="w-3 h-3" />
                </span>
              </div>

              {/* Driver Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black text-base">
                    {ride.driver.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {ride.driver.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      ★ {ride.driver.rating} • {ride.driver.total_completed_rides} rides
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-2">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ride.driver.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ride.driver.email}</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-2">
                <p className="text-[10px] font-extrabold uppercase text-slate-400">Assigned Vehicle</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {ride.vehicle.model} ({ride.vehicle.color})
                    </p>
                    <p className="text-[11px] font-mono text-slate-500">{ride.vehicle.type}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-mono text-xs font-black tracking-wider">
                    {ride.vehicle.plate_number}
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
                {ride.timeline.map((item, index) => (
                  <div key={index} className="relative text-xs">
                    <div className="absolute -left-[25px] top-1 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white dark:ring-[#121824]" />
                    <p className="font-bold text-slate-900 dark:text-white">{item.event}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                    <p className="text-[10px] font-mono text-slate-500 mt-1">{item.timestamp}</p>
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