"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { UserData } from "@/types/userInterface";
import { fetchUserDataResponse } from "@/services/userServices";
import { PlusIcon, SearchIcon, User } from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { calculateAge } from "@/utils/utils";
import { Button } from "../ui/button";
import StickyNotesDialog from "../charts/Encounters/Details/StickyNotes/StickyNotesDialog";
import MessagesDialog from "../messages/MessagesDialog";

function UserList({
  users,
  onUserSelect,
}: {
  users: UserData[];
  onUserSelect: (user: UserData) => void;
}) {
  return (
    <div className="absolute mt-10 space-y-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="border-2 border-white rounded-2xl p-2 shadow-2xl bg-white"
          onClick={() => onUserSelect(user)}
        >
          <div className="flex gap-3 p-4 items-center w-full">
            <div className="bg-[#FFE7E7] p-2 rounded-full">
              <User className="text-[#84012A]" />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="text-[#84012A] text-base font-medium">
                {user.user.firstName} {user.user.lastName}
              </div>
              <div className="flex flex-wrap gap-2 text-[#717171] text-xs font-normal w-full">
                <div>ID: {user.user.userDetailsId}</div>
                <div>DOB: {user.dob.split("T")[0]}</div>
                <div> ✉️ {user.user.email}</div>
              </div>
            </div>
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
    <div className="relative flex flex-col space-y-4 w-full items-center">
      <div className="flex flex-row gap-2 border border-[#84012A] px-2 rounded-full items-center w-96 justify-center justify-items-center">
        <SearchIcon size={25} className="text-[#84012A]" />
        <Input
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedUser(null);
          }}
          placeholder="Search patient..."
          className="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
        />
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
