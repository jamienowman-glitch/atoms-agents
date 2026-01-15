"use client";

import React from "react";

export interface ViewToggleOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface ViewToggleProps {
  options: ViewToggleOption[];
  selectedId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function ViewToggle({ options, selectedId, onChange, className = "" }: ViewToggleProps) {
  return (
    <div className={`inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1 text-sm dark:border-neutral-800 dark:bg-neutral-900 ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`flex items-center gap-2 rounded-md px-3 py-1 transition ${
            selectedId === opt.id
              ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm"
              : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
          }`}
          data-atom-id={`atom-view-toggle-${opt.id}`}
        >
          {opt.icon}
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
