'use client';

import { useState } from 'react';
import ReturnBookDialog from './ReturnBookDialog';
import type { LoanRecord } from '@/types/loan';

interface ReturnActionButtonProps {
  loan: LoanRecord;
  onSuccess: () => void;
}

export default function ReturnActionButton({
  loan,
  onSuccess,
}: ReturnActionButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="text-brand hover:text-brand-hover font-medium transition-colors"
      >
        Return
      </button>

      <ReturnBookDialog
        isOpen={isDialogOpen}
        loan={loan}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={onSuccess}
      />
    </>
  );
}
