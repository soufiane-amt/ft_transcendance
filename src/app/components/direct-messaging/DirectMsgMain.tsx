"use client";
import React, { useEffect, useRef, useState } from "react";
import ChatTextBox from "../shared/ChatTextbox/ChatTextbox";
import DiscussionPanel from "../shared/DiscussionPanel/DiscussionPanel";
import style from "./DirectMsgMain.module.css";
import Message from "../shared/Message/Message";
import UserActionModalMain from "./UserActionModal/UserActionModal";
import {
  DiscussionDto,
  MinMessageDto,
  discussionPanelSelectType,
} from "../../interfaces/DiscussionPanel";

import { UserContactsProvider } from "../../context/UsersContactBookContext";
import { fetchDataFromApi } from "../shared/customFetch/exmple";
import socket from "../../socket/socket"; // Import the socket object
import { ChatBoxStatus } from "../../enum/displayChatBoxStatus";
import { BanProvider } from "../../context/BanContext";

/*stopPropagation is used here to prevent the click event to take way up to the parent it got limited right here */

interface DiscussionsBarProps {
  selectedDiscussionState:{
    selectedDiscussion : discussionPanelSelectType,
    selectDiscussion : (e: discussionPanelSelectType) => void
}}

function DiscussionsBar({ selectedDiscussionState }: DiscussionsBarProps) {
  const [discussionPanels, setDiscussionRooms] = useState<DiscussionDto[]>([]);
  const [modalIsVisible, setModalAsVisible] = useState<boolean>(false);
  const {selectedDiscussion, selectDiscussion} = selectedDiscussionState;
  useEffect(() => {
    async function fetchDataAsync() {
      //use enums instead of passing dircet links
      const roomPanels_data_tmp = await fetchDataFromApi(
        "http://localhost:3001/chat/direct_messaging/discussionsBar"
      );
      setDiscussionRooms(roomPanels_data_tmp);
    }
    fetchDataAsync();
  }, []);

  useEffect(() => {
    const handleNewMessage = (newMessage: messageDto) => {
      const updatedRooms = [...discussionPanels];
      const messageRoomId = newMessage.dm_id
        ? newMessage.dm_id
        : newMessage.channel_id;
      const indexToModify = updatedRooms.findIndex(
        (item) => item.id === messageRoomId
      );
      if (indexToModify !== -1) {
        const messageContent: MinMessageDto = {
          id: newMessage.id,
          content: newMessage.content,
          createdAt: newMessage.createdAt,
        };
        updatedRooms[indexToModify].last_message = messageContent;
        //incrementing unread messages
        updatedRooms[indexToModify].unread_messages += 1;

        const movedElement = updatedRooms.splice(indexToModify, 1)[0];

        // Insert it at the beginning of the array
        updatedRooms.unshift(movedElement);

        setDiscussionRooms(updatedRooms);
      }
    };
    const handleReadStatusTrack = (room: { _id: string }) => {
      const updatedRooms = [...discussionPanels];
      const indexToModify = updatedRooms.findIndex(
        (item) => item.id === room._id
      );
      if (indexToModify !== -1) {
        updatedRooms[indexToModify].unread_messages = 0;

        setDiscussionRooms(updatedRooms);
      }
    };
    socket.on("newMessage", handleNewMessage);
    socket.on("setRoomAsRead", handleReadStatusTrack);
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("setRoomAsRead", handleReadStatusTrack);
    };
  }, [discussionPanels]);

  const displayActionModal = () => {
    setModalAsVisible(true);
  };
  const handlePanelClick = (panelData: DiscussionDto) => {
    selectDiscussion(panelData);
    const updatedRooms = [...discussionPanels];

    const indexToModify = updatedRooms.findIndex(
      (item) => item.id === panelData.id
    );
    if (indexToModify !== -1) {
      updatedRooms[indexToModify].unread_messages = 0;
      setDiscussionRooms(updatedRooms);
    }
  };

  return (
    <ul className={style.discussion_panel_bar}>
      {discussionPanels.map((panelElement) => {
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
      })}
      <UserActionModalMain
        userToActId={selectedDiscussion.partner_id}
        DiscussionToActId={selectedDiscussion.id}
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
      {messages.map((messageElement: messageDto) => {
        //Don't forget to add key attribute to messages
        return <Message key={messageElement.id} messageData={messageElement} />;
      })}
      {/* this is a dummy div created so that it references the bottom of the chatfield to scroll there whenever a message comes */}
      <div style={{ marginTop: "100px" }} ref={scrollDown}></div>
    </div>
  );
}


const selectedPanelDefault: discussionPanelSelectType = {
  id: "",
  partner_id: "",
  last_message: { id: "", content: "", createdAt: "" },
};

interface ChattingFieldPops {
  selectDiscussionState: {
    selectedDiscussion : discussionPanelSelectType,
    selectDiscussion : (e: discussionPanelSelectType) => void

  }
}
function ChattingField({ selectDiscussionState }: ChattingFieldPops) {
  const { selectedDiscussion, selectDiscussion } = selectDiscussionState;
  const [messagesHistory, setMessageHistory] = useState<messageDto[]>([]);

  useEffect(() => {
    async function fetchDataAsync() {
      const messagesHistory_tmp = await fetchDataFromApi(
        `http://localhost:3001/chat/${selectedDiscussion.id}/messages`
      );
      setMessageHistory(messagesHistory_tmp);
    }
    if (selectedDiscussion != selectedPanelDefault) fetchDataAsync();
  }, [selectedDiscussion]);

  return (
    <div className={style.chat_field}>
      <MessagesHistory messages={messagesHistory} />

      <ChatTextBox
        selectedDiscussion={selectedDiscussion}
        messagesHistoryState={[messagesHistory, setMessageHistory]}
        displayStatus={
          selectedDiscussion !== selectedPanelDefault
            ? ChatBoxStatus.ACTIVE
            : ChatBoxStatus.INACTIVE
        }
      />
    </div>
  );
}

function DirectMesgMain() {
  const [selectedDiscussion, setSelectedDiscussion] =
    useState<discussionPanelSelectType>(selectedPanelDefault);
    
    const selectDiscussion = (e : discussionPanelSelectType) => {
      setSelectedDiscussion(e);
    };
    const selectState = {
      selectedDiscussion,
      selectDiscussion,
    };
    return (
    <UserContactsProvider>
      <BanProvider>
        <div className={style.direct_msg_main}>
          <DiscussionsBar
            selectedDiscussionState={selectState}
          />
          <ChattingField
            selectDiscussionState={selectState}
          />
        </div>

      </BanProvider>
    </UserContactsProvider>
  );
}

export default DirectMesgMain;
