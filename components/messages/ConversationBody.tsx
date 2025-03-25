import { archiveChat, fetchMessages } from "@/services/messageService";
import {
  ConversationInterface,
  Message,
  UserMessagesInterface,
} from "@/types/messageInterface";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import LoadingButton from "../LoadingButton";
import GhostButton from "../custom_buttons/buttons/GhostButton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatSentAt } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import { Descendant } from "slate";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import PlateEditor from "../ui/plate-editor/PlateEditor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

const ConversationBody = ({
  userId,
  selectedConversation,
}: {
  userId: string;
  selectedConversation: ConversationInterface;
}) => {
  const socketRef = useRef<Socket | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState<number>(0);
  const [messages, setMessages] = useState<UserMessagesInterface[]>([]);
  const [editorValue, setEditorValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);
  const [page, setPage] = useState<number>(1);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const pageSize = 15;
  const maxRetries = 3;

  const fetchUserMessages = useCallback(
    async (newPage: number) => {
      setMessages([]);
      try {
        setLoading(true);
        const response = await fetchMessages({
          userID: userId,
          recipientId: selectedConversation.conversationPartnerId,
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
    [userId, selectedConversation.conversationPartnerId, pageSize]
  );

  const handleArchiveChat = useCallback(async () => {
    setLoading(true);

    try {
      await archiveChat({
        userID: userId,
        recipientId: selectedConversation.conversationPartnerId,
      });

      if (selectedConversation.status) {
        showToast({
          toast,
          type: "success",
          message: "Chat un-archived successfully",
        });
      } else {
        showToast({
          toast,
          type: "success",
          message: "Chat archived successfully",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        if (selectedConversation.status) {
          showToast({
            toast,
            type: "error",
            message: "Could not un-archive selected chat",
          });
        } else {
          showToast({
            toast,
            type: "error",
            message: "Could not archive selected chat",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  }, [
    selectedConversation.conversationPartnerId,
    selectedConversation.status,
    toast,
    userId,
  ]);

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

  useEffect(() => {
    setPage(1);
  }, [selectedConversation.conversationPartnerId]);

  const handleSendMessage = () => {
    const messageText = editorValue
      .map((node) => {
        if ("children" in node) {
          return node.children
            .map((child) => ("text" in child ? child.text : ""))
            .join(" ");
        }
        return "";
      })
      .join("\n")
      .trim();

    if (!messageText) return;

    const message: Message = {
      id: uuidv4(),
      senderID: userId,
      receiverID: selectedConversation.conversationPartnerId,
      content: messageText, // Use extracted text
      timestamp: new Date(),
      sender: "me",
      isArchived: false,
      sentAt: new Date().toISOString(),
    };

    sendMessage(message);

    setEditorValue([
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ]);
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
    setEditorValue([
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ]);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center">
        <div className="font-semibold text-base capitalize">
          {selectedConversation.partnerUsername}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical size={24} className="text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleArchiveChat}>
              {selectedConversation.status ? "Unarchive" : "Archive"}
            </DropdownMenuItem>
            <DropdownMenuItem>Report User</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      <ScrollArea className="h-[40vh]">
        <div className="flex flex-col flex-1 gap-6">
          {loading && (
            <div className="h-4">
              <LoadingButton />
            </div>
          )}
          <GhostButton onClick={() => setPage((prev) => prev + 1)}>
            Load More Messages
          </GhostButton>
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.senderID === userId ? "flex-row-reverse" : ""
                } gap-2`}
              >
                <Avatar
                  className={`flex h-8 w-8 rounded-full ${
                    msg.senderID === userId ? "border-2 border-[#FFE7E7]" : ""
                  }`}
                >
                  <AvatarImage src="" className="border-2 border-[#FFE7E7]" />
                  <AvatarFallback className="text-[#84012A] bg-rose-50 p-1">
                    <span className="text-xs font-semibold">
                      {selectedConversation.partnerUsername
                        ?.split(" ")[0]
                        .charAt(0)}
                      {selectedConversation.partnerUsername
                        ?.split(" ")[1]
                        .charAt(0)}
                    </span>
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col text-sm font-normal">
                    <div
                      className={`flex w-fit rounded-full ${
                        msg.senderID === userId
                          ? "bg-rose-950 text-rose-100 p-3 pl-4 pr-4"
                          : "bg-[#F3EFF0] font-medium text-gray-900 p-3 pl-4 pr-4"
                      }`}
                    >
                      <div className="inline">{msg.content}</div>
                    </div>
                    <div
                      className={`text-[10px] font-medium text-gray-400 self-end`}
                    >
                      {formatSentAt(msg.sentAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex text-sm w-full gap-6 items-center justify-center font-medium text-gray-500 pt-4">
              Start a conversation
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
      </ScrollArea>
      <div className="flex flex-row gap-3 border-t pt-6 border-gray-100 items-start">
        {/* <Textarea
          value={input}
          onChange={(e) =>
            setEditorValue([
              {
                type: "paragraph",
                children: [{ text: e.target.value }],
              },
            ])
          }
          placeholder="Type a message..."
          className="resize-none"
        /> */}
        <PlateEditor
          placeholder="Type a Message..."
          value={editorValue}
          className="w-full"
          onChange={(value) => setEditorValue(value)}
        />
        <Button onClick={() => handleSendMessage()}>Send</Button>
      </div>
    </div>
  );
};

export default ConversationBody;
