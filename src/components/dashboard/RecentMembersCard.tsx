import Link from "next/link";
import { Users, ArrowRight, Building } from "lucide-react";

interface RecentMember {
  id: string;
  name: string;
  email: string;
  studentId: string | null;
  department: string | null;
  createdAt: Date;
}

interface RecentMembersCardProps {
  members: RecentMember[];
  isAdmin: boolean;
}

export default function RecentMembersCard({ members, isAdmin }: RecentMembersCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#eef4fe] text-[#4d83e6] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 leading-none">
                Recently Registered Members
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Latest students enrolled in the library system
              </p>
            </div>
          </div>

          {isAdmin && (
            <Link
              href="/dashboard/members"
              className="text-xs font-semibold text-[#4d83e6] hover:text-[#386ac9] inline-flex items-center gap-1 transition"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {members.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No registered members yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 mt-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#eef4fe] text-[#4d83e6] font-bold text-xs flex items-center justify-center uppercase shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-900 truncate">
                      {member.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                      <Building className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{member.department || member.email}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {member.studentId && (
                    <div className="font-mono text-[11px] text-slate-700 font-medium">
                      {member.studentId}
                    </div>
                  )}
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(member.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
