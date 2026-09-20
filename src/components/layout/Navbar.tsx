"use client";

import { useTransition } from "react";
import { logoutAction } from "@/actions/authActions";
import { SessionUser } from "@/lib/auth";
import { BookOpen, LogOut, Menu, UserCheck, Shield } from "lucide-react";

interface NavbarProps {
  user: SessionUser | null;
  onMenuToggle?: () => void;
}

export default function Navbar({ user, onMenuToggle }: NavbarProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            type="button"
            aria-label="Toggle navigation menu"
            className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden transition"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#6395ee] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900 hidden sm:inline-block">
            RUET Library
          </span>
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 pl-3">
            <div className="w-8 h-8 rounded-full bg-[#eef4fe] text-[#4d83e6] font-bold text-xs flex items-center justify-center border border-blue-100 uppercase">
              {user.name.charAt(0)}
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-tight">
                {user.name}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {user.department || user.email}
              </span>
            </div>

            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                user.role === "ADMIN"
                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                  : "bg-blue-100 text-[#4d83e6] border border-blue-200"
              }`}
            >
              {user.role === "ADMIN" ? (
                <>
                  <Shield className="w-3 h-3" />
                  Admin
                </>
              ) : (
                <>
                  <UserCheck className="w-3 h-3" />
                  Member
                </>
              )}
            </span>
          </div>

          <button
            onClick={handleLogout}
            disabled={isPending}
            type="button"
            title="Sign Out"
            className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition border border-transparent hover:border-red-100 cursor-pointer disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
}
