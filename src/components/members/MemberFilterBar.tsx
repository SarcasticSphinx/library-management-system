"use client";

import { Search, Filter, X } from "lucide-react";

interface MemberFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (dept: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  departments: string[];
}

export default function MemberFilterBar({
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  selectedStatus,
  onStatusChange,
  departments,
}: MemberFilterBarProps) {
  const hasFilters =
    searchQuery !== "" || selectedDepartment !== "ALL" || selectedStatus !== "ALL";

  const clearFilters = () => {
    onSearchChange("");
    onDepartmentChange("ALL");
    onStatusChange("ALL");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by student name, ID, or email..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#6395ee] focus:ring-1 focus:ring-[#6395ee] transition"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {/* Department Filter */}
        <div className="relative flex-1 md:w-56">
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-[#6395ee] transition truncate cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-[#6395ee] transition cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active Only</option>
          <option value="SUSPENDED">Suspended Only</option>
        </select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-2 transition"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
