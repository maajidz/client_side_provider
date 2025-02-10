import LoadingButton from "@/components/LoadingButton";
import { fetchUserConversations } from "@/services/messageService";
import { RootState } from "@/store/store";
import { ConversationInterface } from "@/types/messageInterface";
import { formatSentAt } from "@/utils/dateUtils";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Inbox = () => {
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

  if(loading){
    return <LoadingButton />
  }

  return (
    <div>
      {conversations.map((conversation) => (
        <div className="flex flex-col gap-4 p-4 border rounded-md border-[#D0D5DD]" key={conversation.recentMessageSenderId}>
          <div className="flex flex-row justify-between">
            <div className="text-[#84012A] capitalize font-semibold text-sm">
              {conversation.partnerUsername}
            </div>
            <div> {formatSentAt(conversation.recentMessageTime)}</div>
          </div>
          <div className="font-normal text-xs">
            {conversation.recentMessage}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Inbox;
