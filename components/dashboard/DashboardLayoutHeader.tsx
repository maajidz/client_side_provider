import React from "react";
import imageUrl from "@/public/images/Logo_Red.svg";
import Image from "next/image";
import Link from "next/link";

const DashboardLayoutHeader = () => {
  return (
    <div className="flex justify-between items-center p-4">
      <Link href={"/dashboard"}>
        <Image src={imageUrl} alt={"logo"} height={24} priority />
      </Link>
    </div>
  );
};

export default DashboardLayoutHeader;
