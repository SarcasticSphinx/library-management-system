"use client";

import { useState, useMemo } from "react";
import { MemberListItem } from "@/actions/memberActions";
import MemberFilterBar from "@/components/members/MemberFilterBar";
import MemberTable from "@/components/members/MemberTable";
import { Users, UserCheck, ShieldAlert, GraduationCap } from "lucide-react";

interface MembersViewProps {
  initialMembers: MemberListItem[];
  currentUserId?: string;
}

export default function MembersView({ initialMembers, currentUserId }: MembersViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Extract unique departments for dropdown
  const departments = useMemo(() => {
    const set = new Set<string>();
    initialMembers.forEach((m) => {
      if (m.department) set.add(m.department);
    });
    return Array.from(set).sort();
  }, [initialMembers]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return initialMembers.filter((member) => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        (member.studentId && member.studentId.toLowerCase().includes(query));

      // Department match
      const matchesDept =
        selectedDepartment === "ALL" ||
        (member.department &&
          member.department.toLowerCase().includes(selectedDepartment.toLowerCase()));

      // Status match
      const matchesStatus =
        selectedStatus === "ALL" || member.status === selectedStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [initialMembers, searchQuery, selectedDepartment, selectedStatus]);

  // Quick statistics
  const totalCount = initialMembers.length;
  const activeCount = initialMembers.filter((m) => m.status === "ACTIVE").length;
  const suspendedCount = initialMembers.filter((m) => m.status === "SUSPENDED").length;
  const totalLoansCount = initialMembers.reduce((acc, m) => acc + m.activeBorrowsCount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Member Directory
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage registered university students, department memberships, and account statuses.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#eef4fe] text-[#4d83e6] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Registered</div>
            <div className="text-xl font-bold text-slate-900">{totalCount}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Active Accounts</div>
            <div className="text-xl font-bold text-slate-900">{activeCount}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Suspended</div>
            <div className="text-xl font-bold text-slate-900">{suspendedCount}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Active Borrowers</div>
            <div className="text-xl font-bold text-slate-900">{totalLoansCount}</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <MemberFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        departments={departments}
      />

      {/* Results Table */}
      <MemberTable members={filteredMembers} currentUserId={currentUserId} />
    </div>
  );
}
