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
      {/* {scrollable ? (
            <div className="flex flex-1 w-full h-full justify-center">
              {children}
            </div>
      ) : (
        <div className="h-full p-4 antialiased">
          {children}
        </div>
      )} */}
      <div className="flex flex-1 w-full h-full flex-col pl-8 gap-6">
        {children}
      </div>
    </>
  );
}