import React, { useState } from "react";
import { 
  X, 
  Activity, 
  IndianRupee, 
  Users, 
  MapPin, 
  Navigation, 
  User, 
  Car, 
  Calendar, 
  Clock, 
  CheckCircle,
  Plus 
} from "lucide-react";
import { CreateRidePayload } from "@/types/rides.types";

export interface RoutePoint {
  lat: number;
  lng: number;
  address?: string;
}

interface CreateRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRidePayload) => void;
  isLoading?: boolean;
}

const initialFormState: CreateRidePayload = {
  driver_id: 0,
  vehicle_id: 0,
  source_address: "",
  destination_address: "",
  ride_date: new Date().toISOString().split("T")[0],
  departure_time: "09:00",
  price_per_seat: 100,
  total_seats: 4,
  available_seats: 4,
  status: "scheduled",
  pet_allowed: "no",
  smoking_allowed: "no",
  instant_booking: "yes",
  max_two_in_back: "yes",
};

export default function CreateRideModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateRideModalProps) {
  const [formData, setFormData] = useState<CreateRidePayload>(initialFormState);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleResetAndClose = () => {
    setFormData(initialFormState);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/10 text-blue-600 rounded-xl">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Create Manual Ride
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Schedule a new carpool ride directly
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs overflow-y-auto">
          {/* Driver & Vehicle Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                <User className="w-3.5 h-3.5 text-blue-500" />
                Driver ID
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 101"
                value={formData.driver_id || ""}
                onChange={(e) =>
                  setFormData({ ...formData, driver_id: Number(e.target.value) })
                }
                className="w-full bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
              />
            </div>

            <div className="p-3.5 bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                <Car className="w-3.5 h-3.5 text-indigo-500" />
                Vehicle ID
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 45"
                value={formData.vehicle_id || ""}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle_id: Number(e.target.value) })
                }
                className="w-full bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Route Details */}
          <div className="p-3.5 bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-3">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                Source Address
              </label>
              <input
                type="text"
                required
                placeholder="Pickup address"
                value={formData.source_address}
                onChange={(e) =>
                  setFormData({ ...formData, source_address: e.target.value })
                }
                className="w-full bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
              />
            </div>

            <div className="h-px bg-gray-200/60 dark:bg-white/5" />

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                <Navigation className="w-3.5 h-3.5 text-rose-500" />
                Destination Address
              </label>
              <input
                type="text"
                required
                placeholder="Destination address"
                value={formData.destination_address}
                onChange={(e) =>
                  setFormData({ ...formData, destination_address: e.target.value })
                }
                className="w-full bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500 transition"
              />
            </div>
          </div>

          {/* Schedule Date & Departure Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                Ride Date
              </label>
              <input
                type="date"
                required
                value={formData.ride_date}
                onChange={(e) =>
                  setFormData({ ...formData, ride_date: e.target.value })
                }
                className="w-full bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition"
              />
            </div>

            <div className="p-3.5 bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-purple-500" />
                Departure Time
              </label>
              <input
                type="time"
                required
                value={formData.departure_time}
                onChange={(e) =>
                  setFormData({ ...formData, departure_time: e.target.value })
                }
                className="w-full bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition"
              />
            </div>
          </div>

          {/* Pricing, Seats, Status */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-1">
              <label className="flex items-center gap-1 text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase">
                <IndianRupee className="w-3 h-3 text-emerald-500" /> Price
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price_per_seat}
                onChange={(e) =>
                  setFormData({ ...formData, price_per_seat: Number(e.target.value) })
                }
                className="w-full bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-xl px-2.5 py-2 font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div className="p-3 bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-1">
              <label className="flex items-center gap-1 text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase">
                <Users className="w-3 h-3 text-blue-500" /> Total Seats
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.total_seats}
                onChange={(e) => {
                  const seats = Number(e.target.value);
                  setFormData({
                    ...formData,
                    total_seats: seats,
                    available_seats: seats,
                  });
                }}
                className="w-full bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-xl px-2.5 py-2 font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div className="p-3 bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-1">
              <label className="flex items-center gap-1 text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase">
                <Activity className="w-3 h-3 text-indigo-500" /> Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  setFormData({ ...formData, status: e.target.value as any })
                }
                className="w-full bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-xl px-2 py-2 font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Preferences & Rules Options */}
          <div className="p-3.5 bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-2.5">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              Ride Preferences
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-500 dark:text-gray-400 mb-1">Instant Booking</label>
                <select
                  value={formData.instant_booking}
                  onChange={(e) => setFormData({ ...formData, instant_booking: e.target.value as "yes" | "no" })}
                  className="w-full bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-xl p-2 font-semibold"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-500 dark:text-gray-400 mb-1">Max 2 in Back</label>
                <select
                  value={formData.max_two_in_back}
                  onChange={(e) => setFormData({ ...formData, max_two_in_back: e.target.value as "yes" | "no" })}
                  className="w-full bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-xl p-2 font-semibold"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-500 dark:text-gray-400 mb-1">Pet Allowed</label>
                <select
                  value={formData.pet_allowed}
                  onChange={(e) => setFormData({ ...formData, pet_allowed: e.target.value as "yes" | "no" })}
                  className="w-full bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-xl p-2 font-semibold"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-500 dark:text-gray-400 mb-1">Smoking Allowed</label>
                <select
                  value={formData.smoking_allowed}
                  onChange={(e) => setFormData({ ...formData, smoking_allowed: e.target.value as "yes" | "no" })}
                  className="w-full bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-xl p-2 font-semibold"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleResetAndClose}
              className="px-4 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Ride"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}