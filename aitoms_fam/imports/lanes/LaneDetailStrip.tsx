"use client";

import React, { useState } from "react";
import { FileCard } from "../files/FileCard";
import { FileDetailPopover } from "../files/FileDetailPopover";

export interface LaneDetailFile {
  id: string;
  title: string;
  thumbnail?: string;
  meta?: string;
  tags?: string[];
}

interface LaneDetailStripProps {
  laneId: string;
  files: LaneDetailFile[];
}

export function LaneDetailStrip({ laneId, files }: LaneDetailStripProps) {
  const [selected, setSelected] = useState<LaneDetailFile | undefined>(undefined);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-neutral-500">Lane</p>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{laneId}</h3>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {files.map((file) => (
          <FileCard key={file.id} id={file.id} title={file.title} thumbnail={file.thumbnail} meta={file.meta} draggablePayload={{ laneId }} onSelect={() => setSelected(file)} />
        ))}
      </div>
      <FileDetailPopover open={!!selected} file={selected} onClose={() => setSelected(undefined)} />
    </div>
  );
}
