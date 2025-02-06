import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface ChatMessageProps {
  message: {
    id: string;
    sender: string;
    content: string;
    timestamp: Date;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isSender = message.sender === "me";

  return (
    <div className={`${isSender ? "text-right" : "text-left"} flex flex-col justify-end`}>
      <div className={`flex ${isSender ? "flex-row-reverse" : ""} gap-2`}>
        <Avatar className={`flex h-10 w-10 rounded-full border ${isSender ? "border-2 border-[#FFE7E7]" : ""}`}>
          <AvatarImage src="" />
          <AvatarFallback className="text-[#84012A] bg-[#FFE7E7] p-1">
            <User />
          </AvatarFallback>
        </Avatar>
        <div className={`flex flex-col gap-4 p-4  rounded-lg text-[#444444] ${isSender ? "bg-[#FFE7E7] justify-self-end border-[#84012A4D] border-2" : "bg-[#F9FAFB] border-[#D0D5DD] border-2"}`}>
          <div>{message.content}</div>
          <div className={`text-xs ${isSender ? "text-[#84012A]" : "text-[#444444]"}`}>
            {message.timestamp.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
