'use client';

import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  ShieldAlert,
  Car,
  Calendar,
  CreditCard,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  FileText,
  TrendingUp,
  Download,
  ArrowUpRight,
  ChevronRight,
  Eye,
  Award,
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_USER = {
  id: 'usr_89234710',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  phone: '+1 (555) 382-9102',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
  role: 'Driver & Passenger',
  joinedDate: 'Oct 14, 2023',
  status: 'Active',
  isVerified: true,
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
  metrics: {
    totalEarned: 3420.50,
    totalSpent: 480.00,
    ridesPublished: 42,
    bookingsMade: 12,
    completionRate: '98%',
  },
  documents: [
    { id: 'doc_1', name: "Driver's License (Front & Back)", type: 'License', status: 'Verified', dateSubmitted: '2023-10-15', expiresAt: '2028-10-15' },
    { id: 'doc_2', name: 'Vehicle Insurance Policy', type: 'Insurance', status: 'Verified', dateSubmitted: '2023-10-16', expiresAt: '2025-05-10' },
    { id: 'doc_3', name: 'Government ID / Passport', type: 'Identity', status: 'Verified', dateSubmitted: '2023-10-15', expiresAt: '2031-01-20' },
    { id: 'doc_4', name: 'Vehicle Inspection Certificate', type: 'Inspection', status: 'Pending Review', dateSubmitted: '2026-07-01', expiresAt: '2027-07-01' },
  ],
  publishedRides: [
    {
      id: 'rd_901',
      origin: 'Seattle, WA',
      destination: 'Portland, OR',
      departure: 'Aug 02, 2026 • 08:00 AM',
      seatsTotal: 3,
      seatsBooked: 3,
      pricePerSeat: 35.00,
      totalEarned: 105.00,
      status: 'Scheduled',
    },
    {
      id: 'rd_882',
      origin: 'Portland, OR',
      destination: 'Seattle, WA',
      departure: 'Jul 25, 2026 • 05:30 PM',
      seatsTotal: 3,
      seatsBooked: 2,
      pricePerSeat: 35.00,
      totalEarned: 70.00,
      status: 'Completed',
    },
    {
      id: 'rd_751',
      origin: 'Seattle, WA',
      destination: 'Vancouver, BC',
      departure: 'Jul 10, 2026 • 09:00 AM',
      seatsTotal: 4,
      seatsBooked: 4,
      pricePerSeat: 45.00,
      totalEarned: 180.00,
      status: 'Completed',
    },
  ],
  bookings: [
    {
      id: 'bk_302',
      rideId: 'rd_411',
      driverName: 'Sarah Jenkins',
      origin: 'Seattle, WA',
      destination: 'Tacoma, WA',
      date: 'Jun 18, 2026',
      seats: 1,
      amountPaid: 18.00,
      status: 'Completed',
      paymentMethod: 'Visa •••• 4242',
    },
    {
      id: 'bk_219',
      rideId: 'rd_380',
      driverName: 'Michael Chen',
      origin: 'Olympia, WA',
      destination: 'Seattle, WA',
      date: 'May 04, 2026',
      seats: 2,
      amountPaid: 42.00,
      status: 'Completed',
      paymentMethod: 'Apple Pay',
    },
  ],
  payments: [
    { id: 'tx_9910', type: 'Payout', description: 'Earnings payout for Ride #rd_882', amount: 70.00, status: 'Completed', date: 'Jul 26, 2026', ref: 'PO-88219' },
    { id: 'tx_9841', type: 'Ride Payment', description: 'Booking payment for Ride #rd_411', amount: -18.00, status: 'Completed', date: 'Jun 18, 2026', ref: 'BK-30211' },
    { id: 'tx_9720', type: 'Payout', description: 'Earnings payout for Ride #rd_751', amount: 180.00, status: 'Completed', date: 'Jul 11, 2026', ref: 'PO-75102' },
    { id: 'tx_9501', type: 'Refund', description: 'Cancelled booking refund #bk_109', amount: 25.00, status: 'Completed', date: 'Apr 12, 2026', ref: 'RF-10900' },
  ],
};

