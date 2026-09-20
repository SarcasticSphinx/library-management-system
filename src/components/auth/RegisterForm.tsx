"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerAction } from "@/actions/authActions";
import { User, Mail, Lock, Phone, GraduationCap, Building, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

const DEPARTMENTS = [
  "Computer Science & Engineering (CSE)",
  "Electrical & Electronic Engineering (EEE)",
  "Mechanical Engineering (ME)",
  "Civil Engineering (CE)",
  "Industrial & Production Engineering (IPE)",
  "Electronics & Telecommunication Engineering (ETE)",
  "Mechatronics Engineering (MTE)",
  "Chemical & Food Process Engineering (CFPE)",
  "Material Science & Engineering (MSE)",
  "Architecture",
];

export default function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    department: "Computer Science & Engineering (CSE)",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill out all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    startTransition(async () => {
      const res = await registerAction({
        name: formData.name,
        email: formData.email,
        studentId: formData.studentId,
        department: formData.department,
        phone: formData.phone,
        password: formData.password,
      });

      if (!res.success) {
        setError(res.message || "Registration failed.");
      } else {
        router.push("/dashboard/books");
        router.refresh();
      }
    });
  };

  return (
    <div className="w-full max-w-lg bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl p-7 sm:p-9 shadow-2xl">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Create Member Account
        </h1>
        <p className="text-sm text-slate-400 mt-1.5">
          Register to borrow textbooks and access library records
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
            Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Suhail Ahmed"
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6395ee] focus:ring-1 focus:ring-[#6395ee] transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              University Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="student@ruet.ac.bd"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6395ee] focus:ring-1 focus:ring-[#6395ee] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Student ID / Roll
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="e.g. 2003001"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6395ee] focus:ring-1 focus:ring-[#6395ee] transition"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Department
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-white focus:outline-none focus:border-[#6395ee] focus:ring-1 focus:ring-[#6395ee] transition"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="bg-slate-900 text-white">
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+8801700000000"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6395ee] focus:ring-1 focus:ring-[#6395ee] transition"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Password * (min 6 characters)
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6395ee] focus:ring-1 focus:ring-[#6395ee] transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-3 py-3 px-4 rounded-xl bg-[#6395ee] hover:bg-[#4d83e6] disabled:opacity-50 text-white font-semibold text-sm transition shadow-lg shadow-[#6395ee]/25 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Registering...
            </>
          ) : (
            <>
              Register Account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
        <p className="text-xs text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#6395ee] hover:text-[#4d83e6] font-medium transition"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
