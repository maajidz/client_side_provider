import React, { useCallback, useEffect, useState } from "react";
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
import NewMessageDialog from "./NewMessageDialog";
import { Button } from "../ui/button";
import { Icon } from "../ui/icon";

const MessageBody = () => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [conversations, setConversations] = useState<ConversationInterface[]>(
    []
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const inboxConversations = conversations.filter((convo) => !convo.status);
  const archiveConversations = conversations.filter((convo) => convo.status);
  const defaultConversation = undefined;
  const [selectedConversation, setSelectedConversation] = useState<
    ConversationInterface | undefined
  >();

  const messagesTab = [
    {
      value: "inbox",
      icon: "inbox",
      label: "Inbox",
      component: Inbox,
      data: inboxConversations,
    },
    {
      value: "archived",
      icon: "archive",
      label: "Archived",
      component: Archive,
      data: archiveConversations,
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
            <Button
              size="icon"
              className="px-0"
              onClick={() => {
                setIsDialogOpen(true);
              }}
            >
              <Icon name="message" />
            </Button>
            <NewMessageDialog
              isOpen={isDialogOpen}
              onClose={() => {
                setIsDialogOpen(false);
                userConversation();
              }}
            />
          </div>
          <div>
            <Tabs defaultValue="inbox" className="">
              <TabsList className={styles.tabList}>
                {messagesTab.map((tab) => (
                  <CustomTabsTrigger value={tab.value} key={tab.value}>
                    <Icon name={tab.icon} />
                    {tab.label}
                  </CustomTabsTrigger>
                ))}
              </TabsList>
              {messagesTab.map(({ value, component: Component, data }) => (
                <TabsContent value={value} key={value}>
                  {Component ? (
                    <>
                      {conversations.length > 0 ? (
                        <Component
                          conversations={data}
                          defaultHighlighted={defaultConversation}
                          onCoversationSelect={setSelectedConversation}
                        />
                      ) : (
                        <div
                          className={`${styles.section} ${styles.listTitle}`}
                        >
                          No Conversation Available
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
            <div className="flex text-xs text-gray-500 flex-1 items-center justify-center w-full h-full">
              No Conversation Selected
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessageBody;
