import React, { useEffect, useState } from "react";
import style from "./ChatTextbox.module.css";
import { Send } from "../../svgs";
import { formatDateAndTime } from "../../../utils/dateUtils";
import { useSessionUser } from "../../../context/SessionUserContext";
import { discussionPanelSelectType, selectDiscStateType } from "../../../interfaces/DiscussionPanel";
import socket from "../../../socket/socket.ts"; // Import the socket object


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
      setMessageHistory((messagesHistory) => [...messagesHistory, newMessage]);
      //Add message id later
      let messageRoomId:string| undefined = newMessage.channel_id ? newMessage.channel_id: newMessage.dm_id;
      messageRoomId = messageRoomId ? messageRoomId : ""
      const  discData: discussionPanelSelectType = 
                    {id:messageRoomId, 
                      partner_id :newMessage.user_id, 
                      last_message:{id:"", //add Message id later
                      content: newMessage.content, 
                      createdAt: newMessage.createdAt }}
                      
                      // setSelectedDiscussion (discData)
                      console.log ("SelectedDiscussion :", selectedDiscussion)
      };  
                    
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };  
  }, []);  


  const handleSendMessage = () => {
    const newMessage: messageDto = {
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
