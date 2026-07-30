'use client';

import { useState } from 'react';
import {
  Mail,
  Phone,
  ShieldCheck,
  Car,
  Calendar,
  CreditCard,
  DollarSign,
  MapPin,
  FileText,
  TrendingUp,
  Download,
  Eye,
  Award,
  Loader2,
  AlertCircle,
  Hash,
  Fuel,
  CheckCircle2,
} from 'lucide-react';
import { useParams, useRouter } from "next/navigation";
import userService from '@/services/userService';
import RideService from '@/services/ride.service';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { vehicleService } from '@/services/vehicle.service';



const MOCK_PAYMENTS = [
  {
    id: 'tx_9910',
    type: 'Payout',
    description: 'Earnings payout for Ride #rd_882',
    amount: 70.0,
    status: 'Completed',
    date: 'Jul 26, 2026',
    ref: 'PO-88219',
  },
  {
    id: 'tx_9841',
    type: 'Ride Payment',
    description: 'Booking payment for Ride #rd_411',
    amount: -18.0,
    status: 'Completed',
    date: 'Jun 18, 2026',
    ref: 'BK-30211',
  },
];

type TabType = 'overview' | 'rides' | 'bookings' | "vehicles" | 'documents' | 'payments';

export default function UserDetailsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [payments, setPayments] = useState<typeof MOCK_PAYMENTS>([]);
  const [tabLoading, setTabLoading] = useState<boolean>(false);
  const [tabError, setTabError] = useState<string | null>(null);
  const router = useRouter();

  const params = useParams();

  const userId = params.id as string;


  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => userService.getUserDetails(userId),
    enabled: !!userId,
  });

  const {
    data: publishedRides = [],
    isLoading: publishedRidesLoading,
    isError: publishedRidesError,
    error: publishedRidesErrorData,
  } = useQuery({
    queryKey: ["user", userId, "published-rides"],
    queryFn: () => RideService.getRidesByDriverId(userId),
    enabled: !!userId && activeTab === "rides",
  });

  const {
    data: bookedRides = [],
    isLoading: bookedRidesLoading,
    isError: bookedRidesError,
    error: bookedRidesErrorData,
  } = useQuery({
    queryKey: ["user", userId, "booked-rides"],
    queryFn: () => RideService.getRidesByPassengerId(userId),
    enabled: !!userId && activeTab === "bookings",
  });
  
  const {
    data: vehiclesResponse,
    isLoading: vehiclesLoading,
    isError: vehiclesError,
    error: vehiclesErrorData,
  } = useQuery({
    queryKey: ["user", userId, "vehicles"],
    queryFn: () => vehicleService.getVehiclesByUserId(userId),
    enabled: !!userId && activeTab === "vehicles",
  });

  const vehicles = vehiclesResponse?.data ?? [];


  // Fallback Mock Metrics / Bio (To be updated via backend later)
  const mockMetrics = {
    totalEarned: 3420.5,
    totalSpent: 480.0,
    ridesPublished: 42,
    bookingsMade: 12,
    completionRate: '98%',
    rating: 4.9,
    totalReviews: 84,
    bio: 'Frequent commuter between Seattle and Portland. Love quiet rides and punctual co-travelers.',
    vehicle: {
      make: 'Tesla',
      model: 'Model 3',
      year: '2023',
      plate: '7XYZ89',
      color: 'Midnight Silver',
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] dark:bg-black text-slate-900 dark:text-white p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />

          <p className="text-sm text-slate-500">
            Loading user details...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !userData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 mx-auto text-red-500 mb-3" />

          <h2 className="text-lg font-bold">
            Unable to load user
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            {error instanceof Error
              ? error.message
              : "User details could not be found."}
          </p>
        </div>
      </div>
    );
  }


  // Map API user_details to the Documents Tab structure dynamically
  const userDocuments = [
    {
      id: "doc_dl",
      name: "Driver's License",
      type: "License",
      status: userData.user_details.is_dl_verified,
      url: userData.user_details.driver_license,
    },
    {
      id: "doc_aadhaar",
      name: "Aadhaar Card",
      type: "Identity",
      status: userData.user_details.is_adhhar_verified,
      url: userData.user_details.adhhar_card,
    },
    {
      id: "doc_pan",
      name: "PAN Card",
      type: "Tax ID",
      status: userData.user_details.is_pan_verified,
      url: userData.user_details.pan_card,
    },
    {
      id: "doc_bank",
      name: `Bank Passbook / Cheque (${userData.user_details.bank_name})`,
      type: "Financial",
      status: userData.user_details.is_account_verified,
      url: userData.user_details.bank_account,
    },
  ];


  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* TOP HEADER / USER SUMMARY BAR */}
        <div className="bg-white bg-white dark:bg-[#050505] rounded-2xl border border-slate-200 dark:border-white/15 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <Image
                  src={userData.profile_picture || "/images/default_avatar.webp"}
                  alt={userData.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-emerald-500/30"
                  priority
                />
                {userData.verification_status.toLowerCase() === 'verified' && (
                  <div
                    className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-white dark:ring-slate-900"
                    title="Verified User"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold tracking-tight capitalize">{userData.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    {capitalize(userData.status)}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {userData.role}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {userData.custom_id}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" /> {userData.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" /> {userData.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Joined{' '}
                    {new Date(userData.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-200 dark:border-white/15">
              <button className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                Edit User
              </button>
              <button className="px-4 py-2 text-sm font-medium rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 transition-opacity">
                Suspend Account
              </button>
            </div>
          </div>
        </div>

        {/* METRICS SUMMARY GRID (Using Mock Fallbacks for UI completeness) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white bg-white dark:bg-[#050505] p-5 rounded-2xl border border-slate-200 dark:border-white/15 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm">
              <span>Total Earned</span>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold mt-2">
              ₹{mockMetrics.totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> Platform revenue share generated
            </div>
          </div>

          <div className="bg-white dark:bg-[#050505] p-5 rounded-2xl border border-slate-200 dark:border-white/15 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm">
              <span>Total Spent</span>
              <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold mt-2">
              ₹{mockMetrics.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Across {mockMetrics.bookingsMade} rides booked
            </div>
          </div>

          <div className="bg-white dark:bg-[#050505] p-5 rounded-2xl border border-slate-200 dark:border-white/15 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm">
              <span>Rides Published</span>
              <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-500">
                <Car className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold mt-2">{mockMetrics.ridesPublished}</div>
            <div className="text-xs text-slate-500 mt-1">
              {mockMetrics.completionRate} trip completion rate
            </div>
          </div>

          <div className="bg-white dark:bg-[#050505] p-5 rounded-2xl border border-slate-200 dark:border-white/15 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm">
              <span>Driver Rating</span>
              <div className="p-2 bg-amber-50 dark:bg-amber-950/50 rounded-xl text-amber-600 dark:text-amber-400">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold mt-2">★ {mockMetrics.rating}</div>
            <div className="text-xs text-slate-500 mt-1">
              Based on {mockMetrics.totalReviews} total reviews
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/15 overflow-x-auto pb-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'rides', label: 'Published Rides' },
            { id: 'bookings', label: 'Bookings' },
            { id: "vehicles", label: "Vehicles" },
            { id: 'documents', label: `Documents (${userDocuments.length})` },
            { id: 'payments', label: 'Transactions & Payouts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-2.5 text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${activeTab === tab.id
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>



        {/* TAB CONTENTS */}
        {!tabLoading && !tabError && (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white bg-white dark:bg-[#050505] p-6 rounded-2xl border border-slate-200 dark:border-white/15 shadow-sm space-y-4">
                    <h2 className="text-lg font-bold">Address & Contact Information</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <span className="text-xs text-slate-400 block">Address</span>
                        <span className="font-semibold">{userData.user_details.address}</span>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <span className="text-xs text-slate-400 block">City & State</span>
                        <span className="font-semibold">
                          {userData.user_details.city}, {userData.user_details.state}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <span className="text-xs text-slate-400 block">Country</span>
                        <span className="font-semibold">{userData.user_details.country}</span>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <span className="text-xs text-slate-400 block">Postal Code</span>
                        <span className="font-semibold">{userData.user_details.postal_code}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#050505] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-cyan-500" />
                          <h2 className="text-lg font-bold">
                            Account Details
                          </h2>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">
                          Registered payout account
                        </p>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${userData.user_details.is_account_verified === "verified"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-amber-500/10 text-amber-500"
                          }`}
                      >
                        {userData.user_details.is_account_verified}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/3 border border-slate-200 dark:border-white/5">
                        <span className="text-[11px] text-slate-400 block mb-1">
                          Account Holder
                        </span>

                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {userData.user_details.bank_account_holder || "N/A"}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/3 border border-slate-200 dark:border-white/5">
                        <span className="text-[11px] text-slate-400 block mb-1">
                          Bank
                        </span>

                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {userData.user_details.bank_name || "N/A"}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/3 border border-slate-200 dark:border-white/5">
                        <span className="text-[11px] text-slate-400 block mb-1">
                          Account Number
                        </span>

                        <span className="text-sm font-mono font-semibold text-slate-900 dark:text-white">
                          {userData.user_details.bank_account_number
                            ? `•••• ${userData.user_details.bank_account_number.slice(-4)}`
                            : "N/A"}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/3 border border-slate-200 dark:border-white/5">
                        <span className="text-[11px] text-slate-400 block mb-1">
                          IFSC
                        </span>

                        <span className="text-sm font-mono font-semibold text-slate-900 dark:text-white uppercase">
                          {userData.user_details.bank_account_ifsc || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white dark:bg-[#050505] p-6 rounded-2xl border border-slate-200 dark:border-white/15 shadow-sm space-y-4">
                    <h2 className="text-lg font-bold">Verification Quick Check</h2>
                    <div className="space-y-3">
                      {userDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm"
                        >
                          <span className="font-medium text-slate-700 dark:text-slate-200">
                            {doc.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-xs font-semibold capitalize ${doc.status === 'verified'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                              }`}
                          >
                            {doc.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RIDES PUBLISHED TAB */}
            {activeTab === "rides" && (
              <div className="bg-white dark:bg-[#050505] rounded-2xl border border-slate-200 dark:border-white/15 shadow-sm overflow-hidden">

                <div className="p-6 border-b border-slate-200 dark:border-white/15">
                  <h2 className="text-lg font-bold">
                    Rides Created by {userData.name}
                  </h2>
                </div>

                {publishedRidesLoading ? (
                  <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />

                    <p className="text-sm font-medium">
                      Loading published rides...
                    </p>
                  </div>
                ) : publishedRidesError ? (
                  <div className="p-8 text-center">
                    <AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-3" />

                    <p className="text-sm font-medium text-red-500">
                      {publishedRidesErrorData instanceof Error
                        ? publishedRidesErrorData.message
                        : "Failed to load published rides."}
                    </p>
                  </div>
                ) : publishedRides.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                    <Car className="w-10 h-10 mx-auto mb-3 opacity-40" />

                    <p className="text-sm font-medium">
                      No published rides found.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-white/15">
                        <tr>
                          <th className="p-4">Route</th>
                          <th className="p-4">Departure</th>
                          <th className="p-4">Seats</th>
                          <th className="p-4">Vehicle</th>
                          <th className="p-4">Price / Seat</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {publishedRides.map((ride) => {
                          const bookedSeats =
                            ride.total_seats - ride.available_seats;

                          return (
                            <tr
                              key={ride.id}
                              onClick={() => {
                                  router.push(`/rides/${ride.id}`);
                                }}
                              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 cursor-pointer"
                            >
                              {/* Route */}
                              <td className="p-4 font-medium">
                                <div className="flex items-start gap-2">
                                  <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />

                                  <div className="min-w-0">
                                    <p className="truncate">
                                      {ride.source_address}
                                    </p>

                                    <p className="text-xs text-slate-400 mt-1">
                                      → {ride.destination_address}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Departure */}
                              <td className="p-4">
                                <div className="font-medium">
                                  {new Date(
                                    ride.ride_date
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </div>

                                <div className="text-xs text-slate-500 mt-1">
                                  {ride.departure_time}
                                </div>
                              </td>

                              {/* Seats */}
                              <td className="p-4">
                                <div className="font-medium">
                                  {bookedSeats} / {ride.total_seats}
                                </div>

                                <div className="text-xs text-slate-400">
                                  {ride.available_seats} available
                                </div>
                              </td>

                              {/* Vehicle */}
                              <td className="p-4">
                                <div className="font-medium">
                                  {ride.vehicle_model}
                                </div>

                                <div className="text-xs text-slate-400 font-mono">
                                  {ride.vehicle_registration_number}
                                </div>

                                <div className="text-[11px] text-slate-400 capitalize mt-0.5">
                                  {ride.vehicle_fuel_type}
                                </div>
                              </td>

                              {/* Price */}
                              <td className="p-4 font-semibold">
                                ${Number(ride.price_per_seat).toFixed(2)}
                              </td>

                              {/* Status */}
                              <td className="p-4">
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 capitalize">
                                  {ride.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === "bookings" && (
              <div className="bg-white bg-white dark:bg-[#050505] rounded-2xl border border-slate-200 dark:border-white/15 shadow-sm overflow-hidden">

                <div className="p-6 border-b border-slate-200 dark:border-white/15">
                  <h2 className="text-lg font-bold">
                    Passenger Bookings
                  </h2>
                </div>

                {bookedRidesLoading ? (
                  <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />

                    <p className="text-sm font-medium">
                      Loading booked rides...
                    </p>
                  </div>
                ) : bookedRidesError ? (
                  <div className="p-8 text-center">
                    <AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-3" />

                    <p className="text-sm font-medium text-red-500">
                      {bookedRidesErrorData instanceof Error
                        ? bookedRidesErrorData.message
                        : "Failed to load booked rides."}
                    </p>
                  </div>
                ) : bookedRides.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                    <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />

                    <p className="text-sm font-medium">
                      No booked rides found.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-white/15">
                        <tr>
                          <th className="p-4">Route</th>
                          <th className="p-4">Driver</th>
                          <th className="p-4">Departure</th>
                          <th className="p-4">Seats</th>
                          <th className="p-4">Total</th>
                          <th className="p-4">Ride Status</th>
                          <th className="p-4">Booking Status</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {bookedRides.map((booking) => {
                          const totalPrice =
                            Number(booking.price_per_seat) *
                            booking.seats;

                          return (
                            <tr
                              key={booking.booking_id}
                              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                            >
                              {/* Route */}
                              <td className="p-4 font-medium">
                                <div className="flex items-start gap-2">
                                  <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />

                                  <div className="min-w-0">
                                    <p className="truncate">
                                      {booking.source_address}
                                    </p>

                                    <p className="text-xs text-slate-400 mt-1">
                                      → {booking.destination_address}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Driver */}
                              <td className="p-4">
                                <div className="font-medium">
                                  {booking.driver_name}
                                </div>

                                <div className="text-xs text-slate-400 mt-1">
                                  {booking.driver_phone}
                                </div>
                              </td>

                              {/* Departure */}
                              <td className="p-4">
                                <div className="font-medium">
                                  {new Date(
                                    booking.ride_date
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </div>

                                <div className="text-xs text-slate-500 mt-1">
                                  {booking.departure_time}
                                </div>
                              </td>

                              {/* Seats */}
                              <td className="p-4">
                                {booking.seats}
                              </td>

                              {/* Total */}
                              <td className="p-4 font-semibold">
                                ${totalPrice.toFixed(2)}
                              </td>

                              {/* Ride Status */}
                              <td className="p-4">
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 capitalize">
                                  {booking.ride_status}
                                </span>
                              </td>

                              {/* Booking Status */}
                              <td className="p-4">
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 capitalize">
                                  {booking.booking_status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* VEHICLES TAB */}
            {activeTab === "vehicles" && (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
                        <Car className="w-4 h-4" />
                      </div>

                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Registered Vehicles
                      </h2>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">
                      Vehicles registered to {userData.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold border border-cyan-500/10">
                      {vehicles.length}{" "}
                      {vehicles.length === 1 ? "Vehicle" : "Vehicles"}
                    </span>
                  </div>
                </div>

                {/* Loading */}
                {vehiclesLoading && (
                  <div className="bg-white dark:bg-[#050505] border border-slate-200 dark:border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center gap-3">
                    <div className="p-3 rounded-2xl bg-cyan-500/10">
                      <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Loading vehicles
                      </p>

                      <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">
                        Fetching registered vehicles for this user...
                      </p>
                    </div>
                  </div>
                )}

                {/* Error */}
                {vehiclesError && !vehiclesLoading && (
                  <div className="bg-white dark:bg-[#050505] border border-rose-200 dark:border-rose-500/20 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 shrink-0">
                        <AlertCircle className="w-5 h-5" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          Unable to load vehicles
                        </p>

                        <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">
                          {vehiclesErrorData instanceof Error
                            ? vehiclesErrorData.message
                            : "Something went wrong while fetching vehicles."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!vehiclesLoading &&
                  !vehiclesError &&
                  vehicles.length === 0 && (
                    <div className="bg-white dark:bg-[#050505] border border-slate-200 dark:border-white/10 rounded-2xl p-10 text-center">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                        <Car className="w-6 h-6" />
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-4">
                        No vehicles registered
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1 max-w-sm mx-auto">
                        This user has not added any vehicles to their account yet.
                      </p>
                    </div>
                  )}

                {/* Vehicle Cards */}
                {!vehiclesLoading &&
                  !vehiclesError &&
                  vehicles.length > 0 && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {vehicles.map((vehicle) => (
                        <div
                          key={vehicle.id}
                          className="
                group
                bg-white dark:bg-[#050505]
                border border-slate-200 dark:border-white/10
                rounded-2xl
                p-5
                shadow-sm
                hover:shadow-md
                hover:border-cyan-500/30
                dark:hover:border-cyan-400/30
                transition-all duration-200
              "
                        >
                          {/* Card Header */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-blue-500/10 text-cyan-500 flex items-center justify-center shrink-0 border border-cyan-500/10">
                                <Car className="w-5 h-5" />
                              </div>

                              <div className="min-w-0">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                  {vehicle.model || "Unknown Model"}
                                </h3>

                                <div className="flex items-center gap-2 mt-1">
                                  <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                                  <span className="text-xs font-mono font-semibold text-slate-500 dark:text-zinc-400 uppercase truncate">
                                    {vehicle.registration_number || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Status */}
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold capitalize shrink-0 ${vehicle.status?.toLowerCase() === "active"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-slate-500/10 text-slate-500 dark:text-zinc-400"
                                }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${vehicle.status?.toLowerCase() === "active"
                                  ? "bg-emerald-500"
                                  : "bg-slate-400"
                                  }`}
                              />

                              {vehicle.status || "Unknown"}
                            </span>
                          </div>

                          {/* Divider */}
                          <div className="my-4 border-t border-slate-200 dark:border-white/5" />

                          {/* Details */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {/* Fuel */}
                            <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-3">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <Fuel className="w-3.5 h-3.5 text-cyan-500" />

                                <span className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">
                                  Fuel
                                </span>
                              </div>

                              <p className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
                                {vehicle.fuel_type || "N/A"}
                              </p>
                            </div>

                            {/* Color */}
                            <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-3">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span
                                  className="w-3 h-3 rounded-full border border-slate-300 dark:border-white/20"
                                  style={{
                                    backgroundColor:
                                      vehicle.color?.toLowerCase() || "transparent",
                                  }}
                                />

                                <span className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">
                                  Color
                                </span>
                              </div>

                              <p className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
                                {vehicle.color || "N/A"}
                              </p>
                            </div>

                            {/* Vehicle ID */}
                            <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-3">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />

                                <span className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">
                                  Vehicle ID
                                </span>
                              </div>

                              <p className="text-sm font-mono font-semibold text-slate-900 dark:text-white">
                                #{vehicle.id}
                              </p>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200 dark:border-white/5">
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                              <Calendar className="w-3.5 h-3.5" />

                              Added{" "}
                              {new Date(vehicle.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </div>

                            <span className="text-[11px] font-medium text-slate-400 group-hover:text-cyan-500 transition-colors">
                              Registered Vehicle
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            )}

            {/* DOCUMENTS TAB */}
            {activeTab === 'documents' && (
              <div className=" bg-white dark:bg-[#050505] rounded-2xl border border-slate-200 dark:border-white/15 shadow-sm p-6 space-y-4">
                <h2 className="text-lg font-bold">Submitted Identity & Compliance Verification</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-white/15 flex items-start justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold text-sm">{doc.name}</span>
                        </div>
                        <span
                          className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${doc.status === 'verified'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                            }`}
                        >
                          {doc.status}
                        </span>
                      </div>
                      {doc.url && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                          title="View Document"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PAYMENTS TAB */}
            {activeTab === 'payments' && (
              <div className="bg-white bg-white dark:bg-[#050505] rounded-2xl border border-slate-200 dark:border-white/15 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-white/15 flex justify-between items-center">
                  <h2 className="text-lg font-bold">Transaction History</h2>
                  <button className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-white/15">
                      <tr>
                        <th className="p-4">Reference</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Description</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {payments.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="p-4 font-mono text-xs text-slate-400">{tx.ref}</td>
                          <td className="p-4 font-medium">{tx.type}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-300">
                            {tx.description}
                          </td>
                          <td className="p-4 text-slate-500">{tx.date}</td>
                          <td
                            className={`p-4 font-bold ${tx.amount > 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-800 dark:text-slate-200'
                              }`}
                          >
                            {tx.amount > 0
                              ? `+$${tx.amount.toFixed(2)}`
                              : `-$${Math.abs(tx.amount).toFixed(2)}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}