import { ConversationInterface } from "@/types/messageInterface";
import { formatSentAt } from "@/utils/dateUtils";
import React from "react";
import styles from "@/components/messages/styles.module.css";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "lucide-react";

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
    <div
      onClick={onClick}
      className={`${styles.conversationCard} ${
        highlighted ? "border border-[#84012A]" : "border border-[#D0D5DD]"
      }`}
      key={conversation.recentMessageSenderId}
    >
      <div className={styles.conversationCardHeader}>
        <div>{conversation.partnerUsername}</div>
        <div> {formatSentAt(conversation.recentMessageTime)}</div>
      </div>
      <div className={styles.message}>{conversation.recentMessage}</div>
      <div className={styles.userDetailsBody}>
        <Avatar className="flex h-10 w-10 rounded-full border-2 border-[#FFE7E7]">
          <AvatarImage src="" />
          <AvatarFallback className="text-[#84012A] bg-[#FFE7E7] p-1">
            <User />
          </AvatarFallback>
        </Avatar>
        <div className={styles.userDetails}>
          <div className={styles.userName}>{conversation.partnerUsername}</div>
          <div className={styles.userEmail}>{conversation.partnerEmail}</div>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;
