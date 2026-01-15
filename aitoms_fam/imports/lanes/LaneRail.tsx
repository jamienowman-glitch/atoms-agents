"use client";

import React from "react";

interface LaneRailProps {
  lanes: { id: string; label: string }[];
  categories: { id: string; label: string }[];
  selectedLane?: string;
  selectedCategory?: string;
  zoom?: number;
  onLaneChange?: (laneId: string) => void;
  onCategoryChange?: (categoryId: string) => void;
  onZoomChange?: (zoom: number) => void;
}

export function LaneRail({ lanes, categories, selectedLane, selectedCategory, zoom = 2, onLaneChange, onCategoryChange, onZoomChange }: LaneRailProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3">
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-500">Lane</span>
        <div className="flex items-center gap-1">
          {lanes.map((lane) => (
            <button
              key={lane.id}
              type="button"
              onClick={() => onLaneChange?.(lane.id)}
              className={`rounded-md px-3 py-1 text-sm ${selectedLane === lane.id ? "bg-neutral-900 text-white" : "border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-100"}`}
            >
              {lane.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-500">Category</span>
        <div className="flex items-center gap-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange?.(cat.id)}
              className={`rounded-md px-3 py-1 text-sm ${selectedCategory === cat.id ? "bg-neutral-900 text-white" : "border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-100"}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <span className="text-xs text-neutral-500">Zoom</span>
        <input type="range" min={0} max={4} value={zoom} onChange={(e) => onZoomChange?.(Number(e.target.value))} className="w-32" />
      </div>
    </div>
  );
}
