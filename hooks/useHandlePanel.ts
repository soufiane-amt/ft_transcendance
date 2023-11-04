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
        const handleNewMessage = async (newMessage: messageDto) => {
          console.log ('I got a new message!')
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
    
             setDiscussionRooms(() => [movedElement, ...updatedRooms]);
          }
          else{
            const messageContent: MinMessageDto = {
              id: newMessage.id,
              content: newMessage.content,
              createdAt: newMessage.createdAt,
            };
            var newDiscussionPanel: DiscussionDto  = updatedRooms[0]
             newDiscussionPanel = {
              id : messageRoomId !== undefined ? messageRoomId:'',
              last_message: messageContent,
              unread_messages : 1,
              partner_id: undefined
            } 
             setDiscussionRooms(() => [newDiscussionPanel, ...discussionPanels]);

          }
        };

        const handleReadStatusTrack = (room: { _id: string }) => {

          const updatedRooms = [...discussionPanels];
          const indexToModify = updatedRooms.findIndex(
            (item) => item.id === room._id
          );
          if (indexToModify !== -1) {
            updatedRooms[indexToModify].unread_messages = 0;

            // setDiscussionRooms(updatedRooms);
          }
        };

        //handle getting kicked
        const handleGettingKicked = (room_id: string ) => {
          const updatedRooms = [...discussionPanels];
          const indexToModify = updatedRooms.findIndex(
            (item) => item.id === room_id
          )
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