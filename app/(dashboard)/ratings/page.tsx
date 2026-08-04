"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Star,
  Search,
  Trash2,
  RefreshCw,
  Loader2,
  MessageSquare,
  User,
  Phone,
  Calendar,
  MapPin,
  ShieldAlert,
  X,
  SlidersHorizontal,
} from "lucide-react";
import ratingService from "@/services/ratingService";
import { RatingItem } from "@/types/ratings.types";

export default function RatingManagementPage() {
  const queryClient = useQueryClient();

  // --- States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("All");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);

  // Delete Confirmation Modal State
  const [ratingToDelete, setRatingToDelete] = useState<RatingItem | null>(null);

  // --- TanStack Query: Fetch Ratings ---
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["admin-ratings", page, limit, ratingFilter, searchQuery],
    queryFn: () =>
      ratingService.getRatings({
        page,
        limit,
        rating: ratingFilter !== "All" ? ratingFilter : undefined,
        search: searchQuery || undefined,
      }),
    placeholderData: (previousData) => previousData,
  });

  const ratings = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  // --- TanStack Mutation: Delete Rating ---
  const deleteMutation = useMutation({
    mutationFn: (id: number) => ratingService.deleteRating(id),
    onSuccess: (res) => {
      toast.success(res.message || "Rating removed successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-ratings"] });
      setRatingToDelete(null);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to remove rating.");
    },
  });

  // Helper for star rendering
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 transition-colors ${
              star <= rating
                ? "text-amber-500 fill-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                : "text-gray-300 dark:text-gray-700"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6 max-w-[1700px] mx-auto min-h-screen transition-colors duration-300 select-none">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent p-6 rounded-3xl border border-gray-200/80 dark:border-white/10 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20 mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            Quality Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Rating & Review Management
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Gain insights into passenger experiences, monitor driver feedback, and manage marketplace reputation.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 font-bold text-xs hover:bg-gray-50 dark:hover:bg-white/10 transition shadow-sm active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-amber-500 ${isFetching ? "animate-spin" : ""}`} />
          <span>Sync Feed</span>
        </button>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 bg-white dark:bg-[#090C10] p-4 rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl shadow-black/[0.02]">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by passenger name, driver name, or review content..."
            className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition shadow-inner"
          />
        </div>

        {/* Star Rating Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/[0.03] p-1.5 rounded-2xl border border-gray-200 dark:border-white/10">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 ml-2 mr-1 hidden sm:block" />
            {["All", "5", "4", "3", "2", "1"].map((tab) => {
              const isActive = ratingFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setRatingFilter(tab);
                    setPage(1);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                    isActive
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-[1.02]"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/5"
                  }`}
                >
                  {tab === "All" ? (
                    "All Ratings"
                  ) : (
                    <span className="flex items-center gap-1">
                      {tab} <Star className="w-3 h-3 fill-current" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Ratings Grid Showcase */}
      <div className="relative bg-white dark:bg-[#090C10] rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl shadow-black/[0.02] p-4 sm:p-6 min-h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-[#090C10]/70 backdrop-blur-md flex items-center justify-center z-20 rounded-3xl">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-xs font-bold text-gray-500 animate-pulse">Loading feedback database...</p>
            </div>
          </div>
        )}

        {ratings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ratings.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="p-5 rounded-3xl bg-gradient-to-b from-gray-50/80 to-gray-50/30 dark:from-white/[0.03] dark:to-white/[0.01] border border-gray-200 dark:border-white/10 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 group shadow-sm hover:shadow-md"
              >
                {/* Top Section: Stars & Date */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-inner group-hover:scale-105 transition-transform">
                      <Star className="w-5 h-5 fill-amber-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        {renderStars(item.rating)}
                        <span className="text-xs font-black text-gray-900 dark:text-white px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          {item.rating}.0
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-gray-400 mt-1">
                        Ride #{item.ride_id} • Booking #{item.booking_id}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1.5 bg-white dark:bg-white/5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 shadow-xs">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    {new Date(item.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Review Message Bubble */}
                <div className="relative p-4 rounded-2xl bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium italic shadow-inner">
                  <MessageSquare className="w-4 h-4 text-amber-500/30 absolute top-3.5 right-3.5" />
                  &ldquo;{item.review || "No written review provided by user."}&rdquo;
                </div>

                {/* Trip Route Details */}
                <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-white/5 p-3.5 rounded-2xl border border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="font-bold text-gray-900 dark:text-white shrink-0">From:</span>
                    <span className="truncate text-gray-600 dark:text-gray-300">{item.source_address}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="font-bold text-gray-900 dark:text-white shrink-0">To:</span>
                    <span className="truncate text-gray-600 dark:text-gray-300">{item.destination_address}</span>
                  </div>
                </div>

                {/* Footer Section: Passenger, Driver & Action */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-white/10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-900 dark:text-white">
                      <User className="w-3.5 h-3.5 text-blue-500" />
                      {item.passenger_name}
                      <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-medium">Passenger</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {item.passenger_phone || "N/A"}
                      </span>
                      <span>•</span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">
                        Driver: {item.driver_name}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setRatingToDelete(item)}
                    className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-600 hover:text-white text-xs font-bold border border-rose-500/20 transition-all duration-200 flex items-center gap-1.5 active:scale-95 shadow-sm"
                    title="Remove Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center text-gray-500 dark:text-gray-400 space-y-3">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
              <Star className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">No ratings found</p>
              <p className="text-xs text-gray-500 mt-0.5">Try altering your search keywords or clearing active filters.</p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 bg-white dark:bg-[#090C10] border border-gray-200 dark:border-white/10 rounded-3xl shadow-xl shadow-black/[0.02]">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          Showing page <span className="font-bold text-gray-900 dark:text-white">{page}</span> of{" "}
          <span className="font-bold text-gray-900 dark:text-white">{totalPages || 1}</span>
        </p>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1 || isFetching}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95"
          >
            Previous
          </button>

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page >= totalPages || isFetching}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95"
          >
            Next
          </button>
        </div>
      </div>

      {/* 5. Delete Confirmation Modal */}
      <AnimatePresence>
        {ratingToDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRatingToDelete(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="fixed inset-0 m-auto w-full max-w-md h-fit bg-white dark:bg-[#090C10] border border-gray-200 dark:border-white/10 rounded-3xl p-6 sm:p-7 z-50 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 border border-rose-500/20 shadow-inner">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-900 dark:text-white">
                      Confirm Deletion
                    </h3>
                    <p className="text-xs text-gray-500">This action is permanent and cannot be undone.</p>
                  </div>
                </div>
                <button
                  onClick={() => setRatingToDelete(null)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-white/10 space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <p>
                  Are you sure you want to remove the review written by{" "}
                  <strong className="text-gray-900 dark:text-white font-bold">{ratingToDelete.passenger_name}</strong>?
                </p>
                <p className="italic text-gray-500 dark:text-gray-400 bg-white dark:bg-black/20 p-3 rounded-xl border border-gray-200 dark:border-white/10">
                  &ldquo;{ratingToDelete.review || "No review description"}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setRatingToDelete(null)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 font-bold text-xs transition border border-gray-200 dark:border-white/10 shadow-sm active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(ratingToDelete.id)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>Yes, Remove</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}