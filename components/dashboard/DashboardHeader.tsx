"use client"

import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";

const DashboardHeader = () => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const firstName = providerDetails?.firstName || "User";
  const lastName = providerDetails?.lastName || "";

  return (
    <h2 className="text-2xl font-bold text-center">
      Hi, {firstName} {lastName} Welcome back 👋
    </h2>
  );
};

export default DashboardHeader;
