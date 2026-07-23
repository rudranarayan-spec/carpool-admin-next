"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  // Default credentials pre-filled as requested
  const [email, setEmail] = useState("admin@system.com");
  const [password, setPassword] = useState("admin123456");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    setTimeout(() => {
      if (email === "admin@system.com" && password === "admin123456") {
        setIsLoading(false);

        // Set cookie for middleware validation (valid for 1 day)
        document.cookie = "admin_session=authenticated; path=/; max-age=86400; SameSite=Lax";

        // Read redirect target or default to dashboard
        const searchParams = new URLSearchParams(window.location.search);
        const redirectTo = searchParams.get("from") || "/activity-logs";

        router.push(redirectTo);
        router.refresh(); // Refresh route tree so middleware evaluates immediately
      } else {
        setIsLoading(false);
        setErrorMessage("Invalid credentials. Please use default admin access.");
      }
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Mobile Branding Logo (Shows only on small screens) */}
      <div className="flex lg:hidden items-center justify-center gap-3 mb-6">
        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-600/30">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
          ControlTower
        </h2>
      </div>

      {/* Header */}
      <div className="text-center sm:text-left space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Welcome Back
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
          Sign in with your administrator credentials to access the console.
        </p>
      </div>

      {/* Default Dev Credentials Badge */}
      <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-3">
        <KeyRound className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-extrabold text-blue-600 dark:text-blue-400">
            Development Mode (Pre-filled)
          </p>
          <p className="text-gray-600 dark:text-gray-300 font-mono mt-0.5">
            Email: <span className="font-bold">admin@system.com</span>
          </p>
          <p className="text-gray-600 dark:text-gray-300 font-mono">
            Pass: <span className="font-bold">admin123456</span>
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold flex items-center gap-2"
        >
          <ShieldAlert className="w-4 h-4 shrink-0" />
          {errorMessage}
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Admin Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@system.com"
              className="w-full bg-white dark:bg-[#090C10] border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition shadow-sm"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-white dark:bg-[#090C10] border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center justify-between text-xs font-medium">
          <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-gray-300 dark:border-white/10 text-blue-600 focus:ring-blue-500 dark:bg-white/5"
            />
            Remember Session
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Authenticating Admin...
            </>
          ) : (
            <>
              Access Dashboard <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Security Footer */}
      <div className="pt-4 border-t border-gray-200 dark:border-white/10 text-center">
        <p className="text-[11px] text-gray-400 font-mono flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Encrypted 256-bit Admin Session
        </p>
      </div>
    </motion.div>
  );
}