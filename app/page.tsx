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
        <main className="w-screen h-screen flex flex-1 bg-gray-100">
          <DashboardPage />
        </main>
      ) : (
        <LoginPage />
      )}
    </div>
  );
}
