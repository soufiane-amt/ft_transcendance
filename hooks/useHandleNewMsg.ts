import { useEffect, useState } from "react";
import socket from "../src/app/socket/socket";

export function useHandleNewMsg(messagesHistoryState: any, selectedDiscussion:any) {

    const [messagesHistory, setMessageHistory] = messagesHistoryState;
    useEffect(() => {
        const handleNewMessage = (newMessage: messageDto) => {
          // Add message id later
          const messageRoomId = newMessage.dm_id
            ? newMessage.dm_id
            : newMessage.channel_id;

          if (selectedDiscussion.id === messageRoomId) {
            setMessageHistory((messagesHistory: any) => [
              ...messagesHistory,
              newMessage,
            ]);
    
            socket.emit("MarkMsgRead", { _id: messageRoomId });
          }
        };
    
        socket.on("newMessage", handleNewMessage);
        return () => {
          socket.off("newMessage", handleNewMessage);
        };
      }, [selectedDiscussion]);


}