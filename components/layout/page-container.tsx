import React from "react";

export default function PageContainer({
  children,
  className, // Added className prop
}: {
  children: React.ReactNode;
  className?: string; // Optional className prop
}) {
  return (
    <div className={`flex flex-1 w-full h-full flex-col gap-6 rounded-xl bg-white ${className}`}>
      {children}
    </div>
  );
}
