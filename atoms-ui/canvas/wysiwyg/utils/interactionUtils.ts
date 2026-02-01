export function disableDragAndDrop(element: HTMLElement) {
    element.style.userSelect = 'none';
    element.style.webkitUserSelect = 'none';
    element.ondragstart = () => false;
}

export function enableDoubleTapEdit(elementId: string, onEdit: (newText: string) => void) {
    let lastTap = 0;
    const element = document.getElementById(elementId);

    if (!element) return;

    // Ensure element can accept focus/clicks
    element.style.userSelect = 'auto'; // Re-enable selection for editing
    element.style.webkitUserSelect = 'auto';

    element.addEventListener('touchend', (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;

        // Double tap threshold
        if (tapLength < 300 && tapLength > 0) {
            e.preventDefault(); // Prevent zoom

            // Make editable
            element.contentEditable = 'true';
            element.focus();

            // Cleanup on blur
            const handleBlur = () => {
                element.contentEditable = 'false';
                onEdit(element.innerText);
                element.removeEventListener('blur', handleBlur);
            };

            element.addEventListener('blur', handleBlur);
        }

        lastTap = currentTime;
    });
}
