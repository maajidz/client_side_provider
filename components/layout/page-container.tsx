import React from 'react';

export default function PageContainer({
  children,
  // scrollable = false
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  console.log(scrollable)
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
      <div className="flex flex-1 w-full h-full flex-col gap-6 rounded-xl p-6 bg-white">
        {children}
      </div>
    </>
  );
}