import React, { useEffect, useState } from "react";
import style from "./ChatTextbox.module.css";
import { Send } from "../../svgs";
import { useSessionUser } from "../../../context/SessionUserContext";
import { discussionPanelSelectType, selectDiscStateType } from "../../../interfaces/DiscussionPanel";
import socket from "../../../socket/socket"; // Import the socket object
import axios from "axios";


interface ChatTextBoxProps {
  selectDiscState :selectDiscStateType,
  showTextBox: boolean;
  messagesHistoryState: [
    messageDto[],
    React.Dispatch<React.SetStateAction<messageDto[]>>
  ];
}



function ChatTextBox({ selectDiscState, messagesHistoryState, showTextBox }: ChatTextBoxProps) {
  const {selectedDiscussion, setSelectedDiscussion} = selectDiscState;
  
  const userSession = useSessionUser();

  const [messagesHistory, setMessageHistory] = messagesHistoryState;
  const [newMessageContent, setNewMessageContent] = useState<string>("");

  useEffect(() => {
    const handleNewMessage = (newMessage :messageDto) => {
      //Add message id later
      const messageRoomId = newMessage.dm_id ? newMessage.dm_id: newMessage.channel_id;
      if (selectedDiscussion.id === messageRoomId)
      {
      setMessageHistory((messagesHistory) => [...messagesHistory, newMessage]);
        
      socket.emit ("MarkMsgRead", {_id : messageRoomId})

      // const requestData = { _id: selectedDiscussion.id };
          
      // axios.put('http://localhost:3001/chat/messages/markAsRead', requestData, {
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     withCredentials: true, // This ensures that cookies are sent with the request
      //   })
      }
      };
       
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };  
  }, [selectedDiscussion]);  


  const handleSendMessage = () => {
    const newMessage = {
      user_id: userSession.id,
      content: newMessageContent,
      channel_id:selectedDiscussion.id,
      dm_id:selectedDiscussion.id,
      createdAt: new Date().toISOString(),
    };  
    socket.emit ("sendMsgDm", newMessage)
    setNewMessageContent("");
  };

  if (showTextBox === false) return null;
  return (
    <div className={`${style.message_bar} ${style.middlePos}`}>
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
    </div>
  );
}
export default ChatTextBox;
