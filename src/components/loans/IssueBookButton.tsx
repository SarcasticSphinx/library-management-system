'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import IssueBookModal from './IssueBookModal';

export default function IssueBookButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    // Refresh the page data
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors font-medium"
      >
        Issue Book
      </button>

      <IssueBookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
