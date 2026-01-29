"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const DraftHarnessCanvas = dynamic(
  () => import('../../../canvases/draft_harness/DraftHarnessCanvas').then((mod) => mod.DraftHarnessCanvas),
  { ssr: false }
);

export default function DraftHarnessPage() {
  return <DraftHarnessCanvas />;
}
