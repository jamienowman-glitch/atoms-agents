"use client";

import React from "react";

interface LaneStackCardProps {
  laneId: string;
  label: string;
  thumbnails?: string[];
  extraCount?: number;
  onLaneSelect?: (laneId: string) => void;
}

export function LaneStackCard({ laneId, label, thumbnails = [], extraCount = 0, onLaneSelect }: LaneStackCardProps) {
  const displayed = thumbnails.slice(0, 3);
  return (
    <button
      type="button"
      onClick={() => onLaneSelect?.(laneId)}
      className="flex flex-col gap-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 w-44 text-left hover:shadow-sm"
    >
      <div className="flex -space-x-2">
        {displayed.map((thumb, idx) => (
          <div key={thumb + idx} className="h-10 w-10 rounded-full border border-white dark:border-neutral-900 overflow-hidden bg-neutral-100">
            <img src={thumb} alt={label} className="h-full w-full object-cover" />
          </div>
        ))}
        {extraCount > 0 && (
          <div className="h-10 w-10 rounded-full border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-xs text-neutral-500">
            +{extraCount}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{label}</p>
        <p className="text-xs text-neutral-500">Tap to open lane</p>
      </div>
    </button>
  );
}
