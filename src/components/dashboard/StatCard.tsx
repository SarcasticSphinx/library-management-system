import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  color?: "blue" | "emerald" | "amber" | "purple";
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color = "blue",
}: StatCardProps) {
  const colorStyles = {
    blue: "bg-[#eef4fe] text-[#4d83e6] border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition hover:border-slate-300">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${colorStyles[color]}`}
      >
        <Icon className="w-6 h-6" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-slate-500 truncate">{title}</div>
        <div className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
          {value}
        </div>
        {description && (
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}
