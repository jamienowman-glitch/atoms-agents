import React, { ReactNode } from 'react';

export function WorkbenchLayout({ controlPanel, chatWindow }: { controlPanel: ReactNode, chatWindow: ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {controlPanel}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
         {chatWindow}
      </main>
    </div>
  );
}
