"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionUser } from "@/lib/auth";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ArrowRightLeft,
  BookMarked,
  X,
} from "lucide-react";

interface SidebarProps {
  user: SessionUser | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isAdmin = user?.role === "ADMIN";

  const navigationItems = [
    {
      label: "Dashboard Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      show: true,
    },
    {
      label: "Book Catalog",
      href: "/dashboard/books",
      icon: BookOpen,
      show: true,
    },
    {
      label: "My Borrowed Books",
      href: "/dashboard/my-loans",
      icon: BookMarked,
      show: !isAdmin,
    },
    {
      label: "Member Directory",
      href: "/dashboard/members",
      icon: Users,
      show: isAdmin,
    },
    {
      label: "Circulation / Loans",
      href: "/dashboard/loans",
      icon: ArrowRightLeft,
      show: isAdmin,
    },
  ];

  const visibleItems = navigationItems.filter((item) => item.show);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        suppressHydrationWarning
        className={`fixed md:sticky top-0 left-0 z-50 md:z-20 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col">
          {/* Mobile Close Bar */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 md:hidden">
            <span className="font-bold text-slate-900 text-sm">Navigation</span>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <div className="p-4 space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Menu
            </div>
            {visibleItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-[#6395ee] text-white shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-slate-500"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer info in sidebar */}
        {user && (
          <div className="p-4 m-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
            <div className="font-semibold text-slate-900 truncate">{user.name}</div>
            <div className="text-[11px] text-slate-500 mt-0.5 truncate">{user.email}</div>
            {user.studentId && (
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                ID: {user.studentId}
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
