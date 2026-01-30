"use client";

import { useUtmCapture } from '../../hooks/useUtmCapture';

export function UtmTracker() {
  useUtmCapture();
  return null;
}
