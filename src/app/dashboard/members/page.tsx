import { getSession } from "@/lib/auth";
import { getMembersAction } from "@/actions/memberActions";
import MembersView from "@/components/members/MembersView";
import { Role } from "@prisma/client";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Member Directory - RUET Library Management System",
};

export default async function MembersPage() {
  const session = await getSession();

  // Role check: Only ADMIN / Librarian can view member directory
  if (session?.role !== Role.ADMIN) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-slate-200 rounded-2xl text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          The Member Directory is restricted to library administrators. You are currently logged in as a student member.
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard/books"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#6395ee] hover:bg-[#4d83e6] text-white text-xs font-semibold transition"
          >
            Go to Book Catalog
          </Link>
        </div>
      </div>
    );
  }

  const members = await getMembersAction();

  return <MembersView initialMembers={members} currentUserId={session.id} />;
}
