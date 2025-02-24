"use client";

import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import LoginPage from "@/app/login/page";
import DashboardPage from "@/app/dashboard/page";
import imageUrl from "@/public/images/Logo_Red.svg";
import Image from "next/image";
import Link from "next/link";
import AccountIcon from "@/components/account/AccountIcon";

export default function Home() {
  const token = useSelector((state: RootState) => state.login.token);

  return (
    <div>
      {token ? (
        <main className="w-full flex-1 overflow-hidden">
          <div className="flex justify-between items-center px-11 h-16 bg-[#FFEBF2]">
            <Link href={"/dashboard"}>
              <Image src={imageUrl} alt={"logo"} height={24} priority />
            </Link>
            <AccountIcon />
          </div>
          <DashboardPage />
        </main>
      ) : (
        <LoginPage />
      )}
    </div>
  );
}
