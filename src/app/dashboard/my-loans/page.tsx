import { Suspense } from 'react';
import { getUserBorrowHistoryAction } from '@/actions/loanActions';
import UserLoanHistoryTable from '@/components/loans/UserLoanHistoryTable';

// For demo purposes, we'll use a placeholder user ID
// In a real app, this would come from the authenticated session
const DEMO_USER_ID = 'demo-user-id';

async function MyLoansContent() {
  // TODO: Replace with actual user session ID
  // const session = await getServerSession();
  // const userId = session?.user?.id;
  
  const result = await getUserBorrowHistoryAction(DEMO_USER_ID);
  const loans = result.success ? result.data : [];

  return (
    <div className="container-fixed py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Book Loans</h1>
        <p className="mt-2 text-gray-600">
          View your currently borrowed books and reading history
        </p>
      </div>

      {!result.success && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{result.error}</p>
        </div>
      )}

      {result.success && loans.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No loans yet</h3>
          <p className="mt-2 text-gray-600">
            You haven&apos;t borrowed any books yet. Visit the library to start your reading journey!
          </p>
        </div>
      ) : (
        <UserLoanHistoryTable loans={loans} />
      )}
    </div>
  );
}

export default function MyLoansPage() {
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
      <MyLoansContent />
    </Suspense>
  );
}
