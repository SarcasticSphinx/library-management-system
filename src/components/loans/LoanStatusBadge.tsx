import { BorrowStatus } from '@prisma/client';

interface LoanStatusBadgeProps {
  status: BorrowStatus;
}

export default function LoanStatusBadge({ status }: LoanStatusBadgeProps) {
  const statusConfig = {
    [BorrowStatus.BORROWED]: {
      label: 'Active',
      className: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    [BorrowStatus.RETURNED]: {
      label: 'Returned',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    [BorrowStatus.OVERDUE]: {
      label: 'Overdue',
      className: 'bg-red-100 text-red-800 border-red-200',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
