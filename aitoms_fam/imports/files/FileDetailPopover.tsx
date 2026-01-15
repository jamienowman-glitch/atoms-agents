"use client";

import React from "react";

interface FileDetailPopoverProps {
  open: boolean;
  file?: { id: string; title: string; meta?: string; thumbnail?: string; tags?: string[] };
  onClose?: () => void;
}

export function FileDetailPopover({ open, file, onClose }: FileDetailPopoverProps) {
  if (!open || !file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-4 space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500">File detail</p>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{file.title}</h3>
            {file.meta && <p className="text-sm text-neutral-500 mt-1">{file.meta}</p>}
          </div>
          <button className="text-sm text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="aspect-video rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
          {file.thumbnail ? <img src={file.thumbnail} alt={file.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-neutral-400 text-sm">No preview</div>}
        </div>
        {file.tags && file.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {file.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs text-neutral-600 dark:text-neutral-300">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