export default function UserDetailsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'rides' | 'bookings' | 'documents' | 'payments'>('overview');
  const user = MOCK_USER;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* TOP HEADER / USER SUMMARY BAR */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-500/30"
                />
                {user.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-white dark:ring-slate-900" title="Verified Driver">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    {user.status}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {user.role}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" /> {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" /> {user.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Joined {user.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-200 dark:border-slate-800">
              <button className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                Edit User
              </button>
              <button className="px-4 py-2 text-sm font-medium rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 transition-opacity">
                Suspend Account
              </button>
            </div>
          </div>
        </div>

        {/* METRICS SUMMARY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm">
              <span>Total Earned</span>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold mt-2">${user.metrics.totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> Platform revenue share generated
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm">
              <span>Total Spent</span>
              <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold mt-2">${user.metrics.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <div className="text-xs text-slate-500 mt-1">Across {user.metrics.bookingsMade} rides booked</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm">
              <span>Rides Published</span>
              <div className="p-2 bg-purple-50 dark:bg-purple-950/50 rounded-xl text-purple-600 dark:text-purple-400">
                <Car className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold mt-2">{user.metrics.ridesPublished}</div>
            <div className="text-xs text-slate-500 mt-1">{user.metrics.completionRate} trip completion rate</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm">
              <span>Driver Rating</span>
              <div className="p-2 bg-amber-50 dark:bg-amber-950/50 rounded-xl text-amber-600 dark:text-amber-400">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold mt-2">★ {user.rating}</div>
            <div className="text-xs text-slate-500 mt-1">Based on {user.totalReviews} total reviews</div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'rides', label: `Published Rides (${user.publishedRides.length})` },
            { id: 'bookings', label: `Bookings (${user.bookings.length})` },
            { id: 'documents', label: `Documents (${user.documents.length})` },
            { id: 'payments', label: 'Transactions & Payouts' },
          ].map((tab) => (
            <button
              key={tab.id}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h2 className="text-lg font-bold">About {user.name}</h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{user.bio}</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Car className="w-5 h-5 text-emerald-500" /> Vehicle Profile
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-xs text-slate-400 block">Make & Model</span>
                    <span className="font-semibold">{user.vehicle.make} {user.vehicle.model}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-xs text-slate-400 block">Year</span>
                    <span className="font-semibold">{user.vehicle.year}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-xs text-slate-400 block">Color</span>
                    <span className="font-semibold">{user.vehicle.color}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-xs text-slate-400 block">License Plate</span>
                    <span className="font-semibold tracking-wider font-mono">{user.vehicle.plate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h2 className="text-lg font-bold">Verification Quick Check</h2>
                <div className="space-y-3">
                  {user.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-200">{doc.type}</span>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                        doc.status === 'Verified' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' 
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                      }`}>
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
        {activeTab === 'rides' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold">Rides Created by {user.name}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Route</th>
                    <th className="p-4">Departure</th>
                    <th className="p-4">Bookings</th>
                    <th className="p-4">Seat Price</th>
                    <th className="p-4">Earnings</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {user.publishedRides.map((ride) => (
                    <tr key={ride.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-4 font-medium">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{ride.origin} → {ride.destination}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-500">{ride.departure}</td>
                      <td className="p-4">{ride.seatsBooked} / {ride.seatsTotal} seats</td>
                      <td className="p-4 font-semibold">${ride.pricePerSeat.toFixed(2)}</td>
                      <td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400">${ride.totalEarned.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          ride.status === 'Completed' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                        }`}>
                          {ride.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold">Passenger Bookings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Route</th>
                    <th className="p-4">Driver</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Seats</th>
                    <th className="p-4">Paid</th>
                    <th className="p-4">Payment Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {user.bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-4 font-medium">{booking.origin} → {booking.destination}</td>
                      <td className="p-4">{booking.driverName}</td>
                      <td className="p-4 text-slate-500">{booking.date}</td>
                      <td className="p-4">{booking.seats} seat(s)</td>
                      <td className="p-4 font-semibold">${booking.amountPaid.toFixed(2)}</td>
                      <td className="p-4 text-slate-500">{booking.paymentMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold">Submitted Identity & Compliance Verification</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.documents.map((doc) => (
                <div key={doc.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-sm">{doc.name}</span>
                    </div>
                    <p className="text-xs text-slate-400">Submitted: {doc.dateSubmitted} • Expires: {doc.expiresAt}</p>
                    <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      doc.status === 'Verified' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold">Transaction History</h2>
              <button className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Reference</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {user.payments.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-4 font-mono text-xs text-slate-400">{tx.ref}</td>
                      <td className="p-4 font-medium">{tx.type}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{tx.description}</td>
                      <td className="p-4 text-slate-500">{tx.date}</td>
                      <td className={`p-4 font-bold ${tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}