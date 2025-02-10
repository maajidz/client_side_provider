import ApiFetch from "@/config/api";
import {
  ConversationInterface,
  UserMessagesInterface,
} from "@/types/messageInterface";

export const fetchMessages = async ({
  userID,
  recipientId,
  page,
  pageSize,
}: {
  userID: string;
  recipientId: string;
  page: number;
  pageSize: number;
}) => {
  const response = await ApiFetch({
    method: "get",
    url: `/chat/message?fromUuid=${userID}&toUuid=${recipientId}&page=${page}&pageSize=${pageSize}`,
  });
  console.log(response.data);
  const data: UserMessagesInterface[] = await response.data;
  console.log(data);
  return data;
};

export const fetchUserConversations = async ({
  providerId,
}: {
  providerId: string;
}) => {
  const response = await ApiFetch({
    method: "get",
    url: `/provider/chat/latest/${providerId}`,
  });
  console.log(response.data);
  const data: ConversationInterface[] = await response.data;
  console.log(data);
  return data;
};
