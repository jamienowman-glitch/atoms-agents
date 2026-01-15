"use client";

import React, { useEffect, useMemo, useState } from "react";

type ZoomLevel = "year" | "quarter" | "month" | "week" | "day";

interface CalendarQuarterShellProps {
  variant?: "full" | "half";
  initialDate?: Date;
  onRangeChange?: (range: { start: Date; end: Date; zoom: ZoomLevel }) => void;
  onDaySelect?: (day: Date) => void;
  onZoomChange?: (zoom: ZoomLevel) => void;
  onDayDrop?: (day: Date, payload: unknown) => void;
}

const zoomLevels: ZoomLevel[] = ["year", "quarter", "month", "week", "day"];

const getQuarterStart = (date: Date) => {
  const month = date.getMonth();
  const quarter = Math.floor(month / 3);
  return new Date(date.getFullYear(), quarter * 3, 1);
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const getMonthDays = (year: number, month: number) => {
  const start = new Date(year, month, 1);
  const days = [];
  const weekdayOffset = start.getDay();
  for (let i = 0; i < weekdayOffset; i += 1) {
    days.push(null);
  }
  while (start.getMonth() === month) {
    days.push(new Date(start));
    start.setDate(start.getDate() + 1);
  }
  return days;
};

const computeRange = (focus: Date, zoom: ZoomLevel) => {
  if (zoom === "year") {
    const start = new Date(focus.getFullYear(), 0, 1);
    const end = new Date(focus.getFullYear(), 11, 31);
    return { start, end };
  }
  if (zoom === "quarter") {
    const start = getQuarterStart(focus);
    const end = addDays(new Date(start.getFullYear(), start.getMonth() + 3, 0), 0);
    return { start, end };
  }
  if (zoom === "month") {
    const start = new Date(focus.getFullYear(), focus.getMonth(), 1);
    const end = new Date(focus.getFullYear(), focus.getMonth() + 1, 0);
    return { start, end };
  }
  if (zoom === "week") {
    const start = addDays(focus, -focus.getDay());
    const end = addDays(start, 6);
    return { start, end };
  }
  return { start: new Date(focus), end: new Date(focus) };
};

export function CalendarQuarterShell({
  variant = "full",
  initialDate = new Date(),
  onRangeChange,
  onDaySelect,
  onZoomChange,
  onDayDrop,
}: CalendarQuarterShellProps) {
  const [focusDate, setFocusDate] = useState<Date>(initialDate);
  const [zoom, setZoom] = useState<ZoomLevel>("quarter");

  const quarterStart = useMemo(() => getQuarterStart(focusDate), [focusDate]);
  const months = useMemo(() => [0, 1, 2].map((i) => new Date(quarterStart.getFullYear(), quarterStart.getMonth() + i, 1)), [quarterStart]);

  const range = useMemo(() => {
    const r = computeRange(focusDate, zoom);
    onRangeChange?.({ ...r, zoom });
    return r;
  }, [focusDate, zoom, onRangeChange]);

  const handleZoomChange = (value: number) => {
    const next = zoomLevels[value] || "quarter";
    setZoom(next);
    onZoomChange?.(next);
  };

  const handleDaySelect = (day: Date) => {
    setFocusDate(day);
    onDaySelect?.(day);
  };

  useEffect(() => {
    onRangeChange?.({ ...range, zoom });
  }, [range.start, range.end, zoom, onRangeChange]); // eslint-disable-line react-hooks/exhaustive-deps

  const isFocusedMonth = (month: Date) => month.getMonth() === focusDate.getMonth();

  const monthColumn = (month: Date) => {
    const days = getMonthDays(month.getFullYear(), month.getMonth());
    return (
      <div key={month.toISOString()} className={`flex flex-col gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 ${isFocusedMonth(month) ? "shadow-md border-neutral-300 dark:border-neutral-700" : ""}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500">{month.toLocaleString("default", { month: "long" })}</p>
            <p className="text-[11px] text-neutral-400">{month.getFullYear()}</p>
          </div>
          {isFocusedMonth(month) && (
            <span className="rounded-full bg-neutral-900 text-white text-[10px] px-2 py-1">Focused</span>
          )}
        </div>
        <div className="grid grid-cols-7 gap-1 text-[11px] text-neutral-500">
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <span key={d} className="text-center uppercase">
              {d}
            </span>
          ))}
          {days.map((d, idx) =>
            d ? (
              <button
                key={d.toISOString()}
                onClick={() => handleDaySelect(d)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const raw = e.dataTransfer.getData("application/json") || e.dataTransfer.getData("text/plain");
                  const payload = raw ? (() => { try { return JSON.parse(raw); } catch { return raw; } })() : null;
                  onDayDrop?.(d, payload);
                }}
                className={`h-8 rounded-md text-sm ${
                  d.toDateString() === focusDate.toDateString()
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                }`}
              >
                {d.getDate()}
              </button>
            ) : (
              <span key={`pad-${idx}`} />
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col gap-4 ${variant === "half" ? "max-h-[520px]" : ""}`} data-atom-id="atom-calendar-shell">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Calendar</p>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Quarter view</h2>
          <p className="text-xs text-neutral-500">
            {range.start.toDateString()} – {range.end.toDateString()} ({zoom})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">Zoom</span>
          <input
            type="range"
            min={0}
            max={zoomLevels.length - 1}
            value={zoomLevels.indexOf(zoom)}
            onChange={(e) => handleZoomChange(Number(e.target.value))}
            className="w-32"
          />
        </div>
      </div>

      <div className={`grid ${variant === "half" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"} gap-3`}>
        {months.map(monthColumn)}
      </div>
    </div>
  );
}
