'use client';

import { useState } from 'react';
import { BorrowStatus } from '@prisma/client';

interface LoanFilterBarProps {
  onFilterChange: (filter: BorrowStatus | 'ALL') => void;
  onSearchChange: (query: string) => void;
}

export default function LoanFilterBar({
  onFilterChange,
  onSearchChange,
}: LoanFilterBarProps) {
  const [activeFilter, setActiveFilter] = useState<BorrowStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = [
    { id: 'ALL', label: 'All Loans', count: null },
    { id: BorrowStatus.BORROWED, label: 'Active Loans', count: null },
    { id: BorrowStatus.OVERDUE, label: 'Overdue Only', count: null },
    { id: BorrowStatus.RETURNED, label: 'Returned History', count: null },
  ];

  const handleFilterClick = (filterId: BorrowStatus | 'ALL') => {
    setActiveFilter(filterId);
    onFilterChange(filterId);
  };

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id as BorrowStatus | 'ALL')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === filter.id
                ? 'bg-brand text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by student name, student ID, or book title..."
          value={searchQuery}
          onChange={(e) => handleSearchInput(e.target.value)}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}
