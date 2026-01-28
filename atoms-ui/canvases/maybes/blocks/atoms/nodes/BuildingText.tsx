import React from 'react';
import { NodeProps } from 'reactflow';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export const BuildingText = ({ data }: { data: NodeProps['data'] }) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: data.content || '<p>Start writing...</p>',
        // In a real implementation, we'd sync changes back to data/transport
        onUpdate: ({ editor }) => {
            // console.log('Content updated', editor.getHTML());
            // Emit update?
        }
    });

    return (
        <div className="building-text nodrag" style={{ minHeight: '100px', cursor: 'text' }}>
            <EditorContent editor={editor} />
        </div>
    );
};
