"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Ticket,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Clock,
  Percent,
  DollarSign,
  X,
} from "lucide-react";

interface Offer {
  id: string;
  code: string;
  title: string;
  type: "percentage" | "fixed";
  value: number;
  minSpend: number;
  redemptions: number;
  maxRedemptions: number;
  startDate: string;
  endDate: string;
  status: "active" | "scheduled" | "expired" | "paused";
}

const mockOffers: Offer[] = [
  {
    id: "OFFER-101",
    code: "WELCOME50",
    title: "New Rider First Trip Promo",
    type: "percentage",
    value: 50,
    minSpend: 20,
    redemptions: 1420,
    maxRedemptions: 2000,
    startDate: "2026-05-01",
    endDate: "2026-08-31",
    status: "active",
  },
  {
    id: "OFFER-102",
    code: "COMMUTE15",
    title: "Weekly Commuter Flat Pass",
    type: "fixed",
    value: 15,
    minSpend: 50,
    redemptions: 890,
    maxRedemptions: 1000,
    startDate: "2026-06-10",
    endDate: "2026-09-01",
    status: "active",
  },
  {
    id: "OFFER-103",
    code: "SUMMERFREE",
    title: "Mid-Summer Pool Discount",
    type: "percentage",
    value: 25,
    minSpend: 30,
    redemptions: 500,
    maxRedemptions: 500,
    startDate: "2026-06-01",
    endDate: "2026-07-01",
    status: "expired",
  },
  {
    id: "OFFER-104",
    code: "FESTIVE2026",
    title: "Holiday Rush Rides Special",
    type: "fixed",
    value: 20,
    minSpend: 60,
    redemptions: 0,
    maxRedemptions: 5000,
    startDate: "2026-10-01",
    endDate: "2026-11-01",
    status: "scheduled",
  },
];

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [newCode, setNewCode] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"percentage" | "fixed">("percentage");
  const [newValue, setNewValue] = useState<number>(10);
  const [newMinSpend, setNewMinSpend] = useState<number>(0);
  const [newMaxRedemptions, setNewMaxRedemptions] = useState<number>(1000);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const createdOffer: Offer = {
      id: `OFFER-${Math.floor(100 + Math.random() * 900)}`,
      code: newCode.toUpperCase(),
      title: newTitle,
      type: newType,
      value: Number(newValue),
      minSpend: Number(newMinSpend),
      redemptions: 0,
      maxRedemptions: Number(newMaxRedemptions),
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2026-12-31",
      status: "active",
    };

    setOffers([createdOffer, ...offers]);
    setIsCreateModalOpen(false);
    setNewCode("");
    setNewTitle("");
  };

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || offer.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen bg-gray-50/50 dark:bg-[#090C10] text-gray-900 dark:text-gray-100 transition-colors">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Tag className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Offer Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create, track, and optimize promotional vouchers and discounts.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="py-3 px-5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Offer</span>
        </motion.button>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Active Offers
            </p>
            <h3 className="text-2xl font-bold mt-1">
              {offers.filter((o) => o.status === "active").length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Total Redemptions
            </p>
            <h3 className="text-2xl font-bold mt-1">
              {offers
                .reduce((acc, curr) => acc + curr.redemptions, 0)
                .toLocaleString()}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Revenue Boost
            </p>
            <h3 className="text-2xl font-bold mt-1">$42,850</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Expiring Soon
            </p>
            <h3 className="text-2xl font-bold mt-1">1</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by code or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400 hidden sm:block" />
          <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10 w-full sm:w-auto">
            {["all", "active", "scheduled", "expired"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  selectedStatus === status
                    ? "bg-white dark:bg-blue-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Offers Table */}
      <div className="rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Promo Details</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Redemptions</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {filteredOffers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No offers matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredOffers.map((offer) => {
                  const percentageUsed = Math.min(
                    100,
                    Math.round((offer.redemptions / offer.maxRedemptions) * 100)
                  );

                  return (
                    <tr
                      key={offer.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => copyToClipboard(offer.code)}
                            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 font-mono font-bold text-xs hover:scale-105 transition"
                            title="Click to copy promo code"
                          >
                            <span>{offer.code}</span>
                            <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                          </button>
                          <div>
                            <p className="font-semibold">{offer.title}</p>
                            <p className="text-xs text-gray-400">
                              Min Spend: ${offer.minSpend}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-bold">
                          {offer.type === "percentage" ? (
                            <>
                              <Percent className="w-4 h-4 text-blue-500" />
                              <span>{offer.value}% OFF</span>
                            </>
                          ) : (
                            <>
                              <DollarSign className="w-4 h-4 text-emerald-500" />
                              <span>${offer.value} OFF</span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 w-48">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs text-gray-500 font-medium">
                            <span>{offer.redemptions} used</span>
                            <span>{offer.maxRedemptions} max</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-300"
                              style={{ width: `${percentageUsed}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {offer.startDate} to {offer.endDate}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            offer.status === "active"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : offer.status === "scheduled"
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                              : "bg-gray-500/10 text-gray-500 border border-gray-500/20"
                          }`}
                        >
                          {offer.status === "active" && (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          {offer.status === "scheduled" && (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                          {offer.status === "expired" && (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          <span className="capitalize">{offer.status}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Offer Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#090C10] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                <h3 className="text-lg font-extrabold flex items-center gap-2">
                  <Tag className="w-5 h-5 text-blue-500" />
                  Create New Offer Campaign
                </h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateOffer} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Campaign Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Weekend Special Pass"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Promo Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., WEEKEND20"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Discount Type
                    </label>
                    <select
                      value={newType}
                      onChange={(e) =>
                        setNewType(e.target.value as "percentage" | "fixed")
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Value
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newValue}
                      onChange={(e) => setNewValue(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Min Spend ($)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={newMinSpend}
                      onChange={(e) => setNewMinSpend(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Max Uses
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newMaxRedemptions}
                      onChange={(e) =>
                        setNewMaxRedemptions(Number(e.target.value))
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition"
                  >
                    Publish Offer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}