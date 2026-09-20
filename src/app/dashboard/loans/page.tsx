import { Suspense } from 'react';
import { getCirculationRecordsAction } from '@/actions/loanActions';
import LoanTable from '@/components/loans/LoanTable';
import IssueBookButton from '@/components/loans/IssueBookButton';
import LoanStats from '@/components/loans/LoanStats';

async function LoansContent() {
  const result = await getCirculationRecordsAction();
  const loans = result.success ? result.data : [];

  return (
    <div className="container-fixed py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Circulation Management</h1>
        <p className="mt-2 text-gray-600">
          Manage book borrowing, returns, and track overdue items
        </p>
      </div>

      {!result.success && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{result.error}</p>
        </div>
      )}

      {/* Statistics Banner */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-24 animate-pulse" />
            ))}
          </div>
        }
      >
        <LoanStats />
      </Suspense>

      <div className="mb-6">
        <IssueBookButton />
      </div>

      <LoanTable loans={loans} />
    </div>
  );
}

export default function LoansPage() {
  return (
    <Suspense
      fallback={
        <div className="container-fixed py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      }
    >
      <LoansContent />
    </Suspense>
  );
}
