"use client";

import React, { useCallback, useEffect, useState } from "react"
import { Input } from "@/components/ui/input";
import { UserData } from "@/types/userInterface";
import { fetchUserDataResponse } from "@/services/userServices";
import { PlusIcon, SearchIcon, User, IdCard, Smartphone, Mars, Venus, ExternalLink, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { calculateAge } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import StickyNotesDialog from "../charts/Encounters/Details/StickyNotes/StickyNotesDialog";
import MessagesDialog from "../messages/MessagesDialog";
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


function UserList({
  users,
  onUserSelect,
}: {
  users: UserData[];
  onUserSelect: (user: UserData) => void;
}) {
  // console.log(users);
  return (
    <div className="absolute top-14 left-0 shadow-md rounded-lg space-y-2 w-full p-2 bg-white">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex rounded-md px-4 py-3 hover:cursor-pointer hover:bg-blue-50 flex-row items-center group transition-all duration-400"
          onClick={() => onUserSelect(user)}
        >
          <div className="flex gap-3 items-center w-full">
            <div className="flex bg-pink-50 text-[#63293b] text-lg font-medium rounded-full h-14 w-14 justify-center items-center">
              <span>DB</span>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-1 items-baseline capitalize font-semibold">
                {user.user.firstName} {user.user.lastName}
                <span className="-bottom-[1px] relative">{user.gender === "Male" ? <Mars size={14} strokeWidth={2.5} className="text-blue-400" /> : <Venus size={14} strokeWidth={2.5} className="text-pink-400" />}</span>
              </div>
              <div className="flex gap-2 text-gray-600 text-xs w-full font-semibold">
                <div className="flex child items-center gap-2 border border-gray-200 group-hover:border-blue-200 rounded-2xl px-3 py-1"><IdCard size={16}/>{user.patientId}</div>
                <div className="flex child items-center gap-2 border border-gray-200 group-hover:border-blue-200 rounded-2xl px-3 py-1"><Smartphone size={16}/>{user.user.phoneNumber}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center opacity-0 group-hover:opacity-100">
            <Button variant="link" className="text-cyan-600 text-xs"><ExternalLink />Dashboard</Button>
              <DropdownMenu>
              <Button variant="ghost" className="relative h-6 pl-3 pr-2 text-cyan-600 text-xs gap-1 hover:bg-sky-100 hover:text-sky-600"><DropdownMenuTrigger className="flex flex-row justify-center items-center">New<ChevronDown className="mt-1" /></DropdownMenuTrigger></Button>
                <DropdownMenuContent className="absolute top-0 -left-24 font-medium">
                  <DropdownMenuItem className="group transition-all duration-250"><span className="group-hover:text-sky-600">Encounter</span><PlusIcon className="group-hover:text-sky-600 transition-all scale-50 duration-300 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-1 group-hover:scale-100" size={16}/></DropdownMenuItem>
                  <DropdownMenuItem className="group transition-all duration-250"><span className="group-hover:text-sky-600">Quick RX</span><PlusIcon className="group-hover:text-sky-600 transition-all scale-50 duration-300 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-1 group-hover:scale-100" size={16}/></DropdownMenuItem>
                  <DropdownMenuItem className="group transition-all duration-250"><span className="group-hover:text-sky-600">Task</span><PlusIcon className="group-hover:text-sky-600 transition-all scale-50 duration-300 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-1 group-hover:scale-100" size={16}/></DropdownMenuItem>
                  <DropdownMenuItem className="group transition-all duration-250"><span className="group-hover:text-sky-600">Message</span><PlusIcon className="group-hover:text-sky-600 transition-all scale-50 duration-300 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-1 group-hover:scale-100" size={16}/></DropdownMenuItem>
                  <DropdownMenuItem className="group transition-all duration-250"><span className="group-hover:text-sky-600">Sticky</span><PlusIcon className="group-hover:text-sky-600 transition-all scale-50 duration-300 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-1 group-hover:scale-100" size={16}/></DropdownMenuItem>
                  <DropdownMenuItem className="group transition-all duration-250"><span className="group-hover:text-sky-600">Quick Note</span><PlusIcon className="group-hover:text-sky-600 transition-all scale-50 duration-300 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-1 group-hover:scale-100" size={16}/></DropdownMenuItem>
                  <DropdownMenuItem className="group transition-all duration-250"><span className="group-hover:text-sky-600">Invoice</span><PlusIcon className="group-hover:text-sky-600 transition-all scale-50 duration-300 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-1 group-hover:scale-100" size={16}/></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
      ))}
    </div>
  );
}

