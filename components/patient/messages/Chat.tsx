"use client";
import { Message, UserMessagesInterface } from "@/types/messageInterface";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import messageStyles from "./messages.module.css";
import { formatSentAt } from "@/utils/dateUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { fetchMessages } from "@/services/messageService";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function ChatPage({
  userId,
  recipientId,
}: {
  userId: string;
  recipientId: string;
}) {
  const socketRef = useRef<Socket | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState<number>(0);
  const [messages, setMessages] = useState<UserMessagesInterface[]>([]);
  const [input, setInput] = useState("");
  const [page, setPage] = useState(1);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const pageSize = 15;
  const maxRetries = 3;

  const fetchUserMessages = useCallback(
    async (newPage: number) => {
      try {
        const response = await fetchMessages({
          userID: userId,
          recipientId: recipientId,
          page: newPage,
          pageSize: pageSize,
        });
        if (response) setMessages(response.reverse());
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    },
    [userId, recipientId, pageSize]
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

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
    <div className="flex flex-col p-4 gap-2">
      <div 
      className="flex flex-col"
      // className={`${cn("h-[calc(55dvh-52px)] rounded-md p-4")}`}
      >
      <button
        onClick={() => setPage((prev) => prev + 1)}
        className="p-2 mb-2 bg-gray-300 rounded"
      >
        Load More Messages
      </button>
        <div className="flex flex-col flex-1 gap-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.senderID === userId ? "flex-row-reverse" : ""
              } gap-2`}
            >
              <Avatar
                className={`flex h-10 w-10 rounded-full border ${
                  msg.senderID === userId ? "border-2 border-[#FFE7E7]" : ""
                }`}
              >
                <AvatarImage src="" />
                <AvatarFallback className="text-[#84012A] bg-[#FFE7E7] p-1">
                  <User />
                </AvatarFallback>
              </Avatar>
              <div
                className={`${
                  msg.senderID === userId
                    ? messageStyles.senderMessageBody
                    : messageStyles.recieverMessageBody
                }`}
              >
                <div className={messageStyles.messageBody}>
                  <div className={messageStyles.message}>{msg.content}</div>
                  <div
                    className={`${
                      msg.senderID === userId
                        ? messageStyles.senderTimeStamp
                        : messageStyles.recieverTimeStamp
                    }`}
                  >
                    {formatSentAt(msg.sentAt)}
                  </div>
                </div>
              </div>
              <div ref={chatEndRef} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-l-lg"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}
