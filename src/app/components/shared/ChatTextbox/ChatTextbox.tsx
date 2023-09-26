import React, { useEffect, useState } from "react";
import style from "./ChatTextbox.module.css";
import { Send } from "../../svgs";
import { useSessionUser } from "../../../context/SessionUserContext";
import { selectDiscStateType } from "../../../interfaces/DiscussionPanel";
import socket from "../../../socket/socket"; // Import the socket object
import axios from "axios";
import { ChatBoxStatus } from "../../../enum/displayChatBoxStatus";
import { findBannedRoomContext } from "../../../context/BanContext";

interface ChatTextBoxProps {
  selectDiscState: selectDiscStateType;
  displayStatus: ChatBoxStatus;
  messagesHistoryState: [
    messageDto[],
    React.Dispatch<React.SetStateAction<messageDto[]>>
  ];
}

function ChatTextBox({
  selectDiscState,
  messagesHistoryState,
  displayStatus,
}: ChatTextBoxProps) {
  const { selectedDiscussion, setSelectedDiscussion } = selectDiscState;

  const userSession = useSessionUser();

  const [messagesHistory, setMessageHistory] = messagesHistoryState;
  const [newMessageContent, setNewMessageContent] = useState<string>("");
  const [isBanned, setIsBanned] = useState<boolean>(false); // State to track ban status

  useEffect(() => {
    const handleNewMessage = (newMessage: messageDto) => {
      // Add message id later
      const messageRoomId = newMessage.dm_id
        ? newMessage.dm_id
        : newMessage.channel_id;
      if (selectedDiscussion.id === messageRoomId) {
        setMessageHistory((messagesHistory) => [
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

  useEffect(() => {
    const handleUserBanned = (dm: { id: string }) => {
      if (dm.id === selectedDiscussion.id) {
        setIsBanned(true); // Set the isBanned state to true when banned
      }
    };

    socket.on("userBanned", handleUserBanned);

    return () => {
      socket.off("userBanned", handleUserBanned);
    };
  }, [selectedDiscussion]);

  const handleSendMessage = () => {
    if (isBanned) {
      // Handle sending messages when the user is banned (optional)
      return;
    }

    const newMessage = {
      user_id: userSession.id,
      content: newMessageContent,
      channel_id: selectedDiscussion.id,
      dm_id: selectedDiscussion.id,
      createdAt: new Date().toISOString(),
    };
    socket.emit("sendMsgDm", newMessage);
    setNewMessageContent("");
  };

  if (displayStatus === ChatBoxStatus.INACTIVE) return null;

  return (
    <div className={`${style.message_bar} ${style.middlePos}`}>
      {isBanned ? (
        <div className={style.banned_message}>
          You can't message this person anymore.
        </div>
      ) : (
        <>
          <textarea
            className={`${style.message_input_bar} `}
            placeholder="Type a message..."
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
            disabled={isBanned} // Disable input when banned
          />
          <Send
            onClick={handleSendMessage}
            className={`${style.message_send_icon__init_fill} ${style.message_send_icon}`}
          />
        </>
      )}
    </div>
  );
}

export default ChatTextBox;
