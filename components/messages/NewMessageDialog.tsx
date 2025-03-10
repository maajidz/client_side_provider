import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useToast } from "@/components/ui/use-toast";
import { io, Socket } from "socket.io-client";
import { Message } from "@/types/messageInterface";
import { fetchUserDataResponse } from "@/services/userServices";
import { Label } from "../ui/label";
import { UserData } from "@/types/userInterface";
import { showToast } from "@/utils/utils";

const NewMessageDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const socketRef = useRef<Socket | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userData, setUserData] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const providerDetails = useSelector((state: RootState) => state.login);
  const { toast } = useToast();
  const maxRetries = 3;

  const connectSocket = useCallback(() => {
    if (connectionAttempts >= maxRetries) {
      console.error(
        "Max connection attempts reached. Socket connection failed."
      );
      return;
    }

    const socket: Socket = io("wss://api.joinpomegranateapi.com/chat", {
      query: { uuid: providerDetails.providerId, type: "provider" },
      reconnectionAttempts: maxRetries,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connection established");
      setConnectionAttempts(0);
    });

    socket.on("disconnect", (reason) => {
      if (
        reason === "io server disconnect" ||
        connectionAttempts < maxRetries
      ) {
        console.log("Attempting to reconnect...");
        setConnectionAttempts((prevAttempts) => prevAttempts + 1);
        setTimeout(connectSocket, 3000);
      }
    });
  }, [providerDetails.providerId, connectionAttempts]);

  useEffect(() => {
    connectSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [connectSocket]);

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

  const handleSendMessage = () => {
    if (input.trim() && selectedUser?.user.userDetailsId) {
      const message: Message = {
        id: uuidv4(),
        senderID: providerDetails.providerId,
        receiverID: selectedUser?.user.userDetailsId,
        content: input,
        timestamp: new Date(),
        sender: "me",
        isArchived: false,
        sentAt: new Date().toISOString(),
      };
      sendMessage(message);
      showToast({
        toast,
        type: "success",
        message: "Password changed successfully",
      });
      onClose();
    }
  };

  const sendMessage = (message: Message) => {
    if (socketRef.current) {
      socketRef.current.emit("sendMessage", {
        to: message.receiverID,
        message: message.content,
      });
    }
    console.log(message);
    setInput("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col gap-6 p-6">
        <DialogHeader>
          <DialogTitle className="text-[#84012A] text-xl font-semibold text-center">
            New Message
          </DialogTitle>
          <DialogDescription className="text-[#475467] text-sm font-normal text-center border-b pb-6">
            Start your new conversation by providing following details
          </DialogDescription>
          <div className="flex flex-col gap-6 pt-6 h-[20rem]">
            {!selectedUser && (
              <div className="flex flex-col relative w-full">
                <div className="flex flex-col w-full relative justify-center gap-2">
                  <Label
                    className="text-xs text-gray-700 font-medium"
                    htmlFor="email"
                  >
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
            )}
            <div className="absolute w-full flex justify-center">
              {loading && <UserCardShimmer />}
              {!selectedUser && userData.length > 0 ? (
                <div className="absolute top-14 left-0 shadow-md rounded-lg space-y-2 w-full p-2 bg-white z-50">
                  {userData.map((user) => (
                    <div
                      key={user.id}
                      className="flex gap-3 items-center w-full"
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex bg-pink-50 text-[#63293b] text-lg font-medium rounded-full h-10 w-12 justify-center items-center">
                        <span className="uppercase">
                          {user.user.firstName?.charAt(0)}
                          {user.user.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div className="flex gap-1 w-full items-baseline capitalize font-semibold">
                        {user.user.firstName} {user.user.lastName}
                      </div>
                    </div>
                  ))}
                </div>
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
            {selectedUser && (
              <div className="flex flex-col gap-3 w-full">
                <div className="flex gap-1 w-full items-baseline font-medium">
                  Sending message to{" "}
                  <span className="capitalize">
                    {selectedUser.user.firstName} {selectedUser.user.lastName}
                  </span>
                </div>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full"
                />
                <Button
                  className="border-collapse border-[#84012A] bg-[#84012A] items-center"
                  onClick={() => handleSendMessage()}
                >
                  Submit Request
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageDialog;

const UserCardShimmer = () => {
  return (
    <div className="flex px-4 py-3 animate-pulse bg-gray-100 flex-row items-center absolute top-14 left-0 shadow-md rounded-lg space-y-2 w-full p-2 z-50">
      <div className="flex gap-3 items-center w-full">
        <div className="h-14 w-14 bg-gray-300 rounded-full"></div>
        <div className="flex flex-col gap-2 w-full">
          <div className="h-4 w-32 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};
