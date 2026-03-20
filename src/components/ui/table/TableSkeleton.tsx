"use client";

import React from "react";

interface Props {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({ rows = 5, columns = 6 }: Props) {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="bg-gray-50 dark:bg-white/[0.03] border-b border-gray-100 dark:border-white/[0.06]">
        <div className="flex gap-4 px-4 py-3">
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="h-3 rounded bg-gray-200 dark:bg-gray-700 flex-1"
            />
          ))}
        </div>
      </div>
      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex gap-4 px-4 py-4 border-b border-gray-50 dark:border-white/[0.03]"
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div
              key={colIdx}
              className="h-3 rounded bg-gray-100 dark:bg-gray-800 flex-1"
              style={{ maxWidth: colIdx === 0 ? 40 : undefined }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
