import { ConversationInterface } from "@/types/messageInterface";
import { formatSentAt } from "@/utils/dateUtils";
import React from "react";
import styles from "@/components/messages/styles.module.css";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardHeader, CardTitle, CardFooter, CardContent } from "../ui/card";

const ConversationCard = ({
  conversation,
  highlighted = false,
  onClick,
}: {
  conversation: ConversationInterface;
  highlighted?: boolean;
  onClick?: () => void;
}) => {
  return (
    <Card
      onClick={onClick}
      className={`${
        highlighted ? "border border-[#84012A]" : ""
      }`}
      key={conversation.recentMessageSenderId}
    >
      <CardHeader className="flex flex-row items-center gap-2">
        <Avatar className="flex h-10 w-10 rounded-full border-2 border-[#FFE7E7]">
          <AvatarImage src="" />
          <AvatarFallback className="text-[#84012A] bg-[#FFE7E7] text-xs font-semibold">
            {conversation.partnerUsername?.split(" ")[0].charAt(0)}
            {conversation.partnerUsername?.split(" ")[1].charAt(0)}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="flex flex-col">
          {conversation.partnerUsername}
          <span className="text-xs text-gray-500 font-medium">
            {conversation.partnerEmail}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.message}>{conversation.recentMessage}</div>
      </CardContent>
      {/* <div className={styles.userDetailsBody}>
        <div className={styles.userDetails}>
          <div className={styles.userName}>{conversation.partnerUsername}</div>
        </div>
      </div> */}
      <CardFooter className="text-[11px] text-gray-500 font-medium">
      {formatSentAt(conversation.recentMessageTime)}
      </CardFooter>
    </Card>
  );
};

export default ConversationCard;
