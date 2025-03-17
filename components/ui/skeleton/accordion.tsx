import React from 'react';

const AccordionSkeleton = ({ className }: { className?: string }) => {
    return (
        <div className={`h-16 w-full flex flex-row justify-between gap-4 bg-white rounded ${className}`}>
            <div className="flex h-2 w-2/3 animate-pulse transition-colors rounded-full bg-gray-100 flex-row gap-2">
            </div>
            <div className="flex h-2 w-1/3 animate-pulse transition-colors rounded-full bg-gray-100 flex-row gap-2">
            </div>
        </div>
    );
};

export default AccordionSkeleton;