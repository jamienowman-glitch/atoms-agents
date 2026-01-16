import React, { useState } from 'react';
import { RegistryCard } from './ui/RegistryCard';
import { RegistryHeader } from './ui/RegistryHeader';
import { AddButton } from './ui/AddButton';

type Category = 'connectors' | 'muscle' | 'safety' | 'firearms' | 'utm';

const CATEGORIES: { id: Category; label: string }[] = [
    { id: 'connectors', label: 'Connectors' },
    { id: 'muscle', label: 'Muscle' },
    { id: 'safety', label: 'Safety' },
    { id: 'firearms', label: 'Firearms' },
    { id: 'utm', label: 'UTM' },
];

const MOCK_CONNECTORS = [
    { id: '1', title: 'Shopify', subtitle: 'E-commerce platform integration', status: 'Active' },
    { id: '2', title: 'YouTube', subtitle: 'Video content publishing', status: 'Active' },
    { id: '3', title: 'Instagram', subtitle: 'Social media feed & posting', status: 'Paused' },
    { id: '4', title: 'Stripe', subtitle: 'Payment processing', status: 'Draft' },
];

export const RegistryManager: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
    const [activeCategory, setActiveCategory] = useState<Category>('connectors');

    const renderGrid = () => {
        // For now, only Connectors has mock data, others will show just the Add button
        const items = activeCategory === 'connectors' ? MOCK_CONNECTORS : [];

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item) => (
                    <RegistryCard
                        key={item.id}
                        title={item.title}
                        subtitle={item.subtitle}
                        status={item.status}
                        onEdit={() => console.log('Edit', item.id)}
                        onDelete={() => console.log('Delete', item.id)}
                    />
                ))}

                {/* Plus Button is always at the end */}
                <AddButton onClick={() => console.log('Add New in', activeCategory)} />
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-row font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-zinc-200 border-r border-black flex flex-col pt-20 pb-10 px-0 animate-in slide-in-from-left duration-300">
                <div className="px-6 mb-8">
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-black mb-1">Registry</h2>
                    <p className="text-xs font-mono text-zinc-500">System Admin v1.0</p>
                </div>

                <nav className="flex-1 overflow-y-auto">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`w-full text-left px-6 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-y border-transparent -mt-[1px]
                                ${activeCategory === cat.id
                                    ? 'bg-black text-white border-black z-10'
                                    : 'text-zinc-600 hover:bg-zinc-300 hover:text-black'
                                }
                            `}
                        >
                            {cat.label}
                        </button>
                    ))}
                </nav>

                <div className="px-6 mt-auto">
                    <div className="text-[10px] text-zinc-400 font-mono">
                        Global Configuration
                    </div>
                </div>
            </div>

            {/* Main Stage */}
            <div className="flex-1 bg-zinc-950 flex flex-col relative animate-in fade-in duration-300 delay-75">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-20 w-10 h-10 bg-black border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-8 md:p-12">
                    <RegistryHeader breadcrumbs={[activeCategory]} />

                    {renderGrid()}
                </div>
            </div>
        </div>
    );
};
