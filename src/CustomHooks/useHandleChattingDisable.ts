import { useEffect } from "react";
import { discussionPanelSelectType, selectDiscStateType } from "../src/app/interfaces/DiscussionPanel";

export function useHandleChattingDisable (BanContext:any, MuteContext:any, selectedDiscussion: discussionPanelSelectType, 
  disableChatTextBox : React.Dispatch<React.SetStateAction<boolean | undefined>>)
{
    useEffect(() => {
        const roomIsBanned = BanContext.bannedRooms?.some((ban: {room_id: string}) => 
        {
          return (ban.room_id === selectedDiscussion.id)
        }) 
        const roomIsMuteded = MuteContext?.MuteRooms?.some((mute: {room_id: string}) =>
        {
          return (mute.room_id === selectedDiscussion.id)
          });
        const isChatTextBoxDisabled = (roomIsBanned || roomIsMuteded)
        disableChatTextBox(isChatTextBoxDisabled)
      
  }, [selectedDiscussion]);

}