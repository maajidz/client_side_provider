import ApiFetch from "@/config/api";
import { ConversationInterface, UserMessagesInterface } from "@/types/messageInterface";
import axios from "axios";

const API_BASE_URL = "https://api.joinpomegranateapi.com";

export const sendMessage = async (messageData: any) => {
  return await axios.post(`${API_BASE_URL}/chat/message`, messageData);
};

export const fetchMessages = async ({
  userID,
  recipientId,
  page,
  pageSize
}: {
  userID: string;
  recipientId: string;
  page: number;
  pageSize: number
}) => {
  const response = await ApiFetch({
    method: "get",
    url: `/chat/message?fromUuid=${userID}&toUuid=${recipientId}&page=${page}&pageSize=${pageSize}`,
  });
  console.log(response.data);
  const data: UserMessagesInterface[]= await response.data;
  console.log(data);
  return data;
};

export const fetchUserConversations = async ({
  recipientId,
}: {
  recipientId: string;
}) => {
  const response = await ApiFetch({
    method: "get",
    url: `/chat/conversations?uuid=${recipientId}`,
  });
  console.log(response.data);
  const data: ConversationInterface[] = await response.data;
  console.log(data);
  return data;
};
