import React, { useCallback, useEffect, useState } from "react";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import CustomTabsTrigger from "../custom_buttons/buttons/CustomTabsTrigger";
import Inbox from "./Inbox/Inbox";
import styles from "@/components/messages/styles.module.css";
import Archive from "./Archive/Archive";
import { ConversationInterface } from "@/types/messageInterface";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import LoadingButton from "../LoadingButton";
import { fetchUserConversations } from "@/services/messageService";
import ConversationBody from "./ConversationBody";

const MessageBody = () => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [conversations, setConversations] = useState<ConversationInterface[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const defaultConversation = conversations[0];
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationInterface>(defaultConversation);

  const messagesTab = [
    {
      value: "inbox",
      label: "Inbox",
      component: Inbox,
    },
    {
      value: "archived",
      label: "Archived",
      component: Archive,
    },
  ];

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
    <>
      <div className={styles.messageBody}>
        <div className={`${styles.section} ${styles.listBody}`}>
          <div className={styles.listHeader}>
            <div className={styles.listTitle}>All Messages</div>
            <DefaultButton>New Message</DefaultButton>
          </div>
          <div>
            <Tabs defaultValue="inbox" className="">
              <TabsList className={styles.tabList}>
                {messagesTab.map((tab) => (
                  <CustomTabsTrigger value={tab.value} key={tab.value}>
                    {tab.label}
                  </CustomTabsTrigger>
                ))}
              </TabsList>
              {messagesTab.map(({ value, component: Component }) => (
                <TabsContent value={value} key={value}>
                  {Component ? (
                    <>
                      {conversations.length > 0 ? (
                        <Component
                          conversations={conversations}
                          defaultHighlighted={defaultConversation}
                          onCoversationSelect={setSelectedConversation}
                        />
                      ) : (
                        <div
                          className={`${styles.section} ${styles.listTitle}`}
                        >
                          No Conversation Avaialble
                        </div>
                      )}
                    </>
                  ) : (
                    value
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
        <div className={`${styles.section} ${styles.conversationBody}`}>
          {selectedConversation ? (
            <ConversationBody
              userId={providerDetails.providerId}
              selectedConversation={selectedConversation}
            />
          ) : (
            <div className={styles.listTitle}>
              No Conversation Selected
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessageBody;
