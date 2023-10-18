import { useEffect } from "react";
import { DiscussionDto, MinMessageDto, discussionPanelSelectType } from "../src/app/interfaces/DiscussionPanel";
import socket from "../src/app/socket/socket";
import { selectedPanelDefault } from "../src/app/components/Channels/ChannelsMain";

export function useHandlePanel(discussionPanels: DiscussionDto[],selectedDiscussionState : {
  selectedDiscussion : discussionPanelSelectType,
  selectDiscussion : (e: discussionPanelSelectType) => void
} ,setDiscussionRooms:React.Dispatch<React.SetStateAction<DiscussionDto[]>>) 
{
  const {selectedDiscussion, selectDiscussion} = selectedDiscussionState;
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

        //handle getting kicked
        const handleGettingKicked = (room_id: string ) => {
          console.log ('Leave channel:', room_id)
          const updatedRooms = [...discussionPanels];
          const indexToModify = updatedRooms.findIndex(
            (item) => item.id === room_id
          );
          if (indexToModify !== -1) {
            updatedRooms.splice(indexToModify, 1);
            setDiscussionRooms(updatedRooms);
          }
          socket.emit("leaveChannel", room_id);
          if (selectedDiscussion.id === room_id)
            selectDiscussion(selectedPanelDefault);
        }

        socket.on("newMessage", handleNewMessage);
        socket.on("setRoomAsRead", handleReadStatusTrack);
        socket.on("kickOutNotification", handleGettingKicked);

        return () => {
          socket.off("newMessage", handleNewMessage);
          socket.off("setRoomAsRead", handleReadStatusTrack);
          socket.off("kickOutNotification", handleGettingKicked);

        };
      }, [discussionPanels]);
    }