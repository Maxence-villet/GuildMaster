import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginationProps {
  pagination: PaginationInfo | null;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, currentPage, onPageChange }: PaginationProps) {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!pagination.hasPreviousPage}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
          Previous
        </button>
        
        <div className="flex items-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition duration-150 ease-in-out ${
                page === currentPage
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          Next
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      
      {/* Pagination Info */}
      <div className="text-center text-sm text-gray-500 mt-2">
        Showing {((currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} guides
      </div>
    </div>
  );
} 