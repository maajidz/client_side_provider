'use client';
import React from 'react';
import { patientItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { PatientNav } from './patientNav';
import { ScrollArea } from '../ui/scroll-area';

type patientSidebarProps = {
  className?: string;
  userDetailsId: string;
};

export default function PatientSidebar({ className, userDetailsId }: patientSidebarProps) {
  // const { isMinimized, toggle } = useSidebar();

  // const handleToggle = () => {
  //   toggle();
  // };

  const items = patientItems(userDetailsId);

  return (
    <aside
      className={cn(
        `relative  hidden h-screen flex-none border-r bg-[#84012A] transition-[width] duration-500 md:block w-44`,
        className
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <ScrollArea>
              <div>
                <PatientNav items={items} />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </aside>
  );
}
