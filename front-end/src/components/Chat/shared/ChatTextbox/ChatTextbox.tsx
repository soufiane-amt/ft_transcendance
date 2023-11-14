import React, { useEffect, useState } from "react";
import style from "../../../../styles/ChatStyles/ChatTextbox.module.css";
import { Send } from "../../svgs";
import { useSessionUser } from "../../../../app/context/SessionUserContext";
import { discussionPanelSelectType, selectDiscStateType } from "../../interfaces/DiscussionPanel";
import socket from "../../../../app/socket/socket"; // Import the socket object
import { useBanContext } from "../../../../app/context/BanContext";
import { useHandleNewMsg } from "../../../../CustomHooks/useHandleNewMsg";
import { useHandleBan, useHandleUnBan } from "../../../../CustomHooks/useHandleBan";
import { useMuteContext } from "../../../../app/context/MuteContext";
import { useHandleMute, useHandleUnMute } from "../../../../CustomHooks/useHandleMute";
import { useHandleChattingDisable } from "../../../../CustomHooks/useHandleChattingDisable";

const isMessageValid = (message:string) => { return message.trim() !== '';}




interface ChatTextBoxProps {
  selectedDiscussion: discussionPanelSelectType;
  messagesHistoryState: [
    messageDto[],
    React.Dispatch<React.SetStateAction<messageDto[]>>
  ];
}

function ChatTextBox({
  selectedDiscussion,
  messagesHistoryState,
}: ChatTextBoxProps) {

  const userSession = useSessionUser();
  
  const [newMessageContent, setNewMessageContent] = useState<string>("");
  const [isChatTextBoxDisabled, disableChatTextBox] = useState<boolean>(); // State to track if the chatTextBox is allowed or not  
  const BanContext = useBanContext()
  const MuteContext = useMuteContext()

  useHandleNewMsg(messagesHistoryState, selectedDiscussion)
  useHandleBan(BanContext, selectedDiscussion, disableChatTextBox)
  useHandleUnBan(BanContext, selectedDiscussion, disableChatTextBox)
  
  //ELINT Change happened here 
  useHandleMute(MuteContext, selectedDiscussion, disableChatTextBox)
  useHandleUnMute(MuteContext, selectedDiscussion, disableChatTextBox)
  
  useHandleChattingDisable(BanContext, MuteContext, selectedDiscussion, disableChatTextBox)
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
    socket.emit("sendMsg", newMessage);
    setNewMessageContent("");
  };

  if (!selectedDiscussion.id ) return null;

  return (
    <div className={`${style.message_bar} `}>
      {isChatTextBoxDisabled ? (
        <div className={style.banned_message}>
            You can&rsquo;t use this room for now.
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
