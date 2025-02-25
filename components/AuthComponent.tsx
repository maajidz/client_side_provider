"use client";

import LoginPage from "@/app/login/page";
import { RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AuthComponent = ({ children }: { children: React.ReactNode }) => {
  const token = useSelector((state: RootState) => state.login.token);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>; // Prevents flickering
  }

  if (!token) {
    return <LoginPage />;
  }

  return <div>{children}</div>;
};

export default AuthComponent;
