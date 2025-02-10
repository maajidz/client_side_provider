import { ConversationInterface } from "@/types/messageInterface";
import React, { useEffect, useState } from "react";
import ConversationCard from "../ConversationCard";

const Inbox = ({
  conversations,
  onCoversationSelect,
  defaultHighlighted,
}: {
  conversations: ConversationInterface[];
  onCoversationSelect: (conversation: ConversationInterface) => void;
  defaultHighlighted: ConversationInterface;
}) => {
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationInterface>(defaultHighlighted);

  useEffect(() => {
    if (defaultHighlighted) {
      setSelectedConversation(defaultHighlighted);
      onCoversationSelect(defaultHighlighted);
    }
  }, [defaultHighlighted, onCoversationSelect]);

  const handleConversationClick = (consultant: ConversationInterface) => {
    setSelectedConversation(consultant);
    onCoversationSelect(consultant);
  };

  return (
    <div>
      {selectedConversation && (
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
  );
};

export default Inbox;
