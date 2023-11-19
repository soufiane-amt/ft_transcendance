import { useEffect } from "react";
import {
  DiscussionDto,
  MinMessageDto,
  discussionPanelSelectType,
} from "../components/Chat/interfaces/DiscussionPanel";
import socket from "../app/socket/socket";
import { selectedPanelDefault } from "../components/Chat/Channels/ChannelsMain";
import { useSessionUser } from "../app/context/SessionUserContext";
import { fetchDataFromApi } from "../components/Chat/CustomFetch/fetchDataFromApi";

export function useHandlePanel(
  discussionPanels: DiscussionDto[],
  selectedDiscussionState: {
    selectedDiscussion: discussionPanelSelectType;
    selectDiscussion: (e: discussionPanelSelectType) => void;
  },
  setDiscussionRooms: React.Dispatch<React.SetStateAction<DiscussionDto[]>>,
  setDiscussionIsEmpty: React.Dispatch<React.SetStateAction<boolean>>
) {
  const { selectedDiscussion, selectDiscussion } = selectedDiscussionState;
  const currentUserId = useSessionUser().id;
  useEffect(() => {
    const handleNewMessage = async (newMessage: messageDto) => {

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
      } else {
        const messageContent: MinMessageDto = {
          id: newMessage.id,
          content: newMessage.content,
          createdAt: newMessage.createdAt,
        };
        const partner_id = await fetchDataFromApi(
          "http://localhost:3001/chat/DirectMessaging/getPartner/" +
            messageRoomId
        );
        var newDiscussionPanel: DiscussionDto = updatedRooms[0];
        newDiscussionPanel = {
          id: messageRoomId !== undefined ? messageRoomId : "",
          last_message: messageContent,
          unread_messages: 1,
          partner_id:
            currentUserId === newMessage.user_id
              ? partner_id
              : newMessage.user_id,
        };
        setDiscussionRooms(() => [newDiscussionPanel, ...discussionPanels]);
      }

      //wait untill discussion panel is updated
      if (selectedDiscussion.id === messageRoomId)
        setTimeout(() => {
          socket.emit("MarkMsgRead", { _id: messageRoomId });
        }, 1000);
    };

    const handleReadStatusTrack = async (room: { _id: string }) => {
      const updatedRooms = [...discussionPanels];
      const indexToModify = updatedRooms.findIndex(
        (item) => item.id === room._id
      );

      if (indexToModify !== -1) {
        updatedRooms[indexToModify].unread_messages = 0;

        // Use async/await when setting state (although it may not be necessary)

        setDiscussionRooms(() => updatedRooms);
      }
    };

    //handle getting kicked
    const handleGettingKicked = (room_id: string) => {
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
    };

    const handleLeavingChannel = (room_id: string) => {
      const updatedRooms = [...discussionPanels];
      const indexToModify = updatedRooms.findIndex(
        (item) => item.id === room_id
      );
      if (indexToModify !== -1) {
        updatedRooms.splice(indexToModify, 1);
        setDiscussionRooms(updatedRooms);
      }
      if (selectedDiscussion.id === room_id)
        selectDiscussion(selectedPanelDefault);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("setRoomAsRead", handleReadStatusTrack);
    socket.on("kickOutNotification", handleGettingKicked);
    socket.on("LeaveOutNotification", handleLeavingChannel);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("setRoomAsRead", handleReadStatusTrack);
      socket.off("kickOutNotification", handleGettingKicked);
      socket.off("LeaveOutNotification", handleLeavingChannel);
    };
  }, [discussionPanels]);
}
