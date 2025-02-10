export type UserConversations = ConversationInterface[];

export interface ConversationInterface {
  conversationPartnerId: string;
  recentMessage: string;
  recentMessageSenderId: string;
  recentMessageTime: string;
  partnerUsername: string;
  partnerEmail: string;
  status: boolean;
}

export type UserMessages = UserMessagesInterface[];

export interface UserMessagesInterface {
    id: string
    senderID: string
    receiverID: string
    content: string
    isArchived: boolean
    sentAt: string
}

export interface Message {
  id: string;
  senderID: string;
  receiverID: string;
  content: string;
  timestamp: Date;
  sender: "me" | "other";
  isArchived: boolean; 
  sentAt: string; 
}
