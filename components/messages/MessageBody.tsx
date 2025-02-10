import React from "react";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import CustomTabsTrigger from "../custom_buttons/buttons/CustomTabsTrigger";
import Inbox from "./Inbox/Inbox";
import styles from "@/components/messages/styles.module.css";

const MessageBody = () => {
  const messagesTab = [
    {
      value: "inbox",
      label: "Inbox",
      component: Inbox,
    },
    {
      value: "archived",
      label: "Archived",
      component: Inbox,
    },
  ];
  return (
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
                {Component ? <Component /> : value}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      <div className={`${styles.section} ${styles.conversationBody}`}>
        User Conversations
      </div>
    </div>
  );
};

export default MessageBody;
