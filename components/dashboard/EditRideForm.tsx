import React from "react";
import { 
  Activity, 
  IndianRupee, 
  Users, 
  MapPin, 
  Navigation 
} from "lucide-react";
import { RideListItem, RideStatus } from "@/types/rides.types"; // Adjust path as needed

interface EditRideFormProps {
  editFormData: Partial<RideListItem>;
  setEditFormData: React.Dispatch<React.SetStateAction<Partial<RideListItem>>>;
  handleUpdateRide: (e: React.FormEvent) => void;
}

export default function EditRideForm({
  editFormData,
  setEditFormData,
  handleUpdateRide,
}: EditRideFormProps) {
  return (
    <form id="edit-ride-form" onSubmit={handleUpdateRide} className="space-y-4 text-xs">
      {/* 1. Status Selection */}
      <div className="p-3.5 bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-1.5 transition-all">
        <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5 text-indigo-500" />
          Ride Status
        </label>
        <div className="relative">
          <select
            value={editFormData.status || ""}
            onChange={(e) =>
              setEditFormData({
                ...editFormData,
                status: e.target.value as RideStatus,
              })
            }
            className="w-full bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition cursor-pointer"
          >
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* 2. Pricing & Capacity Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Price Per Seat */}
        <div className="p-3.5 bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-500" />
            Price / Seat
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="0.00"
              value={editFormData.price_per_seat ?? ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  price_per_seat: Number(e.target.value),
                })
              }
              className="w-full bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-xl pl-8 pr-3 py-2.5 font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
              $
            </span>
          </div>
        </div>

        {/* Available Seats */}
        <div className="p-3.5 bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-blue-500" />
            Seats Left
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="1"
              value={editFormData.available_seats ?? ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  available_seats: Number(e.target.value),
                })
              }
              className="w-full bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
            />
          </div>
        </div>
      </div>

      {/* 3. Route Details Group */}
      <div className="p-3.5 bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-3">
        {/* Source Address */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            Pickup Location
          </label>
          <input
            type="text"
            placeholder="Enter full pickup address..."
            value={editFormData.source_address || ""}
            onChange={(e) =>
              setEditFormData({ ...editFormData, source_address: e.target.value })
            }
            className="w-full bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
          />
        </div>

        {/* Divider accent line */}
        <div className="h-px bg-gray-200/60 dark:bg-white/5" />

        {/* Destination Address */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
            <Navigation className="w-3.5 h-3.5 text-rose-500" />
            Destination
          </label>
          <input
            type="text"
            placeholder="Enter full destination address..."
            value={editFormData.destination_address || ""}
            onChange={(e) =>
              setEditFormData({ ...editFormData, destination_address: e.target.value })
            }
            className="w-full bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500 transition"
          />
        </div>
      </div>
    </form>
  );
}