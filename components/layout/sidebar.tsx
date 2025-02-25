'use client';
import React from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/constants/data';
import AccountIcon from '../account/AccountIcon';
import Link from 'next/link';
import imageUrl from "@/public/images/logo_initial.svg";
import Image from "next/image";

// type SidebarProps = {
//   className?: string;
// };

export default function Sidebar() {

  return (
    <aside
      className="flex relative h-full flex-col transition-[width] duration-500 items-center justify-between w-[72px] py-12">
      <div className='flex flex-1 items-center flex-col gap-6'>
        <Link href={"/dashboard"}>
          <Image src={imageUrl} alt={"logo"} height={24} priority />
        </Link>
        <DashboardNav items={navItems} />
      </div>
      <AccountIcon />
    </aside>
  );
}
