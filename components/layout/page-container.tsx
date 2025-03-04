import React from "react";

export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 w-full h-full flex-col gap-6 rounded-xl bg-white">
      {children}
    </div>
  );
}
