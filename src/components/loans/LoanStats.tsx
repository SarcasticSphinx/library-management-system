import { getCirculationStatsAction } from '@/actions/loanActions';

export default async function LoanStats() {
  const result = await getCirculationStatsAction();
  const stats = result.success ? result.data : {
    totalActive: 0,
    totalOverdue: 0,
    returnedThisMonth: 0,
    totalFines: 0,
  };

  const statCards = [
    {
      title: 'Active Borrows',
      value: stats.totalActive,
      subtext: 'Books currently checked out',
    },
    {
      title: 'Overdue Loans',
      value: stats.totalOverdue,
      subtext: stats.totalOverdue > 0 ? 'Requires student follow-up' : 'All loans currently on time',
    },
    {
      title: 'Returned This Month',
      value: stats.returnedThisMonth,
      subtext: 'Completed book returns',
    },
    {
      title: 'Total Fines Accrued',
      value: `${stats.totalFines.toFixed(0)} BDT`,
      subtext: 'Calculated at 5 BDT / day',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
        >
          <div>
            <h4 className="text-sm font-semibold text-slate-600">{card.title}</h4>
            <p className="text-3xl font-bold text-slate-900 tracking-tight mt-1.5">{card.value}</p>
          </div>
          <p className="text-xs text-slate-400 font-light mt-3 pt-3 border-t border-slate-100">
            {card.subtext}
          </p>
        </div>
      ))}
    </div>
  );
}
