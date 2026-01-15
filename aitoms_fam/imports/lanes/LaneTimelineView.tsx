"use client";

import React, { useMemo } from "react";

type ZoomLevel = "year" | "quarter" | "month" | "week" | "day";

export interface LaneItem {
  id: string;
  laneId: string;
  label: string;
  start: Date;
  end: Date;
  color?: string;
}

export interface Lane {
  laneId: string;
  laneLabel: string;
}

interface LaneTimelineViewProps {
  lanes: Lane[];
  items: LaneItem[];
  range: { start: Date; end: Date; zoom: ZoomLevel };
  onLaneItemSelect?: (item: LaneItem) => void;
  onTimeRangeChange?: (range: { start: Date; end: Date; zoom: ZoomLevel }) => void;
  onLaneDrop?: (laneId: string, payload: unknown) => void;
}

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

export function LaneTimelineView({ lanes, items, range, onLaneItemSelect, onTimeRangeChange, onLaneDrop }: LaneTimelineViewProps) {
  const totalMs = Math.max(1, range.end.getTime() - range.start.getTime());

  const laneItems = useMemo(() => {
    const byLane: Record<string, LaneItem[]> = {};
    items.forEach((item) => {
      if (!byLane[item.laneId]) byLane[item.laneId] = [];
      byLane[item.laneId].push(item);
    });
    return byLane;
  }, [items]);

  const shiftRange = (daysDelta: number) => {
    const start = new Date(range.start);
    const end = new Date(range.end);
    start.setDate(start.getDate() + daysDelta);
    end.setDate(end.getDate() + daysDelta);
    onTimeRangeChange?.({ start, end, zoom: range.zoom });
  };

  const renderBar = (item: LaneItem) => {
    const startPct = ((item.start.getTime() - range.start.getTime()) / totalMs) * 100;
    const endPct = ((item.end.getTime() - range.start.getTime()) / totalMs) * 100;
    const left = clamp(startPct, 0, 100);
    const width = clamp(endPct, 0, 100) - left;
    return (
      <button
        key={item.id}
        className="absolute top-1 bottom-1 rounded-md border border-neutral-200 dark:border-neutral-700 text-xs px-2 py-1 overflow-hidden"
        style={{
          left: `${left}%`,
          width: `${Math.max(width, 6)}%`,
          background: item.color || "var(--background, #f4f4f5)",
        }}
        onClick={() => onLaneItemSelect?.(item)}
      >
        <span className="text-[11px] text-neutral-800 dark:text-neutral-100 whitespace-nowrap">{item.label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3" data-atom-id="atom-lane-timeline-shell">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Lane Timeline</p>
          <p className="text-xs text-neutral-500">
            {range.start.toDateString()} – {range.end.toDateString()} ({range.zoom})
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button className="rounded-md border border-neutral-200 dark:border-neutral-700 px-2 py-1" onClick={() => shiftRange(-7)}>
            –7d
          </button>
          <button className="rounded-md border border-neutral-200 dark:border-neutral-700 px-2 py-1" onClick={() => shiftRange(7)}>
            +7d
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {lanes.map((lane) => (
          <div key={lane.laneId} className="space-y-1">
            <div
              className="flex items-center justify-between text-xs text-neutral-500"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const raw = e.dataTransfer.getData("application/json") || e.dataTransfer.getData("text/plain");
                const payload = raw ? (() => { try { return JSON.parse(raw); } catch { return raw; } })() : null;
                onLaneDrop?.(lane.laneId, payload);
              }}
            >
              <span>{lane.laneLabel}</span>
            </div>
            <div
              className="relative h-12 rounded-md bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-dashed border-neutral-200 dark:border-neutral-700"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const raw = e.dataTransfer.getData("application/json") || e.dataTransfer.getData("text/plain");
                const payload = raw ? (() => { try { return JSON.parse(raw); } catch { return raw; } })() : null;
                onLaneDrop?.(lane.laneId, payload);
              }}
            >
              {(laneItems[lane.laneId] || []).map(renderBar)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
