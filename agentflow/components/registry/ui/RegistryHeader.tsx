import React from 'react';

interface RegistryHeaderProps {
    breadcrumbs: string[];
}

export const RegistryHeader: React.FC<RegistryHeaderProps> = ({ breadcrumbs }) => {
    return (
        <div className="flex flex-col gap-2 mb-8 font-sans">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-neutral-400 text-sm font-medium uppercase tracking-widest">
                <span className="text-neutral-500">System</span>
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                        <span className="text-neutral-600">/</span>
                        <span className={index === breadcrumbs.length - 1 ? "text-white" : ""}>
                            {crumb}
                        </span>
                    </React.Fragment>
                ))}
            </div>

            {/* Title - using the last breadcrumb as the main title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                {breadcrumbs[breadcrumbs.length - 1]}
            </h1>
        </div>
    );
};
