import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../atoms';

export const Pagination = ({
  currentPage = 0,
  totalPages = 0,
  totalElements = 0,
  pageSize = 9,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  // Generate page numbers to display around the current page
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - 2);
    let end = Math.min(totalPages - 1, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(0, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-surface-200 text-sm text-surface-600 ${className}`}
      aria-label="Pagination Navigation"
    >
      {/* Result Count Info */}
      <div className="text-xs text-surface-500">
        Showing <span className="font-semibold text-surface-800">{startItem}</span> to{' '}
        <span className="font-semibold text-surface-800">{endItem}</span> of{' '}
        <span className="font-semibold text-surface-800">{totalElements}</span> properties
      </div>

      {/* Page Navigation Buttons */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
          className="!px-2.5 !py-1.5"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {pages[0] > 0 && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(0)}
              className="w-8 h-8 rounded-lg text-xs font-medium hover:bg-surface-100 text-surface-700"
            >
              1
            </button>
            {pages[0] > 1 && <span className="px-1 text-surface-400">...</span>}
          </>
        )}

        {pages.map((p) => {
          const isCurrent = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={isCurrent ? 'page' : undefined}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                isCurrent
                  ? 'bg-brand-600 text-white shadow-soft'
                  : 'text-surface-700 hover:bg-surface-100'
              }`}
            >
              {p + 1}
            </button>
          );
        })}

        {pages[pages.length - 1] < totalPages - 1 && (
          <>
            {pages[pages.length - 1] < totalPages - 2 && (
              <span className="px-1 text-surface-400">...</span>
            )}
            <button
              type="button"
              onClick={() => onPageChange(totalPages - 1)}
              className="w-8 h-8 rounded-lg text-xs font-medium hover:bg-surface-100 text-surface-700"
            >
              {totalPages}
            </button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
          className="!px-2.5 !py-1.5"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
