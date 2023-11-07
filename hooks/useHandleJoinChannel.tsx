import { useEffect } from "react";
import socket from "../src/app/socket/socket";
import { discussionPanelSelectType } from "../src/app/interfaces/DiscussionPanel";

export function useHandleJoinDm (selectedDiscussion: discussionPanelSelectType)
    {
        useEffect(() => {
          const handleJoinDm = (channel_id: string ) => {
            
            socket.emit("joinDm", channel_id);
        };
      
            socket.on("broadacastJoinSignal", handleJoinDm);
        
            return () => {
              socket.off("broadacastJoinSignal", handleJoinDm);
            };
          }, [selectedDiscussion]);
        
    }
