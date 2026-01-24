# SKILL: HOW TO BUILD A COMPLIANT CANVAS

## The Template (Copy-Paste This)
Do not invent your own layout. Use this `WorkbenchShell` pattern.

```tsx
// app/your-surface/page.tsx
import { WorkbenchShell } from '@/components/workbench/WorkbenchShell';
import { YourCanvasCartridge } from '@/components/canvases/YourCanvasCartridge';

export default function YourSurfacePage() {
  return (
    <WorkbenchShell
      // 1. Identity
      surfaceId="your.surface.id"
      
      // 2. The Cartridge (The Logic)
      canvas={(transport) => (
        <YourCanvasCartridge transport={transport} />
      )}
      
      // 3. The Tool Map (The Lens)
      toolMap={{
        leftMagnifier: 'grid.cols',  // Maps Standard Tool -> Your Logic
        rightMagnifier: 'zoom.level' // Maps Standard Tool -> Your Logic
      }}
    />
  );
}
```

## The Cartridge Protocol (Your Logic)
Inside `YourCanvasCartridge.tsx`, you strictly listen:

```tsx
export const YourCanvasCartridge = ({ transport }) => {
  // Listen to the Standard Tool ID mapped above
  const [zoom] = useToolState({ 
    target: { surfaceId: 'your.surface.id', toolId: 'zoom.level' }, 
    defaultValue: 1 
  });

  return <div style={{ transform: `scale(${zoom})` }}>...</div>;
};
```
