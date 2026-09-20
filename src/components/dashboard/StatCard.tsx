interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
}

export default function StatCard({
  title,
  value,
  description,
}: StatCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between transition hover:border-[#6395ee]/40 duration-200">
      <div>
        <h3 className="text-sm font-semibold text-slate-600 tracking-tight">
          {title}
        </h3>
        <div className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-2">
          {value}
        </div>
      </div>

      {description && (
        <div className="text-xs text-slate-400 mt-3 font-light pt-3 border-t border-slate-100">
          {description}
        </div>
      )}
    </div>
  );
}
