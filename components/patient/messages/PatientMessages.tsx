import React from "react";
import ChatPage from "./Chat";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const PatientMessages = ({ userDetailsId }: { userDetailsId: string }) => {
  const providerId = useSelector((state: RootState) => state.login);
  return (
      <ChatPage userId={providerId.providerId} recipientId={userDetailsId} />
  );
};

export default PatientMessages;
