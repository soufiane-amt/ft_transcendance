import { useEffect, useState } from "react";
import { DiscussionDto, MinMessageDto, discussionPanelSelectType } from "../../../interfaces/DiscussionPanel";
import style from "./DiscussionsBar.module.css";
import { fetchDataFromApi } from "../../shared/customFetch/exmple";
import socket from "../../../socket/socket";
import UserActionModalMain from "../UserActionModal/UserActionModal";
import DiscussionPanel from "../../shared/DiscussionPanel/DiscussionPanel";

interface DiscussionsBarProps {
    selectedDiscussionState:{
      selectedDiscussion : discussionPanelSelectType,
      selectDiscussion : (e: discussionPanelSelectType) => void
  }}
  
export function DiscussionsBar({ selectedDiscussionState }: DiscussionsBarProps) {
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
  