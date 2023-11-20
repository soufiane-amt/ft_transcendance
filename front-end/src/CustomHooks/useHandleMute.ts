import { useEffect } from "react";
import { discussionPanelSelectType } from "../components/Chat/interfaces/DiscussionPanel";
import socket from "../app/socket/socket";
import { IMuteContext } from "../app/context/MuteContext";


export function useHandleMute (MuteContext:IMuteContext | undefined, selectedDiscussion : discussionPanelSelectType, 
            disableChatTextBox : React.Dispatch<React.SetStateAction<boolean | undefined>>)
{
  
  useEffect(() => {
    const handleUserMuted = (MuteSignal: { room_id: string}) => {
      
      if (!MuteContext) return;
      if (MuteSignal.room_id === selectedDiscussion.id) {
        disableChatTextBox(true); 
      }
      MuteContext?.MuteUser(MuteSignal.room_id)
    };
    
          socket.on("userMuted", handleUserMuted);

        return () => {
          socket.off("userMuted", handleUserMuted);
        };
      }, [selectedDiscussion]);
    }

    
export function useHandleUnMute (MuteContext:IMuteContext | undefined, selectedDiscussion : discussionPanelSelectType, 
    disableChatTextBox : React.Dispatch<React.SetStateAction<boolean | undefined>>)
    {
        useEffect(() => {
          if (!MuteContext) return;
            const handleUserUnMuted = (MuteSignal: { room_id: string }) => {
              if (MuteSignal.room_id === selectedDiscussion.id) {
                disableChatTextBox(false); // Set the isMuted state to true when Muted
              }
              MuteContext.unMuteUser(MuteSignal.room_id )
            };
        
            socket.on("userUnMuted", handleUserUnMuted);
        
            return () => {
              socket.off("userUnMuted", handleUserUnMuted);
            };
          }, [selectedDiscussion]);
        
    }
