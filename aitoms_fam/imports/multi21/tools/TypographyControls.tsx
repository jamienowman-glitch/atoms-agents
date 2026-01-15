"use client";

import React, { useCallback, useMemo, useState } from "react";
import { TextAlign, TextSize, TextStyle } from "../../../types/multi21";

const SIZE_SCALE: Record<TextSize, { fontSize: string; lineHeight: string; optical: number }> = {
  xs: { fontSize: "var(--type-caption-size)", lineHeight: "var(--type-line-loose)", optical: 12 },
  s: { fontSize: "0.9375rem", lineHeight: "var(--type-line-base)", optical: 14 },
  m: { fontSize: "1rem", lineHeight: "var(--type-line-base)", optical: 16 },
  l: { fontSize: "1.25rem", lineHeight: "var(--type-line-base)", optical: 20 },
  xl: { fontSize: "1.5rem", lineHeight: "var(--type-line-tight)", optical: 24 },
};

const buildStyle = (state: Omit<TextStyle, "fontSize" | "lineHeight" | "fontVariationSettings">): TextStyle => {
  const scale = SIZE_SCALE[state.size];
  const fontVariationSettings = `"wght" ${state.weight}, "wdth" ${state.width}, "slnt" 0, "opsz" ${scale.optical}`;
  return {
    ...state,
    fontSize: scale.fontSize,
    lineHeight: scale.lineHeight,
    fontVariationSettings,
  };
};

export function useTypography(initial?: Partial<TextStyle>) {
  const [style, setStyle] = useState<TextStyle>(() =>
    buildStyle({
      weight: initial?.weight ?? 500,
      width: initial?.width ?? 100,
      size: initial?.size ?? "m",
      align: initial?.align ?? "left",
    }),
  );

  const update = useCallback((next: Partial<TextStyle>) => {
    setStyle((prev) =>
      buildStyle({
        weight: next.weight ?? prev.weight,
        width: next.width ?? prev.width,
        size: (next.size as TextSize | undefined) ?? prev.size,
        align: (next.align as TextAlign | undefined) ?? prev.align,
      }),
    );
  }, []);

  return { style, update };
}

interface TypographyControlsProps {
  value?: TextStyle;
  onChange: (style: TextStyle) => void;
}

export function TypographyControls({ value, onChange }: TypographyControlsProps) {
  const [internal, setInternal] = useState<TextStyle>(() =>
    value
      ? buildStyle(value)
      : buildStyle({
          weight: 500,
          width: 100,
          size: "m",
          align: "left",
        }),
  );

  const displayStyle = value ? buildStyle(value) : internal;

  const emit = (next: Partial<TextStyle>) => {
    const merged = buildStyle({
      weight: next.weight ?? displayStyle.weight,
      width: next.width ?? displayStyle.width,
      size: (next.size as TextSize | undefined) ?? displayStyle.size,
      align: (next.align as TextAlign | undefined) ?? displayStyle.align,
    });
    setInternal(merged);
    onChange(merged);
  };

  const sizeOptions: { label: string; value: TextSize }[] = useMemo(
    () => [
      { label: "XS", value: "xs" },
      { label: "S", value: "s" },
      { label: "M", value: "m" },
      { label: "L", value: "l" },
      { label: "XL", value: "xl" },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-neutral-800 dark:text-neutral-100">Weight</label>
        <input
          type="range"
          min={100}
          max={900}
          step={50}
          value={displayStyle.weight}
          onChange={(e) => emit({ weight: Number(e.target.value) })}
        />
        <span className="text-xs text-neutral-500">{displayStyle.weight}</span>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-neutral-800 dark:text-neutral-100">Width</label>
        <input
          type="range"
          min={75}
          max={100}
          step={1}
          value={displayStyle.width}
          onChange={(e) => emit({ width: Number(e.target.value) })}
        />
        <span className="text-xs text-neutral-500">{displayStyle.width}%</span>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-neutral-800 dark:text-neutral-100">Size</label>
        <div className="grid grid-cols-5 gap-2">
          {sizeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => emit({ size: option.value })}
              className={`rounded-md border px-2 py-1 text-sm ${
                displayStyle.size === option.value
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-neutral-800 dark:text-neutral-100">Alignment</label>
        <div className="grid grid-cols-3 gap-2">
          {(["left", "center", "right"] as TextAlign[]).map((align) => (
            <button
              key={align}
              type="button"
              onClick={() => emit({ align })}
              className={`rounded-md border px-2 py-1 text-sm capitalize ${
                displayStyle.align === align
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100"
              }`}
            >
              {align}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-dashed border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-3">
        <p
          style={{
            fontWeight: displayStyle.weight,
            fontSize: displayStyle.fontSize,
            lineHeight: displayStyle.lineHeight,
            textAlign: displayStyle.align,
            fontVariationSettings: displayStyle.fontVariationSettings,
          }}
        >
          Sample text using Roboto Flex with your selections.
        </p>
      </div>
    </div>
  );
}
