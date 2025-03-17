"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { UserData } from "@/types/userInterface";
import { fetchUserDataResponse } from "@/services/userServices";
import {
  PlusIcon,
  SearchIcon,
  IdCard,
  Smartphone,
  Mars,
  Venus,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StickyNotesDialog from "../charts/Encounters/Details/StickyNotes/StickyNotesDialog";
import MessagesDialog from "../messages/MessagesDialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

function UserList({ users }: { users: UserData[] }) {
  const router = useRouter();
  const [isStickyDialogOpen, setIsStickyDialogOpen] = useState<boolean>(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] =
    useState<boolean>(false);

  const openStickyDialog = () => setIsStickyDialogOpen(true);
  const closeStickyDialog = () => setIsStickyDialogOpen(false);

  const openMessageDialog = () => setIsMessageDialogOpen(true);
  const closeMessageDialog = () => setIsMessageDialogOpen(false);

  const links = [
    { label: "Encounter", href: `encounters` },
    { label: "Quick Rx", href: `medications` },
    { label: "Appointment", href: `appointments` },
    { label: "Task", href: `tasks` },
    { label: "Message", href: `messages` },
    { label: "Sticky", href: `` },
    { label: "Note", href: `notes` },
    // { label: "Invoice", href: `/` },
    // { label: "Patient Due", href: `/` },
  ];
  return (
    <div className="absolute top-14 left-0 shadow-md rounded-lg space-y-2 w-full p-2 bg-white z-50">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex rounded-md px-4 py-3 hover:cursor-pointer hover:bg-blue-50 flex-row items-center group transition-all duration-400"
        >
          <div
            className="flex gap-3 items-center w-full"
            onClick={() =>
              router.push(
                `/dashboard/provider/patient/${user.user.userDetailsId}/patientDetails`
              )
            }
          >
            <div className="flex bg-pink-50 text-[#63293b] text-lg font-medium rounded-full h-14 w-14 justify-center items-center">
              <span className="uppercase">
                {user.user.firstName?.charAt(0)}
                {user.user.lastName?.charAt(0)}
              </span>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-1 items-baseline capitalize font-semibold">
                {user.user.firstName} {user.user.lastName}
                <span className="-bottom-[1px] relative">
                  {user.gender === "Male" ? (
                    <Mars
                      size={14}
                      strokeWidth={2.5}
                      className="text-blue-400"
                    />
                  ) : (
                    <Venus
                      size={14}
                      strokeWidth={2.5}
                      className="text-pink-400"
                    />
                  )}
                </span>
              </div>
              <div className="flex gap-2 text-gray-600 text-xs w-full font-semibold">
                <div className="flex child items-center gap-2 border border-gray-200 group-hover:border-blue-200 rounded-2xl px-3 py-1">
                  <IdCard size={16} />
                  {user.patientId}
                </div>
                <div className="flex child items-center gap-2 border border-gray-200 group-hover:border-blue-200 rounded-2xl px-3 py-1">
                  <Smartphone size={16} />
                  {user.user.phoneNumber}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center opacity-0 group-hover:opacity-100">
            <Button
              variant="link"
              className="text-cyan-600 text-xs font-medium"
              onClick={() =>
                router.push(
                  `/dashboard/provider/patient/${user.user.userDetailsId}/dashboard`
                )
              }
            >
              <ExternalLink />
              Dashboard
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="relative flex font-medium flex-row justify-center items-center text-sky-600 text-xs hover:bg-sky-100 px-2 rounded-md">
                New
                <ChevronDown className="mt-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {links.map((link) =>
                  link.label === "Sticky" ? (
                    <DropdownMenuItem
                      key={link.label}
                      className="font-medium group hover:first:text-sky-600 hover:text-sky-600  flex flex-1 w-full"
                      onClick={openStickyDialog}
                    >
                      {link.label}{" "}
                      <PlusIcon
                        className="text-sky-600  group-hover:ml-2  transition-all opacity-0 group-hover:opacity-100"
                        size={16}
                      />
                    </DropdownMenuItem>
                  ) : link.label === "Message" ? (
                    <DropdownMenuItem
                      key={link.label}
                      className="font-medium group hover:first:text-sky-600 hover:text-sky-600  flex flex-1 w-full"
                      onClick={openMessageDialog}
                    >
                      {link.label}{" "}
                      <PlusIcon
                        className="text-sky-600  group-hover:ml-2  transition-all opacity-0 group-hover:opacity-100"
                        size={16}
                      />
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      key={link.label}
                      className="font-medium group hover:first:text-sky-600 hover:text-sky-600  flex flex-1 w-full"
                      onClick={() => {
                        router.push(
                          `/dashboard/provider/patient/${user.user.userDetailsId}/${link.href}`
                        );
                      }}
                    >
                      {link.label}{" "}
                      <PlusIcon
                        className="text-sky-600  group-hover:ml-2  transition-all opacity-0 group-hover:opacity-100"
                        size={16}
                      />
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
      <StickyNotesDialog
        chartId=""
        onClose={closeStickyDialog}
        isOpen={isStickyDialogOpen}
      />
      <MessagesDialog
        onClose={closeMessageDialog}
        isOpen={isMessageDialogOpen}
      />
    </div>
  );
}

const UserCardShimmer = () => {
  return (
    <div className="flex px-4 py-3 animate-pulse bg-gray-100 flex-row items-center absolute top-14 left-0 shadow-md rounded-lg space-y-2 w-full p-2 z-50">
      <div className="flex gap-3 items-center w-full">
        <div className="h-14 w-14 bg-gray-300 rounded-full"></div>
        <div className="flex flex-col gap-2 w-full">
          <div className="h-4 w-32 bg-gray-300 rounded-md"></div>
          <div className="flex gap-2 text-gray-600 text-xs w-full">
            <div className="h-6 w-20 bg-gray-300 rounded-md"></div>
            <div className="h-6 w-24 bg-gray-300 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function SearchInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchUserDataResponse({
        firstName: searchTerm,
      });

      if (response) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() && !selectedUser) {
        handleSearch();
      } else {
        setUserData([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedUser, handleSearch]);

  return (
    <div className="relative flex flex-col w-full">
      <div className="flex flex-col relative w-full">
        <div className="flex flex-col w-full relative justify-center gap-2">
          <Label className="text-xs text-gray-700 font-medium" htmlFor="email">
            Search for patients
          </Label>
          <div className="flex flex-1 items-center peer-focus-visible:bg-red-700">
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedUser(null);
              }}
              placeholder="eg. Frederick Norman or PAT567378..."
              className="w-full h-11 focus-visible:ring-pink-100 focus-visible:ring-2 focus-visible:border-pink-300 hover:border-gray-300 peer"
            />
            <SearchIcon
              size={20}
              className="text-[#D5D7DA] absolute right-2 peer-focus-visible:text-[#84012A]"
            />
          </div>
        </div>
      </div>
      <div className="absolute w-full flex justify-center">
        {loading && <UserCardShimmer />}
        {!selectedUser && userData.length > 0 ? (
          <UserList users={userData} />
        ) : (
          !selectedUser &&
          !loading &&
          userData.length === 0 &&
          searchTerm.length > 1 && (
            <p className="absolute top-14 left-0 shadow-md rounded-lg text-md text-gray-500 space-y-2 w-full p-4 bg-white">
              No results found.
            </p>
          )
        )}
      </div>
    </div>
  );
}
