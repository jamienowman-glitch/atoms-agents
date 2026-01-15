"use client";

import React, { useEffect, useMemo, useState } from "react";
import { TextBlock as TextBlockModel, TextStyle } from "../../../types/multi21";
import { TypographyControls, useTypography } from "../tools/TypographyControls";

interface TextBlockProps {
  block: TextBlockModel;
  onChange?: (next: TextBlockModel) => void;
}

export function TextBlock({ block, onChange }: TextBlockProps) {
  const { style, update } = useTypography(block.style);
  const [content, setContent] = useState(block.content);

  useEffect(() => {
    setContent(block.content);
    update(block.style);
  }, [block.content, block.style, update]);

  const Tag = useMemo(() => {
    if (block.role === "headline") return "h2";
    if (block.role === "subhead") return "h3";
    return "p";
  }, [block.role]);

  const applyChange = (nextContent: string, nextStyle: TextStyle = style) => {
    onChange?.({
      ...block,
      content: nextContent,
      style: nextStyle,
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-neutral-500">Text Block · {block.role}</p>
      </div>

      <div className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 p-3">
        <Tag
          contentEditable
          suppressContentEditableWarning
          className="outline-none"
          style={{
            fontWeight: style.weight,
            fontSize: style.fontSize,
            lineHeight: style.lineHeight,
            textAlign: style.align,
            fontVariationSettings: style.fontVariationSettings,
          }}
          onInput={(event) => {
            const text = event.currentTarget.textContent || "";
            setContent(text);
            applyChange(text, style);
          }}
        >
          {content}
        </Tag>
      </div>

      <TypographyControls
        value={style}
        onChange={(next) => {
          update(next);
          applyChange(content, next);
        }}
      />
    </div>
  );
}
