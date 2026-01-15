import React from 'react';
import { AtomProps } from '@northstar/builder-registry';

interface GuideItem {
    id: string;
    title: string;
    content: string;
}

export const GuidesBlock: React.FC<AtomProps> = ({ properties, isSelected, onClick }) => {
    const layoutMode = properties['layout.mode'] || 'faq';

    // Mock items since we don't have a child-atom structure for these internally in this simple demo
    // In a real app, these would be child atoms or a complex 'items' token.
    // For this P0, we render a static example based on mode.
    const items: GuideItem[] = [
        { id: '1', title: 'Question 1', content: 'Answer to question 1.' },
        { id: '2', title: 'Question 2', content: 'Answer to question 2.' },
        { id: '3', title: 'Question 3', content: 'Answer to question 3.' }
    ];

    return (
        <div
            onClick={onClick}
            style={{
                padding: '16px',
                border: isSelected ? '2px solid #005bd3' : '1px solid transparent',
                borderRadius: '8px',
                background: '#fff',
                margin: '16px 0'
            }}
        >
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '12px', textTransform: 'uppercase' }}>
                Guide: {layoutMode}
            </div>

            {layoutMode === 'faq' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {items.map(item => (
                        <div key={item.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                            <div style={{ fontWeight: 600 }}>{item.title}</div>
                            <div style={{ fontSize: '14px', color: '#444' }}>{item.content}</div>
                        </div>
                    ))}
                </div>
            )}

            {layoutMode === 'profile' && (
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ddd' }}></div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '18px' }}>John Doe</div>
                        <div style={{ color: '#666' }}>Senior Engineer</div>
                    </div>
                </div>
            )}

            {layoutMode === 'howto' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ background: '#000', color: '#fff', width: '24px', height: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>1</div>
                        <div>Step 1: Do this thing.</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ background: '#000', color: '#fff', width: '24px', height: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>2</div>
                        <div>Step 2: Do the next thing.</div>
                    </div>
                </div>
            )}
        </div>
    );
};
