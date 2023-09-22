"use client";
import React, { useEffect, useRef, useState } from "react";
import ChatTextBox from "../shared/ChatTextbox/ChatTextbox";
import DiscussionPanel from "../shared/DiscussionPanel/DiscussionPanel";
import style from "./DirectMsgMain.module.css";
import Message from "../shared/Message/Message";
import UserActionModalMain from "./UserActionModal/UserActionModal";
import { DiscussionDto, discussionPanelSelectType, selectDiscStateType } from "../../interfaces/DiscussionPanel";
import { UserContactsProvider } from "../../context/UsersContactBookContext";
import { fetchDataFromApi } from "../shared/api/exmple";
import socket from "src/app/socket/socket.ts"; // Import the socket object

/*stopPropagation is used here to prevent the click event to take way up to the parent it got limited right here */


interface DiscussionsBarProps {
  selectedDiscussionState: [
    DiscussionDto,
    React.Dispatch<React.SetStateAction<DiscussionDto>>
  ];
}


function DiscussionsBar({
  selectedDiscussionState,
}: DiscussionsBarProps) {
  const [discussionPanels, setDiscussionRooms] = useState<DiscussionDto[]>([]);
  const [modalIsVisible, setModalAsVisible] = useState<boolean>(false);
  const [selectedDiscussion, setSelectedDiscussion] = selectedDiscussionState;

  useEffect(() => {
    async function fetchDataAsync() {//use enums instead of passing dircet links 
      const roomPanels_data_tmp = await fetchDataFromApi("http://localhost:3001/chat/direct_messaging/discussionsBar")
      setDiscussionRooms(roomPanels_data_tmp);
    }
    fetchDataAsync();
  }, []);

  useEffect(() => {
    const handleNewMessage = (newMessage :messageDto) => {
        const updatedRooms = [...discussionPanels]
        const messageRoomId = newMessage.dm_id ? newMessage.dm_id : newMessage.channel_id;
        const indexToModify = updatedRooms.findIndex((item) => item.id === messageRoomId);
        if (indexToModify !== -1) {
          const messageContent: MinMessageDto = {id : newMessage.id,
                                                content:newMessage.content,
                                                createdAt:newMessage.createdAt}
          updatedRooms[indexToModify].last_message = messageContent;
          const movedElement = updatedRooms.splice(indexToModify, 1)[0];

          // Insert it at the beginning of the array
          updatedRooms.unshift(movedElement);
      
          setDiscussionRooms (updatedRooms)
        }
       };  
                    
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };  
  }, [discussionPanels]);  

  const displayActionModal = () => {
    setModalAsVisible(true);
  };
  const handlePanelClick = (panelData: DiscussionDto) => {
    setSelectedDiscussion(panelData);
  };

  return (
    <ul className={style.discussion_panel_bar}>
      {
      discussionPanels.map((panelElement) => {
        const isSelected = panelElement?.id === selectedDiscussion.id;
        return (
          <DiscussionPanel
            key={panelElement.id}
            onSelect={handlePanelClick}
            DiscussionPanel={panelElement}
            isSelected={isSelected}
            showUserActionModal={displayActionModal}
          />
        );
      })
      }
      <UserActionModalMain
        userToActId={selectedDiscussion.partner_id}
        modalState={[modalIsVisible, setModalAsVisible]}
      />
    </ul>
  );
}




function MessagesHistory({ messages }: { messages: messageDto[] }) {
  const scrollDown = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollDown.current != null)
      scrollDown.current.scrollIntoView({
        block: "end",
      });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <div className={style.messages_history}>
      {messages.map((messageElement: messageDto, index: number) => {
        //Don't forget to add key attribute to messages
        return (
          <Message
            key={index}
            messageData={messageElement}
          />
        );
      })}
      {/* this is a dummy div created so that it references the bottom of the chatfield to scroll there whenever a message comes */}
      <div style={{ marginTop: "100px" }} ref={scrollDown}></div>
    </div>
  );
}


const selectedPanelDefault: discussionPanelSelectType = {
  id: "",
  partner_id: "",
  last_message: { id:"", content: "", createdAt: "" }
};

interface ChattingFieldPops {
  selectDiscussionState: selectDiscStateType

}
function ChattingField({ selectDiscussionState} : ChattingFieldPops)
 {
  const {selectedDiscussion, setSelectedDiscussion} = selectDiscussionState;
  const [messagesHistory, setMessageHistory] = useState<messageDto[]>([]);

  useEffect(() => {
    async function fetchDataAsync() {
      const messagesHistory_tmp = await fetchDataFromApi(`http://localhost:3001/chat/${selectedDiscussion.id}/messages`)
      console.log ("disc id:" + selectedDiscussion.id)
      console.log ("Messages" + messagesHistory_tmp)

      setMessageHistory(messagesHistory_tmp);

    }
    if (selectedDiscussion != selectedPanelDefault)
      fetchDataAsync();
  }, [selectedDiscussion]);

  return (
    <div className={style.chat_field}>
      <MessagesHistory messages={messagesHistory} />

      <ChatTextBox
        selectDiscState={selectDiscussionState}
        messagesHistoryState={[messagesHistory, setMessageHistory]}
        showTextBox={selectedDiscussion !== selectedPanelDefault}
      />
    </div>
  );
}





function DirectMesgMain() {
  const [selectedDiscussion, setSelectedDiscussion] = useState<DiscussionDto>(selectedPanelDefault)
  
  const setDiscussion = (newSelectedDisc : DiscussionDto)=>{
    setSelectedDiscussion(newSelectedDisc)
  }
  // useEffect (()=>{
  //   const roomToModify  = roomPanels_data.find (room => room.id === selectedDiscussion.id)

  // })
  return (
    <UserContactsProvider>
      <div className={style.direct_msg_main}>
        <DiscussionsBar
          selectedDiscussionState={[selectedDiscussion, setSelectedDiscussion]}
          
        />
        <ChattingField selectDiscussionState={{selectedDiscussion, setSelectedDiscussion}} />
      </div>
    </UserContactsProvider>
  );
}

export default DirectMesgMain;
