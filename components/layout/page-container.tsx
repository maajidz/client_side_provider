import React from 'react';

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
        // <ScrollArea className={cn("h-[calc(100dvh-52px)]")}>
            <div className="flex flex-1 w-full h-full justify-center antialiased">
              {children}
            </div>
        // </ScrollArea>
      ) : (
        <div className="h-full p-4 antialiased">
          {children}
        </div>
      )}
    </>
  );
}