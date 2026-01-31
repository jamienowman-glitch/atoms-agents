"use client";

import React from 'react';
import { usePricing } from '../../context/PricingContext';

export function SnaxBalance() {
  const { loading } = usePricing();

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-2 rounded-md bg-gray-100 dark:bg-gray-800 animate-pulse">
         <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600"></div>
         <div className="w-16 h-4 rounded bg-gray-300 dark:bg-gray-600"></div>
      </div>
    );
  }

  // Visual stub of a wallet.
  // In a real implementation, this would fetch the user's actual Snax balance.
  // For now, we display a placeholder.
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-mono text-sm border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
      <span>1,250.00 SNAX</span>
    </div>
  );
}
