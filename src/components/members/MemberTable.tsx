"use client";

import { useTransition, useState } from "react";
import { MemberListItem, toggleMemberStatusAction } from "@/actions/memberActions";
import { UserCheck, ShieldAlert, BookMarked, Phone, GraduationCap, Building, Loader2 } from "lucide-react";

interface MemberTableProps {
  members: MemberListItem[];
  currentUserId?: string;
}

export default function MemberTable({ members, currentUserId }: MemberTableProps) {
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleStatus = (memberId: string) => {
    setLoadingId(memberId);
    startTransition(async () => {
      await toggleMemberStatusAction(memberId);
      setLoadingId(null);
    });
  };

  if (members.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">No members found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No library members match your current search query or department filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/75 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            <tr>
              <th scope="col" className="py-3.5 px-4 sm:px-6">
                Member Info
              </th>
              <th scope="col" className="py-3.5 px-4">
                Student ID
              </th>
              <th scope="col" className="py-3.5 px-4">
                Department
              </th>
              <th scope="col" className="py-3.5 px-4">
                Contact
              </th>
              <th scope="col" className="py-3.5 px-4 text-center">
                Active Loans
              </th>
              <th scope="col" className="py-3.5 px-4 text-center">
                Status
              </th>
              <th scope="col" className="py-3.5 px-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member) => {
              const isSelf = member.id === currentUserId;
              const isUserPending = isPending && loadingId === member.id;

              return (
                <tr
                  key={member.id}
                  className="hover:bg-slate-50/60 transition duration-150"
                >
                  {/* Member Name and Email */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#eef4fe] text-[#4d83e6] font-bold text-xs flex items-center justify-center border border-blue-100 uppercase shrink-0">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 leading-tight flex items-center gap-2">
                          {member.name}
                          {member.role === "ADMIN" && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                              Librarian
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{member.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Student ID */}
                  <td className="py-4 px-4 font-mono text-xs text-slate-800">
                    {member.studentId || <span className="text-slate-400 italic">N/A</span>}
                  </td>

                  {/* Department */}
                  <td className="py-4 px-4 text-xs text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[180px]">{member.department || "General"}</span>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-4 px-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{member.phone || "—"}</span>
                    </div>
                  </td>

                  {/* Active Loans */}
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        member.activeBorrowsCount > 0
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <BookMarked className="w-3 h-3" />
                      {member.activeBorrowsCount}{" "}
                      {member.activeBorrowsCount === 1 ? "book" : "books"}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        member.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {member.status === "ACTIVE" ? (
                        <>
                          <UserCheck className="w-3 h-3" />
                          Active
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-3 h-3" />
                          Suspended
                        </>
                      )}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    {isSelf ? (
                      <span className="text-xs text-slate-400 italic">Current User</span>
                    ) : member.role === "ADMIN" ? (
                      <span className="text-xs text-slate-400 italic">Admin Account</span>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(member.id)}
                        disabled={isUserPending}
                        type="button"
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5 ${
                          member.status === "ACTIVE"
                            ? "text-rose-600 border-rose-200 hover:bg-rose-50"
                            : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        }`}
                      >
                        {isUserPending ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : member.status === "ACTIVE" ? (
                          "Suspend"
                        ) : (
                          "Reactivate"
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
