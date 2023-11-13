import { useEffect } from "react";
import socket from "../app/socket/socket";
import { discussionPanelSelectType } from "../src/app/interfaces/DiscussionPanel";

export function useHandleJoinDm (selectedDiscussion: discussionPanelSelectType)
    {
        useEffect(() => {
          const handleJoinDm = (dm_id: string ) => {
            
            console.log("joinDm", dm_id);
            socket.emit("joinDm", dm_id);
        };
      
            socket.on("dmIsJoined", handleJoinDm);
        
            return () => {
              socket.off("dmIsJoined", handleJoinDm);
            };
          }, [selectedDiscussion]);
        
    }
