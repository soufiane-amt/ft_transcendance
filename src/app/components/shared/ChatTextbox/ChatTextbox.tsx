import React, { useEffect, useState } from "react";
import style from "./ChatTextbox.module.css";
import { Send } from "../../svgs";
import { useSessionUser } from "../../../context/SessionUserContext";
import { discussionPanelSelectType, selectDiscStateType } from "../../../interfaces/DiscussionPanel";
import socket from "../../../socket/socket"; // Import the socket object
import { ChatBoxStatus } from "../../../enum/displayChatBoxStatus";
import { useBanContext } from "../../../context/BanContext";
import { useHandleNewMsg } from "../../../../../hooks/useHandleNewMsg";
import { useHandleBan, useHandleUnBan } from "../../../../../hooks/useHandleBan";


const isMessageValid = (message:string) => { return message.trim() !== '';}




interface ChatTextBoxProps {
  selectedDiscussion: discussionPanelSelectType;
  displayStatus: ChatBoxStatus;
  messagesHistoryState: [
    messageDto[],
    React.Dispatch<React.SetStateAction<messageDto[]>>
  ];
}

function ChatTextBox({
  selectedDiscussion,
  messagesHistoryState,
  displayStatus,
}: ChatTextBoxProps) {

  const userSession = useSessionUser();
  
  const [newMessageContent, setNewMessageContent] = useState<string>("");
  const [isBanned, setIsBanned] = useState<boolean>(); // State to track ban status
  const BanContext = useBanContext()

  useHandleNewMsg(messagesHistoryState, selectedDiscussion)
  useHandleBan(BanContext, selectedDiscussion, setIsBanned)
  useHandleUnBan(BanContext, selectedDiscussion, setIsBanned)

  useEffect(() => {
        setIsBanned(BanContext.bannedRooms.some((ban) => 
        {
          return (ban.room_id === selectedDiscussion.id)
        }));
  }, [selectedDiscussion]);

  const handleSendMessage = () => {
    if (isMessageValid(newMessageContent) === false)
      return;
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
