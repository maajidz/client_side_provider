"use client";

import { RootState } from "@/store/store";
import { User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultButton from "../custom_buttons/buttons/DefaultButton";
import { useRouter } from "next/navigation";
import { resetLoginData } from "@/store/slices/loginSlice";
import { Avatar, AvatarImage } from "../ui/avatar";

function AccountIcon() {
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const providerDetails = useSelector((state: RootState) => state.login);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleShowDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Hide the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
    <Avatar
        className="w-10 h-10 rounded-md cursor-pointer border-2 border-[#E9DFE9]"
        onClick={handleShowDropdown}>
      <AvatarImage src="https://i.pravatar.cc/150?img=3" />
    </Avatar>
      {showDropdown && (
        <div className="flex flex-col gap-6 absolute left-0 bottom-0 translate-x-[10%] mt-2 w-[450px] p-4 bg-white shadow-lg rounded-xl z-50">
          <div className="flex items-center gap-3">
            <User
              color="#84012A"
              className="flex gap-2.5 w-8 h-8 p-1.5 rounded-full cursor-pointer"
            />
            <div className="flex flex-col gap-2">
              <span className="text-base font-medium text-[#84012a]">
                {providerDetails.firstName} {providerDetails.lastName}
              </span>
              <span className="text-xs font-normal text-[#717171]">
                {providerDetails.roleName}
              </span>
              <span className="text-xs font-normal text-[#717171]">
                User ID: {providerDetails.providerId}
              </span>
              <div className="flex items-start gap-2.5 px-4 py-2.5 rounded-md">
                <Link
                  href="/dashboard/provider/account"
                  className="text-xs font-semibold text-[#84012A] hover:underline"
                  onClick={handleShowDropdown}
                >
                  My Account
                </Link>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <DefaultButton
              onClick={() => {
                dispatch(resetLoginData());
                router.push("/");
              }}
            >
              Sign Out
            </DefaultButton>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountIcon;
