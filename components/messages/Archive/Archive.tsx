import { ConversationInterface } from "@/types/messageInterface";
import React, { useEffect, useState } from "react";
import ConversationCard from "../ConversationCard";
import styles from "../styles.module.css";
import { ScrollArea } from "@/components/ui/scroll-area";

const Archive = ({
  conversations,
  onCoversationSelect,
  defaultHighlighted,
}: {
  conversations: ConversationInterface[];
  onCoversationSelect: (conversation: ConversationInterface) => void;
  defaultHighlighted: ConversationInterface | undefined;
}) => {
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationInterface>();

  useEffect(() => {
    if (!selectedConversation && defaultHighlighted) {
      setSelectedConversation(defaultHighlighted);
      onCoversationSelect(defaultHighlighted);
    }
  }, [defaultHighlighted, onCoversationSelect, selectedConversation]);

  const handleConversationClick = (consultant: ConversationInterface) => {
    setSelectedConversation(consultant);
    onCoversationSelect(consultant);
  };

  return (
    <ScrollArea className="h-[52vh]">
      <div className={styles.conversationList}>
        {selectedConversation && selectedConversation.status === true && (
          <ConversationCard
            conversation={selectedConversation}
            highlighted={selectedConversation === selectedConversation}
          />
        )}
        {conversations
          .filter((conversation) => conversation !== selectedConversation)
          .map((conversation) => (
            <ConversationCard
              key={conversation.recentMessageSenderId}
              conversation={conversation}
              onClick={() => handleConversationClick(conversation)}
            />
          ))}
      </div>
    </ScrollArea>
  );
};

export default Archive;
