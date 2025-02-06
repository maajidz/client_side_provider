// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { Message } from "@/types/messageInterface";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { fetchMessages } from "@/services/messageService";
// import ChatMessage from "./ChatMessage";

// interface ChatWindowProps {
//   userID: string;
//   subject: string;
//   messages: Message[];
//   onSendMessage: (message: Message) => void;
//   recipientId: string;
//   handleScrollMessages: (messages: Message[]) => void;
// }

// const ChatWindow: React.FC<ChatWindowProps> = ({
//   subject,
//   messages,
//   onSendMessage,
//   recipientId,
//   handleScrollMessages,
//   userID,
// }) => {
//   const chatContainerRef = useRef<HTMLDivElement | null>(null);
//   const chatEndRef = useRef<HTMLDivElement | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);
//   const [page, setPage] = useState<number>(1);
//   const [chatMessages, setChatMessages] = useState<Message[]>(messages);
//   const [newMessage, setNewMessage] = useState("");

//   const fetchMoreMessages = useCallback(async () => {
//     if (loading || !hasMoreMessages) return;
//     setLoading(true);

//     try {
//       const nextPage = page + 1;
//       const currentScrollHeight = chatContainerRef.current?.scrollHeight || 0;
//       const response = await fetchMessages({
//         userID: userID,
//         recipientId: recipientId,
//         page: page,
//       });

//       const newMessages = response.data.map((msg: any) => ({
//         id: msg.id,
//         senderID: msg.senderID,
//         receiverID: msg.receiverID,
//         content: msg.content,
//         timestamp: new Date(msg.sentAt),
//         sender: msg.senderID === userID ? "me" : "other",
//       }));

//       if (newMessages.length > 0) {
//         handleScrollMessages(newMessages);
//         setChatMessages((prevMessages) => [...newMessages, ...prevMessages]);
//         setPage(nextPage);
//         if (chatContainerRef.current) {
//           chatContainerRef.current.scrollTop =
//             chatContainerRef.current.scrollHeight - currentScrollHeight;
//         }
//       } else {
//         setHasMoreMessages(false); // No more messages to load
//       }
//     } catch (error) {
//       console.error("Failed to load more messages:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [
//     userID,
//     recipientId,
//     handleScrollMessages,
//     hasMoreMessages,
//     page,
//     loading,
//   ]);

//   const handleSendMessage = () => {
//     if (!newMessage.trim()) return;

//     const message: Message = {
//       id: String(Date.now()),
//       senderID: "me",
//       receiverID: recipientId,
//       content: newMessage,
//       timestamp: new Date(),
//       sender: "me",
//     };

//     onSendMessage(message);
//     setNewMessage("");
//   };

//   const handleScroll = useCallback(() => {
//     if (chatContainerRef.current?.scrollTop === 0 && hasMoreMessages) {
//       fetchMoreMessages();
//     }
//   }, [hasMoreMessages, fetchMoreMessages]);

//   useEffect(() => {
//     console.log("updating messages in chat");
//     setChatMessages(messages);
//   }, [messages]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chatMessages]);

//   useEffect(() => {
//     const container = chatContainerRef.current;
//     if (container) {
//       container.addEventListener("scroll", handleScroll);
//     }
//     return () => {
//       if (container) {
//         container.removeEventListener("scroll", handleScroll);
//       }
//     };
//   }, [handleScroll]);

//   useEffect(() => {
//     setPage(1);
//     setHasMoreMessages(true);
//     setNewMessage("");
//   }, [recipientId]);

//   return (
//     <div className="flex flex-col lg:max-h-[79vh] md:max-h-[90vh] max-h-[90vh] w-full h-full p-6 bg-white rounded-2xl shadow-lg overflow-hidden ">
//       <div className="flex flex-col md:gap-4 lg:gap-4 gap-2 md:pb-6 lg:pb-6 pb-2 border-b">
//         <div className="flex flex-row justify-between">
//           <div className="font-semibold text-lg">{subject}</div>
//         </div>
//         <div className="font-semibold text-lg">Welcome to Promegranate</div>
//       </div>
//       <div
//         className="flex flex-col flex-grow overflow-y-auto border-b py-6 gap-4"
//         ref={chatContainerRef}
//       >
//         {chatMessages
//           .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
//           .map((msg) => (
//             <ChatMessage key={msg.id} message={msg} />
//           ))}
//         <div ref={chatEndRef} />
//       </div>
//       <form onSubmit={handleSendMessage} className="flex flex-col gap-6 pt-6">
//         <div className="flex flex-col flex-grow w-full border-2 rounded-lg px-3 md:py-2 lg:py-2 py-1">
//           <Textarea
//             placeholder="Chat Here"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             className={`

//             border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 h-[calc(2*1.5rem)] `}
//           />
//         </div>
//         <div className="flex flex-row w-full justify-end items-end md:gap-4 lg:gap-4 gap-2">
//           <Button
//             variant={"outline"}
//             className="border-[#84012A] border-2 text-[#84012A] w-28"
//             type="button"
//             onClick={() => setNewMessage("")}
//           >
//             Cancel
//           </Button>
//           <Button type="submit" className="bg-[#84012A] w-28">
//             Send
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ChatWindow;
