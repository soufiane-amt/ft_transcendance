import { useEffect } from "react";
import { DiscussionDto, MinMessageDto, discussionPanelSelectType } from "../src/app/interfaces/DiscussionPanel";
import socket from "../src/app/socket/socket";

export function useHandlePanel(discussionPanels: DiscussionDto[],selectedDiscussion : discussionPanelSelectType ,setDiscussionRooms:React.Dispatch<React.SetStateAction<DiscussionDto[]>>) 
{

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
        //handle in removing a pannel
        const handleRemovePanel = (room: { _id: string }) => {
          const updatedRooms = [...discussionPanels];
          const indexToRemove = updatedRooms.findIndex(
            (item) => item.id === room._id
          );
          if (indexToRemove !== -1) {
            updatedRooms.splice(indexToRemove, 1);
            setDiscussionRooms(updatedRooms);
          }
        }

        socket.on("newMessage", handleNewMessage);
        socket.on("setRoomAsRead", handleReadStatusTrack);
        socket.on("removePanel", handleRemovePanel);

        return () => {
          socket.off("newMessage", handleNewMessage);
          socket.off("setRoomAsRead", handleReadStatusTrack);
          socket.off("removePanel", handleRemovePanel);

        };
      }, [discussionPanels]);
    }