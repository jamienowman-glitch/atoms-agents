"use client";

import React, { useRef } from "react";

interface UploadButtonProps {
  label?: string;
  icon?: React.ReactNode;
  accept?: string;
  multiple?: boolean;
  onUpload: (files: FileList) => void;
}

export function UploadButton({ label = "Upload", icon, accept, multiple, onUpload }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onUpload(event.target.files);
      event.target.value = "";
    }
  };

  return (
    <div className="inline-flex items-center">
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
        data-atom-id="atom-upload-button"
      >
        {icon}
        <span>{label}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
