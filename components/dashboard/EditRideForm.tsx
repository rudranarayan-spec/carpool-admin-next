import React from "react";
import { 
  Activity, 
  IndianRupee, 
  Users, 
  Clock, 
  PlayCircle, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Plus,
  Minus 
} from "lucide-react";
import { UpdateRidePayload, RideStatus } from "@/types/rides.types";

interface EditRideFormProps {
  editFormData: UpdateRidePayload;
  setEditFormData: React.Dispatch<React.SetStateAction<UpdateRidePayload>>;
  handleUpdateRide: (e: React.FormEvent) => void;
}

const STATUS_OPTIONS: { 
  value: RideStatus; 
  label: string; 
  icon: React.ElementType; 
  activeColor: string; 
}[] = [
  { value: "scheduled", label: "Scheduled", icon: Clock, activeColor: "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { value: "ongoing", label: "Ongoing", icon: PlayCircle, activeColor: "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { value: "completed", label: "Completed", icon: CheckCircle2, activeColor: "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { value: "cancelled", label: "Cancelled", icon: XCircle, activeColor: "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  { value: "expired", label: "Expired", icon: AlertCircle, activeColor: "border-gray-500 bg-gray-500/10 text-gray-600 dark:text-gray-400" },
];

export default function EditRideForm({
  editFormData,
  setEditFormData,
  handleUpdateRide,
}: EditRideFormProps) {

  const handleSeatChange = (delta: number) => {
    setEditFormData((prev) => {
      const current = prev.seat ?? 0;
      const nextValue = Math.max(0, current + delta);
      return { ...prev, seat: nextValue };
    });
  };

  return (
    <form id="edit-ride-form" onSubmit={handleUpdateRide} className="space-y-5 text-xs">
      
      {/* 1. Status Selector (Custom Chip Grid) */}
      <div className="p-4 bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-indigo-500" />
            Ride Status
          </label>
          <span className="text-[10px] text-gray-400 font-medium">Select current status</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {STATUS_OPTIONS.map((item) => {
            const Icon = item.icon;
            const isSelected = editFormData.status === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setEditFormData((prev) => ({
                    ...prev,
                    status: item.value,
                  }))
                }
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all duration-200 font-semibold active:scale-95 ${
                  isSelected
                    ? `${item.activeColor} shadow-xs font-bold border-2`
                    : "border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#12171F] text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "animate-pulse" : "text-gray-400"}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Pricing & Capacity Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* Price Per Seat */}
        <div className="p-4 bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-2">
          <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-500" />
            Price Per Seat
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-gray-400 font-bold text-sm select-none">
              ₹
            </span>
            <input
              type="number"
              min="0"
              step="0.5"
              placeholder="0.00"
              value={editFormData.price ?? ""}
              onChange={(e) =>
                setEditFormData((prev) => ({
                  ...prev,
                  price: e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
              className="w-full bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-xl pl-8 pr-3 py-2.5 font-bold text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition shadow-xs"
            />
          </div>
        </div>

        {/* Available Seats */}
        <div className="p-4 bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-2">
          <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-blue-500" />
            Seats Available
          </label>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleSeatChange(-1)}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#12171F] hover:bg-gray-100 dark:hover:bg-white/5 active:scale-95 text-gray-600 dark:text-gray-300 transition"
              title="Decrease seat count"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="number"
              min="0"
              placeholder="1"
              value={editFormData.seat ?? ""}
              onChange={(e) =>
                setEditFormData((prev) => ({
                  ...prev,
                  seat: e.target.value === "" ? undefined : Math.max(0, Number(e.target.value)),
                }))
              }
              className="w-full text-center bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 font-bold text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition shadow-xs"
            />
            <button
              type="button"
              onClick={() => handleSeatChange(1)}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#12171F] hover:bg-gray-100 dark:hover:bg-white/5 active:scale-95 text-gray-600 dark:text-gray-300 transition"
              title="Increase seat count"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </form>
  );
}