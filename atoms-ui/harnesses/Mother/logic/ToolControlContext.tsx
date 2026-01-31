import React, { createContext, useContext } from 'react';

const ToolControlContext = createContext<any>(null);

export const ToolControlProvider = ({ children }: { children: React.ReactNode }) => {
  return <ToolControlContext.Provider value={{}}>{children}</ToolControlContext.Provider>;
};

export const useToolControl = () => useContext(ToolControlContext);

export type ToolDefinition = any;
