import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export default function PageContainer({
  children,
  scrollable = false
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className={cn("h-[calc(100dvh-52px)]")}>
          <div className="h-full p-4 md:px-8">
            <div>
            {children}
            </div>
          </div>
        </ScrollArea>
      ) : (
        <div className="h-full p-4 md:px-8">
          {children}
        </div>
      )}
    </>
  );
}
