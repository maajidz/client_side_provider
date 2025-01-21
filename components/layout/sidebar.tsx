'use client';
import React from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/constants/data';
import { cn } from '@/lib/utils';

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {

  return (
    <aside
      className={cn(
        `relative  hidden h-screen flex-none border-r bg-[#84012A] transition-[width] duration-500 md:block w-[72px]`,
        className
      )}
    >
      {/* <ChevronLeft
        className={cn(
          'absolute -right-3 top-10 z-50  cursor-pointer rounded-full border-2 border-[#84012A] bg-[#FFF] text-3xl text-[#84012A]',
          isMinimized && 'rotate-180'
        )}
        onClick={handleToggle}
      /> */}
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>
    </aside>
  );
}
