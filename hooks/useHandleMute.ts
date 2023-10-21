import { useEffect } from "react";
import { discussionPanelSelectType } from "../src/app/interfaces/DiscussionPanel";
import socket from "../src/app/socket/socket";
import { IMuteContext } from "../src/app/context/MuteContext";


export function useHandleMute (MuteContext:IMuteContext, selectedDiscussion : discussionPanelSelectType, 
            disableChatTextBox : React.Dispatch<React.SetStateAction<boolean | undefined>>)
{

    useEffect(() => {
        const handleUserMuted = (MuteSignal: { room_id: string}) => {

          if (MuteSignal.room_id === selectedDiscussion.id) {
            disableChatTextBox(true); 
          }
          MuteContext.MuteUser(MuteSignal.room_id)
          socket.emit("suspendChannelUpdates", MuteSignal.room_id);
        };

        socket.on("userMuted", handleUserMuted);

        return () => {
          socket.off("userMuted", handleUserMuted);
        };
      }, [selectedDiscussion]);
    }

    
export function useHandleUnMute (MuteContext:IMuteContext, selectedDiscussion : discussionPanelSelectType, 
    disableChatTextBox : React.Dispatch<React.SetStateAction<boolean | undefined>>)
    {
        useEffect(() => {
            const handleUserUnMuted = (MuteSignal: { room_id: string }) => {
              if (MuteSignal.room_id === selectedDiscussion.id) {
                disableChatTextBox(false); // Set the isMuted state to true when Muted
              }
              MuteContext.unMuteUser(MuteSignal.room_id )
              socket.emit("resumeChannelUpdates", MuteSignal.room_id);
            };
        
            socket.on("userUnMuted", handleUserUnMuted);
        
            return () => {
              socket.off("userUnMuted", handleUserUnMuted);
            };
          }, [selectedDiscussion]);
        
    }
