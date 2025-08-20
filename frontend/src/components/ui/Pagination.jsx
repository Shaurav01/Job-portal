import React from "react";

const Pagination = ({ current = 1, pages = 1, onPageChange }) => {
  if (pages <= 1) return null;

  const handlePrev = () => {
    if (current > 1) onPageChange(current - 1);
  };

  const handleNext = () => {
    if (current < pages) onPageChange(current + 1);
  };

  // Show a range of pages around the current
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(1, current - delta);
      i <= Math.min(pages, current + delta);
      i++
    ) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="flex items-center justify-center mt-8 gap-2">
      {/* Prev Button */}
      <button
        onClick={handlePrev}
        disabled={current === 1}
        className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Prev
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1.5 text-sm rounded-lg transition ${
              page === current
                ? "bg-blue-600 text-white font-medium"
                : "border border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={current === pages}
        className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
