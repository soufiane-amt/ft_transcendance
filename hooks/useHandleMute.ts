import { useEffect } from "react";
import { discussionPanelSelectType } from "../src/app/interfaces/DiscussionPanel";
import socket from "../src/app/socket/socket";
import { IMuteContext } from "../src/app/context/MuteContext";


export function useHandleMute (MuteContext:IMuteContext, selectedDiscussion : discussionPanelSelectType, 
            setIsMuted : React.Dispatch<React.SetStateAction<boolean | undefined>>)
{
    useEffect(() => {
        const handleUserMuted = (MuteSignal: { room_id: string}) => {
          console.log ('ban signal:', MuteSignal)
          if (MuteSignal.room_id === selectedDiscussion.id) {
            setIsMuted(true); 
          }
          MuteContext.MuteUser(MuteSignal.room_id)
        };

        socket.on("userMuted", handleUserMuted);

        return () => {
          socket.off("userMuted", handleUserMuted);
        };
      }, [selectedDiscussion]);
    }

    
export function useHandleUnBan (MuteContext:IMuteContext, selectedDiscussion : discussionPanelSelectType, 
    setIsMuted : React.Dispatch<React.SetStateAction<boolean | undefined>>)
    {
        useEffect(() => {
            const handleUserUnMuted = (MuteSignal: { room_id: string, agent_id:string }) => {
              if (MuteSignal.room_id === selectedDiscussion.id) {
                setIsMuted(false); // Set the isMuted state to true when Muted
              }
              MuteContext.unMuteUser(MuteSignal.room_id )
            };
        
            socket.on("userUnMuted", handleUserUnMuted);
        
            return () => {
              socket.off("userUnMuted", handleUserUnMuted);
            };
          }, [selectedDiscussion]);
        
    }
