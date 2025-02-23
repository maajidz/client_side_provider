"use client";
import { Message, UserMessagesInterface } from "@/types/messageInterface";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { formatSentAt } from "@/utils/dateUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SendHorizonalIcon } from "lucide-react";
import { fetchMessages } from "@/services/messageService";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";

export default function ChatPage({
  userId,
  recipientId,
}: {
  userId: string;
  recipientId: string;
}) {
  const userDetails = useSelector((state: RootState) => state.user);
  const socketRef = useRef<Socket | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState<number>(0);
  const [messages, setMessages] = useState<UserMessagesInterface[]>([]);
  const [input, setInput] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const pageSize = 15;
  const maxRetries = 3;

  const fetchUserMessages = useCallback(
    async (newPage: number) => {
      try {
        setLoading(true);
        const response = await fetchMessages({
          userID: userId,
          recipientId: recipientId,
          page: newPage,
          pageSize: pageSize,
        });
        if (response) {
          setMessages((prevMessages) => {
            const combinedMessages = [...response.reverse(), ...prevMessages];
            const uniqueMessages = Array.from(
              new Map(combinedMessages.map((msg) => [msg.id, msg])).values()
            );
            return uniqueMessages;
          });
        }
      } catch (error) {
        console.log("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    },
    [userId, recipientId, pageSize]
  );

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages]);

  useEffect(() => {
    fetchUserMessages(page);
  }, [page, fetchUserMessages]);

  const connectSocket = useCallback(() => {
    if (connectionAttempts >= maxRetries) {
      console.error(
        "Max connection attempts reached. Socket connection failed."
      );
      return;
    }

    const socket: Socket = io("wss://api.joinpomegranateapi.com/chat", {
      query: { uuid: userId, type: "provider" },
      reconnectionAttempts: maxRetries,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connection established");
      setConnectionAttempts(0);
    });

    socket.on("receiveMessage", (data) => {
      const message = data;
      console.log(data, "data");
      const newMessage: Message = {
        id: uuidv4(),
        senderID: message.from,
        receiverID: userId,
        content: message.message,
        timestamp: new Date(
          new Date(message.timestamp).getTime() + 5.5 * 60 * 60 * 1000
        ),
        sender: message.senderID === userId ? "me" : "other",
        isArchived: false,
        sentAt: new Date(
          new Date(message.timestamp).getTime() + 5.5 * 60 * 60 * 1000
        ).toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
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
  }, [userId, connectionAttempts]);

  useEffect(() => {
    connectSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [connectSocket]);

  const handleSendMessage = () => {
    if (input.trim()) {
      const message: Message = {
        id: uuidv4(),
        senderID: userId,
        receiverID: recipientId,
        content: input,
        timestamp: new Date(),
        sender: "me",
        isArchived: false,
        sentAt: new Date().toISOString(),
      };
      console.log(message);
      sendMessage(message);
    }
  };

  const sendMessage = (message: Message) => {
    if (socketRef.current) {
      socketRef.current.emit("sendMessage", {
        to: message.receiverID,
        message: message.content,
      });
    }
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, message];
      return updatedMessages;
    });
    setInput("");
  };

  return (
    <div className="flex flex-col gap-8 h-full ">
      <div className="flex justify-between">
        <div className="font-semibold text-base capitalize">
          {userDetails.firstName} {userDetails.lastName}
        </div>
      </div>
      <div className="flex h-[10vh] flex-grow flex-col">
      <ScrollArea className="h-[10vh] flex flex-grow border-t border-gray-100">
        <div className="flex flex-col flex-1 gap-6">
          {loading && (
            <div className="h-4">
              <LoadingButton />
            </div>
          )}
            <Button variant="link" onClick={() => setPage((prev) => prev + 1)}>
              {" "}
              Load More Messages
            </Button>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start ${
                msg.senderID === userId ? "flex-row-reverse" : ""
              } gap-2`}
            >
              <Avatar
                className={`flex h-8 w-8 rounded-full ${
                  msg.senderID === userId ? "" : ""
                }`}
              >
                <AvatarImage src="" className="border-2 border-[#FFE7E7]"/>
                <AvatarFallback className="text-[#84012A] bg-[#FFE7E7] p-1">
                  <span className="text-xs font-semibold">AF</span>
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
              <div className="flex flex-col text-sm font-normal">
              <div
                className={`${
                  msg.senderID === userId
                    ? "flex w-fit rounded-full bg-rose-950 text-rose-100 p-3 pl-4 pr-4"
                    : "flex w-fit rounded-full bg-gray-300/50 text-gray-900 p-3 pl-4 pr-4"
                }`}
              >
              <div className="inline">{msg.content}</div>
              </div>
              {/* <div ref={chatEndRef} /> */}
            </div>
            <div
              className={`${
                msg.senderID === userId
                  ? "text-[10px] font-medium text-gray-400 self-end"
                  : "text-[10px] font-medium text-gray-400 self-end"
              }`}>
                    {formatSentAt(msg.sentAt)}
            </div>
            </div>
            </div>
          ))}
          <div ref={endOfMessagesRef} />
        </div>
      </ScrollArea>
      <div className="flex flex-row gap-3 border-t pt-6 border-gray-100 items-start">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="resize-none"
        />
        <Button onClick={() => handleSendMessage()}>Send<SendHorizonalIcon type=""/></Button>
      </div>
      </div>
    </div>
  );
}
