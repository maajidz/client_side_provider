"use client";

import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import LoginPage from "@/app/login/page";
import DashboardPage from "@/app/dashboard/page";

export default function Home() {
  const token = useSelector((state: RootState) => state.login.token);

  return (
    <div>
      {token ? (
        <main className="w-full flex-1 bg-gray-100">
          {/* <div className="flex justify-between items-center px-11 h-16">
            <Link href={"/dashboard"}>
              <Image src={imageUrl} alt={"logo"} height={24} priority />
            </Link>
            <AccountIcon />
          </div> */}
          <DashboardPage />
        </main>
      ) : (
        <LoginPage />
      )}
    </div>
  );
}
