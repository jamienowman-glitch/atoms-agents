"use client";

import React from "react";

export interface FileCardProps {
  id: string;
  title: string;
  thumbnail?: string;
  meta?: string;
  onSelect?: (id: string) => void;
  draggablePayload?: Record<string, unknown>;
}

export function FileCard({ id, title, thumbnail, meta, onSelect, draggablePayload }: FileCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    const payload = JSON.stringify({ type: "file", id, title, ...(draggablePayload || {}) });
    e.dataTransfer.setData("application/json", payload);
    e.dataTransfer.effectAllowed = "copyMove";
  };

  return (
    <div
      className="flex flex-col gap-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 w-44"
      draggable
      onDragStart={handleDragStart}
      onClick={() => onSelect?.(id)}
    >
      <div className="aspect-video rounded-md bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">No preview</div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2">{title}</p>
        {meta && <p className="text-xs text-neutral-500 line-clamp-2">{meta}</p>}
      </div>
    </div>
  );
}