function SelectedUserActions({ user }: { user: UserData }) {
  const [isStickyDialogOpen, setIsStickyDialogOpen] = useState<boolean>(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] =
    useState<boolean>(false);
  const baseUrl = `dashboard/provider/patient/${user.user.userDetailsId}`;
  const links = [
    { label: "Dashboard", href: `${baseUrl}/patientDetails` },
    { label: "Encounter", href: `${baseUrl}/encounters` },
    { label: "Quick Rx", href: `${baseUrl}/medications` },
    { label: "Appointment", href: `${baseUrl}/appointments` },
    { label: "Task", href: `${baseUrl}/tasks` },
    { label: "Message", href: `${baseUrl}/messages` },
    { label: "Sticky", href: `${baseUrl}/` },
    { label: "Quick Note", href: `${baseUrl}/quick_notes` },
    // { label: "Invoice", href: `${baseUrl}/` },
    // { label: "Patient Due", href: `${baseUrl}/` },
  ];

  const age = calculateAge(user.dob);

  const openStickyDialog = () => setIsStickyDialogOpen(true);
  const closeStickyDialog = () => setIsStickyDialogOpen(false);

  const openMessageDialog = () => setIsMessageDialogOpen(true);
  const closeMessageDialog = () => setIsMessageDialogOpen(false);

  return (
    <div className="absolute mt-10 space-y-2">
      <div className="border-2 border-white rounded-2xl p-2 shadow-2xl bg-white w-full">
        <div className="flex flex-col gap-3 p-4 w-full">
          <div className="flex gap-3 items-center w-full">
            <div className="bg-[#FFE7E7] p-2 rounded-full">
              <User className="text-[#84012A]" />
            </div>
            <div className="flex gap-2 w-full text-[#717171] text-base font-medium items-center">
              <div className="text-[#84012A]">
                {user.user.firstName?.toUpperCase()}{" "}
                {user.user.lastName?.toUpperCase()}
              </div>
              <div>[{user.user.userDetailsId}]</div>
              <div>
                {user.gender} / {age}
              </div>
              <div>DOB: {user.dob.split("T")[0]}</div>
            </div>
          </div>
          <Separator />
          <div className="flex gap-3 w-full">
            {links.map((link) =>
              link.label === "Sticky" ? (
                <div key={link.label}>
                  <Button variant="ghost" onClick={openStickyDialog}>
                    <div className="flex items-center gap-2 text-[#717171] py-3 px-4 hover:underline hover:text-blue-400 text-xs w-full">
                      <PlusIcon size={16} />
                      <div>{link.label}</div>
                    </div>
                  </Button>
                  <StickyNotesDialog
                    chartId=""
                    onClose={closeStickyDialog}
                    isOpen={isStickyDialogOpen}
                  />
                </div>
              ) : link.label === "Message" ? (
                <div key={link.label}>
                  <Button variant="ghost" onClick={openMessageDialog}>
                    <div className="flex items-center gap-2 text-[#717171] py-3 px-4 hover:underline hover:text-blue-400 text-xs w-full">
                      <PlusIcon size={16} />
                      <div>{link.label}</div>
                    </div>
                  </Button>
                  <MessagesDialog
                    onClose={closeMessageDialog}
                    isOpen={isMessageDialogOpen}
                  />
                </div>
              ) : (
                <Link key={link.label} href={link.href}>
                  <div className="flex flex-row items-center gap-2 text-[#717171] py-3 px-4 hover:underline hover:text-blue-400 text-xs w-full">
                    <PlusIcon size={16} />
                    <div className="w-16">{link.label}</div>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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

  const handleUserSelect = (user: UserData) => {
    setSelectedUser(user);
    setUserData([]);
  };

  return (
    <div className="relative flex flex-col space-y-4 flex-1">
      <div className="flex flex-col relative w-full">
        <div className="flex flex-col w-full relative justify-center gap-1">
        <Label className="text-xs text-gray-700 font-medium" htmlFor="email">Search for patients</Label>
          <div className="flex flex-1 items-center peer-focus-visible:bg-red-700">
          <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedUser(null);
              }}
              placeholder="eg. Frederick Norman or PMG567378..."
              className="w-full h-11 focus-visible:ring-pink-100 focus-visible:ring-2 focus-visible:border-pink-300 hover:border-gray-300 peer"
            />
          <SearchIcon size={20} className="text-[#D5D7DA] absolute right-2 peer-focus-visible:text-[#84012A]" />
          </div>
        </div>
      </div>
      <div className="absolute w-full flex justify-center">
        {loading && (
          <p className="absolute bg-white p-2 rounded shadow-lg">Loading...</p>
        )}
        {!selectedUser && userData.length > 0 ? (
          <UserList users={userData} onUserSelect={handleUserSelect} />
        ) : (
          !selectedUser &&
          !loading &&
          searchTerm && (
            <p className="absolute bg-white p-2 rounded shadow-lg">
              No results found.
            </p>
          )
        )}
        {selectedUser && <SelectedUserActions user={selectedUser} />}
      </div>
    </div>
  );
}
