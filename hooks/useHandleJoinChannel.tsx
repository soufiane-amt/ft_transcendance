import { useEffect } from "react";
import socket from "../src/app/socket/socket";
import { discussionPanelSelectType } from "../src/app/interfaces/DiscussionPanel";

export function useHandleJoinChannel (selectedDiscussion: discussionPanelSelectType)
    {
        useEffect(() => {
          const handleJoinChannel = (joinSignal: { room_id: string }) => {
            console.log("joinSignal:", joinSignal);
            socket.emit("resumeChannelUpdates", joinSignal.room_id);
        };
      
            socket.on("joinChannel", handleJoinChannel);
        
            return () => {
              socket.off("joinChannel", handleJoinChannel);
            };
          }, [selectedDiscussion]);
        
    }
