"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/authActions";
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    startTransition(async () => {
      const res = await loginAction(email, password);

      if (!res.success) {
        setError(res.message || "Invalid credentials.");
      } else {
        router.push("/dashboard/books");
        router.refresh();
      }
    });
  };

  return (
    <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl p-7 sm:p-9 shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Welcome Back
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Sign in to access your library account
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@ruet.ac.bd"
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6395ee] focus:ring-1 focus:ring-[#6395ee] transition"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6395ee] focus:ring-1 focus:ring-[#6395ee] transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-[#6395ee] hover:bg-[#4d83e6] disabled:opacity-50 text-white font-semibold text-sm transition shadow-lg shadow-[#6395ee]/25 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
        <p className="text-xs text-slate-400">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/register"
            className="text-[#6395ee] hover:text-[#4d83e6] font-medium transition"
          >
            Register as a student
          </Link>
        </p>
      </div>
    </div>
  );
}
