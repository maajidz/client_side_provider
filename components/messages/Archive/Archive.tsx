import LoadingButton from "@/components/LoadingButton";
import { fetchUserConversations } from "@/services/messageService";
import { RootState } from "@/store/store";
import { ConversationInterface } from "@/types/messageInterface";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ConversationCard from "../ConversationCard";

const Archive = () => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [conversations, setConversations] = useState<ConversationInterface[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);

  const userConversation = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchUserConversations({
        providerId: providerDetails.providerId,
      });
      if (response) {
        setConversations(response);
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  }, [providerDetails.providerId]);

  useEffect(() => {
    userConversation();
  }, [userConversation]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <div>
      {conversations.map((conversation) => (
        <ConversationCard
          key={conversation.recentMessageSenderId}
          conversation={conversation}
        />
      ))}
    </div>
  );
};

export default Archive;
