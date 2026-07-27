import React from "react";
import { motion } from "framer-motion";
import {
  X,
  Loader2,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  Car,
  Fuel,
  Hash,
  User,
  DollarSign,
  Users,
  Edit2,
  Trash2,
  Save,
  CheckCircle2,
  Navigation
} from "lucide-react";
import EditRideForm from "../dashboard/EditRideForm";

export default function RideDetailsDrawer({
  selectedRideId,
  selectedRide,
  isEditing,
  setIsEditing,
  loadingDetails,
  detailsError,
  actionLoading,
  editFormData,
  setEditFormData,
  handleCloseDrawer,
  handleSelectRide,
  handleUpdateRide,
  handleDeleteRide, // Trigger your toast confirmation inside this function
  formatDate,
  formatTime,
  formatCurrency,
  getDriverInitials,
  getStatusBadge
}) {
  return (
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
              <div>{getStatusBadge(selectedRide.status)}</div>
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
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-black text-sm flex items-center justify-center shadow-md shadow-indigo-500/20">
                    {getDriverInitials(selectedRide.driver_name)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white capitalize text-sm">
                      {selectedRide.driver_name}
                    </p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      Driver ID: #{selectedRide.driver_id}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-900/30 space-y-2 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-900/60 p-2 rounded-xl border border-indigo-200/40 dark:border-indigo-900/20">
                    <Phone className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="font-mono text-xs">{selectedRide.driver_phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-900/60 p-2 rounded-xl border border-indigo-200/40 dark:border-indigo-900/20">
                    <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">{selectedRide.driver_email}</span>
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
                    <p className="text-[10px] font-semibold uppercase">Model</p>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs capitalize truncate">
                    {selectedRide.vehicle_model}
                  </p>
                </div>
                <div className="p-3 bg-violet-50/40 dark:bg-violet-950/10 rounded-2xl border border-violet-200/60 dark:border-violet-900/30">
                  <div className="flex items-center gap-1 text-slate-400 mb-1">
                    <Hash className="w-3 h-3 text-violet-500" />
                    <p className="text-[10px] font-semibold uppercase">Plate</p>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs uppercase truncate">
                    {selectedRide.vehicle_registration_number}
                  </p>
                </div>
                <div className="p-3 bg-violet-50/40 dark:bg-violet-950/10 rounded-2xl border border-violet-200/60 dark:border-violet-900/30">
                  <div className="flex items-center gap-1 text-slate-400 mb-1">
                    <Fuel className="w-3 h-3 text-violet-500" />
                    <p className="text-[10px] font-semibold uppercase">Fuel</p>
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
                    {selectedRide.available_seats} / {selectedRide.total_seats} Available
                  </p>
                  <span className="inline-block text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1">
                    {selectedRide.total_seats - selectedRide.available_seats} Booked
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
  );
}