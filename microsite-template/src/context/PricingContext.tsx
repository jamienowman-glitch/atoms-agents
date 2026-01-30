"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of our context
interface PricingContextType {
  price: number;
  discountedPrice: number | null;
  currency: string;
  loading: boolean;
  refreshPricing: () => Promise<void>;
}

// Default values
const defaultContext: PricingContextType = {
  price: 0,
  discountedPrice: null,
  currency: 'USD',
  loading: true,
  refreshPricing: async () => {},
};

const PricingContext = createContext<PricingContextType>(defaultContext);

export function usePricing() {
  return useContext(PricingContext);
}

interface PricingProviderProps {
  children: ReactNode;
}

export function PricingProvider({ children }: PricingProviderProps) {
  const [price, setPrice] = useState<number>(100); // Default stub price
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>('USD');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPricing = async () => {
    setLoading(true);
    try {
      // Mock fetch to atoms-core
      // In production, this would be fetch('/api/pricing') or similar
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate latency

      // Mock logic: Check for discount policy
      const randomDiscount = Math.random() > 0.5;

      setPrice(100);
      setCurrency('USD');

      if (randomDiscount) {
          setDiscountedPrice(80);
      } else {
          setDiscountedPrice(null);
      }

    } catch (error) {
      console.error("Failed to fetch pricing", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  return (
    <PricingContext.Provider value={{ price, discountedPrice, currency, loading, refreshPricing: fetchPricing }}>
      {children}
    </PricingContext.Provider>
  );
}
