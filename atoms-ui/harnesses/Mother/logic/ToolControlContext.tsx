import React, { createContext, useContext, useState, useCallback } from 'react';

type UseToolState = <T>(key: string, defaultVal: T) => [T, (val: T) => void];

interface ToolControlContextType {
  useToolState: UseToolState;
}

const ToolControlContext = createContext<ToolControlContextType | null>(null);

export const ToolControlProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<Record<string, any>>({});

  const useToolState: UseToolState = useCallback(<T,>(key: string, defaultVal: T): [T, (val: T) => void] => {
    const val = state[key] !== undefined ? state[key] : defaultVal;
    const setVal = (newVal: T) => {
      setState(prev => ({ ...prev, [key]: newVal }));
    };
    return [val, setVal];
  }, [state]);

  return <ToolControlContext.Provider value={{ useToolState }}>{children}</ToolControlContext.Provider>;
};

export const useToolControl = () => {
  const ctx = useContext(ToolControlContext);
  if (!ctx) {
    // Fallback if used outside provider (should be avoided but prevents crash)
    return {
      useToolState: <T,>(key: string, defaultVal: T): [T, (val: T) => void] => {
        const [localVal, setLocalVal] = useState<T>(defaultVal);
        return [localVal, setLocalVal];
      }
    }
  }
  return ctx;
};

export type ToolDefinition = any;
