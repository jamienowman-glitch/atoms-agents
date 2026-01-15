import { CanvasState } from '@northstar/canvas-kernel';
import { AtomId } from '@northstar/contracts';

const renderAtom = (atomId: AtomId, state: CanvasState): string => {
    const atom = state.atoms[atomId];
    if (!atom) return '';

    const childrenHtml = (atom.children || [])
        .map(childId => renderAtom(childId, state))
        .join('');

    const style = Object.entries(atom.properties)
        .filter(([key]) => key !== 'text' && key !== 'src') // content props
        .map(([key, val]) => `${key}:${val}`)
        .join(';');

    switch (atom.type) {
        case 'text':
            return `<div id="${atomId}" style="${style}">${atom.properties.text || ''}</div>`;
        case 'image':
            return `<img id="${atomId}" src="${atom.properties.src}" style="${style}" />`;
        case 'box':
        default:
            return `<div id="${atomId}" style="${style}">${childrenHtml}</div>`;
    }
};

export function renderToHtml(state: CanvasState): string {
    return `
<!DOCTYPE html>
<html>
<head><style>body { margin: 0; }</style></head>
<body>
    ${state.rootAtomIds.map(id => renderAtom(id, state)).join('')}
</body>
</html>`;
}
